var stage = new PIXI.Container();
var renderer = PIXI.autoDetectRenderer(1280, 720,{backgroundColor : 0xCCCCCC});
document.body.appendChild(renderer.view);

//create a texture
var texture = PIXI.Texture.fromImage("assets/textures/wood.jpg");

var floorSprite = new PIXI.extras.TilingSprite(texture, 1280, 720);

// Enable/Disable debugging
var debug = false;

//initialise
var mousedown = false;
var snapPoints = false;

//select option variables
var creategallery = false;
var newHole = false;
var createguards = false;
var createpath = false;
var createplayer = false;

//drawscene variables
var pointarray = [];
var pointselected = -1;
var holeselected = -1;
var guardselected = -1;

var starttime;
var lastframe;

var level = new Level();

//create graphics
var galleryMask = new PIXI.Graphics();
var patrolGraphics = new PIXI.Graphics();
var galleryGraphics = new PIXI.Graphics();
var wallgraphics = new PIXI.Graphics();
var pointgraphics = new PIXI.Graphics();
var guardGraphics = new PIXI.Graphics();

galleryMask.beginFill(0);
galleryMask.drawPolygon(level.gallery.points);
galleryMask.endFill();

stage.addChild(galleryMask);
stage.addChild(floorSprite);
stage.addChild(galleryGraphics);
stage.addChild(patrolGraphics);
stage.addChild(wallgraphics);
stage.addChild(pointgraphics);
stage.addChild(guardGraphics);

floorSprite.mask = galleryMask;

stage.interactive = true;
stage.buttonMode = true;
stage.on("mousemove", mouseEventHandler);
stage.on("mousedown", mouseEventHandler);
stage.on("mouseup", mouseEventHandler);
var ctrlKey = keyboard(16);

update();

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
  ctrlKey.press = function() 
  {
    snapPoints = true;
  };
  ctrlKey.release = function() 
  {
    snapPoints = false;
  };

function update()
{   
	if(!starttime) starttime = Date.now();
	if(!lastframe) lastframe = Date.now();
    requestAnimationFrame( update );

    renderer.render(stage);
 }

function CreateScene(scene)
{
	pointarray = [];
	guardselected = -1;
	creategallery = false;
	newHole = false;
	createguards = false;
	createpath = false;
	createplayer = false;
	switch(scene){
		case 1:
			pointarray = level.gallery.points;
			creategallery = true;
			break;

		case 2:
			level.holes.push(new PIXI.Polygon());
			holeselected = -1;
			newHole = true;
			break;

		case 3:
			createguards = true;
			break;

		case 4:
			createpath = true;
			break;

		case 5:
			createplayer = true;
			break;

		default:
			statements_def
			break;
	}
}

function Export()
{
	tb_Export.value = JSON.stringify(level);
}

function Import()
{
	level.loadJSON(document.getElementById('tb_Export').value);
	redraw();
}

