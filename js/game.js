var stage = new PIXI.Container();
var renderer = PIXI.autoDetectRenderer(1280, 720,{backgroundColor : 0xCCCCCC});
renderer.forceFXAA = true;
document.body.appendChild(renderer.view);

//create a texture
var floorTexture = PIXI.Texture.fromImage("assets/textures/wood.jpg");
var alertedTexture = PIXI.Texture.fromImage("assets/textures/mgs.png");
var lightTexture = PIXI.Texture.fromImage("assets/textures/light.png");

var floorSprite = new PIXI.extras.TilingSprite(floorTexture, 1280, 720);

var shadowMask = new PIXI.RenderTexture(renderer, 1280, 720);
var shadowMaskGraphics = new PIXI.Graphics();
var shadowMaskSprite = new PIXI.Sprite(shadowMask);

var guardTexture = new PIXI.RenderTexture(renderer, 20, 20);
var level = {};

// Enable/Disable debugging
var debug = false;

var visibilityPolygon;

var moveplayer = new Vector(0, 0);

var starttime = null;

// Create graphics objects
var galleryGraphics = new PIXI.Graphics();
var wallGraphics = new PIXI.Graphics();
var galleryMask = new PIXI.Graphics();
var obstacleGraphics = new PIXI.Graphics();

var playerGraphics = new PIXI.Graphics();
var guardGraphics = new PIXI.Graphics();

var shadowGraphics = new PIXI.Graphics();
var visibilityMask = new PIXI.Graphics();

var debugGraphics = new PIXI.Graphics();

//drawVisibility(guards[0].x, guards[0].y, 0);

stage.interactive = true;
stage.buttonMode = true;
stage.on("mousemove", mouseEventHandler);
stage.on("mousedown", mouseEventHandler);
stage.on("mouseup", mouseEventHandler);

var lastframe;
var playerspeed = 200;
var guardspeed = 120;

initialize();

update();

function initialize()
{
	// Add masks
	stage.addChild(visibilityMask);
	stage.addChild(galleryMask);

	// Add graphics objects
	stage.addChild(floorSprite);
	stage.addChild(obstacleGraphics);
	stage.addChild(shadowGraphics);
	stage.addChild(galleryGraphics);
	stage.addChild(wallGraphics);
	stage.addChild(guardGraphics);
	//stage.addChild(guardGraphics);
	stage.addChild(playerGraphics);

	stage.addChild(shadowMaskSprite);

	stage.addChild(debugGraphics);
	// Mask the texture with the gallery polygon
	floorSprite.mask = galleryMask;

	// Load the gallery
	loadlevel();
}

