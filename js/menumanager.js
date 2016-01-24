
var interactive = true;

var initialmenu = new PIXI.Container();
var gameoverMenu = new PIXI.Container();
var pauseMenu = new PIXI.Container();
var helpMenu = new PIXI.Container();

var menuGraphics = new PIXI.Graphics();
var startBtn = new PIXI.Graphics();
var infoBtn = new PIXI.Graphics();
var backBtn = new PIXI.Graphics();

var menupauzeactive = false;
var menustartactive = false;
var menugemeoveractive = false;
//var btnsprite = new PIXI.Sprite(buttonTexture);
// sprite.position.x = 0 - sprite.width;
// sprite.position.y = top;
// sprite.interactive = true;
// text.position.x = (0 - sprite.width) + 20;
// text.position.y = top + 20;

function showstartmenu()
{
	menustartactive = true;
	titleText = new PIXI.Text("Art Gallery Heist", {font:"25px Goudy Old Style", fill:"white", stroke:"#999999", strokeThickness: 2});
	titleText.position = new PIXI.Point(0, 0);
	startBtn.beginFill(0xFFFF00);	 	
	startBtn.lineStyle(5, 0xFF0000);	 	
	startBtn.drawRect(300, 100, 250, 50);		
	startBtnText = new PIXI.Text("Start Game", {font:"25px Goudy Old Style", fill:"black", stroke:"#000000", strokeThickness: 2});
	startBtnText.position = new PIXI.Point(310, 110);
	startBtn.addChild(startBtnText);
	startBtn.hitArea = startBtn.getBounds();
	startBtn.interactive = true;	
	infoBtn.beginFill(0xFFFF00);	
	infoBtn.lineStyle(5, 0xFF0000);	 	
	infoBtn.drawRect(300, 200, 250, 50);		
	infoBtnText = new PIXI.Text("Info", {font:"25px Goudy Old Style", fill:"black", stroke:"#000000", strokeThickness: 2});
	infoBtnText.position = new PIXI.Point(310, 210);		
	infoBtn.addChild(infoBtnText);
	infoBtn.hitArea = infoBtn.getBounds();
	infoBtn.interactive = true;
	initialmenu.addChild(titleText);		
	initialmenu.addChild(startBtn);	
	initialmenu.addChild(infoBtn);
	initialmenu.interactive = true;
	renderer.render(initialmenu);
}

function showpauzemenu()
{
	menupauzeactive = true;
	titleText = new PIXI.Text("Paused", {font:"35px Goudy Old Style", fill:"white", stroke:"#000000", strokeThickness: 5});
	titleText.position = new PIXI.Point(500, 200);
	menuGraphics.lineStyle(5, 0x000000);	
	menuGraphics.drawRect(470, 170, 300, 300);			
	backBtn.beginFill(0xFFFF00);	 	
	backBtn.lineStyle(5, 0xFF0000);	 
	backBtn.drawRect(500, 400, 250, 50);			
	infoBtnText = new PIXI.Text("Back", {font:"25px Goudy Old Style", fill:"black", stroke:"#000000", strokeThickness: 2});
	infoBtnText.position = new PIXI.Point(510, 410);		
	backBtn.addChild(infoBtnText);
	backBtn.hitArea = backBtn.getBounds();
	backBtn.interactive = true;
	menuGraphics.addChild(titleText);		
	menuGraphics.addChild(backBtn);
	pauseMenu.addChild(menuGraphics);
	pauseMenu.interactive = true;
	stage.addChild(pauseMenu);
	renderer.render(stage);
	//renderer.render(pauseMenu);
}

function showgameovermenu()
{
	menugemeoveractive = true;
	titleText = new PIXI.Text("Game Over", {font:"35px Goudy Old Style", fill:"white", stroke:"#000000", strokeThickness: 5});
	titleText.position = new PIXI.Point(500, 200);
	menuGraphics.lineStyle(5, 0x000000);	
	menuGraphics.drawRect(470, 170, 300, 300);			
	backBtn.beginFill(0xFFFF00);	 	
	backBtn.lineStyle(5, 0xFF0000);	 
	backBtn.drawRect(500, 400, 250, 50);			
	infoBtnText = new PIXI.Text("Back", {font:"25px Goudy Old Style", fill:"black", stroke:"#000000", strokeThickness: 2});
	infoBtnText.position = new PIXI.Point(510, 410);		
	backBtn.addChild(infoBtnText);
	backBtn.hitArea = backBtn.getBounds();
	backBtn.interactive = true;
	menuGraphics.addChild(titleText);		
	menuGraphics.addChild(backBtn);
	gameoverMenu.addChild(menuGraphics);
	gameoverMenu.interactive = true;
	stage.addChild(gameoverMenu);
	renderer.render(stage);
	//renderer.render(pauseMenu);
}

startBtn.click = function(data){
	menustartactive = false;
	initialize();
	update();
}

infoBtn.click = function(data){		
	infoText = new PIXI.Text("Art Gallery Heist \n By Jeroen Hoogers and Niek van Hulzen \n ABCDEFGHIJKLMNOPQRTSUVWXYZ", {font:"25px Goudy Old Style", fill:"white", stroke:"#999999", strokeThickness: 2});
	infoText.position = new PIXI.Point(310, 210);	
	backBtn.beginFill(0xFFFF00);	 	// set the line style to have a width of 5 and set the color to red	
	backBtn.lineStyle(5, 0xFF0000);	 	// draw a rectangle	
	backBtn.drawRect(300, 600, 250, 50);			// make the button interactive..	
	startBtnText = new PIXI.Text("Back", {font:"25px Goudy Old Style", fill:"black", stroke:"#000000", strokeThickness: 2});
	startBtnText.position = new PIXI.Point(310, 610);
	backBtn.addChild(startBtnText);
	backBtn.hitArea = backBtn.getBounds();
	backBtn.interactive = true;	
	initialmenu.removeChild(startBtn);
	initialmenu.removeChild(infoBtn);
	initialmenu.addChild(infoText);
	initialmenu.addChild(backBtn);
	renderer.render(initialmenu);
}

backBtn.click = function(data){		
	if(menustartactive)
	{
		initialmenu.removeChild(infoText);
		initialmenu.removeChild(backBtn);
		showstartmenu();
	}
	else if(menupauzeactive)
	{
		stage.removeChild(pauseMenu);
		menupauzeactive = false;
		pause = false;
		update();
	}
	else if(menugemeoveractive)
	{
		stage.removeChild(gameoverMenu);
		menugemeoveractive = false;
		menustartactive = true;
		pause = false;
		showstartmenu();
	}
}