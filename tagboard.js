//Global definitions
var l_tag_sprites = [];
var l_tagboard = null;
var l_canvas = null;
/*global window*/
/*global document*/
/*global setInterval*/
/*global SphereBoard*/

function Options() {
    "use strict";
    this.bgcolor = '#FFFFFF';
    this.transparency = false;
}

var Sprite = {
    createNew: function (name, url) {
        "use strict";
        var sprite = {};

        sprite.name = name;
        sprite.x = 0;
        sprite.y = 0;
        sprite.z = 0;
        sprite.link = url;
        sprite.font = null;

        return sprite;
    }
};

var TagBoard = {
    createNew : function (canvas, context, sprites, opts) {
        "use strict";
        var tagBoard = {};

        tagBoard.canvas = canvas;
        tagBoard.context = context;
        tagBoard.width = canvas.width;
        tagBoard.height = canvas.height;
        tagBoard.sprites = sprites;

        tagBoard.bgcolor = opts.bgcolor;
        tagBoard.transparency = opts.transparency;

        tagBoard.focusspr = null;
        tagBoard.mouse_x = 0;
        tagBoard.mouse_y = 0;

        tagBoard.debug = false;
        tagBoard.frame_cnt = 0;
        tagBoard.start = (new Date()).getTime();

        tagBoard.rotateX = function (point, radians) {
            var y = point.y - tagBoard.height / 2,
                cos_r = Math.cos(radians),
                sin_r = Math.sin(radians);

            point.y = (y * cos_r) + (point.z * sin_r * -1.0) +
                tagBoard.height / 2;
            point.z = (y * sin_r) + (point.z * cos_r);
        };


        tagBoard.rotateY = function (point, radians) {
            var x = point.x - tagBoard.width / 2,
                cos_r = Math.cos(radians),
                sin_r = Math.sin(radians);

            point.x = (x * cos_r) + (point.z * sin_r * -1.0) +
                tagBoard.width / 2;
            point.z = (x * sin_r) + (point.z * cos_r);
        };

        tagBoard.rotateZ = function (point, radians) {
            var x = point.x - tagBoard.width / 2,
                cos_r = Math.cos(radians),
                sin_r = Math.sin(radians);

            point.y -= tagBoard.height / 2;
            point.x = (x * cos_r) + (point.y * sin_r * -1.0) + tagBoard.width / 2;
            point.y = (x * sin_r) + (point.y * cos_r) + tagBoard.height / 2;
        };

        tagBoard.onMouseMove = function (x, y) {
            tagBoard.mouse_x = x;
            tagBoard.mouse_y = y;
        };

        tagBoard.onMouseOut = function (x, y) {
            tagBoard.mouse_x = -1;
            tagBoard.mouse_y = -1;
        };

        tagBoard.onMouseClick = function (x, y) {
            if (tagBoard.focusspr !== null) {
                window.location = tagBoard.focusspr.link;
            }
        };

        tagBoard.spritesMove = function () {
            //Sprites move!
        };


        tagBoard.draw = function () {
            if (tagBoard.transparency) {
                tagBoard.context.globalAlpha = 0.0;
            } else {
                tagBoard.context.globalAlpha = 1;
            }

            tagBoard.context.fillStyle = tagBoard.bgcolor;
            tagBoard.context.clearRect(0, 0, tagBoard.width, tagBoard.height);
            tagBoard.context.fillRect(0, 0, tagBoard.width, tagBoard.height);
            tagBoard.context.globalAlpha = 1;

            if (tagBoard.debug) {
                var diff,
                    fps;
                tagBoard.frame_cnt += 1;
                diff = (new Date()).getTime() - tagBoard.start;
                fps = tagBoard.frame_cnt / (diff / 1000);
                tagBoard.context.fillText(fps.toFixed(2), 30, 20);
            }
        };

        tagBoard.drawSprite = function (sprite, font_size, style, is_focus, fast_draw) {

            //If fast_draw is true then skip setting font. It would cost more time on firefox.
            if (!fast_draw) {
                tagBoard.context.font = font_size.toString() + "px sans-serif";
            }
            tagBoard.context.fillStyle = style;
            tagBoard.context.textAlign = 'center';
            tagBoard.context.fillText(sprite.name, sprite.x, sprite.y);

            //TODO: We should compile the sprite and focusspr. is_focus might not be needed.
            if (tagBoard.focusspr === sprite) {
                var w = tagBoard.context.measureText(sprite.name).width;
                tagBoard.context.strokeRect(Math.max(sprite.x - w / 2, 0),
                    sprite.y - font_size,
                    w, font_size + 1);
            }
        };

        tagBoard.render = function () {
            tagBoard.draw();
            tagBoard.spritesMove();
        };


        tagBoard.mouseOnSprite = function (spr, fontsize) {
            var width;

            width = tagBoard.context.measureText(spr.name).width;
            //textAlign center
            if (tagBoard.mouse_x >= Math.max(spr.x - width / 2, 0) &&
                    tagBoard.mouse_x <= Math.min(spr.x + width / 2, tagBoard.width) &&
                    tagBoard.mouse_y >= (spr.y - fontsize) && tagBoard.mouse_y <= spr.y) {
                return true;
            }

            return false;
        };


        tagBoard.sortSprites = function (member, reverse) {
            var sort_function = function (a, b) {
                if (reverse) {
                    return (b[member] - a[member]);
                }

                return (a[member] - b[member]);
            };

            tagBoard.sprites.sort(sort_function);
        };

        return tagBoard;
    }
};

//Call this function after the fillStyle.
function createTagBoard(type, opts) {
    "use strict";
    var context,
        obj = null;
    l_canvas = document.getElementById("cumulonimbusCanvas");
    context = l_canvas.getContext("2d");

    switch (type) {
    case "sphere":
        obj = SphereBoard.createNew(l_canvas, context, l_tag_sprites, opts);
        break;
    case "matrix":
        break;
    default:
        break;
    }

    l_tagboard = obj;
}

function addTag(name, url) {
    "use strict";
    l_tag_sprites[l_tag_sprites.length] = Sprite.createNew(name, url);
}

function timeout() {
    "use strict";
    l_tagboard.render();
}

function onMouseMove(ev) {
    "use strict";
    var x = ev.clientX - l_canvas.getBoundingClientRect().left,
        y = ev.clientY - l_canvas.getBoundingClientRect().top;

    l_tagboard.onMouseMove(x, y);
}

function onMouseOut(ev) {
    "use strict";
    var x = ev.clientX - l_canvas.getBoundingClientRect().left,
        y = ev.clientY - l_canvas.getBoundingClientRect().top;

    l_tagboard.onMouseOut(x, y);
}

function onMouseClick(ev) {
    "use strict";
    var x = ev.clientX - l_canvas.getBoundingClientRect().left,
        y = ev.clientY - l_canvas.getBoundingClientRect().top;

    l_tagboard.onMouseClick(x, y);
}

function start() {
    "use strict";
    l_canvas.addEventListener("mousemove", onMouseMove, false);
    l_canvas.addEventListener("mouseout", onMouseOut, false);
    l_canvas.addEventListener("click", onMouseClick, false);

    setInterval(timeout, 1000 / 20);
}


