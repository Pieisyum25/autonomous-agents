

class Vehicle {

    static BorderBehaviour = {
        NONE: 'none',
        BOUNCE: 'bounce',
        WRAP: 'wrap'
    }

    static count = 1;

    constructor(x, y, radius, borderBehaviour = Vehicle.BorderBehaviour.NONE) {
        this.id = Vehicle.count++;
        this.pos = new Vector2D(x + radius, y + radius);
        this.vel = new Vector2D(0, 0);
        this.acc = new Vector2D(0, 0);
        this.maxSpeed = 15;
        this.maxForce = 0.5;
        this.radius = radius;
        this.borderBehaviour = borderBehaviour;
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

        if (this.borderBehaviour == Vehicle.BorderBehaviour.BOUNCE){
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
        else { // wrap:
            if (left >= canvasSize.x){
                this.pos.setX(-this.radius);
            }
            else if (right <= 0){
                this.pos.setX(canvasSize.x + this.radius)
            }
            if (top >= canvasSize.y){
                this.pos.setY(-this.radius);
            }
            else if (bottom <= 0){
                this.pos.setY(canvasSize.y + this.radius)
            }
        }
    }

    update(canvasSize){
        this.vel.add(this.acc);
        this.vel.limitMag(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.set(0, 0);
        if (this.borderBehaviour != Vehicle.BorderBehaviour.NONE) this.applyBorder(canvasSize);
    }

    draw(c){
        c.translate(this.pos.x, this.pos.y);
        const dir = this.vel.direction()
        c.rotate(dir);

        c.fillStyle = "red";
        c.strokeStyle = "maroon";
        triangle(c, -this.radius, -this.radius/2, -this.radius, this.radius/2, this.radius, 0);

        c.rotate(-dir);
        c.translate(-this.pos.x, -this.pos.y);
    }

}



class Target extends Vehicle {

    constructor(x, y, radius, speedX, speedY){
        super(x, y, radius, Vehicle.BorderBehaviour.WRAP);
        this.defaultVel = new Vector2D(speedX, speedY);
    }

    update(canvasSize, mousePos){
        // If mouse on canvas, move target towards mouse pos:
        if (mousePos.x != -1) this.vel = Vector2D.sub(mousePos, this.pos).mul(0.2);
        // Else make target travel at default velocity:
        else this.vel = this.defaultVel;

        super.update(canvasSize);
    }

    draw(c){
        c.translate(this.pos.x, this.pos.y);

        c.fillStyle = "red";
        c.strokeStyle = "maroon";
        circle(c, 0, 0, this.radius);

        c.translate(-this.pos.x, -this.pos.y);
    }
}