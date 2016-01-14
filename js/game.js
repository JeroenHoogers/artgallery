var stage = new PIXI.Container();
var renderer = PIXI.autoDetectRenderer(1280, 720,{backgroundColor : 0xCCCCCC});
renderer.forceFXAA = true;
document.body.appendChild(renderer.view);

//create a texture
var texture = PIXI.Texture.fromImage("assets/textures/woodl.jpg");
var alertedTexture = PIXI.Texture.fromImage("assets/textures/mgs.png");
var lightTexture = PIXI.Texture.fromImage("assets/textures/light.png");

//var floorShadowSprite = new PIXI.extras.TilingSprite(texture, 1280, 720);
var floorSprite = new PIXI.extras.TilingSprite(texture, 1280, 720);

var shadowMask = new PIXI.RenderTexture(renderer, 1280, 720);

var shadowMaskGraphics = new PIXI.Graphics();
//shadowMaskGraphics.blendMode = PIXI.BLEND_MODES.EXCLUSION;
var shadowMaskSprite = new PIXI.Sprite(shadowMask);


//stage.addChild(shadowMaskGraphics);


var alertedSprite = new PIXI.Sprite(alertedTexture);
alertedSprite.anchor.x = 0.5;
alertedSprite.anchor.y = 0.5;

alertedSprite.visible = false;

var visionColor = 0x000000;

// Enable/Disable debugging
var debug = false;

var gallery = [
		// Gallery polygon
		new PIXI.Polygon([
			new PIXI.Point(50,20),
			new PIXI.Point(700,140),
			new PIXI.Point(1200,150),
			new PIXI.Point(1000,585),
			new PIXI.Point(830,605),
			new PIXI.Point(700,350),
			new PIXI.Point(500,600),
			new PIXI.Point(470,540),
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
			new PIXI.Point(850,250),
			new PIXI.Point(940,310),
			new PIXI.Point(780,340),
			new PIXI.Point(750,310)]
		)
];

var guardpath = [
	new PIXI.Point(500,250),
	new PIXI.Point(350,150),
	new PIXI.Point(250,150),
	new PIXI.Point(700,140),
	new PIXI.Point(820,190),
	new PIXI.Point(700,140),
	new PIXI.Point(500,150)
];

var obstacles = [
	new PIXI.Polygon([
		new PIXI.Point(570,200),
		new PIXI.Point(680,260),
		new PIXI.Point(530,340)]
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
	{position: new PIXI.Point(500,300)},
	{position: new PIXI.Point(960,300)}
];


var player = new PIXI.Point(900,500);
var moveplayerx = 0;
var moveplayery = 0;

//create graphics
var galleryMask = new PIXI.Graphics();
galleryMask.beginFill(0);
galleryMask.drawPolygon(gallery[0].points);
galleryMask.endFill();

var visibilityMask = new PIXI.Graphics();
stage.addChild(visibilityMask);

var shadowGraphics = new PIXI.Graphics();
shadowGraphics.beginFill(0x000000, 0.3);
shadowGraphics.drawPolygon(gallery[0].points);
shadowGraphics.endFill();
shadowGraphics.mask = shadowMaskSprite;

var mousedown = false;

var obstacleGraphics = new PIXI.Graphics();
for (var i = 0; i < obstacles.length; i++) {
	obstacleGraphics.beginFill(0xffff44);
	obstacleGraphics.drawPolygon(obstacles[i].points);
	obstacleGraphics.endFill();
}

stage.addChild(galleryMask);
stage.addChild(floorSprite);
stage.addChild(obstacleGraphics);
// Add shadow
stage.addChild(shadowGraphics);

var galleryGraphics = new PIXI.Graphics();
for (var i = 1; i < gallery.length; i++)  {
	galleryGraphics.beginFill(0xCCCCCC);
	galleryGraphics.drawPolygon(gallery[i].points);
	galleryGraphics.endFill();
	galleryGraphics.lineStyle(5, 0xFFFFFF, 1);
	galleryGraphics.drawPolygon(gallery[i].points);
}
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

var lightGraphics = new PIXI.Graphics();
lightGraphics.beginFill(0xFFFFFF, 0.3);
lightGraphics.drawPolygon(gallery[0].points);
lightGraphics.endFill();

//stage.addChild(lightGraphics);

var starttime = null;
var alerted = false;

var guardGraphics = new PIXI.Graphics();
guardGraphics.lineStyle(1, 0x000000, 1);
guardGraphics.beginFill(0xff0000);

// Draw guards
for (var i = guards.length - 1; i >= 0; i--) {
	guardGraphics.drawCircle(guards[i].x, guards[i].y, 10);
};

guardGraphics.endFill();

stage.addChild(guardGraphics);

var triangleGraphics = new PIXI.Graphics();
stage.addChild(triangleGraphics);

//mask the texture with the polygon

floorSprite.mask = galleryMask;
//lightGraphics.mask = visibilityMask;
stage.addChild(alertedSprite);

stage.addChild(shadowMaskSprite);
//shadowMaskSprite
//stage.addChild(shadowMaskGraphics);


//shadowGraphics.mask = shadowMaskSprite;

drawVisibility(guards[0].x, guards[0].y, 0);

stage.interactive = true;
stage.buttonMode = true;
stage.on("mousemove", mouseEventHandler);
stage.on("mousedown", mouseEventHandler);
stage.on("mouseup", mouseEventHandler);

var left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);

