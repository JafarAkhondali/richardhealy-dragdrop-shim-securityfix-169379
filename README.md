#Drag and Drop across iFrames

Demo to show how drag and drop can work between frames whilst taking
into account scrolling and UI offests. This demo allows you to drag a
widget from the sidebar onto the page. You can drag above, below and
in the side of a widget. Also allow you to drag into empty spaces.

This works on the Safari for iOS, which stretches out all iframes, which 
can cause issues with offsetting the drag. This code works around 100% height
iframes.

Working demo: https://dragdrop-f418d.firebaseapp.com/


Using JavaScript ES5 and require.js to try and modularize some the 
the components. 