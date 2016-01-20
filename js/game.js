var stage = new PIXI.Container();
var renderer = PIXI.autoDetectRenderer(1280, 720,{backgroundColor : 0x999999});
renderer.forceFXAA = true;
document.body.appendChild(renderer.view);

//create a texture
var floorTexture = PIXI.Texture.fromImage("assets/textures/wood.jpg");
var alertedTexture = PIXI.Texture.fromImage("assets/textures/mgs.png");
var lightTexture = PIXI.Texture.fromImage("assets/textures/light.png");
var wallTexture = PIXI.Texture.fromImage("assets/textures/wall.jpg")

var floorSprite = new PIXI.extras.TilingSprite(floorTexture, 1280, 720);
var wallSprite = new PIXI.extras.TilingSprite(wallTexture, 1280, 720);

var shadowMask = new PIXI.RenderTexture(renderer, 1280, 720);
var shadowMaskGraphics = new PIXI.Graphics();
var shadowMaskSprite = new PIXI.Sprite(shadowMask);

var hud = new PIXI.Container();

var guardTexture = new PIXI.RenderTexture(renderer, 30, 30);
var level = {};

// Enable/Disable debugging
var debug = false;

var visibilityPolygon;

var moveplayer = new Vector(0, 0);
var useKeydown = false;

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
var guardspeed = 50;

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
	stage.addChild(galleryGraphics);
	stage.addChild(wallSprite);
	stage.addChild(wallGraphics);

	stage.addChild(shadowGraphics);


	stage.addChild(guardGraphics);
	//stage.addChild(guardGraphics);
	stage.addChild(playerGraphics);

	stage.addChild(shadowMaskSprite);

	stage.addChild(debugGraphics);
	// Mask the texture with the gallery polygon
	floorSprite.mask = galleryMask;

	wallSprite.mask = wallGraphics;

	// Draw HUD
	var titleText = new PIXI.Text("Art Gallery Heist", {font:"30px Goudy Old Style", fill:"white", stroke:"gray", strokeThickness: 4});
	var targetText = new PIXI.Text("Money", {font:"20px Arial", fill:"white", stroke:"gray", strokeThickness: 3});
	var currentText = new PIXI.Text("Current: ", {font:"20px Arial", fill:"white", stroke:"gray", strokeThickness: 3});
	var targetMoneyText = new PIXI.Text("$0 / $5000", {font:"22px Arial", fill:"#ffFF99", stroke:"gray", strokeThickness: 2});
	var currentMoneyText = new PIXI.Text("$2000,- ", {font:"22px Arial", fill:"gold", stroke:"gray", strokeThickness: 2});
	titleText.position = new PIXI.Point(0, 0);
	targetText.position = new PIXI.Point(1000, 0);
	currentText.position = new PIXI.Point(800, 0);
	targetMoneyText.position = new PIXI.Point(80, 0);
	currentMoneyText.position = new PIXI.Point(80, 0);
	hud.addChild(titleText);
	hud.addChild(targetText);
	//hud.addChild(currentText);
	targetText.addChild(targetMoneyText);
	//currentText.addChild(currentMoneyText);
	stage.addChild(hud);

	// Load the gallery
	loadlevel();
}

