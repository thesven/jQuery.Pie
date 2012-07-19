(function($){
  $.fn.pie = function(options) {
    return this.each(function(){
      var self = $(this), o = $.extend({}, $.fn.pie.defaults, options);
      
      var Pie = {
        
        update: function(options, percentages){
          var radians = this.getRadians(percentages);
          this.drawLines(options, radians);
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
        
        drawLines: function(options, radians){
          
          var radiansSoFar = 0;
          var i = 0;
          var total = radians.length;

          for(i; i < total; i++){

            options.drawingContext.beginPath();

            options.drawingContext.moveTo(0, 0);
            options.drawingContext.lineTo(Math.sin(radiansSoFar * Math.PI) * options.totalRadius, Math.cos(radiansSoFar * Math.PI) * options.totalRadius);

            var n = 0;
            var totalRads = radians[i];
            for(n; n < totalRads; n+= .00005){
              options.drawingContext.lineTo(Math.sin((radiansSoFar+n) * Math.PI) * options.totalRadius, Math.cos((radiansSoFar+n) * Math.PI) * options.totalRadius);
            }

            radiansSoFar += radians[i];

            options.drawingContext.lineTo(0, 0);

            options.drawingContext.closePath();

            options.drawingContext.strokeStyle = options.outlineColor;
            options.drawingContext.lineWidth = options.thickness;

            options.drawingContext.stroke();

            //options.drawingContext.fillStyle = options.colors[i];
            var grad = options.drawingContext.createLinearGradient(0, 0, 0, options.drawingSurface.height / 2);
            grad.addColorStop(0, options.colors[i][0]);
            grad.addColorStop(0.5, options.colors[i][1]);
            grad.addColorStop(1, options.colors[i][2]);
            options.drawingContext.fillStyle = grad;

            options.drawingContext.fill();

            //specific to BTCMobile site
            this.drawInnerOutline(options);
            this.drawInnerCircle(options);
            // end of specific to btc site

          }
          
        },
        
        animatedPie: function(options){
          
          if(options.animationValues[0] < options.percentages[0]){
            console.log('animate' + " " + options.animationValues[0] + " " +  options.percentages[0]);
            this.update(options, options.animationValues);
            options.animationValues[0] += 1;
            options.animationValues[1] -= 1;
            setTimeout(function(){
              console.log(options);
              Pie.animatedPie(options);
            }, 30);
          } else {
            options.animationValues[0] = 0;
            options.animationValues[1] = 100;
            return;
          }
          
        },
        
        drawInnerOutline: function(options){
          
          options.drawingContext.moveTo(0, 0);
          options.drawingContext.beginPath();
          options.drawingContext.arc(0, 0, options.totalRadius - 20, 0, Math.PI * 2, false);
          options.drawingContext.closePath();

          options.drawingContext.strokeStyle = options.outlineColor;
          options.drawingContext.lineWidth = options.thickness;
          options.drawingContext.stroke();
          
        },
        
        drawInnerCircle: function(options){
          
          options.drawingContext.moveTo(0, 0);
          options.drawingContext.beginPath();
          options.drawingContext.arc(0, 0, options.totalRadius / 4, 0, Math.PI * 2, false);
          options.drawingContext.closePath();

          options.drawingContext.fillStyle = options.outlineColor;
          options.drawingContext.fill();
          
        }
        
      };
      
      
      //get the percentage from the data attribute
      var percentage = self.data('percent');
      o.percentages = [percentage, 100 - percentage];
      console.log(o.percentages);
      
      //create the canvas
      var $canvas = $('<canvas>');
      $canvas[0].width = 400;
      $canvas[0].height = 400;
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
        Pie.animatedPie(o);
      } else {
        Pie.update(o, o.percentages);
      }    
      
    });
  };
  
  $.fn.pie.defaults = {
    colors: [["#f30a0a", "#b70505",  "#7b090b"], ["#858585", "#666666", "#5C5C5C"]],
    percentages: [0, 100],
    totalRadius: 160,
    thickness: 10,
    outlineColor: "#FFFFFF",
    rotation: 180,
    drawingSurface: null,
    drawingContext: null,
    canvasDimensions: [400, 400],
    centerPoint: [200, 200],
    animationValues: [0, 100],
    animate: true
  };
  
})(jQuery);