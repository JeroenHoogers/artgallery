
var interactive = true;

var homemenu = new PIXI.Container();
var gameoverMenu = new PIXI.Container();
var pauseMenu = new PIXI.Container();
var helpMenu = new PIXI.Container();

var menuGraphics = new PIXI.Graphics();
var gameBtn = new PIXI.Graphics();
var infoBtn = new PIXI.Graphics();
var resumeBtn = new PIXI.Graphics();
var menuTitleText = new PIXI.Text("", {font:"35px Goudy Old Style", fill:"white", stroke:"#999999", strokeThickness: 2});
var infoText = new PIXI.Text("", {font:"25px Arial", fill:"white", stroke:"#999999", strokeThickness: 2});	
var gameBtnText = new PIXI.Text("", {font:"25px Arial", fill:"white", stroke:"#999999", strokeThickness: 2});	
var infoBtnText = new PIXI.Text("", {font:"25px Arial", fill:"white", stroke:"#999999", strokeThickness: 2});	

var menuOpen = false;
var menupauzeactive = false;
var menuinfoactive = false;
var menustartactive = false;
var menugemeoveractive = false;
//var btnsprite = new PIXI.Sprite(buttonTexture);
// sprite.position.x = 0 - sprite.width;
// sprite.position.y = top;
// sprite.interactive = true;
// text.position.x = (0 - sprite.width) + 20;
// text.position.y = top + 20;

function showmenu()
{
	menuOpen = true;
	menuGraphics.clear();	
	menuGraphics.beginFill(0x000000, 0.7);	
	menuGraphics.lineStyle(2, 0xCCCCCC);	 
	menuGraphics.drawRect(200, 100 , 850, 500);
	menuTitleText.position = new PIXI.Point(500, 200);
	gameBtn.beginFill(0x888888);	 	
	gameBtn.lineStyle(2, 0xCCCCCC);	 
	gameBtn.drawRect(500, 350, 250, 50);	
	gameBtnText.position = new PIXI.Point(510, 360);		
	gameBtn.addChild(gameBtnText);
	gameBtn.hitArea = gameBtn.getBounds();
	gameBtn.interactive = true;
	infoBtn.beginFill(0x888888);	
	infoBtn.lineStyle(2, 0xCCCCCC);	 	
	infoBtn.drawRect(500, 500, 250, 50);	
	infoBtnText.position = new PIXI.Point(510, 510);		
	infoBtn.addChild(infoBtnText);
	infoBtn.hitArea = infoBtn.getBounds();
	infoBtn.interactive = true;
	menuGraphics.addChild(menuTitleText);		
	menuGraphics.addChild(gameBtn);		
	menuGraphics.addChild(infoBtn);
	homemenu.addChild(menuGraphics);
	homemenu.interactive = true;
	stage.addChild(homemenu);
}

function showstartmenu()
{
	showmenu();
	menustartactive = true;
	menuTitleText.text = "Art Gallery Heist";
	gameBtnText.text = "Start Game";
	infoBtnText.text = "Info";
	renderer.render(stage);
}

function showpauzemenu()
{
	showmenu();
	menupauzeactive = true;
	menuTitleText.text = "Paused";
	gameBtnText.text = "Back to Start";	
	infoBtnText.text ="Resume Game";
	renderer.render(stage);
}

function showgameovermenu()
{
	showmenu();
	menugemeoveractive = true;
	menuTitleText.text = "Game Over";
	gameBtnText.text = "Back to Start";	
	infoBtnText.text = "Restart Game";		
	renderer.render(stage);
}



gameBtn.click = function(data){
	if(menustartactive)
	{
		stage.removeChild(homemenu);
		menustartactive = false;
		currentStage = 0;
		initialize();
		update();
	}
	else
	{
		menupauzeactive = false;
		menugemeoveractive = false;
		menustartactive = true;
		pause = false;
		showstartmenu();
	}
}

infoBtn.click = function(data){	
	if(menustartactive)
	{
		showmenu();
		menuGraphics.removeChild(gameBtn);
		menustartactive = false;
		menuinfoactive = true;
		menuTitleText.text = "Game information";
		menuTitleText.position = new PIXI.Point(500, 120);
		infoText.text = "Art Gallery Heist \n By Jeroen Hoogers and Niek van Hulzen \n ABCDEFGHIJKLMNOPQRTSUVWXYZ";
		infoText.position = new PIXI.Point(225, 180);
		menuGraphics.addChild(infoText);
		infoBtnText.text = "Back";		
		renderer.render(stage);
	}
	else if(menupauzeactive)
	{
		menupauzeactive = false;
		pause = false;
		stage.removeChild(homemenu);
		update();
	}
	else if(menuinfoactive)
	{
		menuGraphics.removeChild(infoText);
		menuinfoactive = false;
		showstartmenu();
	}
	else if(menugemeoveractive)
	{
		stage.removeChild(homemenu);
		menugemeoveractive = false;
		currentStage = 0;
		initialize();
		update();
	}
}