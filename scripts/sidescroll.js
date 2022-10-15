function startGame() {
    map = new component(5000, 480, "images/ssmap.png", 0, 0);
    player = new player();
    crate = new component(60, 60, "images/crate.png", 200, 300)
    gameArea.start();
}

var gameArea = {
    canvas : document.getElementById("ssCanvas"),
    start : function() {
        this.canvas.width = 720;
        this.canvas.height = 480;
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            gameArea.keys = (gameArea.keys || []);
            gameArea.keys[e.key] = true;
          })
          window.addEventListener('keyup', function (e) {
            gameArea.keys[e.key] = false;
          })
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function component(width, height, imagesrc, x, y) {
    this.image = new Image();
    this.image.src = imagesrc;

    this.width = width;
    this.height = height;
    this.speed = 0;   
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = gameArea.context;
        ctx.drawImage(this.image, 
            this.x, 
            this.y,
            this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speed;    
    }
}

function player() {
    this.image = new Image();
    this.image.src = "images/player.png";
    this.width = 60;
    this.height = 120;
    this.speedx = 0;   
    this.speedy = 0;   
    this.x = 200;
    this.y = 400;    
    this.update = function() {
        ctx = gameArea.context;
        ctx.drawImage(this.image, 
            this.x, 
            this.y - this.height,
            this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedx;    
        this.y += -this.speedy;  
    }
}

function isColiding(object) {
    wide = object.width/2;
    if ((Math.abs(player.x-object.x) < (wide + 30))) {
        return true;
    }
}

function updateGameArea() {
    let floor = 420;
    gameArea.clear();
    map.speed = map.speed/1.15;
    player.height = 120; 
    player.image.src = "images/player.png"
    if (gameArea.keys && gameArea.keys['s']) {
        player.height = 60; 
        player.image.src = "images/crouch.png"
    }
    let h = player.height/120;
    if (gameArea.keys && gameArea.keys['a']) {
        map.speed += 1 * h;
    }
    if (gameArea.keys && gameArea.keys['d']) {
        map.speed += -1 * h; 
    }
    if (isColiding(crate)) {
        floor = crate.y - 30;
    }
    if (gameArea.keys && (gameArea.keys[' '] | gameArea.keys['w'])) {
        if (player.y > floor-10) {
            player.speedy = 20 * h; 
        }
    }
    if (player.y > floor) {
        player.y = floor;
    } else {
        player.speedy--;
    }
    map.newPos();
    map.update();
    player.newPos();
    player.update();
    crate.x = map.x + 2000;
    crate.newPos();
    crate.update();
}