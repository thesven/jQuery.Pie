//request animation frame shim
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
//end of request animation frame shim

(function($){
  $.fn.pie = function(options) {
    return this.each(function(){
      var self = $(this), o = $.extend({}, $.fn.pie.defaults, options);
      
      var Pie = {
        
        update: function(percentages){
          var radians = this.getRadians(percentages);
          Pie.drawLines(radians);
        },
        
        getRadians: function(percentages){
          
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
          
        }, 
        
        drawLines: function(radians){
          
          var radiansSoFar = 0;
          var i = 0;
          var total = radians.length;

          for(i; i < total; i++){

            o.drawingContext.beginPath();

            o.drawingContext.moveTo(0, 0);
            o.drawingContext.lineTo(Math.sin(radiansSoFar * Math.PI) * o.totalRadius, Math.cos(radiansSoFar * Math.PI) * o.totalRadius);

            var n = 0;
            var totalRads = radians[i];
            for(n; n < totalRads; n+= .00005){
              o.drawingContext.lineTo(Math.sin((radiansSoFar+n) * Math.PI) * o.totalRadius, Math.cos((radiansSoFar+n) * Math.PI) * o.totalRadius);
            }

            radiansSoFar += radians[i];

            o.drawingContext.lineTo(0, 0);

            o.drawingContext.closePath();

            o.drawingContext.strokeStyle = o.outlineColor;
            o.drawingContext.lineWidth = o.thickness;

            //options.drawingContext.fillStyle = options.colors[i];
            var grad = o.drawingContext.createLinearGradient(0, 0, 0, o.drawingSurface.height / 2);
            grad.addColorStop(0, o.colors[i][0]);
            grad.addColorStop(0.5, o.colors[i][1]);
            grad.addColorStop(1, o.colors[i][2]);
            o.drawingContext.fillStyle = grad;
						
						o.drawingContext.save();
            o.drawingContext.fill();
						o.drawingContext.stroke();
						o.drawingContext.restore();

          }
          
        },
        
        animatedPie: function(){
          
          var min = $canvas.data('minAnim');
          var max = $canvas.data('maxAnim');
          
          if($canvas.data('minAnim') < o.percentages[0]){
            Pie.update([min, max]);
            min += 1;
            max -= 1;
            $canvas.data('minAnim', min);
            $canvas.data('maxAnim', max);
						requestAnimationFrame(Pie.animatedPie);

          } else {
            $canvas.data('minAnim', 0);
            $canvas.data('maxAnim', 100);
          }
          
        },
        
      };
      
      
      //get the percentage from the data attribute
      var percentage = self.data('percent');
      o.percentages = [percentage, 100 - percentage];
      
      //create the canvas
      var $canvas = $('<canvas>');
      $canvas[0].width = 400;
      $canvas[0].height = 400;
      $canvas
        .data('minAnim', 0)
        .data('maxAnim', 100);
      $canvas
        .css('width', '100%')
        .css('height', '100%');
      self.append($canvas);
      
      var context = $canvas[0].getContext('2d');
      
      o.drawingSurface = $canvas[0];
      o.drawingContext = context;
      
      //setup the canvas context
      o.drawingContext.translate(o.centerPoint[0], o.centerPoint[1]);
      //to rotate the canvas we need to convert the input degrees into radians
      o.drawingContext.rotate( o.rotation * (Math.PI / 180) );
      
      //init
      if(o.animate){
        Pie.animatedPie();
      } else {
        Pie.update(o.percentages);
      }    
      
    });
  };
  
  $.fn.pie.defaults = {
    colors: [["#f30a0a", "#b70505",  "#7b090b"], ["#858585", "#666666", "#5C5C5C"]],
    percentages: [0, 100],
    totalRadius: 160,
    thickness: 7,
    outlineColor: "#FFFFFF",
    rotation: 180,
    drawingSurface: null,
    drawingContext: null,
    canvasDimensions: [400, 400],
    centerPoint: [200, 200],
    animate: true,
    animationSpeed: 30
  };
  
})(jQuery);