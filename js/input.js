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
    moveplayery = 0;
  };

  //Left arrow key `release` method
  left.release = function() 
  {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the cat isn't moving vertically:
    //Stop the cat
    if (!right.isDown && moveplayery === 0) {
      moveplayerx = 0;
    }
  };

  //Up
  up.press = function() 
  {
    moveplayery = -1;
    moveplayerx = 0;
  };
  
  up.release = function() 
  {
    if (!down.isDown && moveplayerx === 0) {
      moveplayery = 0;
    }
  };

  //Right
  right.press = function() 
  {
    moveplayerx = 1;
    moveplayery = 0;
  };
  right.release = function() 
  {
    if (!left.isDown && moveplayery === 0) {
      moveplayerx = 0;
    }
  };

  //Down
  down.press = function() 
  {
    moveplayery = 1;
    moveplayerx = 0;
  };

  down.release = function() 
  {
    if (!up.isDown && moveplayerx === 0) {
      moveplayery = 0;
    }
  };

