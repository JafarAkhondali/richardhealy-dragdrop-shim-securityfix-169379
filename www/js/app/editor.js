define([
	"jquery",
	"app/Site",
	"app/Control/SidebarControl",
	"app/Control/ProxyControl",
	"app/Control/ColumnDragControl",

], function($, Site, SidebarControl, ProxyControl, ColumnDragControl) {

	var Editor = {

		load: function (iframe) {

			var droppableArr = [],
				iframeWindow = iframe.contentWindow ? iframe.contentWindow : iframe.contentDocument.defaultView;

			// You have to frame, to play!
			if (typeof iframe !== 'object' || 
				iframe.nodeName !== "IFRAME"
			) {
				throw "Site IFRAME element required."
			}
			
			$dragHighlight = iframeWindow.$('#drop-highlight');
			widgetDragElId = '#move-drag',
			columnDragElId = '#column-drag-container',
			
			droppableArr = Site.load(iframe, widgetDragElId, columnDragElId);

			SidebarControl.load(iframe, droppableArr, $dragHighlight);
			ProxyControl.load(iframe, droppableArr, $dragHighlight);
			ColumnDragControl.load(iframe);

			$('#column-drag').on('mouseover', function (e) {
				e.preventDefault();
			});

			// Add button!
			$('#add-button').on('click', function () {
				$('body').toggleClass('show-sidebar');
			});
			
		}
	};

	return Editor;
});
