(function( $ ) {
  
  $.pie = function( targetCanvasID, colors, percentages, totalRadius, thickness, outlineColor, initialRotation, centerPoint ) {

      $.pie.vars.canvasID = targetCanvasID;
      $.pie.vars.colors = colors;
      $.pie.vars.totalRadius = totalRadius;
      $.pie.vars.thickness = thickness;
      $.pie.vars.outlineColor = outlineColor;
      $.pie.vars.rotation = initialRotation;
      $.pie.vars.centerPoint = centerPoint;
      
      $.pie.vars.drawingSurface = document.getElementById( $.pie.vars.canvasID );
      
      if( $.pie.vars.drawingSurface.getContext ){
        
        $.pie.vars.drawingContext = $.pie.vars.drawingSurface.getContext( '2d' );
        $.pie.update( percentages );
        
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
  }
  
  $.pie.update = function( percentages ) {
    
    $.pie.vars.percentages = percentages;
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
      $.pie.vars.drawingContext.clearRect(0, 0, $.pie.vars.drawingSurface.width, $.pie.vars.drawingSurface.height);
    } else {
      return;
    }
    
    var radiansSoFar = 0;
    var i = 0;
    var total = radians.length;
    
    $.pie.vars.drawingContext.translate($.pie.vars.centerPoint[0], $.pie.vars.centerPoint[1]);
    
    $.pie.vars.drawingContext.strokeStyle = $.pie.vars.outlineColor;
    
    for(i; i < total; i++){
      
      $.pie.vars.drawingContext.fillStyle = $.pie.vars.colors[i];
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
      $.pie.vars.drawingContext.stroke();
      $.pie.vars.drawingContext.fill();
      
    }
    
  }
  
  
})( jQuery );