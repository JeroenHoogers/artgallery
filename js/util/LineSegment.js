function LineSegment(x1_, y1_, x2_, y2_)
{
    var x1 = x1_;
    var y1 = y1_;
    var x2 = x2_;
    var y2 = y2_;
   
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
}

LineSegment.prototype.constructor = LineSegment;


/**
 * Creates a clone of this linesegment
 *
 * @return a copy of the linesegment
 */
LineSegment.prototype.clone = function ()
{
    return new LineSegment(this.x1, this.y1, this.x2, this.y2);
};


LineSegment.prototype.equals = function (seg)
{
    return (this.x1 == seg.x1 && this.y1 == seg.y1 && this.x2 == seg.x2 && this.y2 == seg.y2)
};
/**
 * Used to check whether the given point is an endpoint of this linesegment
 *
 * @return true if the given point is an endpoint, false otherwise
 */
LineSegment.prototype.isendpoint = function (x, y)
{
    return (this.x1 == x && this.y1 == y) || (this.x2 == x && this.y2 == y);
};

/**
 * Used to check whether the given point is an endpoint of this linesegment
 *
 * @return true if the given point is an endpoint, false otherwise
 */
LineSegment.prototype.other = function (x, y)
{
    var point = {
        x: (this.x1 == x && this.y1 == y) ? this.x2 : this.x1,
        y: (this.x1 == x && this.y1 == y) ? this.y2 : this.y1,
    }
    
    return point;
};


/**
 * Checks whether the given ray intersects this linesegment
 *
 * @param ray The ray that should be tested for interesections
 * @return a bool whether the ray intersects or not and the corresponding point of intersection (if any)
 */
LineSegment.prototype.intersects = function (ray)
{
    var output = {};
    output.result = false;

    var denom = ( ray.x1 - ray.x2 ) * ( this.y1 - this.y2 ) -
        ( ray.y1 - ray.y2 ) * ( this.x1 - this.x2 );

    if ( denom !== 0 ) {
        output.x = ( ( ray.x1 * ray.y2 - ray.y1 * ray.x2 ) *
            ( this.x1 - this.x2 ) - ( ray.x1 - ray.x2 ) *
            ( this.x1 * this.y2 - this.y1 * this.x2 ) ) / denom;
        output.y = ( ( ray.x1 * ray.y2 - ray.y1 * ray.x2 ) *
            ( this.y1 - this.y2 ) - (ray.y1 - ray.y2 ) *
            ( this.x1 * this.y2 - this.y1 * this.x2 ) ) / denom;

        var maxX = Math.max( this.x1, this.x2 );
        var minX = Math.min( this.x1, this.x2 );
        var maxY = Math.max( this.y1, this.y2 );
        var minY = Math.min( this.y1, this.y2 );

        if ( ( output.x <= maxX && output.x >= minX ) === true &&
            ( output.y <= maxY && output.y >= minY ) === true ) {
            output.result = true;
        }

    }

    return output;
};

//module.exports = LineSegment;