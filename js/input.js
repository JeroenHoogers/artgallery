var mousedown = false;
var left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40),
    use = keyboard(69);
    pkey = keyboard(80);
    esc = keyboard(27);

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


  //Left arrow key `press` method
  left.press = function() 
  {
    //Change the cat's velocity when the key is pressed
    moveplayer.x = -1; //setX(-1);
    //moveplayery = 0;
  };

  //Left arrow key `release` method
  left.release = function() 
  {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the cat isn't moving vertically:
    //Stop the cat
    if (!right.isDown) {
      moveplayer.x = 0; //setX(0);
    }
  };

  //Up
  up.press = function() 
  {
    moveplayer.y = -1; 
   // moveplayerx = 0;
  };
  
  up.release = function() 
  {
    if (!down.isDown) {
      moveplayer.y = 0; 
    }
  };

  //Right
  right.press = function() 
  {
    moveplayer.x = 1;
   // moveplayery = 0;
  };
  right.release = function() 
  {
    if (!left.isDown) {
      moveplayer.x = 0;
    }
  };

  //Down
  down.press = function() 
  {
    moveplayer.y = 1;
   // moveplayerx = 0;
  };

  down.release = function() 
  {
    if (!up.isDown) {
      moveplayer.y = 0;
    }
  };

  use.press = function() 
  {
    useKeydown = true;
   // moveplayerx = 0;
  };

  use.release = function() 
  {
    if (use.isDown) {
      useKeydown = false;
    }
  };

  pkey.press = function() 
  {
    pause = true;
  };

  pkey.release = function() 
  {
    if(playerspeed == 0)
      startGameClick();
    else
      showpauzemenu();
  }; 
  esc.press = function() 
  {
    pause = true;
  };

  esc.release = function() 
  {
    if(playerspeed == 0)
      startGameClick();
    else
      showpauzemenu();
  };

function mouseEventHandler(event)
{
  if(event.type == "mousedown")
    mousedown = true;
  else if(event.type =="mouseup")
    mousedown = false;
  
  var position = event.data.global;
  
  debugGraphics.clear();
  
  if(mousedown && debug)
  {
    var position = event.data.global;
    level.guards[0].position.x = position.x;
    level.guards[0].position.y = position.y;
   // console.log("x:" +position.x +" y:"+ position.y);
  }
}



