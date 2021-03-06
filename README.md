#Canvas Draw

##USER MANUAL

###DRAWING SHAPES
- On the left menu select the "Draw" option
- On the top menu select desired shape type
- To change shape's Outline Color/ Fill Color/ Outline Width, click on the respective input box, a drop down menu will appear.
- After selecting a shape, press the left mouse down on the canvas and draw to desired size, let go of left mouse button on having wanted size

###MOVING SHAPES
- On the left menu select the "Select" option
- For shapes other than "Line", select the shape by pressing the left mouse button down anywhere on the interior of desired shape
- For the "Line" shape, select the shape by pressing the left mouse button down on center square (control point)
- After selecting the shape, keep the left mouse button down and draw the shape to desired location
- Let go left mouse button after achieving desired location

###ALTERING SHAPES
- On the left menu select the "Select" option
- Every shape now has three squares (control points)
- To alter the size of the shape, left click the mouse button and hold one of the corner control points
- After obtaining desired alteration, release the left mouse button

###COPYING SHAPES
- On the left menu select the "Copy" option
- Left click on the shape you wish to copy
- Shape is now ready to be pasted

###PASTING SHAPES
- After following the steps from COPYING SHAPES, a shape is ready to be copied
- On the left menu select the "PASTE" option
- Left click anywhere on the canvas to paste the shape at that position

###ERASING SINGLE SHAPES
- On the left menu select the "Select" option
- Select a shape
- Left click on erase in the top menu

###CLEARING THE CANVAS
- Left click the "Clear Canvas" button in the left menu

##HOW IT WORKS
The application initially begins with an empty array of shapes. When the user creates a new shape by drawing it on the canvas,
that shape gets appended to the array of shapes. The shapes are then drawing in order of the array, and hence the shapes at the
end of the array get drawn last, and on top of all previous shapes. When select a shape, that shape's position in the array gets
moved to the last one, as a result the shape ends up being on the upmost layer. For moving the shape, the application tracks the
difference in coordiantes, and applies that changes to the x, y, xEnd, yEnd variables and then are re drawn. For copying, there is a global
variable that tracks the last copied shape, when the user is ready to paste the application makes calculations to find the size of the shape
and adjusts it's x, y, xEnd, yEnd variables accordingly.

##DESIGN DECISIONS:
- The line's colour depends on the outline colour and is not affected by the fill colour. It's width is controlled by outline width.
- A shape can be selected by pressing down on any of its control points. However, pressing down and dragging on a control point
triggers an action depending on the type of control point. The center control point triggers move while the other two control 
points trigger alteration of the shape.
- On selecting a shape in "Select" mode, the selected shape's colors and outline width are instantly displayed in the color pickers and the
outline width field. Likewise, changing any of the colors in the color pickers(on mouse down and move) is instantly reflected by the
selected shape. The shape's outline width is changed on clicking a value in the dropdown menu.
- The selected shape is retained even if you change the menu option on the left menu. 
- The "Select" and "Copy" mode share the selected shape. Changing the selected shape in either mode selects the shape and brings it to the 
front and the selection is reflected in both modes.
- If a shape is selected in "Select" mode and then "Copy" is clicked on the left menu, the shape is automatically copied to the clipboard.
- The shape copied to clipboard is retained even if you click on the canvas in "Select"/"Copy" mode. It is only changed if you select 
another shape.
- Once "Paste" is selected from the left menu, the clipboard shape can be pasted as many times as desired. 
- The "Copy"/"Paste" menus can be selected by using the keyboard shortcuts "Ctrl + c/v". (Firefox only)
