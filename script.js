/*******************************************************************************
 * CANVAS DRAW
 * Author   : 
 * Email    : 
 * CDF      : 
 * Student# : 

 * Author   : Pallak Grewal
 * Email    : pallak.grewal@mail.utoronto.ca
 * CDF      : c3grewal
 * Student# : 997293931
 ******************************************************************************/


/*******************************************************************************
 * Shape object methods
*******************************************************************************/

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
		this.outlineColor = $(".draw .outlineColor").val();
		this.outlineWidth = $(".draw .outlineWidth").val();
	}
}

// Select flag for shape
Shape.prototype.selected = false;
Shape.prototype.setSelected = function(value) { this.selected = value;}
Shape.prototype.isSelected = function() { return this.selected;}

// Returns the center point of the shape
Shape.prototype.center = function() {
	var xSize = this.xEnd - this.x;
    var ySize = this.yEnd - this.y;
    return {
    	x:this.x + xSize/2,
    	y:this.y + ySize/2
    };
}

// Removes all the shapes and updates the display
function clearCanvas() {
  shapes = [];
  drawShapes();
}

// Size (side) for control points
var pointSize = 10;

// Draws control points for a given position on a shape       
function drawPoint(x, y, color, size) {
    context.beginPath();            
    context.rect(x - size/2, y - size/2, size, size);
    context.fillStyle = color;
    this.context.strokeStyle = "black";
    this.context.lineWidth = 1;
    context.fill();
    this.context.stroke(); 
}

// Clears the canvas, loops through the shapes array
// and draws all the shapes
function drawShapes() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for(var i=0; i<shapes.length; i++) {
    var shape = shapes[i];
    if (shape!=null) {
    	shape.draw();
	}

    // If select mode is on, display control points for
    // the shape at the start, end and center positions
    if (currentToolbarItem == toolbarItem.SELECT || 
    	currentToolbarItem == toolbarItem.COPY) {

	    // Select color for control points
	    // depending on whether shape is selected
	    var color = (shape.isSelected() != false) ?"#ff0000" :"#000000";

		drawPoint(shape.x, shape.y, color, pointSize);
		drawPoint(shape.xEnd, shape.yEnd, color, pointSize);
		center = shape.center();
		drawPoint(center.x, center.y, color, pointSize);
    }
  }
}

// Returns the distance between two given points
function getDistance(point1x, point1y, point2x, point2y){
	return (Math.floor(Math.sqrt(Math.pow(point2x - point1x, 2) + 
		Math.pow(point2y - point1y, 2))));
}

// Types of control points for shape selection
var controlPoints = {
    START: 0,
    END: 1,
    CENTER: 2,
    INTERIOR: 3
};

// TODO: does not work properly - fix
// Hit test for the shape's control points
Shape.prototype.inside = function(x, y) {
	// Go through each control point to check 
	//if it got selected

	// // Calculate distance between each control
	// // point and position of cursor
	// var startDistance = getDistance(this.x, this.y, x, y);
	// var endDistance = getDistance(this.xEnd, this.yEnd, x, y);
	// var center = this.center();
	// var centerDistance = getDistance(center.x, center.y, x, y);

	// // See if cursor point lies on the 
	// // control point rectangle
	// if (startDistance <= (pointSize/2)) {
	// 	return {
	// 		result: true,
	// 		point: controlPoints.START
	// 	};
	// } else if(endDistance <= (pointSize/2)){	
	// 	return {
	// 		result: true,
	// 		point: controlPoints.END
	// 	};
	// } else if(centerDistance <= (pointSize/2)){
	// 	return {
	// 		result: true,
	// 		point: controlPoints.CENTER
	// 	};
	// }

	context.beginPath();            
    context.rect(this.x - pointSize/2, this.y - pointSize/2, 
    	pointSize, pointSize);
    var inside = this.context.isPointInPath(x,y);
    if (inside == true) {
    	return {
			result: true,
			point: controlPoints.START
		};
    };


	context.beginPath();            
    context.rect(this.xEnd - pointSize/2, this.yEnd - pointSize/2, 
    	pointSize, pointSize);
    var inside = this.context.isPointInPath(x,y);
    if (inside == true) {
    	return {
			result: true,
			point: controlPoints.END
		};
    };

    var center = this.center();
	context.beginPath();            
    context.rect(center.x - pointSize/2, center.y - pointSize/2, 
    	pointSize, pointSize);
    var inside = this.context.isPointInPath(x,y);
    if (inside == true) {
    	return {
			result: true,
			point: controlPoints.CENTER
		};
    };

	return {
		result: false,
		point: null
	};
}


