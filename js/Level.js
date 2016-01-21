function Level()
{
	this.gallery = new PIXI.Polygon([]);
	this.start =  new PIXI.Polygon([]);
	this.finish = new PIXI.Polygon([]);
	this.holes = [];
	this.obstacles = [];
	this.covers = [];
	this.paintings = [];
	this.player = {position : new PIXI.Point()};
	this.guards = [];
}

Level.prototype.constructor = Level;

Level.prototype.load = function(level)
{
	this.loadJSON(levels[level]);
}

Level.prototype.loadJSON = function(level)
{
	newlevel = JSON.parse(level);
	this.gallery.points = newlevel.gallery.points;
	for (var i = 0; i < newlevel.holes.length; i++) {
		this.holes.push(new PIXI.Polygon(newlevel.holes[i].points));
	};
	for (var i = 0; i < newlevel.obstacles.length; i++) {
		this.obstacles.push(new PIXI.Polygon(newlevel.obstacles[i].points));
	};
	for (var i = 0; i < newlevel.covers.length; i++) {
		this.covers.push(new PIXI.Polygon(newlevel.covers[i].points));
	};
	this.paintings = newlevel.paintings;
	this.player = newlevel.player;
	for (var i = 0; i < newlevel.guards.length; i++) {
		this.guards.push({position : newlevel.guards[i].position,
							guardpath : new PIXI.Polygon(newlevel.guards[i].guardpath.points)});
	};
}

Level.prototype.save = function()
{
	return JSON.stringify(this);
}

