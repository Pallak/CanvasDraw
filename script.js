/*******************************
Shape object methods
*******************************/

// Types of shapes
var shapeTypes = {
    LINE: 0,
    CIRCLE: 1,
    RECTANGLE: 2
};

// Shape object constructor
function Shape(canvas, x, y) {
	if (canvas) {
		this.context = canvas.getContext("2d");
		this.x = x;
		this.y = y;
	}
}

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

function getDistance(startX, startY, endX, endY){
	return (distanceFromCenter = Math.floor(Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))));
}

/*******************************
Rectangle object methods
Inherited from Shape
*******************************/

function Rectangle(canvas, x, y) {
	Shape.call(this,canvas, x, y);
	this.xEnd = x;
	this.yEnd = y;
	this.fillColor = $("#fillColor").val();
	this.outlineColor = $("#outlineColor").val();
}

// Clone(Shape.prototype);
Rectangle.prototype = new Shape(); 
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.draw = function () {
    this.context.globalAlpha = 0.85;
    var xLength = this.xEnd - this.x;
    var yLength = this.yEnd - this.y;
    this.context.beginPath();
    this.context.rect(this.x, this.y, xLength, yLength);
    this.context.fillStyle = this.fillColor;
    this.context.strokeStyle = this.outlineColor;
    this.context.fill();
    this.context.stroke(); 
};

/*******************************
Line object methods
Inherited from Shape
*******************************/

function Line(canvas, x, y) {
	Shape.call(this,canvas, x, y);
	this.xEnd = x;
	this.yEnd = y;
	this.outlineColor = $("#outlineColor").val();
}

// Clone(Shape.prototype);
Line.prototype = new Shape(); 
Line.prototype.constructor = Line;

Line.prototype.draw = function () {
    this.context.globalAlpha = 0.85;
    this.context.beginPath();
    this.context.moveTo(this.x, this.y);
    this.context.lineTo(this.xEnd, this.yEnd);
    this.context.strokeStyle = this.outlineColor;
    this.context.stroke();
};

/*******************************
Circle object methods
Inherited from Shape
*******************************/

function Circle(canvas, x, y) {
	Shape.call(this,canvas, x, y);
	this.xEnd = x;
	this.yEnd = y;
	this.fillColor = $("#fillColor").val();
	this.outlineColor = $("#outlineColor").val();
}

// Clone(Shape.prototype);
Circle.prototype = new Shape(); 
Circle.prototype.constructor = Line;

Circle.prototype.draw = function () {
	var radius = getDistance(this.x, this.y, this.xEnd, this.yEnd);
    this.context.globalAlpha = 0.85;
    this.context.beginPath();
    this.context.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    this.context.fillStyle = this.fillColor;
    this.context.strokeStyle = this.outlineColor;
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
Highlighting certain menu items.
Removes highlight from all menu 
items and then highlights the 
selected item.
Currently only used for shapes menu,
which is part of the draw menu.
*******************************/
function selectMenuItem(item){
	$(".shapes li").each(function() {
		$(this).css("background-color", "#047F6A");
	});
	item.css("background-color", "#57BEAD");
	currentShapeType = item.index();
}


/*******************************
Global Variables
*******************************/
var shapes = [];
var canvas;
var context;
var currentShapeType;

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
	/*******************************
	DRAW MENU
	********************************/

	// Line selected by default
	selectMenuItem($(".shapes li").first());

	$(".shapes li").click(function(){
		selectMenuItem($(this));
	});

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
				switch(currentShapeType){
					case(shapeTypes.LINE):
						shape = new Line(canvas, currentCoords.x, currentCoords.y);
					break;
					case(shapeTypes.RECTANGLE):
						shape = new Rectangle(canvas, currentCoords.x, currentCoords.y);
					break;
					case(shapeTypes.CIRCLE):
						shape = new Circle(canvas, currentCoords.x, currentCoords.y);
					break;
					default:
					alert("Some error occured");
				}
				needNewShape = 0;		
			} else{
				shapes.pop();
			}

			shape.xEnd = currentCoords.x;
			shape.yEnd = currentCoords.y;

			shapes.push(shape);
			drawShapes();
		}
	});
/***********End Canvas methods*************************/	
});
