(function (window) {

function SplitPic(element) {
    var leftPane = element.querySelector('.splitpic-left-image');
    var bar = element.querySelector('.splitpic-bar');
    var infoHidden = false;
    // split the image at the cursor
    function updateSplit(x, isRelative) {
        var relativeX;
        if (!isRelative) {
            relativeX = x - element.offsetLeft;
        } else {
            relativeX = x;
        }
        leftPane.style.clipPath = 'rect(0px, ' + relativeX + 'px, auto, 0px)';
        bar.style.left = relativeX + 'px';
    };
    // how much of the left image should we show at start? 50% if not specified
    var startPercentage = parseInt(element.getAttribute('data-start-percent'));
    if (isNaN(startPercentage)) {
        startPercentage = 50;
    }
    startPercentage /= 100;
    updateSplit(element.width * startPercentage, true);
    var isMoving = false;
    var lastX = 0,
        lastY = 0;
    element.addEventListener('touchmove', function (event) {
        if (!infoHidden) {
            element.querySelector('.splitpic-info').style.opacity = 0;
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
    element.addEventListener('touchend', function (event) {
        isMoving = false;
    });
    element.addEventListener('mousemove', function (event) {
        if (!infoHidden) {
            element.querySelector('.splitpic-info').style.opacity = 0;
            infoHidden = true;
        }
        updateSplit(event.pageX);
    });

};

window.SplitPic = SplitPic;


function SplitPicVertical(element) {
    var overPane = element.querySelector('.splitpic-left-image');
    var bar = element.querySelector('.splitpic-bar');
    var infoHidden = false;
    // split the image at the cursor
    function updateSplit(y, isRelative) {
        var relativeY;
        if (!isRelative) {
            relativeY = y - element.offsetTop;
        } else {
            relativeY = y;
        }
        overPane.style.clipPath = 'rect(' + relativeY + 'px, auto, auto, 0px)';
        bar.style.top =  relativeY + 'px';
    };
    // this is necessary since we're using original crops and therefore the
    // image height won't be known until it's loaded.
    function setInitialPosition() {
        // how much of the left image should we show at start? 50% if not specified
        var startPercentage = parseInt(element.getAttribute('data-start-percent'));
        if (isNaN(startPercentage)) {
            startPercentage = 50;
        }
        startPercentage /= 100;
        updateSplit(element.clientHeight * startPercentage, true);
    }
    var img = element.querySelector('.splitpic-left-image img');
    img.addEventListener('load',function(){
        setInitialPosition();
    });
    var isMoving = false;
    var lastX = 0,
        lastY = 0;
    element.addEventListener('touchmove', function (event) {
        if (!infoHidden) {
            element.querySelector('.splitpic-info').style.opacity = 0;
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
    element.addEventListener('touchend', function (event) {
        isMoving = false;
    });
    element.addEventListener('mousemove', function (event) {
        if (!infoHidden) {
            element.querySelector('.splitpic-info').style.opacity = 0;
            infoHidden = true;
        }
        updateSplit(event.pageY);
    });

};

window.SplitPic = SplitPic;
window.SplitPicVertical = SplitPicVertical;

}(window));
