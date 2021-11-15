

class Vehicle {

    static count = 1;

    constructor(x, y, radius) {
        this.id = Vehicle.count++;
        this.pos = new Vector2D(x + radius, y + radius);
        this.vel = new Vector2D(0, 0);
        this.acc = new Vector2D(0, 0);
        this.maxSpeed = 15;
        this.maxForce = 0.5;
        this.radius = radius;
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

    applyBorder(canvasSize){
        const left = this.pos.x - this.radius;
        const top = this.pos.y - this.radius;
        const right = this.pos.x + this.radius;
        const bottom = this.pos.y + this.radius;

        if (left <= 0){
            this.pos.setX(this.radius);
            this.vel.invertX();
            this.vel.mul(0.8);
        } 
        else if (right >= canvasSize.x){
            this.pos.setX(canvasSize.x - this.radius);
            this.vel.invertX();
            this.vel.mul(0.8);
        }
        if (top <= 0){
            this.pos.setY(this.radius);
            this.vel.invertY();
            this.vel.mul(0.8);
        }
        else if (bottom >= canvasSize.y){
            this.pos.setY(canvasSize.y - this.radius);
            this.vel.invertY();
            this.vel.mul(0.8);
        }
    }

    update(canvasSize){
        this.vel.add(this.acc);
        this.vel.limitMag(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.set(0, 0);
        this.applyBorder(canvasSize);
    }

    draw(c){
        c.translate(this.pos.x, this.pos.y);
        let dir = this.vel.direction()
        c.rotate(dir);

        c.fillStyle = "red";
        c.strokeStyle = "maroon";
        triangle(c, -this.radius, -this.radius/2, -this.radius, this.radius/2, this.radius, 0);
        
        c.rotate(-dir);
        c.translate(-this.pos.x, -this.pos.y);
    }

}