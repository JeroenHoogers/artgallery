var stage = new PIXI.Container();
var renderer = PIXI.autoDetectRenderer(1280, 720,{backgroundColor : 0xCCCCCC});
document.body.appendChild(renderer.view);

//create a texture
var texture = PIXI.Texture.fromImage("assets/textures/wood.jpg");
var tilingSprite = new PIXI.extras.TilingSprite(texture, 1280, 720);
stage.addChild(tilingSprite);

var gallery = [
		// Gallery polygon
		new PIXI.Polygon([
			new PIXI.Point(200,100),
			new PIXI.Point(700,100),
			new PIXI.Point(1000,250),
			new PIXI.Point(900,585),
			new PIXI.Point(830,605),
			new PIXI.Point(700,350),
			new PIXI.Point(500,620),
			new PIXI.Point(470,530),
			new PIXI.Point(100,650),
			new PIXI.Point(140,230)
		]),
		// // Holes
		// new PIXI.Polygon([
		// 	new PIXI.Point(290,250),
		// 	new PIXI.Point(400,230),
		// 	new PIXI.Point(450,350),
		// 	new PIXI.Point(300,420)]
		// ),
		// new PIXI.Polygon([
		// 	new PIXI.Point(600,200),
		// 	new PIXI.Point(690,290),
		// 	new PIXI.Point(570,340)]
		// )
	];

var guards = [
	new PIXI.Point(500,250),
	new PIXI.Point(630,300)
];

//create graphics
var graphics = new PIXI.Graphics();
graphics.beginFill(0);
graphics.drawPolygon(gallery[0].points);
graphics.endFill();

var mousedown = false;

stage.addChild(graphics);

var galleryGraphics = new PIXI.Graphics();
for (var i = gallery.length - 1; i >= 1; i--) {
	galleryGraphics.beginFill(0xCCCCCC);
	galleryGraphics.drawPolygon(gallery[i].points);
	galleryGraphics.endFill();
	galleryGraphics.lineStyle(10, 0xFFFFFF, 1);
	galleryGraphics.drawPolygon(gallery[i].points);
};

stage.addChild(galleryGraphics);


var walls = new PIXI.Graphics();

walls.drawPolygon(gallery[0].points);
stage.addChild(walls);

var paintings = new PIXI.Graphics();
paintings.lineStyle(1, 0x009900, 1);
paintings.beginFill(0x44ff44);
paintings.moveTo(400,110);
paintings.lineTo(540,110);
paintings.lineTo(540,105);
paintings.lineTo(400,105);
paintings.lineTo(400,110);
paintings.endFill();

stage.addChild(paintings);

var guardGraphics = new PIXI.Graphics();
guardGraphics.lineStyle(1, 0x000000, 1);
guardGraphics.beginFill(0xff0000);
for (var i = guards.length - 1; i >= 0; i--) {
	guardGraphics.drawCircle(guards[i].x, guards[i].y, 10);
	console.log("guard " + i + " in gallery: " + gallery[0].contains(guards[i].x, guards[i].y));
};
guardGraphics.endFill();

stage.addChild(guardGraphics);
var triangleGraphics = new PIXI.Graphics();
stage.addChild(triangleGraphics);
//mask the texture with the polygon
tilingSprite.mask = graphics;
drawVisibility(guards[0].x, guards[0].y);

stage.interactive = true;
stage.buttonMode = true;
stage.on("mousemove", mouseEventHandler);
stage.on("mousedown", mouseEventHandler);
stage.on("mouseup", mouseEventHandler);

update();

function update()
{   
    requestAnimationFrame( update );
    renderer.render(stage);
}

function mouseEventHandler(event)
{
	if(event.type == "mousedown")
		mousedown = true;
	else if(event.type =="mouseup")
		mousedown = false;

	if(mousedown)
	{
		triangleGraphics.clear();
		var position = event.data.global;
		drawVisibility(position.x, position.y);
	}

}


