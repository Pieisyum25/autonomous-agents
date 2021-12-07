
class Path {

    constructor(start, end, radius){
        this.start = start.copy();
        this.end = end.copy();
        this.radius = radius;
    }

    draw(c){
        c.lineWidth = this.radius * 2;
        c.strokeStyle = "maroon";
        line(c, this.start.x, this.start.y, this.end.x, this.end.y);

        c.lineWidth = 5;
        c.strokeStyle = "white";
        line(c, this.start.x, this.start.y, this.end.x, this.end.y);

        c.lineWidth = 1;
    }
}