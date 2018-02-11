/* jshint esversion: 6 */
// TODO: Cleanup code, Fix comments, research if functions and variables need to be in the ready function or not for best preformance

const pixelCanvas = $("#pixel-canvas"), //Cache common DOM lookups
  sizePicker = $("#size-picker"),
  colorPicker = $("#color-picker"),
  inputHeight = $("#input-height"),
  inputWidth = $("#input-width");

let mouseDown = false, // Tracks status of mouse button
  color = colorPicker.val(),     //initialize input values
  gridHeight = inputHeight.val(),
  gridWidth = inputWidth.val();

function setGridHandler(){     //function to set event listeners on the new grid
  const td = $("#pixel-canvas td");
  td.mouseover(function() {   //color grid while dragging mouse
    if (mouseDown) {
      $(this).css({
        background: color
      });
    }
  });
  td.click(function() {   //color while clicking a single cell
    $(this).css({
      background: color
    });
  });
}

function makeGrid() {
  pixelCanvas.empty(); //removes all children from the table
  let htmlGrid = [];
  //storing the grid html in array to be pushed all at once instead of manipulating the dom in the loops
  for (let i = 0; i < gridHeight; i++) {
    htmlGrid.push("<tr>"); //add row to array
    for (let j = 0; j < gridWidth; j++) {
      htmlGrid.push("<td></td>"); //add cell
    }
    htmlGrid.push("</tr>"); //close row
  }
  pixelCanvas.append(htmlGrid); //add the grid markup to the DOM
  setGridHandler();
}

$(function() {
  makeGrid();
  // When size is submitted by the user, call makeGrid()
  sizePicker.submit(function(event) {
    event.preventDefault();
    gridHeight = inputHeight.val();
    gridWidth = inputWidth.val();
    makeGrid();
  });

  colorPicker.change(function(event) {  //changes color value when input is changed
    color = colorPicker.val();
  });

  // I had issues with dragging nonexistant things bugging out the mouseDown value. this code fixes that problem
  //by dissallowing dragging on the webpage
  $(document).on('dragstart', function(event) {
    event.preventDefault();
  });

  $(document).mousedown(function() {
      mouseDown = true; // When mouse goes down, set  to true
    })
    .on("mouseup", function() {
      mouseDown = false; // When mouse goes up, set  to false
    });

});