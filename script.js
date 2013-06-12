$(document).ready(function(){

	/*******************************
	Highlighting toolbar items
	*******************************/
	function selectItem (item) {
		$(".toolbar li").each(function() {
			$(this).removeClass("highlightTool");
		});
		item.addClass("highlightTool");
	}

	selectItem($(".toolbar li").first());

	$(".toolbar li").click(function(){
		selectItem($(this));
	});
	/*******************************/
	
});