function drawVisibility(x, y)
{
	triangleGraphics.lineStyle(1, 0xFFFFFF);

    var endpoints = [];

    for (var p = 0; p < gallery.length; p++) {
	    for (var i = 0;  i < gallery[p].points.length; i+=2) {
	    	var endpoint = {};
	    	endpoint.x = gallery[p].points[i];
			endpoint.y = gallery[p].points[i+1];
			var dir = { 
				x: endpoint.x - x, 
				y: endpoint.y - y
			};
			var len = gallery[p].points.length;
			var e1 = {
	    		x: gallery[p].points[(len + i-2) % len],
	    		y: gallery[p].points[(len + i-1) % len]
	    	}
	    	var e2 = {
	    		x: gallery[p].points[(i+2) % len],
	    		y: gallery[p].points[(i+3) % len]
	    	}
	    	// normalisation (optimal)
	    	var vectorLength = Math.sqrt(Math.pow(dir.x,2) + Math.pow(dir.y, 2));
	    	dir.x /= vectorLength;
	    	dir.y /= vectorLength;

			endpoint.angle = Math.atan2(dir.y, dir.x);
			endpoint.polygon = p;
			endpoint.index = i;
			endpoint.neighbour1 = e1; 
			endpoint.neighbour2 = e2;

	    	endpoints.push(endpoint);
	    }
    };

    endpoints.sort(function(a,b){return a.angle - b.angle});

    // TODO: added the first 2 points twice for continuity
    endpoints.push(endpoints[0]);
    endpoints.push(endpoints[1]);
    console.debug(endpoints);

    var status = [];
    var lastVertex;

    for (var i = endpoints.length - 1; i >= 0; i--) 
    {
    	var p = endpoints[i];

    	var containsWall1 = false;
    	var containsWall2 = false;

    	var nearestwall = status[0];


    	// Remove walls with p as second endpoint
    	for (var j = status.length - 1; j >= 0; j--) 
    	{
    		if(status[j].isendpoint(p.x, p.y))
    		{
    			// Check which neighbour the wall belongs to so we don't add them again.
    			if(status[j].isendpoint(p.neighbour1.x, p.neighbour1.y))
    				containsWall1 = true;
    			else
    				containsWall2 = true;

    			// remove this wall from the array
    			status.splice(j, 1);
    		}
    	};
    	
    	// Add walls
    	if(!containsWall1)
    	{
    		var wall = new LineSegment(p.neighbour1.x, p.neighbour1.y, p.x, p.y);
    		status.push(wall);
    	}
    	if(!containsWall2)
    	{
    		var wall = new LineSegment(p.x, p.y, p.neighbour2.x, p.neighbour2.y);
    		status.push(wall);
    	}

    	// Sort walls in the status structure on distance to the origin
    	var ray = new Ray(x, y, p.x, p.y);

    	for (var j = status.length - 1; j >= 0; j--) 
    	{
    		var hit = status[j].intersects(ray);
    		console.log(hit.result);
    		// calculate the distance from the origin to this wall
    		status[j].dist = Math.sqrt(Math.pow(x - hit.x, 2) + Math.pow(y - hit.y, 2));

    		// TODO: there shouldnt be any walls in the status that are not intersecting the sweepline
    		if(!hit.result)
    		{
    			status.splice(j,1);

    		}
    	};

    	status.sort(function(a,b){ return a.dist - b.dist});

    	// Debug draws
    	/*if(status.length > 0)
    	{
	     	var hit = status[0].intersects(ray);
	     	triangleGraphics.lineStyle(2*i, 0x000000, 1);
	     	triangleGraphics.moveTo(x,y);
	     	triangleGraphics.lineTo(p.x,p.y);
			triangleGraphics.lineStyle(1, 0xff0000, 1);
			triangleGraphics.moveTo(x,y);
			triangleGraphics.lineTo(hit.x, hit.y);
		}*/


    	// Check whether the nearest wall has changed, if so construct a visibility triangle
    	if(typeof nearestwall != 'undefined' && status.length > 0 && !nearestwall.equals(status[0]))
    	{
    		var ray1 = new Ray(x, y, p.x, p.y);
    		var hit1 = nearestwall.intersects(ray1);
    		
     		triangleGraphics.lineStyle(1, 0x000000, 1);
	     	triangleGraphics.moveTo(x,y);
	     	triangleGraphics.lineTo(p.x,p.y);
    		
    		if (typeof lastVertex != 'undefined')
    		{
    			var ray2 = new Ray(x, y, lastVertex.x, lastVertex.y);
    			var hit2 = nearestwall.intersects(ray2);
	    		var triangle = new PIXI.Polygon([
					new PIXI.Point(x, y),
					new PIXI.Point(hit1.x, hit1.y),
					new PIXI.Point(hit2.x, hit2.y)
				]);
	    		triangleGraphics.lineStyle(0, 0xFFFF00, 1);
				triangleGraphics.beginFill(0, 0.3);
				triangleGraphics.drawPolygon(triangle);
				triangleGraphics.endFill();
			}
			// Save the new vertex
			lastVertex = p;

    	}

    };
    
}