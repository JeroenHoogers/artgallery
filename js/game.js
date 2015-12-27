var stage = new PIXI.Container();
var renderer = PIXI.autoDetectRenderer(1280, 720,{backgroundColor : 0xCCCCCC});
document.body.appendChild(renderer.view);

//create a texture
var texture = PIXI.Texture.fromImage("assets/textures/wood.jpg");
var tilingSprite = new PIXI.extras.TilingSprite(texture, 1280, 720);
stage.addChild(tilingSprite);

var gallery = new PIXI.Polygon([
		new PIXI.Point(200,100),
		new PIXI.Point(700,100),
		new PIXI.Point(1000,250),
		new PIXI.Point(900,585),
		new PIXI.Point(830,605),
		new PIXI.Point(700,350),
		new PIXI.Point(500,620),
		new PIXI.Point(470,530),
		new PIXI.Point(100,650),
		new PIXI.Point(140,230)]
	);

//create graphics
var graphics = new PIXI.Graphics();
graphics.beginFill(0);
graphics.drawPolygon(gallery.points);
graphics.endFill();

stage.addChild(graphics);

var walls = new PIXI.Graphics();
walls.lineStyle(10, 0xFFFFFF, 1);
walls.drawPolygon(gallery.points);

stage.addChild(walls);

var paintings = new PIXI.Graphics();
paintings.lineStyle(2, 0x999999, 1);
paintings.beginFill(0xffff22);
paintings.moveTo(400,110);
paintings.lineTo(540,110);
paintings.lineTo(540,100);
paintings.lineTo(400,100);
paintings.lineTo(400,110);
paintings.endFill();


stage.addChild(paintings);

//mask the texture with the polygon
tilingSprite.mask = graphics;

update();

function update()
{    
    requestAnimationFrame( update );
    renderer.render(stage);
}