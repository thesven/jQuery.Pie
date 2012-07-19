(function( $ ) {
  
  $.pie = function( targetCanvasID, colors, percentages, totalRadius, thickness, outlineColor, initialRotation, centerPoint, animate ) {

      $.pie.vars.canvasID = targetCanvasID;
      $.pie.vars.colors = colors;
      $.pie.vars.totalRadius = totalRadius;
      $.pie.vars.thickness = thickness;
      $.pie.vars.outlineColor = outlineColor;
      $.pie.vars.rotation = initialRotation;
      $.pie.vars.centerPoint = centerPoint;
      $.pie.vars.shouldAnimate = animate;
      
      $.pie.vars.drawingSurface = document.getElementById( $.pie.vars.canvasID );
      
      if( $.pie.vars.drawingSurface.getContext ){
        
        $.pie.vars.drawingContext = $.pie.vars.drawingSurface.getContext( '2d' );
        
        $.pie.vars.percentages = percentages;
        
        $.pie.vars.drawingContext.translate($.pie.vars.centerPoint[0], $.pie.vars.centerPoint[1]);
        //to rotate the canvas we need to convert the input degrees into radians
        $.pie.vars.drawingContext.rotate( $.pie.vars.rotation * (Math.PI / 180) );
        
        if($.pie.vars.shouldAnimate){
          $.pie.animatedPie();
        } else {
          $.pie.update( $.pie.vars.percentages );
        }
        
      }
      
      
  };
  
  $.pie.vars = {
    canvasID: null,
    colors: null,
    percentages: null,
    totalRadius: null,
    thickness: null,
    outlineColor: null,
    rotation: null,
    drawingSurface: null,
    drawingContext: null,
    pieRadians: null,
    centerPoint: null,
    animationValues: [0, 100],
    shouldAnimate: false, 
  }
  
  $.pie.update = function( percentages ) {
    
    $.pie.vars.pieRadians = $.pie.getRadians( percentages );
    $.pie.drawLines( $.pie.vars.colors , $.pie.vars.pieRadians );
    
  }
  
  $.pie.getRadians = function( percentages ) {
    
    var rads = new Array();
    var totalValue = 0;
    
    var i = 0;
    var totalLength = percentages.length;
    for(i; i < totalLength; i++){
      totalValue = totalValue + percentages[i];
    }
    
    i = 0;
    for(i; i < totalLength; i++){
      rads.push( percentages[i] / totalValue*2 );
    }
    
    return rads;
    
  }
  
  $.pie.drawLines = function( colors, radians ) {
    
    if(radians.length > 1){
      //$.pie.vars.drawingContext.clearRect(0, 0, $.pie.vars.drawingSurface.width, $.pie.vars.drawingSurface.height);
    } else {
      return;
    }
    
    var radiansSoFar = 0;
    var i = 0;
    var total = radians.length;
    
    for(i; i < total; i++){
      
      $.pie.vars.drawingContext.beginPath();
      
      $.pie.vars.drawingContext.moveTo(0, 0);
      $.pie.vars.drawingContext.lineTo(Math.sin(radiansSoFar * Math.PI) * $.pie.vars.totalRadius, Math.cos(radiansSoFar * Math.PI) * $.pie.vars.totalRadius);
      
      var n = 0;
      var totalRads = radians[i];
      for(n; n < totalRads; n+= .00005){
        $.pie.vars.drawingContext.lineTo(Math.sin((radiansSoFar+n) * Math.PI) * $.pie.vars.totalRadius, Math.cos((radiansSoFar+n) * Math.PI) * $.pie.vars.totalRadius);
      }
      
      radiansSoFar += radians[i];
      
      $.pie.vars.drawingContext.lineTo(0, 0);
      
      $.pie.vars.drawingContext.closePath();
      
      $.pie.vars.drawingContext.strokeStyle = $.pie.vars.outlineColor;
      $.pie.vars.drawingContext.lineWidth = $.pie.vars.thickness;
      
      $.pie.vars.drawingContext.stroke();
      
      //$.pie.vars.drawingContext.fillStyle = $.pie.vars.colors[i];
      var grad = $.pie.vars.drawingContext.createLinearGradient(0, 0, 0, $.pie.vars.drawingSurface.height / 2);
      grad.addColorStop(0, $.pie.vars.colors[i][0]);
      grad.addColorStop(0.5, $.pie.vars.colors[i][1]);
      grad.addColorStop(1, $.pie.vars.colors[i][2]);
      $.pie.vars.drawingContext.fillStyle = grad;
      
      $.pie.vars.drawingContext.fill();
      
      //specific to BTCMobile site
      $.pie.drawInnerOutline();
      $.pie.drawInnerCircle();
      // end of specific to btc site
      
    }
    
  }
  
  $.pie.animatedPie = function(){
    
    if($.pie.vars.animationValues[0] < $.pie.vars.percentages[0]){
      console.log('animate' + " " + $.pie.vars.animationValues[0] + " " +  $.pie.vars.percentages[0]);
      $.pie.update([$.pie.vars.animationValues[0], $.pie.vars.animationValues[1]]);
      $.pie.vars.animationValues[0] += 1;
      $.pie.vars.animationValues[1] -= 1;
      setTimeout('$.pie.animatedPie()', 1);
    } else {
      $.pie.vars.animationValues[0] = 0;
      $.pie.vars.animationValues[1] = 100;
      return;
    }
    
  }
  
  //methods specific to BTCMobie Site.
  $.pie.drawInnerOutline = function(){
    
    $.pie.vars.drawingContext.moveTo(0, 0);
    $.pie.vars.drawingContext.beginPath();
    $.pie.vars.drawingContext.arc(0, 0, $.pie.vars.totalRadius - 20, 0, Math.PI * 2, false);
    $.pie.vars.drawingContext.closePath();
    
    $.pie.vars.drawingContext.strokeStyle = $.pie.vars.outlineColor;
    $.pie.vars.drawingContext.lineWidth = $.pie.vars.thickness;
    $.pie.vars.drawingContext.stroke();
    
  }
  
  $.pie.drawInnerCircle = function(){
    
    $.pie.vars.drawingContext.moveTo(0, 0);
    $.pie.vars.drawingContext.beginPath();
    $.pie.vars.drawingContext.arc(0, 0, $.pie.vars.totalRadius / 4, 0, Math.PI * 2, false);
    $.pie.vars.drawingContext.closePath();
    
    $.pie.vars.drawingContext.fillStyle = $.pie.vars.outlineColor;
    $.pie.vars.drawingContext.fill();
    
  }
  
  
})( jQuery );