var currentpathindex = 0;
var lastframe;
var playerspeed = 200;
var guardspeed = 120;



update();

function update()
{   
	if(!starttime) starttime = Date.now();
	if(!lastframe) lastframe = Date.now();
    requestAnimationFrame( update );

    var step = parseInt((Date.now() - starttime) / 1000);
    var deltatime = (Date.now() - lastframe) / 1000;

   	triangleGraphics.clear();
	guardGraphics.clear();

	alerted = false;
	// Check whether the player can be seen by any of the guards
	for (var g = 0; g < guards.length; g++) {
		if(typeof(guards[g].visibility) != "undefined" && guards[g].visibility.contains(player.x, player.y))
		{	
			alerted = true;
			break;
		}
	};

	if(!alerted && !debug)
	{
		if(guards[0].position.x < guardpath[currentpathindex].x - guardspeed * deltatime)
			guards[0].position.x = parseInt(guards[0].position.x + guardspeed * deltatime);
		else if(guards[0].position.x > guardpath[currentpathindex].x + guardspeed * deltatime)
			guards[0].position.x = parseInt(guards[0].position.x - guardspeed * deltatime);
		else
			guards[0].position.x = guardpath[currentpathindex].x;
		if(guards[0].position.y < guardpath[currentpathindex].y)
			guards[0].position.y = parseInt(guards[0].position.y + guardspeed * deltatime);
		else if(guards[0].position.y > guardpath[currentpathindex].y + guardspeed * deltatime)
			guards[0].position.y = parseInt(guards[0].position.y - guardspeed * deltatime);
		else
			guards[0].position.y = guardpath[currentpathindex].y;
		if(guards[0].position.x == guardpath[currentpathindex].x && guards[0].position.y == guardpath[currentpathindex].y)
			currentpathindex = (currentpathindex + 1) % (guardpath.length);
	}

	var nextPosition = new PIXI.Point(
			parseInt( player.x  + (moveplayerx * playerspeed * deltatime)), 
			parseInt( player.y + (moveplayery * playerspeed * deltatime)));

	if(gallery[0].contains(nextPosition.x, nextPosition.y))
	{
		var collision = false;

		// Check for collision with holes
		for (var i = 1; i < gallery.length; i++) 
		{
			if(gallery[i].contains(nextPosition.x, nextPosition.y))
			{
				collision = true;
				break;
			}
		};

		// Check for collision with obstacles
		for (var i = 0; i < obstacles.length; i++) 
		{
			if(obstacles[i].contains(nextPosition.x, nextPosition.y))
			{
				collision = true;
				break;
			}
		};

		// Player did not collide, set next position
		if(!collision)
		{
			player.x = nextPosition.x;
			player.y = nextPosition.y;
		}
	}
	guardGraphics.lineStyle(1, 0x000000, 1);
	guardGraphics.beginFill(0x0000ff);
	guardGraphics.drawCircle(player.x, player.y, 10);
	guardGraphics.endFill();

	alertedSprite.visible = alerted;
	
	drawVisibility(step);
    
    
   	//triangleGraphics.clear();
    //drawVisibility(guards[0].x, guards[0].y, step);

    alertedSprite.x = guards[0].position.x;
    alertedSprite.y = guards[0].position.y - 40;

    // save current time to calculate the deltatime next frame
    lastframe = Date.now();
    renderer.render(stage);

    shadowMaskGraphics.clear();
    //shadowMaskGraphics.beginFill(0x000000, 0);
    //shadowMaskGraphics.drawRect(0,0,1280,720);
    //shadowMaskGraphics.endFill();
    shadowMaskGraphics.lineStyle(0, 0x000000, 1);
	shadowMaskGraphics.beginFill(0xFFFFFF, 1);
	shadowMaskGraphics.drawPolygon(gallery[0].points);
	shadowMaskGraphics.endFill();

	for (var i = 0; i < guards.length; i++) {
		shadowMaskGraphics.beginFill(0x000000, 1);
		shadowMaskGraphics.drawPolygon(guards[i].visibility);
		shadowMaskGraphics.endFill();
	};

	shadowMask.render(shadowMaskGraphics);
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
		//triangleGraphics.clear();
		//guardGraphics.clear();
		var position = event.data.global;
		guards[0].position.x = position.x;
		guards[0].position.y = position.y;

		//drawVisibility(guards[0].x, guards[0].y, 0);
		
		//drawVisibility(position.x, position.y, endpoints.length);
	}

	drawVisibility(guards[0].x, guards[0].y, 0);
}