function loadlevel()
{
	// level.gallery = new PIXI.Polygon([
	// 	new PIXI.Point(50,20),
	// 	new PIXI.Point(700,140),
	// 	new PIXI.Point(1200,150),
	// 	new PIXI.Point(1000,585),
	// 	new PIXI.Point(830,605),
	// 	new PIXI.Point(700,350),
	// 	new PIXI.Point(500,600),
	// 	new PIXI.Point(470,540),
	// 	new PIXI.Point(100,650),
	// 	new PIXI.Point(140,230)
	// ])

	// level.holes = [
	// 	new PIXI.Polygon([
	// 		new PIXI.Point(290,250),
	// 		new PIXI.Point(400,230),
	// 		new PIXI.Point(450,350),
	// 		new PIXI.Point(300,420)]
	// 	),
	// 	new PIXI.Polygon([
	// 		new PIXI.Point(850,250),
	// 		new PIXI.Point(940,310),
	// 		new PIXI.Point(780,340),
	// 		new PIXI.Point(750,310)]
	// 	)
	// ];

	// level.obstacles = [
	// 	new PIXI.Polygon([
	// 		new PIXI.Point(570,200),
	// 		new PIXI.Point(680,260),
	// 		new PIXI.Point(530,340)
	// 	])
	// ];

	// level.paintings = [
	// 	{
	// 		position: new PIXI.Point(400,100),
	// 		value: 1000
	// 	},
	// 	{
	// 		position: new PIXI.Point(600,100),
	// 		value: 500
	// 	}
	// ];

	// level.guards = [
	// 	{
	// 		position: new PIXI.Point(500,300),
	// 		guardpath: [
	// 			new PIXI.Point(500,250),
	// 			new PIXI.Point(350,150),
	// 			new PIXI.Point(250,150),
	// 			new PIXI.Point(700,140),
	// 			new PIXI.Point(820,190),
	// 			new PIXI.Point(700,140),
	// 			new PIXI.Point(500,150)
	// 		]
	// 	}
	// 	//,
	// 	// {
	// 	// 	position: new PIXI.Point(960,300),
	// 	// 	guardpath: []
	// 	// }
	// ];

	// level.player = {position: new PIXI.Point(900,500)};

	level = new Level();
	level.load("level3");

	guardGraphics.clear();
	guardGraphics.lineStyle(2, 0x990000, 1);
	guardGraphics.beginFill(0xff0000);
	guardGraphics.drawCircle(15, 15, 10);
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
		alertedSprite.anchor.y = 2.0;
		alertedSprite.visible = false;

		var lightSprite = new PIXI.Sprite(lightTexture);
		lightSprite.anchor.x = 0.5;
		lightSprite.anchor.y = 0.5;

		var alertedGraphics = new PIXI.Graphics();

		level.guards[i].container = new PIXI.Container();
		level.guards[i].sprite = guardSprite;
		level.guards[i].alerted = false;
		level.guards[i].alertedIndicator = alertedSprite;
		level.guards[i].light = lightSprite;
		level.guards[i].visibility = new PIXI.Polygon();
		level.guards[i].pathindex = 0;
		level.guards[i].alertedRatio = 0.1;
		level.guards[i].alertedMeter = alertedGraphics;

		level.guards[i].light.mask = visibilityMask;

		stage.addChild(level.guards[i].container);

		level.guards[i].container.addChild(level.guards[i].light);
		level.guards[i].container.addChild(level.guards[i].sprite);
		level.guards[i].container.addChild(level.guards[i].alertedMeter);
		level.guards[i].container.addChild(level.guards[i].alertedIndicator);
	}

	// Draw gallery mask
	galleryMask.beginFill(0);
	galleryMask.drawPolygon(level.gallery.points);
	galleryMask.endFill();

	// Draw gallery walls
	wallGraphics.clear();
	wallGraphics.lineStyle(8, 0xFFFFFF, 1);
	wallGraphics.drawPolygon(level.gallery.points);

	// Draw holes
	galleryGraphics.clear();
	for (var i = 0; i < level.holes.length; i++)  {
		galleryGraphics.beginFill(0x999999);
		galleryGraphics.drawPolygon(level.holes[i].points);
		galleryGraphics.endFill();

		wallGraphics.lineStyle(8, 0xFFFFFF, 1);
		wallGraphics.drawPolygon(level.holes[i].points);
	}

	// Draw obstacles
	obstacleGraphics.clear();
	for (var i = 0; i < level.obstacles.length; i++) {
		obstacleGraphics.beginFill(0xFFFFFF);
		obstacleGraphics.drawPolygon(level.obstacles[i].points);
		obstacleGraphics.endFill();
	}

	// Draw shadows
	shadowGraphics.clear();
	shadowGraphics.beginFill(0x000000, 0.2);
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
	playerGraphics.lineStyle(2, 0x000099, 1);
	playerGraphics.beginFill(0x2222ff);
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

		// Draw guard alerted meter
		g.alertedMeter.clear();
		g.alertedMeter.lineStyle(5, 0xff0000, 0.5);
		g.alertedMeter.arc(0,0, 20, (Math.PI * 2.0) * g.alertedRatio, 0);
		// guardGraphics.lineStyle(1, 0x000000, 1);
		// guardGraphics.beginFill(0xff0000);
		// guardGraphics.drawCircle(g.position.x, g.position.y, 10);
		// guardGraphics.endFill();
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
		//level.guards[g].light.position = level.guards[g].position;
		level.guards[g].container.position = level.guards[g].position;
	

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
