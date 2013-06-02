//Global definitions
var l_tag_sprites = [];
var l_tagboard = null;
var l_canvas = null;
/*global window*/
/*global document*/
/*global setTimeout*/
/*global SphereBoard*/

function Options() {
    "use strict";
    this.bgcolor = '#FFFFFF';
    this.bg_alpha = 0;
    this.max_font_size = 14;
    this.font_color = "#000000";
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
        sprite.scale = 1;

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
        tagBoard.bg_alpha = opts.bg_alpha;
        tagBoard.max_font_size = opts.max_font_size;
        tagBoard.font_color = opts.font_color;

        tagBoard.focusspr = null;
        tagBoard.mouse_x = 0;
        tagBoard.mouse_y = 0;

        tagBoard.debug = false;
        tagBoard.frame_cnt = 0;
        tagBoard.start = (new Date()).getTime();

        tagBoard.context.fillStyle = tagBoard.font_color;
        tagBoard.context.textAlign = 'center';
        tagBoard.context.font = tagBoard.max_font_size + "px serif";

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
            var i, diff, fps, scale, spr, w;

            //Reset the focus sprite
            tagBoard.focusspr = null;

            tagBoard.context.clearRect(0, 0, tagBoard.width, tagBoard.height);
            tagBoard.context.globalAlpha = tagBoard.bg_alpha;
            tagBoard.context.fillStyle = tagBoard.bgcolor;
            tagBoard.context.fillRect(0, 0, tagBoard.width, tagBoard.height);

            tagBoard.context.fillStyle = tagBoard.font_color;
            tagBoard.context.globalAlpha = 1;
            //Print FPS
            if (tagBoard.debug) {
                tagBoard.frame_cnt += 1;
                diff = (new Date()).getTime() - tagBoard.start;
                fps = tagBoard.frame_cnt / (diff / 1000);
                tagBoard.context.fillText(fps.toFixed(2), 30, 20);
            }

            for (i = 0; i < tagBoard.sprites.length; i += 1) {
                spr = tagBoard.sprites[i];
                scale = spr.scale.toFixed(2);
                //console.debug("draw x:", spr.x, " y:", spr.y, " scale:", scale);

                //scale 0 will cause problems to firefox
                //https://bugzilla.mozilla.org/show_bug.cgi?id=661452
                if (scale > 0) {
                    tagBoard.context.save();
                    tagBoard.context.transform(scale, 0, 0, scale, spr.x * (1 - scale), spr.y * (1 - scale));
                    tagBoard.context.fillText(spr.name, spr.x, spr.y);

                    if (!tagBoard.focusspr && tagBoard.mouseOnSprite(spr, tagBoard.max_font_size)) {
                        tagBoard.focusspr = spr;
                        w = tagBoard.context.measureText(spr.name).width;
                        tagBoard.context.strokeRect(Math.max(spr.x - w / 2, 0),
                            spr.y - tagBoard.max_font_size,
                            w, tagBoard.max_font_size + 1);
                    }

                    tagBoard.context.restore();
                }
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
    setTimeout(timeout, 1000 / 20);
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

    setTimeout(timeout, 1000 / 20);
}


