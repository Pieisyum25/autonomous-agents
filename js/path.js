
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
class CurvePath {

    constructor(points, radius, looping = false, tension = 1.0){
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