function loadlevel()
{
	level.gallery = new PIXI.Polygon([
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
	])

	level.holes = [
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

	level.obstacles = [
		new PIXI.Polygon([
			new PIXI.Point(570,200),
			new PIXI.Point(680,260),
			new PIXI.Point(530,340)
		])
	];

	level.paintings = [
		{
			position: new PIXI.Point(400,100),
			value: 1000
		},
		{
			position: new PIXI.Point(600,100),
			value: 500
		}
	];

	level.guards = [
		{
			position: new PIXI.Point(500,300),
			guardpath: [
				new PIXI.Point(500,250),
				new PIXI.Point(350,150),
				new PIXI.Point(250,150),
				new PIXI.Point(700,140),
				new PIXI.Point(820,190),
				new PIXI.Point(700,140),
				new PIXI.Point(500,150)
			]
		}
		//,
		// {
		// 	position: new PIXI.Point(960,300),
		// 	guardpath: []
		// }
	];

	level.player = {position: new PIXI.Point(900,500)};

	level = new Level();
	level.load("level2");
	
	guardGraphics.clear();
	guardGraphics.lineStyle(1, 0x000000, 1);
	guardGraphics.beginFill(0xff0000);
	guardGraphics.drawCircle(10, 10, 10);
	guardGraphics.endFill();

	guardTexture.render(guardGraphics);

	// Initialize guards
	for (var i = 0; i < level.guards.length; i++) 
	{
		var guardSprite = new PIXI.Sprite(guardTexture);
		guardSprite.anchor.x = 0.5;
		guardSprite.anchor.y = 0.5;

		var alertedSprite = new PIXI.Sprite(alertedTexture);
		alertedSprite.anchor.x = 0.5;
		alertedSprite.anchor.y = 1.5;
		alertedSprite.visible = false;

		var lightSprite = new PIXI.Sprite(lightTexture);
		lightSprite.anchor.x = 0.5;
		lightSprite.anchor.y = 0.5;

		level.guards[i].alerted = false;
		level.guards[i].alertedIndicator = alertedSprite;
		level.guards[i].light = lightSprite;
		level.guards[i].visibility = new PIXI.Polygon();
		level.guards[i].pathindex = 0;

		level.guards[i].light.mask = visibilityMask;
		stage.addChild(level.guards[i].alertedIndicator);
		guardGraphics.addChild(level.guards[i].light);
	}

	// Draw gallery mask
	galleryMask.beginFill(0);
	galleryMask.drawPolygon(level.gallery.points);
	galleryMask.endFill();

	// Draw holes
	galleryGraphics.clear();
	for (var i = 0; i < level.holes.length; i++)  {
		galleryGraphics.beginFill(0xCCCCCC);
		galleryGraphics.drawPolygon(level.holes[i].points);
		galleryGraphics.endFill();
		galleryGraphics.lineStyle(5, 0xFFFFFF, 1);
		galleryGraphics.drawPolygon(level.holes[i].points);
	}

	wallGraphics.clear();
	wallGraphics.lineStyle(5, 0xFFFFFF, 1);
	wallGraphics.drawPolygon(level.gallery.points);

	// Draw obstacles
	obstacleGraphics.clear();
	for (var i = 0; i < level.obstacles.length; i++) {
		obstacleGraphics.beginFill(0xFFFFFF);
		obstacleGraphics.drawPolygon(level.obstacles[i].points);
		obstacleGraphics.endFill();
	}

	// Draw shadows
	shadowGraphics.clear();
	shadowGraphics.beginFill(0x000000, 0.3);
	shadowGraphics.drawPolygon(level.gallery.points);
	shadowGraphics.endFill();
	shadowGraphics.mask = shadowMaskSprite;
}

// Draw function, called every frame
function draw()
{
	// Clear the graphics objects that we have to redraw
	guardGraphics.clear();
	shadowMaskGraphics.clear();
	playerGraphics.clear();
   	debugGraphics.clear();

    var step = parseInt((Date.now() - starttime) / 1000);
   	calculateVisibility(step);

	// Draw player
	playerGraphics.lineStyle(1, 0x000000, 1);
	playerGraphics.beginFill(0x0000ff);
	playerGraphics.drawCircle(level.player.position.x, level.player.position.y, 10);
	playerGraphics.endFill();

	// Create shadow mask
    shadowMaskGraphics.lineStyle(0, 0x000000, 1);
	shadowMaskGraphics.beginFill(0xFFFFFF, 1);
	shadowMaskGraphics.drawPolygon(level.gallery.points);
	shadowMaskGraphics.endFill();

	for (var i = 0; i < level.guards.length; i++) 
	{
		var g = level.guards[i];

		// Draw guards
		guardGraphics.lineStyle(1, 0x000000, 1);
		guardGraphics.beginFill(0xff0000);
		guardGraphics.drawCircle(g.position.x, g.position.y, 10);
		guardGraphics.endFill();
		// guardGraphics.lineStyle(1, 0x000000, 1);
		// guardGraphics.beginFill(0xff0000);
		// guardGraphics.drawCircle(g.position.x, g.position.y, 10);
		// guardGraphics.endFill();

		// Add guard visibility to the shadow mask
		shadowMaskGraphics.beginFill(0x000000, 1);
		shadowMaskGraphics.drawPolygon(g.visibility);
		shadowMaskGraphics.endFill();

		// TODO: make guard drawable and add it to the guard
	};

	shadowMask.render(shadowMaskGraphics);

    
}

// Update function, called every frame
function update()
{   
	if(!starttime) starttime = Date.now();
	if(!lastframe) lastframe = Date.now();
    requestAnimationFrame( update );

    var step = parseInt((Date.now() - starttime) / 1000);
    var deltatime = (Date.now() - lastframe) / 1000;

	// Check whether the player can be seen by any of the guards
	for (var g = 0; g < level.guards.length; g++) {
		level.guards[g].alerted = false;
		if(typeof(level.guards[g].visibility) != "undefined" && level.guards[g].visibility.contains(level.player.position.x, level.player.position.y))
		{
			level.guards[g].alerted = true;
		}
		level.guards[g].alertedIndicator.visible = level.guards[g].alerted;
		level.guards[g].light.position = level.guards[g].position;
		level.guards[g].alertedIndicator.position = level.guards[g].position;
	

	// TODO: Improve this code and make it work for all guards
		if(!level.guards[g].alerted && !debug)
		{
			var pathindex = level.guards[g].pathindex;
			var currentguardposition = new PIXI.Point(level.guards[g].position.x, level.guards[g].position.y);
			var nextguardposition = new PIXI.Point(level.guards[g].guardpath.points[pathindex], level.guards[g].guardpath.points[pathindex + 1]);
			//var nextguardposition = new PIXI.Point(level.guards[g].guardpath.points[pathindex + 2], level.guards[g].guardpath.points[pathindex + 3]);

			var lastvisited = new Vector(currentguardposition.x, currentguardposition.y);
			var target = new Vector(nextguardposition.x, nextguardposition.y);
			var direction = target.sub(lastvisited);
			direction = direction.normalize();

			var nextPosition = new PIXI.Point(
				level.guards[g].position.x + (direction.x * guardspeed * deltatime), 
				level.guards[g].position.y + (direction.y * guardspeed * deltatime)
			);
			level.guards[g].position.x = nextPosition.x;
			level.guards[g].position.y = nextPosition.y;

			// if(level.guards[g].position.x < level.guards[g].guardpath.points[pathindex] - guardspeed * deltatime)
			// 	level.guards[g].position.x = parseInt(level.guards[g].position.x + guardspeed * deltatime);
			// else if(level.guards[g].position.x > level.guards[g].guardpath.points[pathindex] + guardspeed * deltatime)
			// 	level.guards[g].position.x = parseInt(level.guards[g].position.x - guardspeed * deltatime);
			// else
			// 	level.guards[g].position.x = level.guards[g].guardpath.points[pathindex];
			// if(level.guards[g].position.y < level.guards[g].guardpath.points[pathindex + 1])
			// 	level.guards[g].position.y = parseInt(level.guards[g].position.y + guardspeed * deltatime);
			// else if(level.guards[g].position.y > level.guards[g].guardpath.points[pathindex + 1] + guardspeed * deltatime)
			// 	level.guards[g].position.y = parseInt(level.guards[g].position.y - guardspeed * deltatime);
			// else
			// 	level.guards[g].position.y = level.guards[g].guardpath.points[pathindex + 1];
			if(currentguardposition.x >= nextguardposition.x - 10 && currentguardposition.x <= nextguardposition.x + 10
				&& currentguardposition.y >= nextguardposition.y - 10 && currentguardposition.y <= nextguardposition.y + 10)
			{
				level.guards[g].position.x = nextguardposition.x;
				level.guards[g].position.y = nextguardposition.y;
				pathindex = (pathindex + 2) % (level.guards[g].guardpath.points.length);
			}
			level.guards[g].pathindex = pathindex;
		}
	};
	playermovement = moveplayer.normalize();
	var nextPosition = new PIXI.Point(
		level.player.position.x + (playermovement.x * playerspeed * deltatime), 
		level.player.position.y + (playermovement.y * playerspeed * deltatime)
	);

	if(level.gallery.contains(nextPosition.x, nextPosition.y))
	{
		var collision = false;

		// Check for collision with holes
		for (var i = 0; i < level.holes.length; i++) 
		{
			if(level.holes[i].contains(nextPosition.x, nextPosition.y))
			{
				collision = true;
				break;
			}
		};

		// Check for collision with obstacles
		for (var i = 0; i < level.obstacles.length; i++) 
		{
			if(level.obstacles[i].contains(nextPosition.x, nextPosition.y))
			{
				collision = true;
				break;
			}
		};

		// Player did not collide, set next position
		//console.log("y:" + Math.abs(nextPosition.y - level.player.position.y));
		if(!collision)
		{
			level.player.position.x = nextPosition.x;
			level.player.position.y = nextPosition.y;
		}
	}

	// draw moving objects
	draw();
	renderer.render(stage);
    // Save current timestamp to calculate the deltatime next frame
    lastframe = Date.now();
}
