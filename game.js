
function startGame(){
    game.start(500, 500, 60)
}

const game = {

    canvas: document.createElement("canvas"),
    
    start: function(width, height, fps) {  
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        // Mouse:
        this.mousePos = new Vector2D(0, 0);
        this.canvas.addEventListener("mousemove", function(event){
            game.updateMousePos(event);
        });

        this.interval = setInterval(tick, 1000 / fps);
        setup()
    },

    updateMousePos: function(event){
        let rect = this.canvas.getBoundingClientRect();
        this.mousePos.set(event.clientX - rect.left, event.clientY - rect.top);
    },

    clear: function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
}

function tick(){
    game.clear();
    update();
    draw(game.context);
}


let vehicle;
let target;

function setup(){
    vehicle = new Vehicle(100, 100);
    target = game.mousePos;
}

function update(){
    let steering = vehicle.seek(target);
    vehicle.applyForce(steering);
    vehicle.update();
}

function draw(c){
    vehicle.draw(c);
    c.fillRect(target.x, target.y, 10, 10);
}