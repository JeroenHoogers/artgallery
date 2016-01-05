function Point(x_, y_)
{
    var x = x_;
    var y = y_;

    this.x = x;
    this.y = y;
}

Point.prototype.constructor = Point;


/**
 * Creates a clone of this point
 *
 * @return a copy of the point
 */
Point.prototype.clone = function ()
{
    return new Point(this.x, this.y);
};


Point.prototype.equals = function (p)
{
    return (this.x == p.x && this.y == p.y)
};




//module.exports = LineSegment;