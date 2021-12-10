
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

/**
 * Path following Catmull-Rom curves.
 * Converts the Catmull-Rom control points to Bezier control points before drawing with the Bezier function.
 * Conversion formula adapted from: https://arxiv.org/pdf/2011.08232.pdf
 * Requires at least 4 control points!!!
 */
class CurvedPath {

    /** 
     * Looping determines if the start and end points should connect.
     * Tension should be between 0.0 and 1.0.
     */
    constructor(points, radius, looping = false, tension = 0.75){
        this.points = points;
        this.radius = radius;
        this.looping = looping;

        // Conversion from Catmull-Rom control points to Bezier control points:
        this.bezierCurves = [];

        let startingCurveIndex = 0;
        let totalCurves = points.length;
        if (!looping){
            startingCurveIndex = points.length-1;
            totalCurves--;
        }

        let count = 0;
        let i = startingCurveIndex;
        while (count < totalCurves){
            const p = [];
            for (let j = 0; j < 4; j++) p.push(points[(i + j) % points.length]);

            const bezierPoints = [];
            bezierPoints.push(p[1]);
            bezierPoints.push(Vector2D.add(p[1], Vector2D.sub(p[2], p[0]).div(6 * tension)));
            bezierPoints.push(Vector2D.sub(p[2], Vector2D.sub(p[3], p[1]).div(6 * tension)));
            bezierPoints.push(p[2]);

            this.bezierCurves.push(bezierPoints);
            i++;
            i %= points.length;
            count++;
        }
    }

    draw(c){
        // Bezier curves:
        this.bezierCurves.forEach(p => {
            c.lineWidth = this.radius * 2;
            c.strokeStyle = "maroon";
            bezierCurve(c, p[0], p[1], p[2], p[3]);
    
            c.lineWidth = 5;
            c.strokeStyle = "white";
            bezierCurve(c, p[0], p[1], p[2], p[3]);
        });

        c.lineWidth = 1;

        // Squares on Catmull-Rom control points:
        this.points.forEach(p => {
            c.fillStyle = "white";
            rectangle(c, p.x - this.radius / 2, p.y - this.radius / 2, this.radius, this.radius);
        });
    }
}

class CatmullRomCurve {

    static Parameterization = {
        UNIFORM: 0.0,
        CENTRIPETAL: 0.5,
        CHORDAL: 1.0
    }

    constructor(p0, p1, p2, p3, tension = 0.0, alpha = CatmullRomCurve.Parameterization.CENTRIPETAL, maxLineOffset = 0.5){
        this.p = [p0, p1, p2, p3];
        this.tension = tension;
        this.alpha = alpha;
        this.maxLineOffset = maxLineOffset;

        this.updatePoints();
    }

    updatePoints(){
        // Precalculate coefficients of polynomial so later interpolation is efficient:
        const p = this.p;

        const t0 = 0;
        const t1 = t0 + Math.pow(Vector2D.distance(p[0], p[1]), this.alpha);
        const t2 = t1 + Math.pow(Vector2D.distance(p[1], p[2]), this.alpha);
        const t3 = t2 + Math.pow(Vector2D.distance(p[2], p[3]), this.alpha);

        const mFactor = (1 - this.tension) * (t2 - t1);
        const m1 = Vector2D.sub(p[0], p[1]).div(t0 - t1).sub(Vector2D.sub(p[0], p[2]).div(t0 - t2)).add(Vector2D.sub(p[1], p[2]).div(t1 - t2)).mul(mFactor);
        const m2 = Vector2D.sub(p[1], p[2]).div(t1 - t2).sub(Vector2D.sub(p[1], p[3]).div(t1 - t3)).add(Vector2D.sub(p[2], p[3]).div(t2 - t3)).mul(mFactor);

        this.a = Vector2D.mul(p[1], 2).sub(Vector2D.mul(p[2], 2)).add(m1).add(m2);
        this.b = Vector2D.mul(p[1], -3).add(Vector2D.mul(p[2], 3)).sub(Vector2D.mul(m1, 2)).sub(m2);
        this.c = m1;
        this.d = p[1];

        // Determine which points/vertices to draw line segments between:
        this.determineSegments();
        console.log(this.vertices.length);
    }

    determineSegments(){
        this.vertices = [];
        this.vertices.push({ pos: this.p[1], t: 0.0 });
        this.vertices.push({ pos: this.p[2], t: 1.0 });
        this.evaluateSegment(this.vertices[0], this.vertices[1]);
    }

    evaluateSegment(startVertex, endVertex){
        const midpointPos = Vector2D.midpoint(startVertex.pos, endVertex.pos);
        const midpointT = (startVertex.t + endVertex.t) / 2;
        const actualPos = this.interpolate(midpointT);

        // If the midpoint's position is too far from where it should be (actualPos), divide the line segment
        // into two, add the new vertex, and call this method recursively on each of the new segments:
        const offset = Vector2D.distanceSquared(midpointPos, actualPos);

        if (offset > Math.pow(this.maxLineOffset, 2)){
            const midpointIndex = this.vertices.indexOf(startVertex) + 1;
            const midpointVertex = { pos: actualPos, t: midpointT };
            this.vertices.splice(midpointIndex, 0, midpointVertex);

            this.evaluateSegment(startVertex, midpointVertex);
            this.evaluateSegment(midpointVertex, endVertex);
        }
    }

    interpolate(t){
        return Vector2D.mul(this.a, t*t*t).add(Vector2D.mul(this.b, t*t)).add(Vector2D.mul(this.c, t)).add(this.d);
    }

    draw(c){
        // c.fillStyle = "yellow";
        // c.strokeStyle = "transparent";
        // this.p.forEach(p => circle(c, p.x, p.y, 10));

        c.strokeStyle = "white";
        for (let i = 0; i < this.vertices.length - 1; i++){
            const p0 = this.vertices[i].pos;
            const p1 = this.vertices[i+1].pos;
            line(c, p0.x, p0.y, p1.x, p1.y);
        }
    }
}