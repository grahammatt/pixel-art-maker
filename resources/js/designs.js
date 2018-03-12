/* jshint esversion: 6 */
// TODO: fix code to match styleguide

const PIXEL_CANVAS = $("#pixel-canvas"), //Cache common DOM lookups
  SIZE_PICKER = $("#size-picker"),
  COLOR_PICK = $("#color-picker"),
  PEN = $("#pen"),
  GRID_ON = $("#on");

let mouseDown = false, // Tracks status of mouse button
  bgDefault = "#ffffff", //cached bg color here in case I decide to implement transparancy leter
  color = COLOR_PICK.val(); //initialize input color values

function getTool() {
  //functon to get the current tool selected
  return $('input[name=tool]:radio:checked').val();
}

function colorChange(newColor) {
  color = newColor; //change global variable
  $(".color-tile").css({ //change color on the customized picker button
    background: color
  });
}

function setGridHandler() { //function to set event listeners on the new grid
  const td = $("#pixel-canvas td");
  //switches used to determine which operation to do based on the current tool

  PIXEL_CANVAS.on('touchmove', function(event) { //Touch controls!!
    let touch = event.touches[0]; //get position touched
    let element = document.elementFromPoint(touch.clientX, touch.clientY);//get element at position
    if (element.tagName === "TD") {  //we only want to modify table cells
      switch (getTool()) {
        case "pen":
          $(element).css({
            background: color
          });
          break;
        case "eraser":
          $(element).css({
            background: bgDefault
          });
          break;
      }
    }
    preventDefault();

  });
  td.on('mouseover', function() { //operate on grid while dragging mouse
    if (mouseDown) {
      switch (getTool()) {
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

  td.on('mousedown', function(e) { //operate on grid while clicking a single cell
    switch (getTool()) {
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
    gridHeight = $("#input-height").val(),
    gridWidth = $("#input-width").val();
  try {
    for (let i = 0; i < gridHeight; i++) {
      // TODO: PREPEND FAILS TO EXECUTE IN EDGE AND IE
      fragment.prepend(document.createElement("tr")); //prepend empty row to fragment
      let row = fragment.firstElementChild; //cache created row
      for (let j = 0; j < gridWidth; j++) {
        row.append(document.createElement("td")); //append cell to cached row
      }
    }
    PIXEL_CANVAS.append(fragment); //add the grid markup to the DOM
  } catch (e) {
    //fix for microsoft edge not fully supporting document fragments
    //this is a slower method but works perfectly
    let htmlGrid = [];
    //storing the grid html in array to be pushed all at once

    for (let i = 0; i < gridHeight; i++) {
      htmlGrid.push("<tr>"); //add row to array
      for (let j = 0; j < gridWidth; j++) {
        htmlGrid.push("<td></td>"); //add cell
      }
      htmlGrid.push("</tr>"); //close row
    }
    PIXEL_CANVAS.append(htmlGrid); //add the grid markup to the DOM
  } finally {

    setGridHandler(); //set the event listners on the grid
    GRID_ON.prop("checked", true); //turn grid lines on
  }

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
    PEN.prop("checked", true);
    //sets the active tool back to pen after the color picker is used
  });

  $("#clear-grid").click(function() {
    //sets a grid clearing function to be called when the button is pressed
    if (confirm("This will erase all your work!\nAre you sure you want to erase the canvas?")) {
      $("td").css({
        background: bgDefault
      });
    }
  });

  $("input[name='lines']").click(function() {
    //this listens for ghanges to the grid line option
    //the values of each radio input were set to falsy and trusy to make this work nicely
    if ($("input[name=lines]:radio:checked").val()) {
      $("td").css({
        border: "1px solid #808080"
      });
    } else {
      $("td").css({
        border: 0
      });
    }

  });

  $(document).on("dragstart", function(event) {
      // I had issues with dragging nonexistant things bugging out the mouseDown value. this code fixes that problem
      // by dissallowing dragging on the webpage, If I need dragging enabled in the future I'll fix it another way.
      //preventDefault caused other unexpected issues and this doesn't
      event.preventDefault();
    })
    .on('mousedown', function() {
      //sets to true when mouse is held down
      mouseDown = true;
    })
    .on('mouseup', function() {
      //sets to false when mouse is released
      mouseDown = false;
    });
});