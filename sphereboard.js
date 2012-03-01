var SphereBoard = Object.create(TagBoard);

SphereBoard.init = function(canvas, context, sprites, opts) 
{ 
    TagBoard.init(canvas, context, sprites, opts);

    //Leave some space for text rendering.
    this.radius = Math.min(this.width/2, this.height/2) * 0.8;

    //Perfectly evenly distributed points on a sphere
    //http://www.softimageblog.com/archives/115
    inc = 3.14 * (3 - Math.sqrt(5));
    off = 2/this.sprites.length;
    for(i=0; i<this.sprites.length; i++){ 
        y = i * off - 1 + (off/2);
        r = Math.sqrt(1 - y*y);
        phi = i * inc;
        x = Math.cos(phi) * r;
        z = Math.sin(phi) * r;

        this.sprites[i].x = x * this.radius + this.width/2;
        this.sprites[i].y = y * this.radius + this.height/2;
        this.sprites[i].z = z * this.radius;
    }

    this.speed_x = 1;
    this.speed_y = 1;
    this.rotation_y = Math.PI/45.0 * this.speed_y;
    this.rotation_x = Math.PI/45.0 * this.speed_x;

    this.f_size_max = 17;
    this.f_size_min = 5;
    
    TagBoard.sortSprites('z', true);
};

SphereBoard.draw = function() 
{ 
    var found_focus = false;
    var fast_draw = false;

    if(Math.abs(this.rotation_x) <= 0.01 && Math.abs(this.rotation_y) <= 0.01)
    { 
    return;
    }

    //Draw background
    TagBoard.draw();

    for(i = 0; i < this.sprites.length; i++)
    { 
        var spr = this.sprites[i];
        var font_size;

        if(spr.z < this.radius*2/3 )
        { 
            font_size = this.f_size_min;
        }
        else
        { 
            font_size = this.f_size_max * Math.abs(spr.z)/this.radius;
            if(font_size === 0)
            { 
                font_size = this.f_size_min;
            }

            if(TagBoard.mouseOnSprite(spr, font_size))
            { //Sprites is sorted! Set the top one as focused!
                if(!found_focus)
                { 
                    this.focusspr = spr;
                    found_focus = true;
                }
            }
        }
        
        if(this.focusspr == spr)
        { 
            TagBoard.drawSprite(spr, Math.round(font_size), "#333333", true, fast_draw);
        }
        else
        { 
            TagBoard.drawSprite(spr, Math.round(font_size), "#333333", false, fast_draw);
        }

        if(spr.z < this.radius*2/3 )
        { 
            //The sprites is sorted. Use fast draw!
            fast_draw = true;
        }

        TagBoard.rotateX(spr, this.rotation_x);
        TagBoard.rotateY(spr, this.rotation_y);
        //TagBoard.rotateZ(spr, 0);
    }

    TagBoard.sortSprites('z', true);
};

SphereBoard.spritesMove = function() 
{ 
    this.rotation_y = Math.PI/45.0 * this.speed_y;
    this.rotation_x = Math.PI/45.0 * this.speed_x;

    this.speed_x *= 0.97;
    this.speed_y *= 0.97;
};

SphereBoard.onMouseMove = function(x, y) 
{
    var center_x = this.width/2;
    var center_y = this.height/2;
    var a = x - center_x;
    var b = y - center_y;

    this.speed_x = b/this.radius;
    this.speed_y = a/this.radius;
    if(this.speed_x > 1) 
    { 
        this.speed_x = 1;
    }
    else if(this.speed_x < -1)
    { 
        this.speed_x = -1;
    }
    if(this.speed_y > 1) 
    { 
        this.speed_y = 1;
    }
    else if(this.speed_y < -1)
    { 
        this.speed_y = -1;
    }

    TagBoard.onMouseMove(x, y);
};

