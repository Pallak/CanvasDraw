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
		$("."+menuName).show();
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
				$(this).removeClass("highlightTool");
			});
			item.addClass("highlightTool");
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
	/*******************************/
	
});