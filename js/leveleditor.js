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
var snappoints = false;

//select option variables
var creategallery = false;
var newHole = false;
var createguards = false;
var createpath = false;
var createspawn = false;
var createplayer = false;
var createobstacle = false;
var createpainting = false;
var createcover = false;

//drawscene variables
var pointarray = [];
var pointselected = -1;
var obstacleselected = -1;
var guardselected = -1;
var beginpoint = -1;

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
var obstacleGraphics = new PIXI.Graphics();
var coverGraphics = new PIXI.Graphics();
var paintingGraphics = new PIXI.Graphics();
var spawnGraphics = new PIXI.Graphics();

galleryMask.beginFill(0);
galleryMask.drawPolygon(level.gallery.points);
galleryMask.endFill();

stage.addChild(galleryMask);
stage.addChild(floorSprite);
stage.addChild(obstacleGraphics);
stage.addChild(coverGraphics);
stage.addChild(galleryGraphics);
stage.addChild(patrolGraphics);
stage.addChild(wallgraphics);
stage.addChild(spawnGraphics);
stage.addChild(paintingGraphics);
stage.addChild(guardGraphics);
stage.addChild(pointgraphics);

floorSprite.mask = galleryMask;

stage.interactive = true;
stage.buttonMode = true;
stage.on("mousemove", mouseEventHandler);
stage.on("mousedown", mouseEventHandler);
stage.on("mouseup", mouseEventHandler);
var ctrlKey = keyboard(16);
var delKey = keyboard(46);

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
    snappoints = true;
  };
  ctrlKey.release = function() 
  {
    snappoints = false;
  };
  delKey.press = function() 
  {
	if(pointselected >= 0)
	{
		if(guardselected >= 0 && !createpath)
		{
			level.guards.splice(guardselected, 1)
			guardselected = -1;
		}
		else
		{
			pointarray.splice(pointselected, 2);
			setpoints(pointarray);
		}
	}
	redraw();
  };
  delKey.release = function() 
  {
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
	createobstacle = false;
	createcover = false;
	createpainting = false;
	createspawn = false;
	switch(scene){
		case 1:
			pointarray = level.gallery.points;
			creategallery = true;
			break;

		case 2:
			level.holes.push(new PIXI.Polygon());
			var holeAmount = level.holes.length;
			obstacleselected = holeAmount - 1;
			newHole = true;
			break;

		case 3:
			level.obstacles.push(new PIXI.Polygon());
			var obstacleAmount = level.obstacles.length;
			obstacleselected = obstacleAmount - 1;
			createobstacle = true;
			break;

		case 4:
			level.covers.push(new PIXI.Polygon());
			var coverAmount = level.covers.length;
			obstacleselected = coverAmount - 1;
			createcover = true;
			break;

		case 5:
			console.log("createspawn");
			if(beginpoint == 0)
				beginpoint = 1;
			else if(beginpoint == -1)
				beginpoint = 0;
			createspawn = true;
			break;

		case 6:
			createguards = true;
			break;

		case 7:
			createpath = true;
			break;

		case 8:
			createplayer = true;
			break;

		case 9:
			createpainting = true;
			beginpoint = -1;
		default:
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
		pointselected = -1;
		if(!createpath)
			guardselected = -1;
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
				createobstacle = false;
				createcover = false;
				createpainting = false;	
				createspawn = false;
				pointselected = i;
			}
		};

		//Check whether an obsactle point is selected
		for (var i = 0; i < level.obstacles.length; i++) {
			for (var j = 0; j < level.obstacles[i].points.length; j+=2) {
				if (level.obstacles[i].points[j] <= position.x + 10 && level.obstacles[i].points[j] >= position.x - 10 && 
					level.obstacles[i].points[j+1] <= position.y + 10 && level.obstacles[i].points[j+1] >= position.y - 10)
				{
					pointarray = level.obstacles[i].points;
					creategallery = false;
					createguards = false;
					newHole = false;
					createplayer = false;
					createobstacle = true;
					createcover = false;
					createpainting = false;
					createspawn = false;
					pointselected = j;
					obstacleselected = i;
				}
			};
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
					createobstacle = false;
					createcover = false;
					createpainting = false;
					createspawn = false;
					pointselected = j;
					obstacleselected = i;
				}
			};
		};

		//Check whether a cover point is selected
		for (var i = 0; i < level.covers.length; i++) {
			for (var j = 0; j < level.covers[i].points.length; j+=2) {
				if (level.covers[i].points[j] <= position.x + 10 && level.covers[i].points[j] >= position.x - 10 && 
					level.covers[i].points[j+1] <= position.y + 10 && level.covers[i].points[j+1] >= position.y - 10)
				{
					pointarray = level.covers[i].points;
					creategallery = false;
					createguards = false;
					newHole = false;
					createplayer = false;
					createobstacle = false;
					createcover = true;
					createpainting = false;
					createspawn = false;
					pointselected = j;
					obstacleselected = i;
				}
			};
		};

		//Check whether a spawn point is selected
		for (var j = 0; j < level.start.points.length; j+=2) {
			if (level.start.points[j] <= position.x + 10 && level.start.points[j] >= position.x - 10 && 
				level.start.points[j+1] <= position.y + 10 && level.start.points[j+1] >= position.y - 10)
			{
				pointarray = level.start.points;
				creategallery = false;
				createguards = false;
				newHole = false;
				createplayer = false;
				createobstacle = false;
				createcover = false;
				createpainting = false;
				createspawn = true;
				beginpoint = 0;
				pointselected = j;
			}
		};
		for (var j = 0; j < level.finish.points.length; j+=2) {
			if (level.finish.points[j] <= position.x + 10 && level.finish.points[j] >= position.x - 10 && 
				level.finish.points[j+1] <= position.y + 10 && level.finish.points[j+1] >= position.y - 10)
			{
				pointarray = level.finish.points;
				creategallery = false;
				createguards = false;
				newHole = false;
				createplayer = false;
				createobstacle = false;
				createcover = false;
				createpainting = false;
				createspawn = true;
				beginpoint = 1;
				pointselected = j;
			}
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
				pointselected = -1;
				creategallery = false;
				createguards = true;
				newHole = false;
				createplayer = false;
				createobstacle = false;
				createcover = false;
				createpainting = false;
				createspawn = false;
			}
		};
		//Check whether a painting point is selected
		for (var i = 0; i < level.paintings.length; i++) {
			console.log(level.paintings[i]);
			if (level.paintings[i].begin.x <= position.x + 10 && level.paintings[i].begin.x >= position.x - 10 && 
				level.paintings[i].begin.y <= position.y + 10 && level.paintings[i].begin.y >= position.y - 10)
			{
				pointarray = [];
				creategallery = false;
				createguards = false;
				newHole = false;
				createplayer = false;
				createobstacle = false;
				createcover = false;
				createpainting = true;
				createspawn = false;
				beginpoint = 0;
				obstacleselected = i;
			}
			else if (level.paintings[i].end.x <= position.x + 10 && level.paintings[i].end.x >= position.x - 10 && 
				level.paintings[i].end.y <= position.y + 10 && level.paintings[i].end.y >= position.y - 10)
			{
				pointarray = [];
				creategallery = false;
				createguards = false;
				newHole = false;
				createplayer = false;
				createobstacle = false;
				createcover = false;
				createpainting = true;
				createspawn = false;
				beginpoint = 1;
				obstacleselected = i;
			}
		};

		if(createpath && guardselected >= 0)
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
					createobstacle = false;
					createcover = false;
					createpainting = false;
					createspawn = false;
					pointselected = j;
				}
			};
		}
		//Check whether player is selected
		if (level.player != "undefined" &&
			level.player.position.x <= position.x + 10 && level.player.position.x >= position.x - 10 && 
			level.player.position.y <= position.y + 10 && level.player.position.y >= position.y - 10)
		{
			pointarray = [];
			creategallery = false;
			createguards = false;
			newHole = false;
			createplayer = true;
			createobstacle = false;
			createcover = false;
			createpainting = false;
			createspawn = false;
		}

		if(pointselected < 0)
		{
			pointarray.push(Math.floor(position.x),Math.floor(position.y));
			pointselected = pointarray.length - 2;
		}

		if(createguards && guardselected < 0 && level.gallery.contains(position.x, position.y)) //Create new Guard
		{
			level.guards.push({position: new PIXI.Point(Math.floor(position.x), Math.floor(position.y)),
								guardpath: new PIXI.Polygon([])});
			guardselected = level.guards.length - 1;
		}

		if(createpainting && beginpoint == -1)
		{
			if(rad_Painting_High.checked)
				level.paintings.push({begin : new PIXI.Point(), end : new PIXI.Point(), value : 2000});
			else if(rad_Painting_Medium.checked)
				level.paintings.push({begin : new PIXI.Point(), end : new PIXI.Point(), value : 1000});
			else if(rad_Painting_Low.checked)
				level.paintings.push({begin : new PIXI.Point(), end : new PIXI.Point(), value : 500});
			var paintingAmount = level.paintings.length;
			obstacleselected = paintingAmount - 1;
			beginpoint = 0;
		}

		mousedown = true;
		var jsonstring = JSON.stringify(pointarray);


	}
	else if(event.type =="mouseup")
	{
		mousedown = false;
		if(createpainting && beginpoint == 0)
			beginpoint = 1;
		else if(createpainting && beginpoint == 1)
			beginpoint = -1;
	}
	
	if(mousedown)
	{
		if((creategallery || newHole || createobstacle || createcover || createspawn) && snappoints)
		{
			//Snap with obstacle walls
			for (var j = 0; j < level.obstacles.length; j++) {
				for (var i = 0; i < level.obstacles[j].points.length; i+=2) {
					if(pointselected < 0 && (i >= pointarray.length - 2 && createobstacle))
						break;
					if (level.obstacles[j].points[i] <= position.x + 20 && level.obstacles[j].points[i] >= position.x - 20 && (i != pointselected || !createobstacle))
					{
						position.x = level.obstacles[j].points[i];
					}
					if (level.obstacles[j].points[i+1] <= position.y + 20 && level.obstacles[j].points[i+1] >= position.y - 20 && (i != pointselected || !createobstacle))
					{
						position.y = level.obstacles[j].points[i+1];
					}
				}
			};
			//Snap with cover walls
			for (var j = 0; j < level.covers.length; j++) {
				for (var i = 0; i < level.covers[j].points.length; i+=2) {
					if(pointselected < 0 && (i >= pointarray.length - 2 && createcover))
						break;
					if (level.covers[j].points[i] <= position.x + 20 && level.covers[j].points[i] >= position.x - 20 && (i != pointselected || !createcover))
					{
						position.x = level.covers[j].points[i];
					}
					if (level.covers[j].points[i+1] <= position.y + 20 && level.covers[j].points[i+1] >= position.y - 20 && (i != pointselected || !createcover))
					{
						position.y = level.covers[j].points[i+1];
					}
				}
			};
			for (var i = 0; i < level.start.points.length; i+=2) {
				if(pointselected < 0 && (i >= pointarray.length - 2 && createspawn))
					break;
				if (level.start.points[i] <= position.x + 20 && level.start.points[i] >= position.x - 20 && (i != pointselected || !createspawn))
				{
					position.x = level.start.points[i];
				}
				if (level.start.points[i+1] <= position.y + 20 && level.start.points[i+1] >= position.y - 20 && (i != pointselected || !createspawn))
				{
					position.y = level.start.points[i+1];
				}
			};
			for (var i = 0; i < level.finish.points.length; i+=2) {
				if(pointselected < 0 && (i >= pointarray.length - 2 && createspawn))
					break;
				if (level.finish.points[i] <= position.x + 20 && level.finish.points[i] >= position.x - 20 && (i != pointselected || !createspawn))
				{
					position.x = level.finish.points[i];
				}
				if (level.finish.points[i+1] <= position.y + 20 && level.finish.points[i+1] >= position.y - 20 && (i != pointselected || !createspawn))
				{
					position.y = level.finish.points[i+1];
				}
			}
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
		console.log(pointarray);
		setpoints(pointarray);

		if(guardselected >= 0 && !createpath && level.gallery.contains(position.x, position.y)){ //Change current guard position
			level.guards[guardselected].position.x = Math.floor(position.x);
			level.guards[guardselected].position.y = Math.floor(position.y);
			level.guards[guardselected].guardpath.points[0] = Math.floor(position.x);
			level.guards[guardselected].guardpath.points[1] = Math.floor(position.y);
		}
		else if(createplayer && (level.gallery.contains(position.x, position.y) || level.start.contains(position.x, position.y))) //Change player position
		{
			var candraw = true;
			for (var i = 0; i < level.holes.length; i++) {
				if (level.holes[i].contains(position.x, position.y))
					candraw = false;
			};
			for (var i = 0; i < level.obstacles.length; i++) {
				if (level.obstacles[i].contains(position.x, position.y))
					candraw = false;
			};
			if(candraw)
				level.player = {position : new PIXI.Point(Math.floor(position.x), Math.floor(position.y))};
		}
		else if(createpainting && level.gallery.contains(position.x, position.y))
		{
			var candraw = true;
			for (var i = 0; i < level.holes.length; i++) {
				if (level.holes[i].contains(position.x, position.y))
					candraw = false;
			};
			for (var i = 0; i < level.obstacles.length; i++) {
				if (level.obstacles[i].contains(position.x, position.y))
					candraw = false;
			};
			if(candraw)
			{
				if(beginpoint == 0)
				{
					level.paintings[obstacleselected].begin = new PIXI.Point(Math.floor(position.x), Math.floor(position.y));
				}
				else if(beginpoint == 1)
				{
					level.paintings[obstacleselected].end = new PIXI.Point(Math.floor(position.x), Math.floor(position.y));
				}
			}
		}
		redraw();
	}	
}

