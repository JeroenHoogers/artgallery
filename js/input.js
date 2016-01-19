var mousedown = false;
var left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);

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
    moveplayerx = -1;
    //moveplayery = 0;
  };

  //Left arrow key `release` method
  left.release = function() 
  {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the cat isn't moving vertically:
    //Stop the cat
    if (!right.isDown) {
      moveplayerx = 0;
    }
  };

  //Up
  up.press = function() 
  {
    moveplayery = -1;
   // moveplayerx = 0;
  };
  
  up.release = function() 
  {
    if (!down.isDown) {
      moveplayery = 0;
    }
  };

  //Right
  right.press = function() 
  {
    moveplayerx = 1;
   // moveplayery = 0;
  };
  right.release = function() 
  {
    if (!left.isDown) {
      moveplayerx = 0;
    }
  };

  //Down
  down.press = function() 
  {
    moveplayery = 1;
   // moveplayerx = 0;
  };

  down.release = function() 
  {
    if (!up.isDown) {
      moveplayery = 0;
    }
  };

function mouseEventHandler(event)
{
  if(event.type == "mousedown")
    mousedown = true;
  else if(event.type =="mouseup")
    mousedown = false;
  
  var position = event.data.global;
  
  debugGraphics.clear();
  if(mousedown)
  {
    //triangleGraphics.clear();
    //guardGraphics.clear();
    var position = event.data.global;
    level.guards[0].position.x = position.x;
    level.guards[0].position.y = position.y;

    //drawVisibility(guards[0].x, guards[0].y, 0);
    
    //drawVisibility(position.x, position.y, endpoints.length);
  }

    calculateVisibility(level.guards[0].x, level.guards[0].y, 0);
}



