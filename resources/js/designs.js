/* jshint esversion: 6 */
// TODO: fix code to match styleguide, (ie:const should be all caps) research which functions and variables need to be in the ready function for best preformance

const PIXEL_CANVAS = $("#pixel-canvas"), //Cache common DOM lookups
  SIZE_PICKER = $("#size-picker"),
  COLOR_PICK = $("#color-picker"),
  HEIGHT = $("#input-height"),
  WIDTH = $("#input-width");

let mouseDown = false, // Tracks status of mouse button
  bgDefault = "#ffffff",
  color = COLOR_PICK.val(); //initialize input color values

function tool(){
  return $('input[name=tool]:radio:checked').val();
}

function colorChange(newColor) {
  color = newColor;
  $(".color-tile").css({ //change color on the customized picker button
    background: color
  });
}

function setGridHandler() { //function to set event listeners on the new grid
  const td = $("#pixel-canvas td");

  td.mouseover(function() { //color grid while dragging mouse
    if (mouseDown) {
      switch (tool()) {
        case "pen":
          $(this).css({
            background: color
          });
          break;
        case "eraser":
          $(this).css({
            background: bgDefault
          });
          break;
      }
    }
  });

  td.click(function() { //color while clicking a single cell
    switch (tool()) {
      case "pen":
        $(this).css({
          background: color
        });
        break;
      case "eraser":
        $(this).css({
          background: bgDefault
        });
        break;
      case "picker":
        colorChange($(this).css("backgroundColor"));
        break;
    }
  });
}

function makeGrid() {
  PIXEL_CANVAS.empty(); //removes all children from the table
  //storing the grid html in a document fragment to be pushed all at once instead of manipulating the dom in the loops
  let fragment = document.createDocumentFragment(),
    gridHeight = HEIGHT.val(),
    gridWidth = WIDTH.val();

  for (let i = 0; i < gridHeight; i++) {
    fragment.prepend(document.createElement('tr')); //prepend empty row to fragment
    let row = fragment.firstElementChild; //cache created row
    for (let j = 0; j < gridWidth; j++) {
      row.append(document.createElement('td')); //append cell to cached row
    }
  }
  PIXEL_CANVAS.append(fragment); //add the grid markup to the DOM
  setGridHandler(); //set the event listners on the grid
}

$(function() {
  makeGrid();
  // When size is submitted by the user, call makeGrid()
  SIZE_PICKER.submit(function(event) {
    event.preventDefault();
    makeGrid();
  });

  COLOR_PICK.change(function(event) { //changes color value when input is changed
    colorChange(COLOR_PICK.val());
  });

  // TODO: this works for now but when I add more features i may need to cahe the lookups or change white to transparent
  $("#clear-grid").click(function() {
    if (confirm("This will erase all your work!\nAre you sure you want to erase the canvas?")) {
      $('td').css({
        background: bgDefault
      });
    }
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