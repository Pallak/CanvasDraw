$(document).ready(function(){

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
	/*******************************/

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
});