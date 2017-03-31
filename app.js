'use strict'

// create a two dimensional array of 0 (dead)

var gridArr = [];

function createArr(rows, columns) {
  for(var y = 0; y < rows; y++) {
    gridArr[y] = new Array();
    for(var x = 0; x < columns; x++) {
      gridArr[y][x] = 0;
    }
  }
}


// populate randomly the grid (1 is alive, 0 is dead)

function populateGrid(arr) {
  for(var y = 0, colLen = arr.length; y < colLen; y++) {
    for(var i = 0, rowLen = arr[0].length; i < rowLen; i++) {
        arr[y][i] = Math.round(Math.random() < 0.2);
    }
  }
}


// append the grid to the DOM (using fragment to bypass recalculating, painting and layout for every element, as explained here: https://coderwall.com/p/o9ws2g/why-you-should-always-append-dom-elements-using-documentfragments)

function createGrid(arr) {

  var el;
  var br;
  var fragment = document.createDocumentFragment();

  for(var y = 0, colLen = arr.length; y < colLen; y++) {
    for(var i = 0, rowLen = arr[0].length; i < rowLen; i++) {
        el = document.createElement('span');
        if (arr[y][i] === 1) {
          el.className = 'alive';
        }
        fragment.appendChild(el);
    }
    br = document.createElement('br');
    fragment.appendChild(br);
  }
  document.querySelector('.grid').appendChild(fragment);
}


// calculate next step

function updateArray(arr) {
  for(var y = 1, colLen = arr.length - 1; y < colLen; y++) {
    for(var i = 1, rowLen = arr[0].length - 1; i < rowLen; i++) {
      var sum = arr[y-1][i-1] + arr[y-1][i] + arr[y-1][i+1] + arr[y][i-1] + arr[y][i+1] + arr[y+1][i-1] + arr[y+1][i] + arr[y+1][i+1];
      if(sum < 2) {
        arr[y][i] = 0;
      } else if(sum === 3) {
        arr[y][i] = 1;
      } else if(sum > 3) {
        arr[y][i] = 0;
      }
    }
  }
}


// start the animation (setInterval)

var life;

function animateGrid(arr) {
  var generations = 0;
  life = setInterval(function(){
    updateArray(arr);
    var grid = document.querySelector('.grid');
    while (grid.hasChildNodes()) {
      grid.removeChild(grid.lastChild);
    }
    createGrid(arr);
    generations = generations + 1;
    document.getElementById('generations').innerText = generations;
  }, 200);
}


// Reset the grid

function resetArr(arr) {
  clearInterval(life);
  document.getElementById('generations').innerText = 0;
  for(var y = 0, colLen = arr.length; y < colLen; y++) {
    for(var i = 0, rowLen = arr[0].length; i < rowLen; i++) {
        arr[y][i] = 0;
    }
  }
  var grid = document.querySelector('.grid');
  while (grid.hasChildNodes()) {
    grid.removeChild(grid.lastChild);
  }
}

// randomize again the grid

function randomizeGrid(arr) {
  resetArr(arr);
  populateGrid(arr);
  createGrid(arr);
}


createArr(40,60);

populateGrid(gridArr);

createGrid(gridArr);


// buttons events

document.getElementById('run').addEventListener("click", function() {  clearInterval(life); animateGrid(gridArr)}, false);
document.getElementById('stop').addEventListener("click", function() {clearInterval(life)}, false);
document.getElementById('reset').addEventListener("click", function() {resetArr(gridArr); createGrid(gridArr);}, false);
document.getElementById('randomize').addEventListener("click", function() {randomizeGrid(gridArr)}, false);
