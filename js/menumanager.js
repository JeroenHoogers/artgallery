
var interactive = true;

var homemenu = new PIXI.Container();
var gameoverMenu = new PIXI.Container();
var pauseMenu = new PIXI.Container();
var helpMenu = new PIXI.Container();

var menuGraphics = new PIXI.Graphics();
var buttons = [];
for (var i = 0; i < 3; i++) {
	buttons[i] = {btn : new PIXI.Graphics(), btnText : new PIXI.Text("", {font:"25px Arial", fill:"white", stroke:"#999999", strokeThickness: 0})};
}
var menuTitleText = new PIXI.Text("", {font:"35px Goudy Old Style", fill:"white", stroke:"#999999", strokeThickness: 0});
var infoText = new PIXI.Text("", {font:"18px Arial", fill:"white", stroke:"#999999", strokeThickness: 0});	

var menuOpen = false;
var menustartactive = false;

function showmenu()
{
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].btn.beginFill(0x888888);	 	
		buttons[i].btn.lineStyle(2, 0xCCCCCC);	 
		buttons[i].btn.drawRect(500, (i * 100 + 300), 250, 50);	
		buttons[i].btnText.position = new PIXI.Point(510, (i * 100 + 310));		
		buttons[i].btn.addChild(buttons[i].btnText);	
		buttons[i].btn.hitArea = buttons[i].btn.getBounds();
		buttons[i].btn.interactive = true;		
		menuGraphics.addChild(buttons[i].btn);		
	};
	playerspeed = 0;
	menuGraphics.clear();	
	menuGraphics.beginFill(0x000000, 0.7);	
	menuGraphics.lineStyle(2, 0xCCCCCC);	 
	menuGraphics.drawRect(400, 100 , 450, 500);
	menuTitleText.position = new PIXI.Point(500, 200);
	menuGraphics.addChild(menuTitleText);		
	homemenu.addChild(menuGraphics);
	homemenu.interactive = true;
	stage.addChild(homemenu);
}

function showstartmenu()
{
	showmenu();
	menustartactive = true;
	menuTitleText.text = "Art Gallery Heist";
	buttons[0].btnText.text = "Start Game";
	buttons[0].btn.click = startGameClick;
	buttons[1].btnText.text = "Info";
	buttons[1].btn.click = infoGameClick;
	buttons[2].btnText.text = "How to play";
	buttons[2].btn.click = howTotGameClick;
	renderer.render(stage);
}

function showpauzemenu()
{
	showmenu();
	menustartactive = false;
	menuTitleText.text = "Paused";
	buttons[0].btnText.text ="Resume Game";	
	buttons[0].btn.click = startGameClick;
	buttons[1].btnText.text = "Exit to Menu";	
	buttons[1].btn.click = restartGameClick;
	menuGraphics.removeChild(buttons[2].btn);
	renderer.render(stage);
}

function showgameovermenu()
{
	showmenu();
	menustartactive = true;
	menuTitleText.text = "Game Over";	
	buttons[0].btnText.text = "Restart Game";
	buttons[0].btn.click = startGameClick;	
	buttons[1].btnText.text = "Exit to Menu";
	buttons[1].btn.click = restartGameClick;
	menuGraphics.removeChild(buttons[2].btn);
	renderer.render(stage);
}

function startGameClick(data){
	stage.removeChild(homemenu);
	menuOpen = false;
	pause = false;
	playerspeed = 200;
	if(menustartactive)
	{
		menustartactive = false;
		currentStage = 0;
		unloadstage();
		loadstage();
	}
}

function infoGameClick(data){	
	showmenu();
	menustartactive = false;
	menuGraphics.clear();	
	menuGraphics.beginFill(0x000000, 0.7);	
	menuGraphics.lineStyle(2, 0xCCCCCC);	 
	menuGraphics.drawRect(200, 100 , 850, 500);
	menuGraphics.removeChild(buttons[0].btn);
	menuTitleText.text = "Game information";
	menuTitleText.position = new PIXI.Point(500, 120);
	infoText.text = "Art Gallery Heist \n By Jeroen Hoogers and Niek van Hulzen \n ABCDEFGHIJKLMNOPQRTSUVWXYZ";
	infoText.position = new PIXI.Point(225, 180);
	menuGraphics.addChild(infoText);
	buttons[1].btnText.text = "How to play";		
	buttons[1].btn.click = howTotGameClick;
	buttons[2].btnText.text = "Back";		
	buttons[2].btn.click = menuGameClick;
	renderer.render(stage);
}
function howTotGameClick(data){	
	showmenu();
	menustartactive = false;
	menuGraphics.clear();	
	menuGraphics.beginFill(0x000000, 0.7);	
	menuGraphics.lineStyle(2, 0xCCCCCC);	 
	menuGraphics.drawRect(200, 100 , 850, 500);
	menuGraphics.removeChild(buttons[0].btn);
	menuTitleText.text = "How to Play";
	menuTitleText.position = new PIXI.Point(500, 120);
	infoText.text = "Art Gallery Heist \n By Jeroen Hoogers and Niek van Hulzen \n ABCDEFGHIJKLMNOPQRTSUVWXYZ";
	infoText.position = new PIXI.Point(225, 180);
	menuGraphics.addChild(infoText);
	buttons[1].btnText.text = "Info";		
	buttons[1].btn.click = infoGameClick;
	buttons[2].btnText.text = "Back";		
	buttons[2].btn.click = menuGameClick;
	renderer.render(stage);
}
function menuGameClick(data){
	menuGraphics.removeChild(infoText);
	showstartmenu();
}

function restartGameClick(data){
	currentStage = 4;
	pause = false;
	unloadstage();
	loadstage();
	showstartmenu();
}
