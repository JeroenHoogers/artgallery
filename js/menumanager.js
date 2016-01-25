
var interactive = true;

var homemenu = new PIXI.Container();
var gameoverMenu = new PIXI.Container();
var pauseMenu = new PIXI.Container();
var helpMenu = new PIXI.Container();

var menuGraphics = new PIXI.Graphics();
var buttons = [];
for (var i = 0; i < 6; i++) {
	buttons[i] = {btn : new PIXI.Graphics(), btnText : new PIXI.Text("", {font:"25px Arial", fill:"white", stroke:"#999999", strokeThickness: 0})};
}
var menuTitleText = new PIXI.Text("", {font:"35px Goudy Old Style", fill:"white", stroke:"#999999", strokeThickness: 0});
var endGameText = new PIXI.Text("", {font:"25px Goudy Old Style", fill:"white", stroke:"#999999", strokeThickness: 0});

var infoText = [];
infoText[0] = {header : new PIXI.Text("Game Information", {font:"20px Arial", fill:"white", stroke:"#999999", strokeThickness: 0}), 
			   innertext : new PIXI.Text("This game is designed and developed by Jeroen Hoogers and Niek van Hulzen \n as project for the course Geometric Algortihms at the TU/e. \n\n In this game a visibility algorithm is implemented to optimize the vision of the guards in the game, \n and is implemented using ....", {font:"20px Arial", fill:"white", stroke:"#999999", strokeThickness: 0})};	
infoText[1] = {header : new PIXI.Text("Stealing Paintings", {font:"20px Arial", fill:"white", stroke:"#999999", strokeThickness: 0}), 
			   innertext : new PIXI.MultiStyleText("Paintings are shown as thick lines on the walls in the colors <bronze>bronze</bronze>, <silver>silver</silver> and <gold>gold</gold>. \n These colors represent the value of this painting. \n\n To be able to steal a painting you have to stand near it and press 'e'. \n The color in the painting will show the progress of taking the painting. \n When the color is fully gone, the painting is yours and you can continue to the next painting.", {
        		def: {font:"20px Arial", fill:"white"},
        		bronze: { font: "20px Arial", fill: "#CD7F32" },
        		silver: { font: "20px Arial", fill: "#C0C0C0" },
        		gold: { font: "20px Arial", fill: "#FFD700" }})};	
infoText[2] = {header : new PIXI.Text("Avoid Detection", {font:"20px Arial", fill:"white", stroke:"#999999", strokeThickness: 0}), 
			   innertext : new PIXI.Text("The guards in this game are able to see in a straight line in every direction. \n Your goal is to avoid that any guard will detect you by standing outside of their view.\n\n The vision of the guards is easily recognisable by the lit floor and \n whenever you are in this area the you have only a fraction of a second to hide \n or else you will be seen and you are game over!", {font:"20px Arial", fill:"white", stroke:"#999999", strokeThickness: 0})};	
infoText[3] = {header : new PIXI.Text("Target value", {font:"20px Arial", fill:"white", stroke:"#999999", strokeThickness: 0}), 
			   innertext : new PIXI.MultiStyleText("The colors of the paintings represent the value of that particular painting. \n The values are distributed as followed : \n\n <bronze>Bronze : 500</bronze> \n <silver>Silver : 1000</silver> \n <gold>Gold : 2000</gold> \n\n Your objective is to collect enough paintings to be able to reach the target value \n shown in the upper right corner of every level. \n When this value is reached you will be able to exit through the green exit field \n and continue to the next level.", {	
        		def: {font:"20px Arial", fill:"white"},
        		bronze: { font: "20px Arial", fill: "#CD7F32" },
        		silver: { font: "20px Arial", fill: "#C0C0C0" },
        		gold: { font: "20px Arial", fill: "#FFD700" }})};	
infoText[4] = {header : new PIXI.Text("Game Controls", {font:"20px Arial", fill:"white", stroke:"#999999", strokeThickness: 0}), 
			   innertext : new PIXI.Text("This game uses the arrow keys for the player to walk through the level. \n To steal paintings you have to stand near one and press and hold 'e'.\n \n To pause the game either press 'P' or the escape key.", {font:"20px Arial", fill:"white", stroke:"#999999", strokeThickness: 0})};	
infoText[5] = {header : new PIXI.Text("Obstacles", {font:"20px Arial", fill:"white", stroke:"#999999", strokeThickness: 0}), 
			   innertext : new PIXI.Text("In the game are multiple forms of obstacles for the player, namely : \n\n              - Block vision. \n              - Block movement from player and guards.\n\n\n              - Does not block vision. \n              - Block movement from player and guards.", {font:"20px Arial", fill:"white", stroke:"#999999", strokeThickness: 0})};	

var currentpage = 0;
var menuOpen = false;
var menustartactive = false;

