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
    context.strokeStyle = "black";
    context.lineWidth = 1;
    context.fill();
    context.stroke(); 
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
    var inside = context.isPointInPath(x,y);
    if (inside == true) {
    	return {
			result: true,
			point: controlPoints.START
		};
    };


	context.beginPath();            
    context.rect(this.xEnd - pointSize/2, this.yEnd - pointSize/2, 
    	pointSize, pointSize);
    var inside = context.isPointInPath(x,y);
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
    var inside = context.isPointInPath(x,y);
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

/************************** Toolbar methods ***********************************/

// Tool bar item names/types for readability
var toolbarItem = {
    DRAW: 0,
    SELECT: 1,
    COPY: 2,
    PASTE:3,
    CLEARCANVAS: 4
};

// Highlights selected toolbar item and displays the relevant menu
// First, removes the highlight from all toolbar items and then highlights 
// the selected item
function selectItem (item){
	if(item.index()!=toolbarItem.CLEARCANVAS){
		$(".toolbar li").each(function() {
			$(this).css("background-color", "#047F6A");
		});
		item.css("background-color", "#57BEAD");
		showSelectedMenu(item);
		currentToolbarItem = item.index();

		// Redraw on canvas in case selection is turned on/off
		drawShapes();
	}
	// If item is "clear canvas" treat it as a button
	else{
		clearCanvas();
	}
}


/***************************** Menu methods ***********************************/

// Displays the selected menu.
// First, hides all the menus and then shows the selected one
function showSelectedMenu(item){
	$(".menu div").each(function() {
		$(this).hide();
	});
	var menuName = item.text();
	$("."+menuName).slideDown();
}

// Highlights selected menu item in the draw sub-menu (shapes menu)
// First, removes the highlight from all menu items and then highlights 
// the selected item
function selectMenuItem(item){
	$(".shapes li").each(function() {
		$(this).css("background-color", "#047F6A");
	});
	item.css("background-color", "#57BEAD");
	currentShapeType = item.index();
}

// Adds numerical options starting from 1 to the dropdown passed in
function addDropdownOptions(item, lastValue){
	for (var i = 1; i <= lastValue; i++) {
		item.append("<option>"+i+"</option>");
	};
}

// Updates the menu item values when a new shape is selected
function updateSelectMenuItems(){
	$(".select .outlineColor").val(currentSelectedShape.outlineColor);
	$(".select .fillColor").val(currentSelectedShape.fillColor );
	$(".select .outlineWidth").val(currentSelectedShape.outlineWidth);
}

