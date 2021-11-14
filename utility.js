

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
        let reciprocal = 1 / scalar;
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
        let m = this.getMag();
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