function showmenu(buttonlength)
{
	for (var i = 0; i < buttonlength; i++) {
		buttons[i].btn.beginFill(0x888888);	 	
		buttons[i].btn.lineStyle(2, 0xCCCCCC);	 
		if(buttonlength < 5)
		{
			buttons[i].btn.drawRect(500, (i * 100 + 280), 250, 50);	
			buttons[i].btnText.position = new PIXI.Point(510, (i * 100 + 290));	
		}	
		else if(i == 4)
		{
			buttons[i].btn.drawRect(780, 580, 250, 50);	
			buttons[i].btnText.position = new PIXI.Point(790, 590);
		}
		else if(i == 5)
		{
			buttons[i].btn.drawRect(220, 580, 250, 50);	
			buttons[i].btnText.position = new PIXI.Point(230, 590);		
		}
		buttons[i].btn.addChild(buttons[i].btnText);	
		buttons[i].btn.hitArea = buttons[i].btn.getBounds();
		buttons[i].btn.interactive = true;		
		menuGraphics.addChild(buttons[i].btn);		
	};
	playerspeed = 0;
	menuGraphics.clear();	
	menuGraphics.beginFill(0x000000, 0.7);	
	menuGraphics.lineStyle(2, 0xCCCCCC);	 
	menuGraphics.drawRect(400, 100 , 450, (buttonlength * 100 + 180));
	menuTitleText.position = new PIXI.Point(500, 170);
	menuGraphics.removeChild(endGameText);
	endGameText.position = new PIXI.Point(455, 210);
	menuGraphics.addChild(menuTitleText);		
	homemenu.addChild(menuGraphics);
	homemenu.interactive = true;
	stage.addChild(homemenu);
}

function showstartmenu()
{
	showmenu(4);
	menustartactive = true;
	menuTitleText.text = "Art Gallery Heist";
	buttons[0].btnText.text = "Start Game";
	buttons[0].btn.click = startGameClick;
	buttons[1].btnText.text = "Info";
	buttons[1].btn.click = infoGameClick;
	buttons[2].btnText.text = "How to play";
	buttons[2].btn.click = howTotGameClick;
	buttons[3].btnText.text = "Level editor";
	buttons[3].btn.click = levelEditorClick;
	renderer.render(stage);
}

function showpauzemenu()
{
	showmenu(3);
	menustartactive = false;
	menuGraphics.removeChild(buttons[3].btn);
	menuTitleText.text = "Paused";
	buttons[0].btnText.text ="Resume Game";	
	buttons[0].btn.click = startGameClick;
	buttons[1].btnText.text = "Restart Level";	
	buttons[1].btn.click = restartLevelClick;
	buttons[2].btnText.text = "Exit to Menu";	
	buttons[2].btn.click = restartGameClick;
	renderer.render(stage);
}

function showgameovermenu()
{
	showmenu(2);
	menustartactive = true;
	menuGraphics.removeChild(buttons[2].btn);
	menuGraphics.removeChild(buttons[3].btn);
	menuTitleText.text = "Congratulations!";
	buttons[0].btnText.text = "Restart Game";
	buttons[0].btn.click = startGameClick;
	buttons[1].btnText.text = "Exit to Menu";
	buttons[1].btn.click = restartGameClick;
	var totalAmount = 0;
	for (var j = 0; j < levels.length; j++) {
		getLevel = new Level();
		getLevel.load(j);
		for (var i = 0; i < getLevel.paintings.length; i++) {
			totalAmount += getLevel.paintings[i].value;
		};
	};
	endGameText.text = "    You have completed the game.\nTotal value stolen : " + totalValueStolen + " of " + totalAmount;
	menuGraphics.addChild(endGameText);
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
	showmenu(4);
	menustartactive = false;
	menuGraphics.clear();	
	menuGraphics.beginFill(0x000000, 0.7);	
	menuGraphics.lineStyle(2, 0xCCCCCC);	 
	menuGraphics.drawRect(200, 100 , 850, 580);
	menuGraphics.removeChild(buttons[0].btn);
	menuGraphics.removeChild(buttons[1].btn);
	menuGraphics.removeChild(buttons[2].btn);
	menuTitleText.text = infoText[0].header.text;
	menuTitleText.position = new PIXI.Point(500, 120);
	//infoText.text = "Art Gallery Heist \n By Jeroen Hoogers and Niek van Hulzen \n ABCDEFGHIJKLMNOPQRTSUVWXYZ";
	infoText[0].innertext.position = new PIXI.Point(225, 180);
	menuGraphics.addChild(infoText[0].innertext);
	buttons[3].btnText.text = "Back";		
	buttons[3].btn.click = menuGameClick;
	renderer.render(stage);
}