/*******************************************************************************
 * Rectangle object methods
 * Inherited from Shape
*******************************************************************************/

// Rectangle object constructor
function Rectangle(canvas, x, y) {
	Shape.call(this,canvas, x, y);
	this.xEnd = x;
	this.yEnd = y;
	this.fillColor = $(".draw .fillColor").val();
}

// Clone(Shape.prototype);
Rectangle.prototype = new Shape(); 
Rectangle.prototype.constructor = Rectangle;

// Draws the rectangle
Rectangle.prototype.draw = function () {
    this.context.globalAlpha = 0.85;
    var xLength = this.xEnd - this.x;
    var yLength = this.yEnd - this.y;
    this.context.beginPath();
    this.context.rect(this.x, this.y, xLength, yLength);
    this.context.fillStyle = this.fillColor;
    this.context.strokeStyle = this.outlineColor;
    this.context.lineWidth = this.outlineWidth;
    this.context.fill();
    this.context.stroke(); 
};

// Hit test for rectangle. First calls super for control points hit test
// and then checks for a hit anywhere inside the shape.
Rectangle.prototype.inside = function (x,y){
	var hit = Shape.prototype.inside.call(this, x, y);
	if(hit.result == true){
		return hit;
	} 

	var startX = Math.min(this.x, this.xEnd);
	var startY = Math.min(this.y, this.yEnd);
	var endX = Math.max(this.x, this.xEnd);
	var endY = Math.max(this.y, this.yEnd);

	if (x >= startX && x <= endX && y >= startY && y <= endY) {
    	return {
			result: true,
			point: controlPoints.INTERIOR
		};
	}

	return {
		result: false,
		point: null
	};
}


/*******************************************************************************
 * Line object methods
 * Inherited from Shape
*******************************************************************************/

// Line object constructor
function Line(canvas, x, y) {
	Shape.call(this,canvas, x, y);
	this.xEnd = x;
	this.yEnd = y;
}

// Clone(Shape.prototype);
Line.prototype = new Shape(); 
Line.prototype.constructor = Line;

// Draws the line
Line.prototype.draw = function () {
    this.context.globalAlpha = 0.85;
    this.context.beginPath();
    this.context.moveTo(this.x, this.y);
    this.context.lineTo(this.xEnd, this.yEnd);
    this.context.strokeStyle = this.outlineColor;
    this.context.lineWidth = this.outlineWidth;
    this.context.stroke();
};


/*******************************************************************************
 * Circle object methods
 * Inherited from Shape
*******************************************************************************/

// Circle object constructor
function Circle(canvas, x, y) {
	Shape.call(this,canvas, x, y);
	this.xEnd = x;
	this.yEnd = y;
	this.fillColor = $(".draw .fillColor").val();
}

// Clone(Shape.prototype);
Circle.prototype = new Shape(); 
Circle.prototype.constructor = Circle;

// Draws the circle
Circle.prototype.draw = function () {
	var center = this.center();
	var radius = getDistance(this.x, this.y, center.x, center.y);
    this.context.globalAlpha = 0.85;
    this.context.beginPath();
    this.context.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    this.context.fillStyle = this.fillColor;
    this.context.strokeStyle = this.outlineColor;
    this.context.lineWidth = this.outlineWidth;
    this.context.fill();
    this.context.stroke();
};

