/*******************************
Shape object methods
*******************************/

// Shape object constructor
function Shape(canvas, x, y) {
	if (canvas) {
		this.context = canvas.getContext("2d");
		this.x = x;
		this.y = y;
	}
}

function randomFromTo(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

Shape.prototype.getColor = function () { 
	if (this.color == undefined) {
		var colors = ["green", "blue", "red", "yellow", "magenta", "orange", "brown", "purple", "pink"];
		this.color = colors[randomFromTo(0, 8)];	
	}
	return this.color; 
};

Shape.prototype.selected = false;
Shape.prototype.setSelected = function(value) { this.selected = value;}
Shape.prototype.isSelected = function() { return this.selected;}


function clearCanvas() {
  // Remove all the circles.
  shapes = [];

  // Update the display.
  drawShapes();
}

function drawShapes() {
  // Clear the canvas.
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Go through all the shapes.
  for(var i=0; i<shapes.length; i++) {
    var shape = shapes[i];
    shape.draw();
  }
}
/*******************************
Rectangle object methods
Inherited from Shape
*******************************/

function Rectangle(canvas, x, y) {
	Shape.call(this,canvas, x, y);
	this.xEnd = x;
	this.yEnd = y;
}

// Clone(Shape.prototype);
Rectangle.prototype = new Shape(); 
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.draw = function () {
    this.context.globalAlpha = 0.85;
    this.context.beginPath();
    this.context.rect(this.x, this.y, this.xEnd, this.yEnd);
    this.context.fillStyle = this.getColor();
    this.context.strokeStyle = "black";
    this.context.fill();
    this.context.stroke(); 
};

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
	/* If item is "clear canvas" treat it 
	as a button*/
	else{
		clearCanvas();
		}
}

/*******************************
Global Variables
*******************************/
var shapes = [];
var canvas;
var context;

$(document).ready(function(){
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");

	// Fixes a bug in Firefox.  Otherwise changes to the canvas don't render
 	// until the window is redrawn
 	context.stroke();

/***************Begin toolbar interactivity**************/
	selectItem($(".toolbar li").first());

	$(".toolbar li").click(function(){
		selectItem($(this));
	});
	
	/*******************************
	Animate toolbar when hovering 
	over any item in menu
	********************************/
	$(".toolbar ul li").hover(function(){
		$(this).animate({width:250, duration:200}, "fast");
	},function(){
		$(this).animate({width:165, duration:200}, "fast");
	});
/***************End toolbar interactivity**************/

/***************Begin menu interactivity***************/
/***************End menu interactivity*****************/

/***************Canvas methods*************************/
	/*******************************
	Get the mouse coordinates with 
	respect to the origin of the 
	canvas 
	********************************/
	function getMouseCoords(event){
		var canvasOffset = $("#canvas").offset();
		return{
	 		x: event.pageX - Math.floor(canvasOffset.left),
	 		y: event.pageY - Math.floor(canvasOffset.top)
	 	};
	}

	// Current mouse coords
	var currentCoords;
	var shape;

	// Bool to indicate if we need to create 
	// a new shape using new
	var needNewShape = 1;

	// Bool to indicate whether the mouse 
	// button is pressed down
	var isMouseDown = 0;

	// Functions to set the mouse pressed flag
	$("#canvas").mouseup(function(e) {
		isMouseDown=0;
		needNewShape = 1;
	});

	$("#canvas").mousedown(function(e) {
		isMouseDown = 1;
	});

	$("#canvas").mouseout(function(e) {
		$("#canvas").trigger("mouseup");
	});
	/*****************************************
	This function draws a shape while mouse is 
	moving and pressed down. On mouse up event,
	the shape is added to the array of shapes.
	*****************************************/
	$("#canvas").mousemove(function(e){
		if(isMouseDown)
		{
  			context.clearRect(0, 0, canvas.width, canvas.height);
			currentCoords = getMouseCoords(e);
		
			if(needNewShape == 1){
				shape = new Rectangle(canvas, currentCoords.x, currentCoords.y, 0, 0);
				needNewShape = 0;		
			} else{
				shapes.pop();
			}

			shape.xEnd = currentCoords.x - shape.x;
			shape.yEnd = currentCoords.y - shape.y;

			shapes.push(shape);
			drawShapes();
		}
	});
/***********End Canvas methods*************************/	
});
