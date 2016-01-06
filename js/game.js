var stage = new PIXI.Container();
var renderer = PIXI.autoDetectRenderer(1280, 720,{backgroundColor : 0xCCCCCC});
document.body.appendChild(renderer.view);

//create a texture
var texture = PIXI.Texture.fromImage("assets/textures/wood.jpg");
var alertedTexture = PIXI.Texture.fromImage("assets/textures/mgs.png");


var tilingSprite = new PIXI.extras.TilingSprite(texture, 1280, 720);
stage.addChild(tilingSprite);

var alertedSprite = new PIXI.Sprite(alertedTexture);
alertedSprite.visible = false;

var visionColor = 0x000000;

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
		// Holes
		new PIXI.Polygon([
			new PIXI.Point(290,250),
			new PIXI.Point(400,230),
			new PIXI.Point(450,350),
			new PIXI.Point(300,420)]
		),
		new PIXI.Polygon([
			new PIXI.Point(600,200),
			new PIXI.Point(690,290),
			new PIXI.Point(570,340)]
		)
];

var paintings = [
	{
		pos: new PIXI.Point(400,100),
		value: 1000
	},
	{
		pos: new PIXI.Point(600,100),
		value: 500
	}
];

var visibilityPolygon;

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
	galleryGraphics.lineStyle(5, 0xFFFFFF, 1);
	galleryGraphics.drawPolygon(gallery[i].points);
};
stage.addChild(galleryGraphics);


var walls = new PIXI.Graphics();
walls.lineStyle(5, 0xFFFFFF, 1);
walls.drawPolygon(gallery[0].points);
stage.addChild(walls);
/*
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
*/

var starttime = null;
var alerted = false;


var guardGraphics = new PIXI.Graphics();
guardGraphics.lineStyle(1, 0x000000, 1);
guardGraphics.beginFill(0xff0000);
for (var i = guards.length - 1; i >= 0; i--) {
	guardGraphics.drawCircle(guards[i].x, guards[i].y, 10);
	//console.log("guard " + i + " in gallery: " + gallery[0].contains(guards[i].x, guards[i].y));
};
guardGraphics.endFill();

stage.addChild(guardGraphics);
var triangleGraphics = new PIXI.Graphics();
stage.addChild(triangleGraphics);
//mask the texture with the polygon
tilingSprite.mask = graphics;

stage.addChild(alertedSprite);

drawVisibility(guards[0].x, guards[0].y, 0);

stage.interactive = true;
stage.buttonMode = true;
stage.on("mousemove", mouseEventHandler);
stage.on("mousedown", mouseEventHandler);
stage.on("mouseup", mouseEventHandler);

update();

function update()
{   
	if(!starttime) starttime = Date.now();
    requestAnimationFrame( update );
    //setTimeout(timer(guards[0].x, guards[0].y, 1), 1000);
    var step = parseInt((Date.now() - starttime) / 200);
   //triangleGraphics.clear();
    //drawVisibility(guards[0].x, guards[0].y, step);

    alertedSprite.x = guards[0].x;
    alertedSprite.y = guards[0].y - 40;

    renderer.render(stage);
}

function mouseEventHandler(event)
{
	if(event.type == "mousedown")
		mousedown = true;
	else if(event.type =="mouseup")
		mousedown = false;
	
	var position = event.data.global;
	
	triangleGraphics.clear();
	if(mousedown)
	{
		guards[0].x = position.x;
		guards[0].y = position.y;
		
		//drawVisibility(position.x, position.y, endpoints.length);
	}

	if(visibilityPolygon.contains(position.x, position.y))
	{
		//console.log("inside");
		visionColor = 0xCCCCCC;
		alerted = true;

		
	}
	else{
		//console.log("not inside");
		visionColor = 0x000000;
		alerted = false;
	}

	drawVisibility(guards[0].x, guards[0].y, 0);

	alertedSprite.visible = alerted;
}


