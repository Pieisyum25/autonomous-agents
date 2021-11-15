
function addSeekAndFleeGames(){

    const setup = function(){
        this.vehicle = new Vehicle(100, 100, 20, Vehicle.BorderBehaviour.BOUNCE);
        this.target = new Target(this.size.x / 2, this.size.y / 2, 10, 4, 1);
    }

    const update = function(){
        const steering = (this.id == 1)? this.vehicle.seek(this.target.pos) : this.vehicle.flee(this.target.pos);
        this.vehicle.applyForce(steering);
        this.vehicle.update(this.size);
        this.target.update(this.size, this.mousePos);
    }

    const draw = function(){
        this.vehicle.draw(this.context);
        this.target.draw(this.context);
    }

    for (let i = 0; i < 2; i++){
        new Game(new Vector2D(500, 500), 50, setup, update, draw, (i == 0)? "seek" : "flee");
    }    
}

class Game {

    static count = 1;

    constructor(size, fps, setup, update, draw, containerId){
        const self = this;
        this.id = Game.count++;
        this.size = size;
        this.canvas = document.createElement("canvas");
        this.canvas.width = size.x;
        this.canvas.height = size.y;
        document.getElementById(containerId).appendChild(this.canvas);
        this.context = this.canvas.getContext("2d");

        // Set up callbacks:
        this.initEventListeners(this);
        this.update = update;
        this.draw = draw;

        // Start game:
        this.setup = setup;
        this.setup();
        
        // Set frame rate:
        this.interval = setInterval(function(){ self.tick(self) }, 1000 / fps);        
    }

    initEventListeners(){
        const self = this;
        this.mousePos = new Vector2D(-1, -1);
        this.mouseOver = false;

        // Keep track of whether the mouse/touch is currently on the canvas:
        this.canvas.addEventListener("mouseout", function(event){ self.mousePos.set(-1, -1); });
        this.canvas.addEventListener("touchend", function(event){ self.mousePos.set(-1, -1); });

        // Keep track of mouse/touch position:
        this.canvas.addEventListener("mousemove", function(event){ 
            self.updateMousePos(event.offsetX, event.offsetY); 
        });
        this.canvas.addEventListener("touchmove", function(event){
            const touch = event.targetTouches[0];
            const rect = self.canvas.getBoundingClientRect();
            self.updateMousePos(touch.clientX - rect.left, touch.clientY - rect.top); 
        });
    }

    updateMousePos(absoluteX, absoluteY){
        this.mousePos.set(absoluteX, absoluteY);
    }

    clearCanvas(){
        this.context.clearRect(0, 0, this.size.x, this.size.y);
    }

    tick(self){
        self.clearCanvas();
        self.update();
        self.draw();
    }


}