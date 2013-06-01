/*global TagBoard*/

var SphereBoard = {
    createNew: function (canvas, context, sprites, opts) {
        "use strict";
        var sphereBoard = TagBoard.createNew(canvas, context, sprites, opts),
            inc,
            off,
            i,
            x,
            y,
            z,
            r,
            phi,
            super_Draw = sphereBoard.draw,
            super_OnMouseMove = sphereBoard.onMouseMove;

        //Leave some space for text rendering.
        sphereBoard.radius = Math.min(sphereBoard.width / 2, sphereBoard.height / 2) * 0.8;
        //Perfectly evenly distributed points on a sphere
        //http://www.softimageblog.com/archives/115
        inc = 3.14 * (3 - Math.sqrt(5));
        off = 2 / sphereBoard.sprites.length;

        for (i = 0; i < sphereBoard.sprites.length; i += 1) {
            y = i * off - 1 + (off / 2);
            r = Math.sqrt(1 - y * y);
            phi = i * inc;
            x = Math.cos(phi) * r;
            z = Math.sin(phi) * r;

            sphereBoard.sprites[i].x = x * sphereBoard.radius + sphereBoard.width / 2;
            sphereBoard.sprites[i].y = y * sphereBoard.radius + sphereBoard.height / 2;
            sphereBoard.sprites[i].z = z * sphereBoard.radius;
        }

        sphereBoard.speed_x = 1;
        sphereBoard.speed_y = 1;
        sphereBoard.rotation_y = Math.PI / 45.0 * sphereBoard.speed_y;
        sphereBoard.rotation_x = Math.PI / 45.0 * sphereBoard.speed_x;

        sphereBoard.sortSprites('z', true);

        sphereBoard.draw = function () {
            var spr;

            if (Math.abs(sphereBoard.rotation_x) <= 0.01 && Math.abs(sphereBoard.rotation_y) <= 0.01) {
                return;
            }

            for (i = 0; i < sphereBoard.sprites.length; i += 1) {
                spr = sphereBoard.sprites[i];
                spr.scale = (spr.z + sphereBoard.radius) / (sphereBoard.radius * 2);

                sphereBoard.rotateX(spr, sphereBoard.rotation_x);
                sphereBoard.rotateY(spr, sphereBoard.rotation_y);
                //sphereBoard.rotateZ(spr, 0);
            }

            sphereBoard.sortSprites('z', true);
            super_Draw();
        };

        sphereBoard.spritesMove = function () {
            sphereBoard.rotation_y = Math.PI / 45.0 * sphereBoard.speed_y;
            sphereBoard.rotation_x = Math.PI / 45.0 * sphereBoard.speed_x;

            sphereBoard.speed_x *= 0.97;
            sphereBoard.speed_y *= 0.97;
        };

        sphereBoard.onMouseMove = function (x, y) {
            var center_x = sphereBoard.width / 2,
                center_y = sphereBoard.height / 2,
                a = x - center_x,
                b = y - center_y;

            sphereBoard.speed_x = b / sphereBoard.radius;
            sphereBoard.speed_y = a / sphereBoard.radius;
            if (sphereBoard.speed_x > 1) {
                sphereBoard.speed_x = 1;
            } else if (sphereBoard.speed_x < -1) {
                sphereBoard.speed_x = -1;
            }

            if (sphereBoard.speed_y > 1) {
                sphereBoard.speed_y = 1;
            } else if (sphereBoard.speed_y < -1) {
                sphereBoard.speed_y = -1;
            }

            super_OnMouseMove(x, y);
        };

        sphereBoard.onMouseOut = function (x, y) {
            sphereBoard.focusspr = null;
        };

        return sphereBoard;
    }
};

