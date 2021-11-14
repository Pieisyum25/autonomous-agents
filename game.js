
function startGame(){

    for (let i = 0; i < 2; i++){
        new Game(
            new Vector2D(500, 500),
            50,
            function(){
                this.vehicle = new Vehicle(100, 100);
                this.target = this.mousePos;
            },
            function(){
                const steering = this.vehicle.seek(this.target);
                this.vehicle.applyForce(steering);
                this.vehicle.update();
            },
            function(){
                this.vehicle.draw(this.context);
                this.context.fillRect(this.target.x, this.target.y, 10, 10);
            }
        )
    }
}

class Game {


    constructor(size, fps, setup, update, draw){
        this.size = size;
        this.canvas = document.createElement("canvas");
        this.canvas.width = size.x;
        this.canvas.height = size.y;
        document.body.appendChild(this.canvas);

        const self = this;
        this.canvas.addEventListener("mousemove", function(event){ 
            self.updateMousePos(event.clientX, event.clientY); 
        });
        this.canvas.addEventListener("touchmove", function(event){
            const touch = event.targetTouches[0];
            self.updateMousePos(touch.pageX, touch.pageY); 
        });
        this.mousePos = new Vector2D(0, 0);
        this.canvasRect = this.canvas.getBoundingClientRect();
        this.context = this.canvas.getContext("2d");

        // Set up callbacks:
        this.update = update;
        this.draw = draw;

        // Start game:
        this.setup = setup;
        this.setup();
        
        // Set frame rate:
        this.interval = setInterval(function(){ self.tick(self) }, 1000 / fps);        
    }

    updateMousePos(absoluteX, absoluteY){
        this.mousePos.set(absoluteX - this.canvasRect.left, absoluteY - this.canvasRect.top);
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