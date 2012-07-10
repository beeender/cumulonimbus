var SphereBoard = {
    createNew: function(canvas, context, sprites, opts) {
        var sphereBoard = TagBoard.createNew(canvas, context, sprites, opts);

        //Leave some space for text rendering.
        sphereBoard.radius = Math.min(sphereBoard.width/2, sphereBoard.height/2) * 0.8;

        //Perfectly evenly distributed points on a sphere
        //http://www.softimageblog.com/archives/115
        inc = 3.14 * (3 - Math.sqrt(5));
        off = 2/sphereBoard.sprites.length;
        for(i=0; i<sphereBoard.sprites.length; i++){ 
            y = i * off - 1 + (off/2);
            r = Math.sqrt(1 - y*y);
            phi = i * inc;
            x = Math.cos(phi) * r;
            z = Math.sin(phi) * r;

            sphereBoard.sprites[i].x = x * sphereBoard.radius + sphereBoard.width/2;
            sphereBoard.sprites[i].y = y * sphereBoard.radius + sphereBoard.height/2;
            sphereBoard.sprites[i].z = z * sphereBoard.radius;
        }

        sphereBoard.speed_x = 1;
        sphereBoard.speed_y = 1;
        sphereBoard.rotation_y = Math.PI/45.0 * sphereBoard.speed_y;
        sphereBoard.rotation_x = Math.PI/45.0 * sphereBoard.speed_x;

        sphereBoard.f_size_max = 17;
        sphereBoard.f_size_min = 5;

        sphereBoard.sortSprites('z', true);

        super_Draw = sphereBoard.draw;
        sphereBoard.draw = function() { 
            var found_focus = false;
            var fast_draw = false;

            if(Math.abs(sphereBoard.rotation_x) <= 0.01 && Math.abs(sphereBoard.rotation_y) <= 0.01) { 
                return;
            }

            //Draw background
            super_Draw();

            for(i = 0; i < sphereBoard.sprites.length; i++) { 
                var spr = sphereBoard.sprites[i];
                var font_size;

                if(spr.z < sphereBoard.radius*2/3 ) { 
                    font_size = sphereBoard.f_size_min;
                } else { 
                    font_size = sphereBoard.f_size_max * Math.abs(spr.z)/sphereBoard.radius;
                    if(font_size === 0) { 
                        font_size = sphereBoard.f_size_min;
                    }

                    if(sphereBoard.mouseOnSprite(spr, font_size)) {
                        //Sprites is sorted! Set the top one as focused!
                        if(!found_focus) { 
                            sphereBoard.focusspr = spr;
                            found_focus = true;
                        }
                    }
                }

                if(sphereBoard.focusspr == spr) { 
                    sphereBoard.drawSprite(spr, Math.round(font_size), "#333333", true, fast_draw);
                } else { 
                    sphereBoard.drawSprite(spr, Math.round(font_size), "#333333", false, fast_draw);
                }

                if(spr.z < sphereBoard.radius*2/3 ) { 
                    //The sprites is sorted. Use fast draw!
                    fast_draw = true;
                }

                sphereBoard.rotateX(spr, sphereBoard.rotation_x);
                sphereBoard.rotateY(spr, sphereBoard.rotation_y);
                //sphereBoard.rotateZ(spr, 0);
            }

            sphereBoard.sortSprites('z', true);
        };

        sphereBoard.spritesMove = function() { 
            sphereBoard.rotation_y = Math.PI/45.0 * sphereBoard.speed_y;
            sphereBoard.rotation_x = Math.PI/45.0 * sphereBoard.speed_x;

            sphereBoard.speed_x *= 0.97;
            sphereBoard.speed_y *= 0.97;
        };

        super_OnMouseMove = sphereBoard.onMouseMove;
        sphereBoard.onMouseMove = function(x, y) {
            var center_x = sphereBoard.width/2;
            var center_y = sphereBoard.height/2;
            var a = x - center_x;
            var b = y - center_y;

            sphereBoard.speed_x = b/sphereBoard.radius;
            sphereBoard.speed_y = a/sphereBoard.radius;
            if(sphereBoard.speed_x > 1) 
            { 
                sphereBoard.speed_x = 1;
            }
            else if(sphereBoard.speed_x < -1)
            { 
                sphereBoard.speed_x = -1;
            }
            if(sphereBoard.speed_y > 1) 
            { 
                sphereBoard.speed_y = 1;
            }
            else if(sphereBoard.speed_y < -1)
            { 
                sphereBoard.speed_y = -1;
            }

            super_OnMouseMove(x, y);
        };

        return sphereBoard;
    }
};

