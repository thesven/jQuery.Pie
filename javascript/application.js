$(function() {
 
 //jQuery.pie('pie-canvas1', [["#f30a0a", "#b70505",  "#7b090b"], ["#858585", "#666666", "#5C5C5C"]], [25, 75], 160, 10, "#FFFFFF", 180, [200, 200], true);
 //jQuery.pie('pie-canvas2', [["#f30a0a", "#b70505",  "#7b090b"], ["#858585", "#666666", "#5C5C5C"]], [45, 65], 160, 10, "#FFFFFF", 180, [200, 200], false);
 
 $(".row1 .pie").pie();
 $(".row2 .pie").pie({animate: false});
 
});