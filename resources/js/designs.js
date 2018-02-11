/* jshint esversion: 6 */
// Select color input
// Select size input

// When size is submitted by the user, call makeGrid()

const pixelCanvas = $("#pixel-canvas");
let htmlGrid = [];


function makeGrid() {
  pixelCanvas.empty();
  let gridHeight = $("#input-height").val();
  let gridWidth = $("#input-width").val();
  let htmlGrid = [];
  for (var i = 0; i < gridHeight; i++) {
    htmlGrid.push("<tr>");
    for (var j = 0; j < gridWidth; j++) {
      htmlGrid.push("<td></td>");
    }
    htmlGrid.push("</tr>");
  }
  pixelCanvas.append(htmlGrid);
  // Your code goes here!

}
$("#size-picker").submit(function(event){
  event.preventDefault();
  makeGrid();
});

$(function() {
  makeGrid();
});
