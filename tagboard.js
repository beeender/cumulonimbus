//Global definitions
var l_tag_sprites = [];
var l_tagboard = null;
var l_canvas = null;

function Options()
{ 
    this.bgcolor = '#FFFFFF';
    this.transparency = false;
}

function Sprite(name, url)
{
    this.name = name;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.link = url;

    this.font = null;
}

var TagBoard = Object.create(null);

TagBoard.rotateX = function(point, radians) 
{
    var y = point.y - this.height/2;
    var cos_r = Math.cos(radians);
    var sin_r = Math.sin(radians);

    point.y = (y * cos_r) + (point.z * sin_r * -1.0) +
        this.height/2;
    point.z = (y * sin_r) + (point.z * cos_r);
};

TagBoard.rotateY = function(point, radians) 
{
    var x = point.x - this.width/2;
    var cos_r = Math.cos(radians);
    var sin_r = Math.sin(radians);

    point.x = (x * cos_r) + (point.z * sin_r * -1.0) +
        this.width/2;
    point.z = (x * sin_r) + (point.z * cos_r);
};

TagBoard.rotateZ = function(point, radians) 
{
    var x = point.x - this.width/2;
    var cos_r = Math.cos(radians);
    var sin_r = Math.sin(radians);

    point.y -= this.height/2;
    point.x = (x * cos_r) + (point.y * sin_r * -1.0) +
        this.width/2; 
    point.y = (x * sin_r) + (point.y * cos_r) +
        this.height/2;
};

TagBoard.sortSprites = function(member, reverse)
{ 
    sort_function = function(a, b)
    { 
        if(reverse)
        { 
            return (b[member] - a[member]);
        }

        return (a[member] - b[member]);
    };
    this.sprites.sort(sort_function);
};

TagBoard.onMouseMove = function(x, y) 
{
    this.mouse_x = x;
    this.mouse_y = y;
};

TagBoard.onMouseClick = function(x, y)
{ 
    if(this.focusspr !== null)
    { 
        window.location = this.focusspr.link;
    }
};

TagBoard.spritesMove = function() 
{ 
    //Sprites move!
};

TagBoard.draw = function() 
{ 
    if(this.transparency)
    { 
        this.context.globalAlpha = 0.0;
    }
    else
    { 
        this.context.globalAlpha = 1;
    }

    this.context.fillStyle = this.bgcolor;
    //this.context.fillRect(0, 0, this.width, this.height); 
    this.context.clearRect(0, 0, this.width, this.height); 
    this.context.fillRect(0, 0, this.width, this.height); 
    this.context.globalAlpha = 1;
    
    if(this.debug)
    { 
        var diff;
        var fps;
        this.frame_cnt++;
        diff = (new Date()).getTime() - this.start;
        fps = this.frame_cnt / (diff / 1000);
        this.context.fillText(fps.toFixed(2), 30, 20);
    }
};

TagBoard.drawSprite = function(sprite, font_size, style, is_focus, fast_draw)
{ 

    //If fast_draw is true then skip setting font. It would cost more time on firefox.
    if(!fast_draw)
    { 
        this.context.font = font_size.toString() + "px sans-serif";
    }
    this.context.fillStyle = style;
    this.context.textAlign = 'center';
    this.context.fillText(sprite.name, sprite.x, sprite.y);
   
    //TODO: We should compile the sprite and focusspr. is_focus might not be needed.
    if(is_focus)
    { 
        w = this.context.measureText(sprite.name).width;
        this.context.strokeRect(Math.max(sprite.x - w/2, 0),
                sprite.y - font_size,
                w, font_size+1);
    }
};

TagBoard.render = function() 
{
    this.draw();
    this.spritesMove();
};

TagBoard.init = function(canvas, context, sprites, opts) 
{ 
    this.canvas = canvas;
    this.context = context;
    this.width = canvas.width;
    this.height = canvas.height;
    this.sprites = sprites;

    this.bgcolor = opts.bgcolor;
    this.transparency = opts.transparency;

    this.focusspr = null;
    this.mouse_x = 0;
    this.mouse_y = 0;
    
    this.debug = false;
    this.frame_cnt = 0;
    this.start = (new Date()).getTime();
};

//Call this function after the fillStyle.
TagBoard.mouseOnSprite = function(spr, fontsize)
{ 
    var width;

    width = this.context.measureText(spr.name).width;
    //textAlign center
    if(this.mouse_x >= Math.max(spr.x - width/2, 0) &&
        this.mouse_x <= Math.min(spr.x + width/2, this.width) &&
            this.mouse_y >= (spr.y - fontsize) && this.mouse_y <= spr.y)
    { 
        return true;
    }

    return false;
};

function createTagBoard(type, opts)
{ 
    var context;
    var obj = null;
    l_canvas = document.getElementById("myCanvas");
    context = l_canvas.getContext("2d");

    switch(type){ 
        case "sphere":
            obj = Object.create(SphereBoard);
            break;
        case "matrix":
            break; 
        default:
            break;
    }

    obj.init(l_canvas, context, l_tag_sprites, opts);

    l_tagboard = obj;
}

function addTag(name, url) 
{ 
    l_tag_sprites[l_tag_sprites.length] = new Sprite(name, url);
}

function timeout() { 
    l_tagboard.render();
}

function onMouseMove(ev) {
    var x = ev.pageX - l_canvas.offsetLeft;
    var y = ev.pageY - l_canvas.offsetTop;

    l_tagboard.onMouseMove(x, y);
}

function onMouseClick(ev){ 
    var x = ev.pageX - l_canvas.offsetLeft;
    var y = ev.pageY - l_canvas.offsetTop;

    l_tagboard.onMouseClick(x, y);
}

function start()
{ 
    l_canvas.addEventListener("mousemove", onMouseMove, false);
    l_canvas.addEventListener("click", onMouseClick, false);

    setInterval(timeout, 1000/20);
}


