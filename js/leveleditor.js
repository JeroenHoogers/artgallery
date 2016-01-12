var stage = new PIXI.Container();
var renderer = PIXI.autoDetectRenderer(1280, 720,{backgroundColor : 0xCCCCCC});
document.body.appendChild(renderer.view);

//create a texture
var texture = PIXI.Texture.fromImage("assets/textures/wood.jpg");

var floorSprite = new PIXI.extras.TilingSprite(texture, 1280, 720);

// Enable/Disable debugging
var debug = false;

var level = {
	gallery : new PIXI.Polygon([]),
	holes : [],
	obstacles : [],
	paintings : [],
	guards : [],
	player : new PIXI.Point()
};
		// Gallery polygon
		//new PIXI.Polygon//([
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
		// ]),
		// // Holes
		// new PIXI.Polygon([
		// 	new PIXI.Point(290,250),
		// 	new PIXI.Point(400,230),
		// 	new PIXI.Point(450,350),
		// 	new PIXI.Point(300,420)]
		// ),
		// new PIXI.Polygon([
		// 	new PIXI.Point(570,200),
		// 	new PIXI.Point(680,260),
		// 	new PIXI.Point(530,340)]
		// ),
		// new PIXI.Polygon([
		// 	new PIXI.Point(850,250),
		// 	new PIXI.Point(940,310),
		// 	new PIXI.Point(780,340),
		// 	new PIXI.Point(750,310)]
		// )

var guardpath = [
	new PIXI.Point(500,250),
	new PIXI.Point(350,150),
	new PIXI.Point(250,150),
	new PIXI.Point(700,140),
	new PIXI.Point(820,190),
	new PIXI.Point(700,140),
	new PIXI.Point(500,150)
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

//create graphics
var galleryMask = new PIXI.Graphics();
galleryMask.beginFill(0);
galleryMask.drawPolygon(level.gallery.points);
galleryMask.endFill();

var visibilityMask = new PIXI.Graphics();
stage.addChild(visibilityMask);

var mousedown = false;

stage.addChild(galleryMask);
stage.addChild(floorSprite);

var galleryGraphics = new PIXI.Graphics();
for (var i = level.holes.length - 1; i >= 1; i--) {
	galleryGraphics.beginFill(0xCCCCCC);
	galleryGraphics.drawPolygon(level.holes.points);
	galleryGraphics.endFill();
	galleryGraphics.lineStyle(5, 0xFFFFFF, 1);
	galleryGraphics.drawPolygon(level.holes.points);
};
stage.addChild(galleryGraphics);

var wallgraphics = new PIXI.Graphics();
wallgraphics.lineStyle(5, 0xFFFFFF, 1);
wallgraphics.drawPolygon(level.gallery.points);
stage.addChild(wallgraphics);

var pointgraphics = new PIXI.Graphics();
pointgraphics.lineStyle(1, 0x000000, 1);
pointgraphics.beginFill(0x000000);

// Draw gallery points
for (var i = 0; i < level.gallery.points.length; i+=2) {
	pointgraphics.drawCircle(level.gallery[i], level.gallery[i+1], 5);
};

pointgraphics.endFill();

stage.addChild(pointgraphics);

var starttime;
var lastframe;

var guardGraphics = new PIXI.Graphics();
guardGraphics.lineStyle(1, 0x000000, 1);
guardGraphics.beginFill(0xff0000);
for (var i = 0; i < level.guards.length; i++) {
	guardGraphics.drawCircle(level.guards[i].position.x, level.guards[i].position.y, 10);
};

guardGraphics.endFill();

stage.addChild(guardGraphics);

var triangleGraphics = new PIXI.Graphics();
stage.addChild(triangleGraphics);

floorSprite.mask = galleryMask;

stage.interactive = true;
stage.on("mousemove", mouseEventHandler);
stage.on("mousedown", mouseEventHandler);
stage.on("mouseup", mouseEventHandler);


update();

function update()
{   
	if(!starttime) starttime = Date.now();
	if(!lastframe) lastframe = Date.now();
    requestAnimationFrame( update );

    renderer.render(stage);
 }

var creategallery = false;
var newHole = false;
var createguards = false;
var createpath = false;
var createplayer = false;

function CreateScene(scene)
{
	pointarray = [];
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

var pointarray = [];
var pointselected = -1;
var holeselected = -1;
var guardselected = -1;
function mouseEventHandler(event)
{
	var position = event.data.global;

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
				pointarray = [];
				creategallery = false;
				createguards = true;
				newHole = false;
				createplayer = false;
				guardselected = i;
			}
		};

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

		if(createguards && guardselected < 0) //Create new Guard
		{
			level.guards.push({position: new PIXI.Point(Math.floor(position.x), Math.floor(position.y))});
		}

		mousedown = true;
		var jsonstring = JSON.stringify(pointarray);
		console.log(jsonstring);


	}
	else if(event.type =="mouseup")
	{
		pointselected = -1;
		guardselected = -1;
		mousedown = false;
	}
	
	if(mousedown)
	{
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
		else if(guardselected >= 0){ //Change current guard position
			level.guards[guardselected].position.x = Math.floor(position.x);
			level.guards[guardselected].position.y = Math.floor(position.y);
		}
		else if(createplayer){ //Change player position
			level.player = new PIXI.Point(Math.floor(position.x), Math.floor(position.y));
		}

		//Clear all graphics
		galleryMask.clear();
		wallgraphics.clear();
		pointgraphics.clear();
		galleryGraphics.clear();
		guardGraphics.clear();

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
	}	
}