
function addSeekAndFleeGames(){

    const setup = function(){
        this.vehicles = [];
        for (let i = 1; i <= 3; i++) this.vehicles.push(new Vehicle(100 * i, 100 * i, 20, Vehicle.BorderBehaviour.BOUNCE));
        this.target = new Target(this.size.x / 2, this.size.y / 2, 10, 4, 1);
    }

    const update = function(){
        this.vehicles.forEach(vehicle => {
            const steering = (this.id == 1)? vehicle.seek(this.target.pos) : vehicle.flee(this.target.pos);
            vehicle.applyForce(steering);
            vehicle.update(this.size);
        });
        
        this.target.update(this.size, this.mousePos);
    }

    const draw = function(){
        this.vehicles.forEach(vehicle => {
            vehicle.draw(this.context);
        });
        this.target.draw(this.context);
    }

    for (let i = 0; i < 2; i++){
        new Game(new Vector2D(500, 500), 50, setup, update, draw, (i == 0)? "seek" : "flee");
    }    
}