// Hit test for circle. First calls super for control points hit test
// and then checks for a hit anywhere inside the shape.
Circle.prototype.inside = function(x,y){
	var hit = Shape.prototype.inside.call(this, x, y);
	if(hit.result == true){
		return hit;
	} 

	var center = this.center();
	if (getDistance(x, y, center.x, center.y) <= 
		getDistance(center.x, center.y, this.xEnd, this.yEnd)){
    	return {
			result: true,
			point: controlPoints.INTERIOR
		};
	}

	return {
		result: false,
		point: null
	};
}

/*******************************************************************************
 * Non - event driven methods
*******************************************************************************/

/*******************************
Tool bar item names/types
for readability
*******************************/
var toolbarItem = {
    DRAW: 0,
    SELECT: 1,
    COPY: 2,
    PASTE:3,
    CLEARCANVAS: 4
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
	if(item.index()!=toolbarItem.CLEARCANVAS){
		$(".toolbar li").each(function() {
			$(this).css("background-color", "#047F6A");
		});
		item.css("background-color", "#57BEAD");
		showSelectedMenu(item);
		currentToolbarItem = item.index();

		// Redraw on canvas in case select is 
		// turned on/off
		drawShapes();
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

/*******************************************************************************
 * Global variables
*******************************************************************************/
var shapes = [];
var canvas;
var context;
var currentShapeType;
var currentToolbarItem;
var currentSelectedShape;
var currentControlPoint;
var clipboardShape;
var prevCoords;

/*******************************************************************************
 * Event driven methods
*******************************************************************************/

$(document).ready(function(){
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");

	// Fixes a bug in Firefox.  Otherwise changes to the canvas don't render
 	// until the window is redrawn
 	context.stroke();

/***************Begin toolbar interactivity**************/
	selectItem($(".toolbar li").first());

	/*******************************
	Adding options to the outline width 
	drop down menu
	TODO: change dropdown to something 
	nicer.
	********************************/
	for (var i = 1; i <= 20; i++) {
		$(".outlineWidth").append("<option>"+i+"</option>");
	};

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
		// use switch case for different toolbar items like in mousemove
		isMouseDown=0;
		needNewShape = 1;
	});

	$("#canvas").mousedown(function(e) {
		// use switch case for different toolbar items like in mousemove
		isMouseDown = 1;
		// console.log(getMouseCoords(e).x + " " + getMouseCoords(e).y);

		switch (currentToolbarItem) {
			case (toolbarItem.DRAW):
			{
			} 
			break;

			case (toolbarItem.SELECT):
			{
				prevCoords = getMouseCoords(e);
			}
			case (toolbarItem.COPY):
			{
				var shapeFound = false;
				
				// Unselect last selected shape 
				if (currentSelectedShape != null) {
					currentSelectedShape.setSelected(false);
				}
				currentSelectedShape = null;
				currentControlPoint = null;
				clipboardShape = null;

				// Perform hit test for all shapes starting from the 
				// last index (from front to back)
				// Break at first(front-most) shape found
				currentCoords = getMouseCoords(e);
				for(i = shapes.length - 1; i >= 0; i-- ){
					shapeFound = shapes[i].inside(currentCoords.x,currentCoords.y);
					if (shapeFound.result == true) {
						var clonedShape = jQuery.extend(true, {}, shapes[i]);
						shapes.splice(i,1)
						shapes.push(clonedShape);

						currentSelectedShape = shapes[shapes.length-1];
						currentSelectedShape.setSelected(true);
						currentControlPoint = shapeFound.point;

						// set menu item values to match the selected shape
						$(".select .outlineColor").val(currentSelectedShape.outlineColor);
						$(".select .fillColor").val(currentSelectedShape.fillColor );
						$(".select .outlineWidth").val(currentSelectedShape.outlineWidth);
						if( shapeFound.result == true && currentToolbarItem == toolbarItem.COPY){
							clipboardShape = jQuery.extend(true, {}, shapes[shapes.length-1]);
						}
						break;
					} 
				}
				// Need to draw to show selected/unselected shapes instantly
				drawShapes();
			}
			break;

			case(toolbarItem.PASTE):
			{
				if (clipboardShape!=null){
					currentCoords = getMouseCoords(e);
					var newShape = jQuery.extend(true, {}, clipboardShape);
					var center = clipboardShape.center();
					
					var x = Math.min(clipboardShape.x, clipboardShape.xEnd);
					var y = Math.min(clipboardShape.y, clipboardShape.yEnd);
					var xEnd = Math.max(clipboardShape.x, clipboardShape.xEnd);
					var yEnd = Math.max(clipboardShape.y, clipboardShape.yEnd);

					var xDisplacement = center.x - x;
					var yDisplacement = center.y - y;
					var xEndDisplacement = xEnd - center.x;
					var yEndDisplacement = yEnd - center.y;

					newShape.x = currentCoords.x - xDisplacement;
					newShape.y = currentCoords.y - yDisplacement;
					newShape.xEnd = currentCoords.x + xEndDisplacement;
					newShape.yEnd = currentCoords.y + yEndDisplacement;
					newShape.setSelected(false);
					shapes.push(newShape);
					drawShapes();
				}
			}
			break;

			default:
			// Do not add any console logs/alerts here unless for debugging
			// Will get triggered infinitely
		}
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
			switch (currentToolbarItem) {
				case (toolbarItem.DRAW):
				{
		  			context.clearRect(0, 0, canvas.width, canvas.height);
					currentCoords = getMouseCoords(e);
				
					if(needNewShape == 1){
						switch(currentShapeType){
							case(shapeTypes.LINE):
								shape = new Line(canvas, currentCoords.x, currentCoords.y);
							break;
							case(shapeTypes.CIRCLE):
								shape = new Circle(canvas, currentCoords.x, currentCoords.y);
							break;
							case(shapeTypes.RECTANGLE):
								shape = new Rectangle(canvas, currentCoords.x, currentCoords.y);
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
				break;

				case (toolbarItem.SELECT):
				{
					if (currentSelectedShape != null && currentControlPoint!= null) {
						currentCoords = getMouseCoords(e);
						switch(currentControlPoint){
							case(controlPoints.START):
							{
								// update start point
								currentSelectedShape.x = currentCoords.x;
								currentSelectedShape.y = currentCoords.y;
							}
							break;

							case(controlPoints.CENTER):
							case(controlPoints.INTERIOR):
							{
								// Update position of shape using the displacement
								// of the center
								var center = currentSelectedShape.center();
								xDisplacement = currentCoords.x - prevCoords.x;
								yDisplacement = currentCoords.y - prevCoords.y;
								currentSelectedShape.x += xDisplacement;
								currentSelectedShape.y += yDisplacement;
								currentSelectedShape.xEnd += xDisplacement;
								currentSelectedShape.yEnd += yDisplacement;
								console.log(xDisplacement);
								prevCoords = currentCoords;
							}
							break;

							case(controlPoints.END):
							{
								// update end point
								currentSelectedShape.xEnd = currentCoords.x;
								currentSelectedShape.yEnd = currentCoords.y;
							}
							break;

							default:
							// do nothing
						}

						drawShapes();
					};
				}
				break;

				default:
				// Do not add any console logs/alerts here unless for debugging
				// Will get triggered infinitely
			}
		}
	});

	/*****************************************
	Methods to change color and width for 
	currently selected shape
	*****************************************/	
	$(".select .outlineColor").change(function(){
		if (currentSelectedShape != null) {
			currentSelectedShape.outlineColor = $(".select .outlineColor").val();
			drawShapes();
		}
	});

	$(".select .fillColor").change(function(){
		if (currentSelectedShape != null) {
			currentSelectedShape.fillColor = $(".select .fillColor").val();
			drawShapes();
		}
	});

	$(".select .outlineWidth").change(function(){
		if (currentSelectedShape != null) {
			currentSelectedShape.outlineWidth = $(".select .outlineWidth").val();
			drawShapes();
		}
	});


/***********End Canvas methods*************************/	
});