function drawVisibility(x, y, stopat)
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
	    	//var vectorLength = Math.sqrt(Math.pow(dir.x,2) + Math.pow(dir.y, 2));
	    	//dir.x /= vectorLength;
	    	//dir.y /= vectorLength;

			endpoint.angle = Math.atan2(dir.y, dir.x) + Math.PI;
			endpoint.polygon = p;
			endpoint.index = i;
			endpoint.neighbour1 = e1; 
			endpoint.neighbour2 = e2;

	    	endpoints.push(endpoint);
	    }
    };

    endpoints.sort(function(a,b){return a.angle - b.angle});

    // TODO: added the first 2 points twice for continuity
    //endpoints.push(endpoints[0]);
   	//endpoints.push(endpoints[1]);
    //endpoints.reverse();
    //console.debug(endpoints);

    var status = [];
    var lastVertex;
	// var ray = new Ray(x, y, endpoints[0].x, endpoints[0].y);


	var visPoints = [];
	for (var pass = 0; pass < 2; pass++) 
	{
		//console.debug(status.length);
	    for (var i = 0; i < endpoints.length; i++) 
	    {
	    	var p = endpoints[i];

	    	var nearestwall = status[0];

	    	if(i+1== stopat)
	    	{
	    		//console.debug(status.length);
		 		triangleGraphics.lineStyle(3, 0x0000ff, 1);
		 		triangleGraphics.moveTo(nearestwall.x1, nearestwall.y1);
		 		triangleGraphics.lineTo(nearestwall.x2, nearestwall.y2);

		 		for (var s = 1; s < status.length; s++) {
					triangleGraphics.lineStyle(3, 0x00ffff, 1);
					triangleGraphics.moveTo(status[s].x1, status[s].y1);
					triangleGraphics.lineTo(status[s].x2, status[s].y2);

		 		};
		 	}

			var neighbours = [p.neighbour1, p.neighbour2];
			//console.log(p.angle);

			// Add walls if p is the first endpoint of this wall
	    	for (var j = 0; j < neighbours.length; j++)
	    	{
	    		var n = neighbours[j];
				var dir = { 
					x: n.x - x, 
					y: n.y - y
				};

				// check whether 
				

				var difference = Math.atan2(dir.y, dir.x) + Math.PI - p.angle;
				//console.log("Add : ? " + difference);
				if(difference < -Math.PI || difference > 0)
				{
					//console.log("wall added");
		    		var wall = new LineSegment(n.x, n.y, p.x, p.y);
					status.push(wall);
				}

	    	};
			
			// Remove walls with p as second endpoint
	    	for (var j = status.length - 1; j >= 0; j--) 
	    	{
	    		if(status[j].isendpoint(p.x, p.y))
	    		{
	    			var otherend = status[j].other(p.x, p.y);
					var dir = { 
						x: otherend.x - x, 
						y: otherend.y - y
					};

					var difference = Math.atan2(dir.y, dir.x) + Math.PI - p.angle;
					//console.log("Remove : ? " + difference);
					if(difference >= -Math.PI && difference <= 0)
					{
		    			// remove this wall from the array
					//	console.log("wall removed");
		    			status.splice(j, 1);
		    		}
	    		}
	    	};


	    	// Sort walls in the status structure on distance to the origin
	    	var ray = new Ray(x, y, p.x, p.y);

	    	for (var j = status.length - 1; j >= 0; j--) 
	    	{
	    		var hit = status[j].intersects(ray);
	    		// calculate the distance from the origin to this wall
	    		status[j].dist = Math.sqrt(Math.pow(x - hit.x, 2) + Math.pow(y - hit.y, 2));

	    		// TODO: there shouldnt be any walls in the status that are not intersecting the sweepline
	    		if(!hit.result)
	    		{
	    			// Remove wall from the status
	    			status.splice(j,1);
	    		}
	    	};

	    	// TODO: Create this function in another location since we have to reuse it
	    	status.sort(function(a,b)
	    	{
	    		var diff = a.dist - b.dist;
	    		if(diff > 0) return 1;
	    		if(diff < 0) return -1;
	    		if(diff == 0)
	    		{
	    			// Check which line is closer by taking a point slightly further on the line
	    			var p1 = a.interpolate(p.x, p.y, 0.01);
	    			var p2 = b.interpolate(p.x, p.y, 0.01);

	    			var dist1 = Math.sqrt(Math.pow(x - p1.x, 2) + Math.pow(y - p1.y, 2));
	    			var dist2 = Math.sqrt(Math.pow(x - p2.x, 2) + Math.pow(y - p2.y, 2));

	    			if(dist1 > dist2) return 1;
	    			if(dist1 < dist2) return -1;
	    		}

	    		return 0;
	    	});

	  //    	triangleGraphics.lineStyle(i+1, 0x000000, 1);
	  //    	triangleGraphics.moveTo(x,y);
	  //    	triangleGraphics.lineTo(p.x,p.y);

	    	// Debug draws
	  //   	if(status.length > 0)
	  //   	{
		 //     	var hit = status[0].intersects(ray);

			// 	triangleGraphics.lineStyle(1, 0xff0000, 1);
			// 	triangleGraphics.moveTo(x,y);
			// 	triangleGraphics.lineTo(hit.x, hit.y);
			// }


	    	// Check whether the nearest wall has changed, if so construct a visibility triangle
	    	if(typeof nearestwall != 'undefined' && status.length > 0 && !nearestwall.equals(status[0]))
	    	{
	    		if(pass == 1)
		    	{
		    		var ray1 = new Ray(x, y, p.x, p.y);
		    		var hit1 = nearestwall.intersects(ray1);
		    		
		     		// triangleGraphics.lineStyle(1, 0x000000, 1);
			     	// triangleGraphics.moveTo(x,y);
			     	// triangleGraphics.lineTo(p.x, p.y);
		    		
		    		if (typeof lastVertex != 'undefined')
		    		{
		    			var ray2 = new Ray(x, y, lastVertex.x, lastVertex.y);
		    			var hit2 = nearestwall.intersects(ray2);
			    		var triangle = new PIXI.Polygon([
							new PIXI.Point(x, y),
							new PIXI.Point(hit1.x, hit1.y),
							new PIXI.Point(hit2.x, hit2.y)
						]);

			    		
						visPoints.push(new PIXI.Point(hit2.x, hit2.y));
						visPoints.push(new PIXI.Point(hit1.x, hit1.y));


			    		triangleGraphics.lineStyle(0, 0xFFFF00, 1);
						triangleGraphics.beginFill(visionColor, 0.5);
						triangleGraphics.drawPolygon(triangle);
						triangleGraphics.endFill();
					}
				}
		    	// Save the new vertex
	    		lastVertex = p;
	    	}
	    };
    };

    visibilityPolygon = new PIXI.Polygon(visPoints);

    //triangleGraphics.lineStyle(1, 0xFFFF00, 1);
	//triangleGraphics.beginFill(0x0000ff, 0.5);
	//triangleGraphics.drawPolygon(visibilityPolygon);
	//triangleGraphics.endFill();

}