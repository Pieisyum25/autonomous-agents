

class Vector2D {


    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    set(x, y){
        this.x = x;
        this.y = y;
        return this;
    }

    setX(x){
        this.x = x;
        return this;
    }

    setY(y){
        this.y = y;
        return this;
    }

    invert(){
        return this.mul(-1);
    }

    invertX(){
        this.x *= -1;
        return this;
    }

    invertY(){
        this.y *= -1;
        return this;
    }

    add(vector){
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    sub(vector){
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    mul(scalar){
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    div(scalar){
        const reciprocal = 1 / scalar;
        return this.mul(reciprocal);
    }

    getMag(){ return Math.sqrt((this.x * this.x) + (this.y * this.y)); }

    setMag(m){ 
        this.unit();
        this.x *= m;
        this.y *= m;
        return this;
    }

    limitMag(m){ 
        if (m < this.getMag()) this.setMag(m);
        return this;
    }

    unit(){
        const m = this.getMag();
        return this.div(m)
    }

    direction(){ return Math.atan2(this.y, this.x); }

    copy(){ return new Vector2D(this.x, this.y); }

    toString(){ return "(" + this.x + ", " + this.y + ")"; }

    static add(a, b){ return new Vector2D(a.x + b.x, a.y + b.y); }
    static sub(a, b){ return new Vector2D(a.x - b.x, a.y - b.y); }

    static dotProduct(a, b){ return ((a.x * b.x) + (a.y * b.y)); }

    static get ZERO(){ return ZERO; }

}

const ZERO = new Vector2D(0, 0);