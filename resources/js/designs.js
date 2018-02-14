/* jshint esversion: 6 */
// TODO: fix code to match styleguide, (ie:const should be all caps) research which functions and variables need to be in the ready function for best preformance

const pixelCanvas = $("#pixel-canvas"), //Cache common DOM lookups
  sizePicker = $("#size-picker"),
  colorPicker = $("#color-picker"),
  inputHeight = $("#input-height"),
  inputWidth = $("#input-width");

let mouseDown = false, // Tracks status of mouse button
  color = colorPicker.val(); //initialize input color values

function setGridHandler() { //function to set event listeners on the new grid
  const td = $("#pixel-canvas td");
  td.mouseover(function() { //color grid while dragging mouse
    if (mouseDown) {
      $(this).css({
        background: color
      });
    }
  });
  td.click(function() { //color while clicking a single cell
    $(this).css({
      background: color
    });
  });
}

function makeGrid() {
  pixelCanvas.empty(); //removes all children from the table
  //storing the grid html in a document fragment to be pushed all at once instead of manipulating the dom in the loops
  let fragment = document.createDocumentFragment(),
    gridHeight = inputHeight.val(),
    gridWidth = inputWidth.val();

  for (let i = 0; i < gridHeight; i++) {
    fragment.prepend(document.createElement('tr')); //prepend empty row to fragment
    let row = fragment.firstElementChild;  //cache created row
    for (let j = 0; j < gridWidth; j++) {
      row.append(document.createElement('td')); //append cell to cached row
    }
  }
  pixelCanvas.append(fragment); //add the grid markup to the DOM
  setGridHandler(); //set the event listners on the grid
}

$(function() {
  makeGrid();
  // When size is submitted by the user, call makeGrid()
  sizePicker.submit(function(event) {
    event.preventDefault();
    makeGrid();
  });

  colorPicker.change(function(event) { //changes color value when input is changed
    color = colorPicker.val();
    $(".color-tile").css({ //change color on the customized picker button
      background: color
    });
  });

  $(document).on('dragstart', function(event) {
      // I had issues with dragging nonexistant things bugging out the mouseDown value. this code fixes that problem
      // by dissallowing dragging on the webpage, If I need dragging enabled in the future I'll fix it another way.
      event.preventDefault();
    })
    .mousedown(function() {
      //sets to true when mouse is held down
      mouseDown = true;
    })
    .on("mouseup", function() {
      //sets to false when mouse is released
      mouseDown = false;
    });

});