function keyboard(keyCode) 
{
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) 
  {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) 
  {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}


  //Left arrow key `press` method
  left.press = function() 
  {
    //Change the cat's velocity when the key is pressed
    moveplayerx = -1;
    moveplayery = 0;
  };

  //Left arrow key `release` method
  left.release = function() 
  {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the cat isn't moving vertically:
    //Stop the cat
    if (!right.isDown && moveplayery === 0) {
      moveplayerx = 0;
    }
  };

  //Up
  up.press = function() 
  {
    moveplayery = -1;
    moveplayerx = 0;
  };
  
  up.release = function() 
  {
    if (!down.isDown && moveplayerx === 0) {
      moveplayery = 0;
    }
  };

  //Right
  right.press = function() 
  {
    moveplayerx = 1;
    moveplayery = 0;
  };
  right.release = function() 
  {
    if (!left.isDown && moveplayery === 0) {
      moveplayerx = 0;
    }
  };

  //Down
  down.press = function() 
  {
    moveplayery = 1;
    moveplayerx = 0;
  };

  down.release = function() 
  {
    if (!up.isDown && moveplayerx === 0) {
      moveplayery = 0;
    }
  };

function drawVisibility(stopat)
{
	// clear the current visibility mask
    visibilityMask.clear();
	visibilityMask.lineStyle(0, 0xFFFF00, 1);

	for (var g = 0; g < guards.length; g++) 
	{
		var o = guards[g].position;
	
		guardGraphics.lineStyle(1, 0x000000, 1);
		guardGraphics.beginFill(0xff0000);
		guardGraphics.drawCircle(o.x, o.y, 10);
		guardGraphics.endFill();
		triangleGraphics.lineStyle(1, 0xFFFFFF);

	    var endpoints = [];

	    // Initialize event structure
	    for (var p = 0; p < gallery.length; p++) {
		    for (var i = 0;  i < gallery[p].points.length; i+=2) {
		    	var endpoint = {};
		    	endpoint.x = gallery[p].points[i];
				endpoint.y = gallery[p].points[i+1];
				var dir = { 
					x: endpoint.x - o.x, 
					y: endpoint.y - o.y
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

				endpoint.angle = Math.atan2(dir.y, dir.x) + Math.PI;
				endpoint.polygon = p;
				endpoint.index = i;
				endpoint.neighbour1 = e1; 
				endpoint.neighbour2 = e2;

		    	endpoints.push(endpoint);
		    }
	    };

	    endpoints.sort(function(a,b){return a.angle - b.angle});

	    var status = [];
	    var lastVertex;
		// var ray = new Ray(x, y, endpoints[0].x, endpoints[0].y);


		if(stopat > endpoints.length) stopat = endpoints.length;
		var visPoints = [];
		for (var pass = 0; pass < 2; pass++) 
		{
			//console.debug(status.length);
			var steps = (pass > 0 && debug) ? stopat : endpoints.length;
		    for (var i = 0; i < steps; i++) 
		    {
		    	var p = endpoints[i];

		    	var nearestwall = status[0];

				var neighbours = [p.neighbour1, p.neighbour2];

				// Add walls if p is the first endpoint of this wall
		    	for (var j = 0; j < neighbours.length; j++)
		    	{

		    		var n = neighbours[j];
					var dir = { 
						x: n.x - o.x, 
						y: n.y - o.y
					};

					var exists = false;
					// check whether the wall is already in the status structure
		    		for (var z = status.length - 1; z >= 0; z--) 
		    		{
		    			exists = status[z].isendpoint(p.x, p.y);
		    			if(exists)
		    				break;
		    		}

					//var difference = Math.atan2(dir.y, dir.x) - p.angle;
					var neighbourangle = Math.atan2(dir.y, dir.x) + Math.PI;
					//console.log("Add : ? " + difference);
					//if(difference < -Math.PI || difference > 0)
					if((neighbourangle < Math.PI && p.angle > Math.PI && neighbourangle + Math.PI * 2 > p.angle && neighbourangle + Math.PI * 2 - p.angle < Math.PI) || 
						(neighbourangle > p.angle &&  neighbourangle - p.angle < Math.PI))
					{
						//console.log("wall added");
						//if(exists)
						//	console.log("wall added twice");

			    		var wall = new LineSegment(n.x, n.y, p.x, p.y);
			    		if(!exists)
			    		{
			    			wall.age = 0;			
						}
						status.push(wall);
					}

		    	};
				
				// Remove walls with p as second endpoint
		    	for (var j = status.length - 1; j >= 0; j--) 
		    	{
		    		if(status[j].isendpoint(p.x, p.y) && status[j].age > 0)
		    		{
		    			// remove this wall from the array
						//console.log("wall removed");
		    			status.splice(j, 1);
		    		}
		    	};


		    	// Sort walls in the status structure on distance to the origin
		    	var ray = new Ray(o.x, o.y, p.x, p.y);

		    	for (var j = status.length - 1; j >= 0; j--) 
		    	{
		    		var hit = status[j].intersects(ray);
		    		// calculate the distance from the origin to this wall
		    		status[j].dist = Math.sqrt(Math.pow(o.x - hit.x, 2) + Math.pow(o.y - hit.y, 2));
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

		    			var dist1 = Math.sqrt(Math.pow(o.x - p1.x, 2) + Math.pow(o.y - p1.y, 2));
		    			var dist2 = Math.sqrt(Math.pow(o.x - p2.x, 2) + Math.pow(o.y - p2.y, 2));

		    			if(dist1 > dist2) return 1;
		    			if(dist1 < dist2) return -1;
		    		}

		    		return 0;
		    	});

		  //    	triangleGraphics.lineStyle(i+1, 0x000000, 1);
		  //    	triangleGraphics.moveTo(x,y);
		  //    	triangleGraphics.lineTo(p.x,p.y);



		    	// Debug draws
		    	if(status.length > 0 && pass == 1 && debug)
		    	{
			     	var hit = status[0].intersects(ray);

					triangleGraphics.lineStyle(1, 0xff0000, 1);
					triangleGraphics.moveTo(o.x,o.y);
					triangleGraphics.lineTo(hit.x, hit.y);


			     	triangleGraphics.lineStyle(1, 0xFFFF00, 1);
					triangleGraphics.beginFill(0x000000, 1);
					triangleGraphics.drawCircle(p.x, p.y, 5);
					triangleGraphics.endFill();


					if(nearestwall != "undefined" && i == stopat - 1)
					{
						for (var z = 0; z < status.length; z++) {
							if(status[z].age > 0)
								triangleGraphics.lineStyle(6, 0x00ff00, 1);
							else
								triangleGraphics.lineStyle(6, 0xff0000, 1);
							triangleGraphics.moveTo(status[z].x1, status[z].y1);
							triangleGraphics.lineTo(status[z].x2, status[z].y2);			
						}

						triangleGraphics.lineStyle(3, 0x0000ff, 1);
						triangleGraphics.moveTo(nearestwall.x1, nearestwall.y1);
						triangleGraphics.lineTo(nearestwall.x2, nearestwall.y2);
					}
				}

				for (var j = 0; j < status.length; j++) {
					status[j].age = 1;
				};

		    	// Check whether the nearest wall has changed, if so construct a visibility triangle
		    	if(typeof nearestwall != 'undefined' && status.length > 0 && !nearestwall.equals(status[0]))
		    	{
		    		if(pass == 1)
			    	{
			    		var ray1 = new Ray(o.x, o.y, p.x, p.y);
			    		var hit1 = nearestwall.intersects(ray1);
			    		
			    		// DEBUG lines
			    		if(debug)
			    		{
				     		triangleGraphics.lineStyle(1, 0x000000, 1);
					     	triangleGraphics.moveTo(o.x,o.y);
					     	triangleGraphics.lineTo(p.x, p.y);
					    }
			    		
			    		if (typeof lastVertex != 'undefined')
			    		{
			    			var ray2 = new Ray(o.x, o.y, lastVertex.x, lastVertex.y);
			    			var hit2 = nearestwall.intersects(ray2);
				    		var triangle = new PIXI.Polygon([
								new PIXI.Point(o.x, o.y),
								new PIXI.Point(hit1.x, hit1.y),
								new PIXI.Point(hit2.x, hit2.y)
							]);

							visPoints.push(new PIXI.Point(hit2.x, hit2.y));
							visPoints.push(new PIXI.Point(hit1.x, hit1.y));

							// Draw debug triangles
							if(debug)
							{
					    		triangleGraphics.lineStyle(1, 0xFFFF00, 1);
								triangleGraphics.beginFill(0x0000ff, 0.5);
								triangleGraphics.drawPolygon(triangle);
								triangleGraphics.endFill();
							}
						}
					}
			    	// Save the new vertex
		    		lastVertex = p;
		    	}
		    };
	    };

	    //visibilityPolygon = new PIXI.Polygon(visPoints);
	    guards[g].visibility = new PIXI.Polygon(visPoints);
    	visibilityMask.beginFill(0x000000, 0);
		visibilityMask.drawPolygon(guards[g].visibility);
		visibilityMask.endFill();
	};
}