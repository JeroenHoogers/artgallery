function Ray(x1_, y1_, x2_, y2_)
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

Ray.prototype.constructor = Ray;

/**
 * Creates a clone of this ray
 *
 * @return a copy of the ray
 */
Ray.prototype.clone = function ()
{
    return new Ray(this.x1, this.y1, this.x2, this.y2);
};

//module.exports = Ray;