// Removes the selected shape from the shapes array
function eraseShape(index){
	if (index != -1 && index < shapes.length) {
		shapes.splice(index,1);
		drawShapes();
	};
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
var currentSelectedShapeIndex = -1;
var currentControlPoint;
var clipboardShape;

// Saves previous coordinates for unit displacement (delta) calculation
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

/*********************** Begin toolbar interactivity **************************/
	// Select first toolbar item by default when page loads
	selectItem($(".toolbar li").first());

	// Handles toolbar item click
	$(".toolbar li").click(function(){
		selectItem($(this));
	});
	
	// Animates toolbar item when hovering over it
	$(".toolbar ul li").hover(function(){
		$(this).animate({width:250, duration:200}, "fast");
	},function(){
		$(this).animate({width:165, duration:200}, "fast");
	});

/************************* End toolbar interactivity **************************/

/************************** Begin menu interactivity **************************/
	// Populate outline width dropdown options in menu
	addDropdownOptions($(".outlineWidth"), 20);

	// Select line by default for the draw sub-menu (shapes menu)
	selectMenuItem($(".shapes li").first());

	// Selects clicked menu item in the draw sub-menu (shapes menu)
	$(".shapes li").click(function(){
		selectMenuItem($(this));
	});

	// Methods to change color and width for currently selected shape
	// from options in the Select menu
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

	// Erases selected shape
	$(".select .erase").click(function(){
		if (currentSelectedShape != null) {
			eraseShape(currentSelectedShapeIndex);
		};
	});
/************************** End menu interactivity ****************************/

/******************************** Canvas methods ******************************/
	// Gets the mouse coordinates with respect to the origin of the canvas 
	function getMouseCoords(event){
		var canvasOffset = $("#canvas").offset();
		return{
	 		x: event.pageX - Math.floor(canvasOffset.left),
	 		y: event.pageY - Math.floor(canvasOffset.top)
	 	};
	}

	// Current mouse coordinates
	var currentCoords;

	// Variable used for making new shapes on the canvas
	// Needed to keep track of current shape being drawn 
	// when toolbarItem.DRAW is selected
	var shape;

	// Flag to indicate if we need to create a new shape using new
	var needNewShape = 1;

	// Flag to indicate whether the mouse button is pressed down
	var isMouseDown = 0;

	// Handles mouse up on canvas
	$("#canvas").mouseup(function(e) {
		isMouseDown=0;
		needNewShape = 1;
	});

	// Handles mouse down on canvas
	$("#canvas").mousedown(function(e) {
		isMouseDown = 1;

		switch (currentToolbarItem) {
			case (toolbarItem.SELECT):
			{
				prevCoords = getMouseCoords(e);
			}
			// no break because rest of code is common with toolbarItem.COPY

			case (toolbarItem.COPY):
			{
				var shapeFound = false;
				
				// Unselect last selected shape and reset variables
				if (currentSelectedShape != null) {
					currentSelectedShape.setSelected(false);
				}
				currentSelectedShape = null;
				currentSelectedShapeIndex = -1;
				currentControlPoint = null;

				// Perform hit test for all shapes starting from the 
				// last index (from front to back)
				// Break at first(front-most) shape found
				// Selected shape becomes top most shape
				currentCoords = getMouseCoords(e);
				for(i = shapes.length - 1; i >= 0; i-- ){
					shapeFound = shapes[i].inside(currentCoords.x,
						currentCoords.y);

					// Selected shape is pushed to the front of the shapes array
					if (shapeFound.result == true) {
						var clonedShape = jQuery.extend(true, {}, shapes[i]);
						shapes.splice(i,1)
						shapes.push(clonedShape);

						currentSelectedShapeIndex = shapes.length-1;
						currentSelectedShape = shapes[currentSelectedShapeIndex];
						currentSelectedShape.setSelected(true);
						currentControlPoint = shapeFound.point;

						// set menu item values to match the selected shape
						updateSelectMenuItems();

						// Copy shape to clipboard if toolbarItem.COPY 
						// is selected
						if(shapeFound.result == true && 
							currentToolbarItem == toolbarItem.COPY){
								clipboardShape = jQuery.extend(true, {}, 
									shapes[shapes.length-1]);
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
					// Make new shape from clipboard shape
					currentCoords = getMouseCoords(e);
					var newShape = jQuery.extend(true, {}, clipboardShape);
					
					// Calculate coordinates for new shape
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

					// Add it to the shapes array
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

	// Handles mouse out on canvas
	$("#canvas").mouseout(function(e) {
		$("#canvas").trigger("mouseup");
	});

	// Handles mouse move on canvas
	$("#canvas").mousemove(function(e){
		if(isMouseDown)
		{
			switch (currentToolbarItem) {
				case (toolbarItem.DRAW):
				{
					currentCoords = getMouseCoords(e);
					
					// Create and push a new shape to shapes array 
					// only if needed (ie on mouse down)
					if(needNewShape == 1){
						switch(currentShapeType){
							case(shapeTypes.LINE):
								shape = new Line(canvas, currentCoords.x, 
									currentCoords.y);
							break;
							case(shapeTypes.CIRCLE):
								shape = new Circle(canvas, currentCoords.x, 
									currentCoords.y);
							break;
							case(shapeTypes.RECTANGLE):
								shape = new Rectangle(canvas, currentCoords.x, 
									currentCoords.y);
							break;
							default:
								alert("Some error occurred");
						}

						shapes.push(shape);
						needNewShape = 0;		
					} 

					// Adjust end coordinates for shape being drawn
					shape.xEnd = currentCoords.x;
					shape.yEnd = currentCoords.y;

					drawShapes();
				} 
				break;

				case (toolbarItem.SELECT):
				{
					if (currentSelectedShape != null && currentControlPoint!= null) {
						currentCoords = getMouseCoords(e);

						// Update shape coordinates depending on type of
						// control point
						switch(currentControlPoint){
							case(controlPoints.START):
							{
								// Update start point for selected shape
								currentSelectedShape.x = currentCoords.x;
								currentSelectedShape.y = currentCoords.y;
							}
							break;

							case(controlPoints.CENTER):
							case(controlPoints.INTERIOR):
							{
								// Update position for selected shape
								var center = currentSelectedShape.center();
								xDisplacement = currentCoords.x - prevCoords.x;
								yDisplacement = currentCoords.y - prevCoords.y;
								currentSelectedShape.x += xDisplacement;
								currentSelectedShape.y += yDisplacement;
								currentSelectedShape.xEnd += xDisplacement;
								currentSelectedShape.yEnd += yDisplacement;
								prevCoords = currentCoords;
							}
							break;

							case(controlPoints.END):
							{
								// Update end point for selected shape
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
/*****************************End Canvas methods*******************************/	
});
