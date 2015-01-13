(function (window) {

function SplitPic(element) {
    var el = $(element);
    var leftPane = $('.splitpic-left-image', el);
    var rightPane = $('.splitpic-right-image', el);
    var bar = $('.splitpic-bar', el);
    var infoHidden = false;
    // split the image at the cursor
    function updateSplit(x, isRelative) {
        var relativeX;
        if (!isRelative) {
            var elOffset = el.offset();
            relativeX = x - elOffset.left;
        } else {
            relativeX = x;
        }
        leftPane.css(
            'clip', 'rect(0px, ' + relativeX + 'px, auto, 0px)'
        );
        bar.css('left',  relativeX - bar.width() / 2 + 'px');
    };
    // how much of the left image should we show at start? 50% if not specified
    var startPercentage = parseInt(el.attr('data-start-percent'));
    if (isNaN(startPercentage)) {
        startPercentage = 50;
    }
    startPercentage /= 100;
    updateSplit(el.width() * startPercentage, true);
    var isMoving = false;
    var lastX = 0,
        lastY = 0;
    el.on('touchmove touchstart', function (event) {
        if (!infoHidden) {
            $('.splitpic-info', el).fadeOut(200);
            infoHidden = true;
        }
        var touches;
        if (event.touches) {
            touches = event.touches;
        } else if (event.originalEvent && event.originalEvent.touches) {
            touches = event.originalEvent.touches;
        }
        if (touches) {
            var touch = touches[0];
            var dx = 0,
                dy = 0;
            if (isMoving) {
                dx = touch.pageX - lastX;
                dy = touch.pageY - lastY;
            } else {
                isMoving = true;
            }
            // if we move a bit and it's laterally
            if (Math.abs(dx) > Math.abs(dy)) {
                event.preventDefault();
                updateSplit(touches[0].pageX);
            }
            lastX = touch.pageX;
            lastY = touch.pageY;
        }
    });
    el.on('touchend', function (event) {
        isMoving = false;
    });
    el.on('mouseenter mousemove mouseleave', function (event) {
        if (!infoHidden) {
            $('.splitpic-info', el).fadeOut(200);
            infoHidden = true;
        }
        updateSplit(event.pageX);
    });
    
};

window.SplitPic = SplitPic;


function SplitPicVertical(element) {
    var el = $(element);
    var overPane = $('.splitpic-left-image', el);
    var underPane = $('.splitpic-right-image', el);
    var bar = $('.splitpic-bar', el);
    var infoHidden = false;
    // split the image at the cursor
    function updateSplit(y, isRelative) {
        var relativeY;
        if (!isRelative) {
            var elOffset = el.offset();
            relativeY = y - elOffset.top;
        } else {
            relativeY = y;
        }
        overPane.css(
            'clip', 'rect(' + relativeY + 'px, auto, auto, 0px)'
        );
        bar.css('top',  relativeY - bar.height() / 2 + 'px');
    };
    // this is necessary since we're using original crops and therefore the
    // image height won't be known until it's loaded.
    function setInitialPosition() {
        // how much of the left image should we show at start? 50% if not specified
        var startPercentage = parseInt(el.attr('data-start-percent'));
        if (isNaN(startPercentage)) {
            startPercentage = 50;
        }
        startPercentage /= 100;
        updateSplit(el.height() * startPercentage, true);
    }
    var img = $('.splitpic-left-image img', element);
    if (img[0].complete) {
        setInitialPosition();
    } else {
        img.load(setInitialPosition.bind(this));
    }
    var isMoving = false;
    var lastX = 0,
        lastY = 0;
    el.on('touchmove touchstart', function (event) {
        if (!infoHidden) {
            $('.splitpic-info', el).fadeOut(200);
            infoHidden = true;
        }
        var touches;
        if (event.touches) {
            touches = event.touches;
        } else if (event.originalEvent && event.originalEvent.touches) {
            touches = event.originalEvent.touches;
        }
        if (touches) {
            var touch = touches[0];
            var dx = 0,
                dy = 0;
            if (isMoving) {
                dx = touch.pageX - lastX;
                dy = touch.pageY - lastY;
            } else {
                dy = 0.001; // HACK: so it's not equal to dx and immediately updates
                isMoving = true;
            }
            // if we move a bit and it's vertically and not too fast
            // TODO: something better
            if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) < 10) {
                event.preventDefault();
                updateSplit(touch.pageY);
            }
            lastX = touch.pageX;
            lastY = touch.pageY;
        }
    });
    el.on('touchend', function (event) {
        isMoving = false;
    });
    el.on('mouseenter mousemove mouseleave', function (event) {
        if (!infoHidden) {
            $('.splitpic-info', el).fadeOut(200);
            infoHidden = true;
        }
        updateSplit(event.pageY);
    });
    
};

window.SplitPic = SplitPic;
window.SplitPicVertical = SplitPicVertical;

}(window));
