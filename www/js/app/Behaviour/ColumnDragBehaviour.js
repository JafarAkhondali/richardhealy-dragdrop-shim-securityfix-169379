define([
	"jquery",
	"classie",
	"draggabilly"
], function($, classie, Draggabilly) {
	var ColumnDragBehaviour = {
		// containment = document.body
		load: function (element, iframe) {
			var self = this,
				
				// Organise the iframe document
				iframeWindow = iframe.contentWindow ? iframe.contentWindow : iframe.contentDocument.defaultView,
				// ...and the body
				iframeBody = $(iframeWindow.document.body)[0],
				droppableArr = [];

			this.drag = new Draggabilly( element, {
				axis: 'x',
				grid:[80,0],
				containment:'#column-drag-container'
			});

			// The full columns width (all columns)
			this.previousPosition = 0;
			this.$selectedColumn = null;
			this.$selectedColumnSibling = null;
			this.$leftColumn = null;
			this.$rightColumn = null;
			this.previousGridPosition = 0;
			this.previousPositionX = 0;

			this.drag.on( 'dragStart', function (drag, event, pointer) {self.onStart(iframe, pointer);}  );
			this.drag.on( 'dragMove', function (drag, event, pointer) {self.onDrag(iframe, pointer);} );
			this.drag.on( 'dragEnd', function (drag, event, pointer) {self.onEnd(iframe, pointer);} );

			return this.drag;
		},
		onStart : function (iframe, pointer) {

			var iframeWindow = iframe.contentWindow ? iframe.contentWindow : iframe.contentDocument.defaultView,
				// ...and the body
				iframeBody = $(iframeWindow.document.body)[0];

			this.$selectedColumn = iframeWindow.$('.column.selected');
			this.$selectedColumnSibling = iframeWindow.$('.column.selected-sibling');

			// Work out which column is on the left, and which is on the right
			if (this.$selectedColumn.attr('data-order') > this.$selectedColumnSibling.attr('data-order')) {
				this.$leftColumn = this.$selectedColumnSibling;
				this.$rightColumn = this.$selectedColumn;
			} else {
				this.$leftColumn = this.$selectedColumn;
				this.$rightColumn = this.$selectedColumnSibling;
			}

			this.previousPositionX = pointer.x;

			// The iframe always interferes with the drag event;
			// giving it a really bad drag experience where the 
			// proxy gets stuck on the iframe. This reduces the 
			// z-index of the iframe (and the elements behind it
			// so the iframe doesn't disappear!) so that the iframe
			// stops picking up the move events on drag
			$(iframe).css('z-index', '-1');

			// Set the 
			classie.add( iframeBody, 'drag-active' );
			classie.add( document.body, 'drag-active' );
			classie.add( document.body, 'column-drag-active' );
			
		},
		onDrag: function (iframe, pointer) {
			var sizeClasses = 's1 s2 s3 s4 s5 s6 s7 s8 s9 s10 s11 s12',
				leftColumnSize = null
				rightColumnSize = null,
				difference = 0;

			// Only move on grid snaps
			if(this.previousGridPosition !== this.drag.dragPoint.x) {
				
				difference = parseInt(Math.abs(this.previousGridPosition - this.drag.dragPoint.x)/80, 10);

				this.$selectedColumn.removeClass(sizeClasses);
				this.$selectedColumnSibling.removeClass(sizeClasses);

				// Change the column classes
				if (this.previousPositionX < pointer.x) {
					
					leftColumnSize = Math.min(parseInt(this.$leftColumn.attr('data-size'), 10) + difference, 12);
					rightColumnSize = Math.max(parseInt(this.$rightColumn.attr('data-size'), 10) - difference, 1);

				} else if (this.previousPositionX >	pointer.x) {

					leftColumnSize = Math.max(parseInt(this.$leftColumn.attr('data-size'), 10) - difference, 1);
					rightColumnSize = Math.min(parseInt(this.$rightColumn.attr('data-size'), 10) + difference, 12);
				}

				this.$leftColumn.addClass('s' + leftColumnSize);
				this.$rightColumn.addClass('s' + rightColumnSize);
				this.$leftColumn.attr('data-size', leftColumnSize);
				this.$rightColumn.attr('data-size', rightColumnSize);

				this.previousGridPosition = this.drag.dragPoint.x;
				this.previousPositionX = pointer.x;
			}
		},
		onEnd : function (iframe) {

			var iframeWindow = iframe.contentWindow ? iframe.contentWindow : iframe.contentDocument.defaultView,
				// ...and the body
				iframeBody = $(iframeWindow.document.body)[0];

			this.previousPosition = 0;
			this.$selectedColumn = null;
			this.$selectedColumnSibling = null;
			this.$leftColumn = null;
			this.$rightColumn = null;
			this.previousGridPosition = 0;
			this.previousPositionX = 0;

			// The iframe always interferes with the drag event;
			// giving it a really bad drag experience where the 
			// proxy gets stuck on the iframe. This brings the 
			// iframe back to life after the drag.
			$("#editor-frame").css('z-index', '0');

			classie.remove( iframeBody, 'drag-active' );
			classie.remove( document.body, 'drag-active' );
			classie.remove( document.body, 'column-drag-active' );
		}
	};

	return ColumnDragBehaviour;
		
});