function setpoints(points)
{
	// new gallery point position or position altered
	if(creategallery) 
	{
		level.gallery = new PIXI.Polygon(points);
	}
 	
 	// change current hole points to new array
	else if(newHole)
	{
		if(points.length > 0)
			level.holes[obstacleselected] = new PIXI.Polygon(points);
		else
			level.holes.splice(obstacleselected, 1);
	}
	// change current hole points to new array
	else if(createobstacle)
	{
		if(points.length > 0)
			level.obstacles[obstacleselected] = new PIXI.Polygon(points);
		else
			level.obstacles.splice(obstacleselected, 1);
	}
	// change current cover points to new array
	else if(createcover)
	{
		if(points.length > 0)
			level.covers[obstacleselected] = new PIXI.Polygon(points);
		else
			level.covers.splice(obstacleselected, 1);
	}
	// change start or finish points to new array
	else if(createspawn)
	{
		if(beginpoint == 0)
		{
			level.start = new PIXI.Polygon(points);
		}
		else if(beginpoint == 1)
		{
			level.finish = new PIXI.Polygon(points);
		}
	}
	// change current guard path points to new array
	else if(guardselected >= 0 && createpath && points.length >= 2){
		level.guards[guardselected].position.x = Math.floor(points[0]);
		level.guards[guardselected].position.y = Math.floor(points[1]);
		level.guards[guardselected].guardpath = new PIXI.Polygon(points);
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
	obstacleGraphics.clear();
	paintingGraphics.clear();
	coverGraphics.clear();
	spawnGraphics.clear();

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
	//draw Obstacles
	for (var i = 0; i < level.obstacles.length; i++) {
		obstacleGraphics.beginFill(0xFFFFFF);
		obstacleGraphics.drawPolygon(level.obstacles[i].points);
		obstacleGraphics.endFill();
		obstacleGraphics.lineStyle(2, 0xFFFFFF, 1);
		obstacleGraphics.drawPolygon(level.obstacles[i].points);
	};
	//draw spawn
	spawnGraphics.beginFill(0x00ff00, 0.3);
	spawnGraphics.drawPolygon(level.start.points);
	spawnGraphics.endFill();
	spawnGraphics.lineStyle(5, 0x00ff00, 0.3);
	spawnGraphics.drawPolygon(level.start.points);
	spawnGraphics.beginFill(0xff0000, 0.3);
	spawnGraphics.drawPolygon(level.finish.points);
	spawnGraphics.endFill();
	spawnGraphics.lineStyle(5, 0xffffff, 0.3);
	spawnGraphics.drawPolygon(level.finish.points);


	//draw Paintings
	for (var i = 0; i < level.paintings.length; i++) {
		if(level.paintings[i].end.x != 0)
		{
			if(level.paintings[i].value == 2000)
				paintingGraphics.lineStyle(10, 0xffd700, 1);
			else if(level.paintings[i].value == 1000)
				paintingGraphics.lineStyle(10, 0xC0C0C0, 1);
			else if(level.paintings[i].value == 500)
				paintingGraphics.lineStyle(10, 0xcd7f32, 1);
			paintingGraphics.moveTo(level.paintings[i].begin.x, level.paintings[i].begin.y);
			paintingGraphics.lineTo(level.paintings[i].end.x, level.paintings[i].end.y);
		}
	};

	//draw polygon points (Gallery + Holes)
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
	for (var i = 0; i < level.obstacles.length; i++) {
		for (var j = 0; j < level.obstacles[i].points.length; j+=2) {
			pointgraphics.drawCircle(level.obstacles[i].points[j], level.obstacles[i].points[j+1], 5);
		};
	};
	for (var i = 0; i < level.covers.length; i++) {
		for (var j = 0; j < level.covers[i].points.length; j+=2) {
			pointgraphics.drawCircle(level.covers[i].points[j], level.covers[i].points[j+1], 5);
		};
	};
	for (var j = 0; j < level.start.points.length; j+=2) {
		pointgraphics.drawCircle(level.start.points[j], level.start.points[j+1], 5);
	};
	for (var j = 0; j < level.finish.points.length; j+=2) {
		pointgraphics.drawCircle(level.finish.points[j], level.finish.points[j+1], 5);
	};
	for (var i = 0; i < level.paintings.length; i++) {
		pointgraphics.drawCircle(level.paintings[i].begin.x, level.paintings[i].begin.y, 5);
		if(level.paintings[i].end.x != 0)
		{
			pointgraphics.drawCircle(level.paintings[i].end.x, level.paintings[i].end.y, 5);
		}
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
	guardGraphics.drawCircle(level.player.position.x, level.player.position.y, 10);
	guardGraphics.endFill();

	//draw guard path
	if((createpath || createguards) && guardselected >= 0)
	{
		patrolGraphics.lineStyle(5, 0x0000FF, 1);
		patrolGraphics.drawPolygon(level.guards[guardselected].guardpath.points);
	}
	//draw Covers
	for (var i = 0; i < level.covers.length; i++) {
		coverGraphics.beginFill(0xDDDDDD, 0.3);
		coverGraphics.drawPolygon(level.covers[i].points);
		coverGraphics.endFill();
		coverGraphics.lineStyle(5, 0xDDDDDD, 0.3);
		coverGraphics.drawPolygon(level.covers[i].points);
	};
}