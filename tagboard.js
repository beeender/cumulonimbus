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

Object.defineProperty(TagBoard, 'bgcolor', {
value: '#FFFFF0',
writable: true
});

Object.defineProperty(TagBoard, 'focusspr', {
value: null,
writable: true
});

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
    this.context.fillStyle = this.bgcolor;
    this.context.fillRect(0, 0, this.width, this.height); 

    this.context.fillStyle = "#000000";
};

TagBoard.drawSprite = function(sprite, font_size, style)
{ 
    this.context.font = font_size.toString() + "px sans-serif";
    this.context.fillStyle = style;
    this.context.textAlign = 'center';
    this.context.fillText(sprite.name, sprite.x, sprite.y);
};

TagBoard.render = function() 
{
    this.draw();
    this.spritesMove();
};

TagBoard.init = function(width, height, context, sprites) 
{ 
    this.width = width;
    this.height = height;
    this.context = context;
    this.sprites = sprites;
    this.mouse_x = 0;
    this.mouse_y = 0;

    this.fonts = [];
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

function createTagBoard(type, width, height, context, sprites)
{ 
    var obj = null;
    switch(type){ 
        case "sphere":
            obj = Object.create(SphereBoard);
            break;
        case "matrix":
            break; 
        default:
            break;
    }

    obj.init(width, height, context, sprites);
    return obj;
}

//Test code starts
var tag_sprites = [];
var aniboard = null;
var context = null;
var canvas = null;

function addTag(name, url) 
{ 
    tag_sprites[tag_sprites.length] = new Sprite(name, url);
}

function timeout() { 
    aniboard.render();
}

function onMouseMove(ev) {
    var x = ev.pageX - canvas.offsetLeft;
    var y = ev.pageY - canvas.offsetTop;

    aniboard.onMouseMove(x, y);
}

function onMouseClick(ev){ 
    var x = ev.pageX - canvas.offsetLeft;
    var y = ev.pageY - canvas.offsetTop;

    aniboard.onMouseClick(x, y);
}

function start()
{ 
    time_begin = new Date().getTime();
    // do stuff here
    canvas = document.getElementById("myCanvas");
    context = canvas.getContext("2d");
    aniboard = createTagBoard("sphere", canvas.width, canvas.height, context, tag_sprites);
    canvas.addEventListener("mousemove", onMouseMove, false);
    canvas.addEventListener("click", onMouseClick, false);

    setInterval(timeout, 1000/20);
}