function mouseEventHandler(event)
{
	var position = event.data.global;
	if (position.x < 0)
		position.x = 0;
	if (position.y < 0)
		position.y = 0;
	if (position.x > 1280)
		position.x = 1280;
	if (position.y > 720)
		position.y = 720;
	if(event.type == "mousedown")
	{
		//Check whether a gallery point is selected
		for (var i = 0; i < level.gallery.points.length; i+=2) {
			if (level.gallery.points[i] <= position.x + 10 && level.gallery.points[i] >= position.x - 10 && 
				level.gallery.points[i+1] <= position.y + 10 && level.gallery.points[i+1] >= position.y - 10)
			{
				pointarray = level.gallery.points;
				creategallery = true;
				createguards = false;
				newHole = false;
				createplayer = false;
				pointselected = i;			
			}
		};

		//Check whether a hole point is selected
		for (var i = 0; i < level.holes.length; i++) {
			for (var j = 0; j < level.holes[i].points.length; j+=2) {
				if (level.holes[i].points[j] <= position.x + 10 && level.holes[i].points[j] >= position.x - 10 && 
					level.holes[i].points[j+1] <= position.y + 10 && level.holes[i].points[j+1] >= position.y - 10)
				{
					pointarray = level.holes[i].points;
					creategallery = false;
					createguards = false;
					newHole = true;
					createplayer = false;
					pointselected = j;
					holeselected = i;
				}
			};
		};

		//Check whether a guard is selected
		for (var i = 0; i < level.guards.length; i++) {
			if (level.guards[i].position.x <= position.x + 10 && level.guards[i].position.x >= position.x - 10 && 
				level.guards[i].position.y <= position.y + 10 && level.guards[i].position.y >= position.y - 10)
			{
				guardselected = i;
				pointarray = [];
				if(createpath)
				{
					pointarray = level.guards[i].guardpath.points;
					pointselected = 0;
					break;
				}
				creategallery = false;
				createguards = true;
				newHole = false;
				createplayer = false;
			}
		};

		if((createpath || createguards) && guardselected >= 0)
		{
			for (var j = 0; j < level.guards[guardselected].guardpath.points.length; j+=2) {
				console.log(level.guards[guardselected].guardpath)
				if (level.guards[guardselected].guardpath.points[j] <= position.x + 10 && level.guards[guardselected].guardpath.points[j] >= position.x - 10 && 
					level.guards[guardselected].guardpath.points[j+1] <= position.y + 10 && level.guards[guardselected].guardpath.points[j+1] >= position.y - 10)
				{
					pointarray = level.guards[guardselected].guardpath.points;
					createpath = true;
					creategallery = false;
					createguards = false;
					newHole = false;
					createplayer = false;
					pointselected = j;
				}
			};
		}
		//Check whether player is selected
		if (level.player.x <= position.x + 10 && level.player.x >= position.x - 10 && 
			level.player.y <= position.y + 10 && level.player.y >= position.y - 10)
		{
			pointarray = [];
			creategallery = false;
			createguards = false;
			newHole = false;
			createplayer = true;
		}

		if(pointselected < 0)
		{
			pointarray.push(Math.floor(position.x),Math.floor(position.y));
		}

		if(createguards && guardselected < 0 && level.gallery.contains(position.x, position.y)) //Create new Guard
		{
			level.guards.push({position: new PIXI.Point(Math.floor(position.x), Math.floor(position.y)),
								guardpath: new PIXI.Polygon([])});
			guardselected = level.guards.length - 1;
		}


		mousedown = true;
		var jsonstring = JSON.stringify(pointarray);
		console.log(jsonstring);


	}
	else if(event.type =="mouseup")
	{
		console.log("up : " + position.x + "h : " + position.y);
		pointselected = -1;
		if(!createpath)
			guardselected = -1;
		mousedown = false;
	}
	
	if(mousedown)
	{
		if((creategallery || newHole) && snapPoints)
		{
			//Snap with gallery walls
			for (var i = 0; i < level.gallery.points.length; i+=2) {
				if(pointselected < 0 && (i >= pointarray.length - 2 && creategallery))
					break;
				if (level.gallery.points[i] <= position.x + 20 && level.gallery.points[i] >= position.x - 20 && (i != pointselected || !creategallery))
				{
					position.x = level.gallery.points[i];
				}
				if (level.gallery.points[i+1] <= position.y + 20 && level.gallery.points[i+1] >= position.y - 20 && (i != pointselected || !creategallery))
				{
					position.y = level.gallery.points[i+1];
				}
			};
			//Snap with hole walls
			for (var j = 0; j < level.holes.length; j++) {
				for (var i = 0; i < level.holes[j].points.length; i+=2) {
					if(pointselected < 0 && (i >= pointarray.length - 2 && newHole))
						break;
					if (level.holes[j].points[i] <= position.x + 20 && level.holes[j].points[i] >= position.x - 20 && (i != pointselected || !newHole))
					{
						position.x = level.holes[j].points[i];
					}
					if (level.holes[j].points[i+1] <= position.y + 20 && level.holes[j].points[i+1] >= position.y - 20 && (i != pointselected || !newHole))
					{
						position.y = level.holes[j].points[i+1];
					}
				}
			};
		}
		if(pointselected < 0) //Selected point OR last point
		{
			var len = pointarray.length;
			pointarray[len-2] = Math.floor(position.x);
			pointarray[len-1] = Math.floor(position.y);
		}
		else
		{
			pointarray[pointselected] = Math.floor(position.x);
			pointarray[pointselected+1] = Math.floor(position.y);
		}

		if(creategallery) // new gallery point position
		{
			level.gallery = new PIXI.Polygon(pointarray);
		}
		else if(newHole && holeselected < 0){//change last hole point position
			var holeAmount = level.holes.length;
			level.holes[holeAmount - 1] = new PIXI.Polygon(pointarray);
		}
		else if(newHole && holeselected >= 0){ // change current hole point position
			level.holes[holeselected] = new PIXI.Polygon(pointarray);
		}
		else if(guardselected >= 0 && !createpath && level.gallery.contains(position.x, position.y)){ //Change current guard position
			console.log("new position");
			level.guards[guardselected].position.x = Math.floor(position.x);
			level.guards[guardselected].position.y = Math.floor(position.y);
			level.guards[guardselected].guardpath.points[0] = Math.floor(position.x);
			level.guards[guardselected].guardpath.points[1] = Math.floor(position.y);
			console.log(level.guards[guardselected].guardpath);
		}
		else if(guardselected >= 0 && createpath && level.gallery.contains(position.x, position.y)){
			console.log("new path");
			level.guards[guardselected].position.x = Math.floor(pointarray[0]);
			level.guards[guardselected].position.y = Math.floor(pointarray[1]);
			level.guards[guardselected].guardpath = new PIXI.Polygon(pointarray);
			console.log(level.guards[guardselected].guardpath);
		}
		else if(createplayer && level.gallery.contains(position.x, position.y)){ //Change player position
			var candraw = true;
			for (var i = 0; i < level.holes.length; i++) {
				if (level.holes[i].contains(position.x, position.y))
					candraw = false;
			};
			if(candraw)
				level.player = new PIXI.Point(Math.floor(position.x), Math.floor(position.y));
		}
		redraw();
	}	
}

