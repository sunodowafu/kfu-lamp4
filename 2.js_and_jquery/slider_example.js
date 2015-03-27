// slider
GeometrySlider = function(){
  th = this;
  var container, movingButtonLeft, movingButtonRight, standardChildMargin, containerHeight, containerWidth;
  var delay    = 100;
  var interval = null;
  
  /**
   * 
   * @param Object cont Container of slider children
   * @param int speed Speed of slider moving. From 1 to 100
   */
  th.init = function(cont, speed){
    //get all HTML objects
    container = $(cont);
    if(container === null){
      throw new Error("Can't find container for geometry slider.");
    }
    containerHeight = parseInt(container.css('height'));
    if(isNaN(containerHeight) || containerHeight === 0){
      throw new Error("No proper height of container for geometry slider.");
    }
    containerWidth = parseInt(container.css('width'));
    if(isNaN(containerHeight) || containerHeight === 0){
      throw new Error("No proper width of container for geometry slider.");
    }
    movingButtonLeft = container.parent().find('.moving-button.left');
    movingButtonRight = container.parent().find('.moving-button.right');
    
    //set speed
    if(speed !== undefined){
      if(speed < 1 || speed > 100){
        throw new Error("Wrong speed value for geometry slider");
      }
      delay = parseInt(1000 / speed);
    }
    
    //put children in the right position
    var firstChildWidth = parseInt(container.children().first().css('width'));
    if(isNaN(firstChildWidth) || firstChildWidth === 0){
      throw new Error("No proper width of first child for geometry slider.");
    }
    standardChildMargin = (-1)*parseInt(firstChildWidth * 0.3);
    var left = 0;
    var top  = 0;
    container.children().each(function(){
      var width = parseInt($(this).css('width'));
      if(isNaN(width) || width === 0){
        throw new Error("No proper width of child for geometry slider.");
      }
      
      var height = parseInt($(this).css('width'));
      if(isNaN(height) || height === 0){
        throw new Error("No proper height of child for geometry slider.");
      }
      
      top = th.getProperTop(left, height);
      $(this).css('top',  top+"px");
      $(this).css('left', left+"px");
      left = left + width + standardChildMargin;
    });
    
    //slider actions
    th.moveLeft = function(){
      if(interval === null){
        interval = setInterval(function(){
          container.children().each(function(){
            var left = parseInt($(this).css('left'));
            
            left = left - 1;
            top = th.getProperTop(left, parseInt($(this).css('width')));
            
            $(this).css('left', left+"px");
            $(this).css('top', top+"px");
            //move element to the another end
            if(left < 0 - parseInt($(this).css('width'))){
              var newElement = $(this).clone(true);
              var newLeft = parseInt(container.children().last().css('left')) + parseInt($(this).css('width')) + standardChildMargin;
              $(this).remove();
              newElement.css('left', newLeft+"px").appendTo(container);
            }
          });
        }, delay);
      }
    };
    th.moveRight = function(){
      if(interval === null){
        interval = setInterval(function(){
          $(container.children().get().reverse()).each(function(){
            var left = parseInt($(this).css('left'));
            
            left = left + 1;
            top = th.getProperTop(left, parseInt($(this).css('width')));
            
            $(this).css('left', left+"px");
            $(this).css('top', top+"px");
            //move element to the another end
            if(left > containerWidth){
              var newElement = $(this).clone(true);
              var newLeft = parseInt(container.children().first().css('left')) - parseInt($(this).css('width')) - standardChildMargin;
              $(this).remove();
              newElement.css('left', newLeft+"px").prependTo(container);
            }
          });
        }, delay);
      }
    };
    th.stop = function(){
      if(interval !== null){
        clearInterval(interval);
        interval = null;
      }
    };
    
    //add listeners to moving buttons
    movingButtonLeft.on('mousedown',   th.moveRight);
    movingButtonLeft.on('mouseup',     th.stop);
    movingButtonLeft.on('mouseleave',  th.stop);
    movingButtonRight.on('mousedown',  th.moveLeft);
    movingButtonRight.on('mouseup',    th.stop);
    movingButtonRight.on('mouseleave', th.stop);
  };
  
  th.calculateY = function(x){
    return (Math.sin(x*0.01) + 1) * 0.5;
  };
  th.getProperTop = function(left, height){
    return parseInt(th.calculateY(left) * containerHeight * 0.4 + containerHeight * 0.3 - height * 0.5);
  };
};