function howTotGameClick(data){	
	showmenu(6);
	currentpage++;
	menustartactive = false;
	menuGraphics.clear();	
	menuGraphics.beginFill(0x000000, 0.7);	
	menuGraphics.lineStyle(2, 0xCCCCCC);	 
	menuGraphics.drawRect(200, 100 , 850, 580);
	menuGraphics.removeChild(buttons[0].btn);
	menuGraphics.removeChild(buttons[1].btn);
	menuGraphics.removeChild(buttons[2].btn);
	menuTitleText.text = infoText[currentpage].header.text;
	menuTitleText.position = new PIXI.Point(500, 120);
	for (var i = 0; i < infoText.length; i++) {
		menuGraphics.removeChild(infoText[i].innertext);
	};
	infoText[currentpage].innertext.position = new PIXI.Point(225, 180);
	//infoText.text = "Art Gallery Heist \n By Jeroen Hoogers and Niek van Hulzen \n ABCDEFGHIJKLMNOPQRTSUVWXYZ";
	menuGraphics.addChild(infoText[currentpage].innertext);
	menuGraphics.removeChild(buttons[1].btn);
	buttons[3].btnText.text = "Back";		
	buttons[3].btn.click = menuGameClick;
	if(currentpage < infoText.length - 1)
	{
		buttons[4].btnText.text = "Next";	
		buttons[4].btn.click = howTotGameClick; 
		menuGraphics.addChild(buttons[4].btn);
	}
	else
	{
		menuGraphics.removeChild(buttons[4].btn);
	}
	if(currentpage > 1)
	{
		buttons[5].btnText.text = "Previous";	
		buttons[5].btn.click = previousPageClick;
		menuGraphics.addChild(buttons[5].btn);
	}
	else
	{
		menuGraphics.removeChild(buttons[5].btn);
	}

	if(currentpage == 5)
	{
		menuGraphics.lineStyle(0, 0xFFFFFF, 1);
		menuGraphics.beginFill(0xFFFFFF);
		menuGraphics.drawPolygon([230, 310, 235, 365, 280, 360, 295, 310, 255, 330]);
		menuGraphics.endFill();

		menuGraphics.beginFill(0x999999);
		menuGraphics.drawPolygon([230, 227, 230, 277, 280, 277, 280, 227]);
		menuGraphics.endFill();

		menuGraphics.lineStyle(8, 0xFFFFFF, 1);
		menuGraphics.drawPolygon([230, 227, 230, 277, 280, 277, 280, 227]);

	}
	renderer.render(stage);
}

function previousPageClick(data){
	showmenu(6);
	currentpage--;
	menustartactive = false;
	menuGraphics.clear();	
	menuGraphics.beginFill(0x000000, 0.7);	
	menuGraphics.lineStyle(2, 0xCCCCCC);	 
	menuGraphics.drawRect(200, 100 , 850, 580);
	menuGraphics.removeChild(buttons[0].btn);
	menuGraphics.removeChild(buttons[1].btn);
	menuGraphics.removeChild(buttons[2].btn);
	menuTitleText.text = infoText[currentpage].header.text;
	menuTitleText.position = new PIXI.Point(500, 120);
	for (var i = 0; i < infoText.length; i++) {
		menuGraphics.removeChild(infoText[i].innertext);
	};
	infoText[currentpage].innertext.position = new PIXI.Point(225, 180);
	//infoText.text = "Art Gallery Heist \n By Jeroen Hoogers and Niek van Hulzen \n ABCDEFGHIJKLMNOPQRTSUVWXYZ";
	menuGraphics.addChild(infoText[currentpage].innertext);
	menuGraphics.removeChild(buttons[1].btn);
	buttons[3].btnText.text = "Back";		
	buttons[3].btn.click = menuGameClick;
	if(currentpage < infoText.length - 1)
	{
		buttons[4].btnText.text = "Next";	
		buttons[4].btn.click = howTotGameClick; 
		menuGraphics.addChild(buttons[4].btn);
	}
	else
	{
		menuGraphics.removeChild(buttons[4].btn);
	}
	if(currentpage > 1)
	{
		buttons[5].btnText.text = "Previous";	
		buttons[5].btn.click = previousPageClick;
		menuGraphics.addChild(buttons[5].btn);
	}
	else
	{
		menuGraphics.removeChild(buttons[5].btn);
	}
	renderer.render(stage);
}

function menuGameClick(data){
	for (var i = 0; i < infoText.length; i++) {
		menuGraphics.removeChild(infoText[i].innertext);
	};
	menuGraphics.removeChild(buttons[4].btn);
	menuGraphics.removeChild(buttons[5].btn);
	currentpage = 0;
	showstartmenu();
}

function restartLevelClick(data){
	stage.removeChild(homemenu);
	menuOpen = false;
	playerspeed = 200;
	pause = false;
	unloadstage();
	loadstage();
}

function restartGameClick(data){
	currentStage = 4;
	pause = false;
	unloadstage();
	loadstage();
	showstartmenu();
}

function levelEditorClick(data){
	window.location = "leveleditor.html";
}