function redraw()
{
	//Clear all graphics
	galleryMask.clear();
	wallgraphics.clear();
	pointgraphics.clear();
	galleryGraphics.clear();
	guardGraphics.clear();
	patrolGraphics.clear();

	//draw Gallery
	galleryMask.beginFill(0);
	galleryMask.drawPolygon(level.gallery.points);
	galleryMask.endFill();
	wallgraphics.lineStyle(5, 0xFFFFFF, 1);
	wallgraphics.drawPolygon(level.gallery.points);

	//draw Holes
	for (var i = 0; i < level.holes.length; i++) {
		galleryGraphics.beginFill(0xCCCCCC);
		galleryGraphics.drawPolygon(level.holes[i].points);
		galleryGraphics.endFill();
		galleryGraphics.lineStyle(5, 0xFFFFFF, 1);
		galleryGraphics.drawPolygon(level.holes[i].points);
	};

	//draw polygon points (Gallery + Holes-)
	pointgraphics.lineStyle(1, 0x000000, 1);
	pointgraphics.beginFill(0x000000);
	for (var i = 0; i < level.gallery.points.length; i+=2) {
		pointgraphics.drawCircle(level.gallery.points[i], level.gallery.points[i+1], 5);
	};
	for (var i = 0; i < level.holes.length; i++) {
		for (var j = 0; j < level.holes[i].points.length; j+=2) {
			pointgraphics.drawCircle(level.holes[i].points[j], level.holes[i].points[j+1], 5);
		};
	};
	pointgraphics.endFill();

	//draw Guards
	guardGraphics.lineStyle(1, 0x000000, 1);
	guardGraphics.beginFill(0xff0000);
	for (var i = 0; i < level.guards.length; i++) {
		guardGraphics.drawCircle(level.guards[i].position.x, level.guards[i].position.y, 10);
	};
	//draw Player
	guardGraphics.lineStyle(1, 0x000000, 1);
	guardGraphics.beginFill(0x0000ff);
	guardGraphics.drawCircle(level.player.x, level.player.y, 10);
	guardGraphics.endFill();

	//draw guard path
	if((createpath || createguards) && guardselected >= 0)
	{
		console.log(guardselected);
		//patrolGraphics.beginFill(0x0000ff);
		//patrolGraphics.drawPolygon(level.guards[guardselected].guardpath.points);
		//patrolGraphics.endFill();
		patrolGraphics.lineStyle(5, 0x0000FF, 1);
		patrolGraphics.drawPolygon(level.guards[guardselected].guardpath.points);
	}
}