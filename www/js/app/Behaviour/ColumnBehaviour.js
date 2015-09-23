define([
	"jquery",
	"app/Behaviour/DropBehaviour"
], function($, Drop ) {
	function isiOSSafari() {
        return (navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) && /iPad|iPhone|iPod/.test(navigator.platform)) ? true : false;
	}
	var ColumnBehaviour = {
		load: function (el, iframe) {

			var $dropEl = this.createDropEl(),
				timeout = null,
				self = this;

			$el = $(el);			

			$el.append($dropEl);

			this.resizeDropEl(el, $dropEl);
			// Column Drag handle... coming soon!
			this.setUpResizeHandle(el, iframe);

			// Set up window resizing
			$(window).on('resize', function () {
				clearTimeout(timeout);
				timeout = setTimeout(function () {
					self.resizeDropEl(el, $dropEl);
					timeout = null;
				}, 10);
			});

			return Drop.load( $dropEl[0], iframe);
		},

		setUpResizeHandle: function (el, iframe) {
			var self = this,
				$el = $(el),
				side = (parseInt($el.attr('data-order'),10) === 1) ? 'right' : 'left',
				outTimeout = null;

			$el.on('mouseover', function () {
				self.showResizeIndicator(el, iframe, side);
			});
		},

		showResizeIndicator: function (el, iframe, side) {
			var $el = $(el),
				$columnDragContainer = $('#column-drag-container'),
				$columnDrag = $('#column-drag'),
				iframeBoundaries = iframe.getBoundingClientRect(),
				frameWindow = iframe.contentWindow ? iframe.contentWindow : iframe.contentDocument.defaultView,
				scrollWin = isiOSSafari() ? window : frameWindow,
				elementOffset = {},
				frameOffset = {},
				positionX = 0,
				positionY = 0,
				pushOutXFactor = 80, // This exists because we do not want the boundary to go right up to the edge. Column width 0 is not an option
				reduceXFactor = 80, // Same for the above right side of the boundary
				width = (side === 'right' ? parseInt($el.outerWidth(),10) : 0),
				columnDragWidth = parseInt($columnDrag.width(),10),
				halfDragWidth = (side === 'right' ? (parseInt(columnDragWidth/2,10)) : -(parseInt(columnDragWidth/2,10))),
				$selectedSiblingColumnEl = null,
				selectedColumnOffset = null,
				selectedSiblingColumnOffset = null,
				boundaryReferenceWidth = null,
				columnsGridSize = 0,
				leftColumnGridSize = null, // Used to calculate initial handle position (worked out via left side)
				initialHandlePosition = '',
				remainder = 0;

			// Remove all selected classes
			frameWindow.$('.column').removeClass('selected selected-sibling');
			// Place a selected event on the column $el
			$el.addClass('selected');
			// Set the column sibling
			$selectedSiblingColumnEl = (side === 'right' ? $el.next() : $el.prev());
			$selectedSiblingColumnEl.addClass('selected-sibling');

			// What is the halfway position for the handle? Both column sizes added / 2
			columnsGridSize = parseInt($selectedSiblingColumnEl.attr('data-size'),10) + parseInt($el.attr('data-size'), 10);

			// Get the left column size 
			leftColumnGridSize = (side === 'right' ? parseInt($el.attr('data-size'), 10) : parseInt($selectedSiblingColumnEl.attr('data-size'), 10)),

			selectedColumnOffset = $el.offset();
			selectedSiblingColumnOffset = $selectedSiblingColumnEl.offset();

			// These positionX / positionY calculations are 
			// explained in WidgetMoveBehaviour load function. 
			frameOffset.top = iframeBoundaries.top;
			frameOffset.left = iframeBoundaries.left;
			frameOffset.scrollX = (isiOSSafari() ? scrollWin.pageXOffset : -(scrollWin.pageXOffset));
			frameOffset.scrollY = (isiOSSafari() ? scrollWin.pageYOffset : -(scrollWin.pageYOffset));
			elementOffset = $el.offset();

			positionX = (side === 'right' ? selectedColumnOffset.left : selectedSiblingColumnOffset.left) + frameOffset.left + frameOffset.scrollX + pushOutXFactor;
			positionY = elementOffset.top + frameOffset.top + frameOffset.scrollY;

			if (selectedColumnOffset.left > selectedSiblingColumnOffset.left) {
				boundaryReferenceWidth =  selectedColumnOffset.left - selectedSiblingColumnOffset.left + $el.outerWidth() - reduceXFactor;
			} else {

				boundaryReferenceWidth = selectedSiblingColumnOffset.left - selectedColumnOffset.left + $selectedSiblingColumnEl.outerWidth() - reduceXFactor;
			}

			// Round up to multiples of 80 (sometimes width is just off!);
			remainder = boundaryReferenceWidth % 80;
			if(remainder !== 0) {
				boundaryReferenceWidth = this.roundTo(boundaryReferenceWidth, 80);
				positionX = this.roundTo(positionX, 80);
			}

			// This element lives in the Editor HTML
			$columnDragContainer.css({
				'display':'block',
				'height':'1px',
				'width':boundaryReferenceWidth + 'px',
				'top': positionY + 'px',
				'left': positionX + 'px'
 			});

 			// We need to position the handle where the 
			// gap between the the columns are. As we've 
			// reduced the boundary width by 80 (1 columns),
			// we have to take 2 columns off the columnGridSize
			// and reduce the leftColumnGrid size by 1.
			initialHandlePosition = ((boundaryReferenceWidth / (columnsGridSize-1)) * (leftColumnGridSize-1));

			// Round up to multiples of 80 preventing a full range of motion
			remainder = initialHandlePosition % 80;
			if(remainder !== 0) {
				initialHandlePosition = this.roundTo(initialHandlePosition, 80);
			}

			$columnDragContainer.find('.column-drag').css({
				'left': initialHandlePosition + 'px',
				'top': ''
			});
		},

		createDropEl: function () {
			var $dropEl = $('<div></div>')
				.addClass('column-drop')
				.css('position', 'absolute')
				.css('bottom', '0');

			return $dropEl;
		},

		resizeDropEl: function (el, $dropEl) {
			var $el = $(el);

			$dropEl.css('left', $el.position().left + 'px');
			$dropEl.css('width', $el.outerWidth() + 'px');

			if ($el.find('.droppable').length === 0) {
				// Set the height to the columns parent
				$dropEl.css('height', $el.parent().height() + 'px');
			} else {
				// Offset of the last child element + it's height - the offset of the column
				$dropEl.css('height', ($el.parent().innerHeight() - ($el.find('.droppable').last().position().top + $el.find('.droppable').last().outerHeight(true)))  + 'px');
			}
		},

		roundTo: function (num,round) {
			var resto = num % round;
		    
		    if (resto <= (round / 2)) { 
		        return num - resto;
		    } else {
		        return num + round - resto;
		    }
		}

	};

	return ColumnBehaviour;
		
});