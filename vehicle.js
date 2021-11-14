

class Vehicle {

    constructor(x, y) {
        this.pos = new Vector2D(x, y);
        this.vel = new Vector2D(0, 0);
        this.acc = new Vector2D(0, 0);
        this.maxSpeed = 15;
        this.maxForce = 0.5;
        this.radius = 16;
    }

    seek(target){
        let force = Vector2D.sub(target, this.pos);
        force.setMag(this.maxSpeed);
        force.sub(this.vel);
        force.limitMag(this.maxForce);
        return force;
    }

    flee(target){
        return this.seek(target).mul(-1);
    }

    applyForce(force){ this.acc.add(force); }

    update(){
        this.vel.add(this.acc);
        this.vel.limitMag(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.set(0, 0);
    }

    draw(c){
        c.fillStyle = "black";
        c.translate(this.pos.x, this.pos.y);
        let dir = this.vel.direction()
        c.rotate(dir);

        //c.fillRect(0, 0, this.radius, this.radius);

        c.beginPath();
        c.moveTo(-this.radius, -this.radius/2);
        c.lineTo(-this.radius, this.radius/2);
        c.lineTo(this.radius, 0);
        c.fill();

        c.rotate(-dir);
        c.translate(-this.pos.x, -this.pos.y);
    }

}