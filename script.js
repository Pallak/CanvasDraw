// Shape object, contains shape's information
function Shape(canvas, x, y) {
	if (canvas) {
		this.context = canvas.getContext("2d");
		this.x = x;
		this.y = y;
	}
}
// get the colour of a shape
Shape.prototype.getColor = function () { 
	if (this.color == undefined) {
		var colors = "black";
	}
	return this.color; 
};
//
Shape.prototype.selected = false;
Shape.prototype.setSelected = function(value) { this.selected = value;}
Shape.prototype.isSelected = function() { return this.selected;}

/*******************************
Adding selected menu on the top.
Hides all the menus and then 
shows the selected one
*******************************/
function showSelectedMenu(item){
	$(".menu div").each(function() {
		$(this).hide();
	});
	var menuName = item.text();
	$("."+menuName).slideDown();
}


/*******************************
Highlighting toolbar items.
Removes highlight from all menu 
items and then highlights the 
selected item
*******************************/
function selectItem (item) {
	if(item.index()!=5){
		$(".toolbar li").each(function() {
			$(this).css("background-color", "#047F6A");
		});
		item.css("background-color", "#57BEAD");
		showSelectedMenu(item);
	}
	/* if item is "clear canvas" treat it 
	as a button*/
	else{
		}
}

//global variables
var shapes = [];
var canvas;
var context;

$(document).ready(function(){
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");

	// fixes a bug in Firefox.  Otherwise changes to the canvas don't render
 	// until the window is redrawn
 	context.stroke();
/***************Begin toolbar interactivity**************/
	selectItem($(".toolbar li").first());

	$(".toolbar li").click(function(){
		selectItem($(this));
	});
	
	/*******************************
	Animate toolbar when hovering over
	any item in menu
	*******************************/
	$(".toolbar ul li").hover(function(){
		$(this).animate({width:250, duration:200}, "fast");
	});
	/*******************************
	 Retract the item once the mouse
	 left the item in the menu
	 ************************/
	$(".toolbar ul li").mouseleave(function(){
		$(this).animate({width:165, duration:200}, "fast");
	});
/***************End toolbar interactivity**************/

/***************Begin menu interactivity**************/

/***************Begin menu interactivity**************/
});
