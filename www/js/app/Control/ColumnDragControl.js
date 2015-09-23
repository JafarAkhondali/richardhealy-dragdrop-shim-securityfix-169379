define([
	"jquery",
	"drag",
	"app/Behaviour/ColumnDragBehaviour",
], function($, Draggable, ColumnDrag) {
	
	var ColumnDragControl = {

		load: function (iframe) {

			var drag = null;

	    	$('.column-drag').each(function () {
				drag = ColumnDrag.load(this, iframe);
			});
	    	console.log(drag);
		}
	};

	return ColumnDragControl;
});