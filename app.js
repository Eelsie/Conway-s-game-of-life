'use strict'

// create a two dimensional gridArray of 0 (dead)

var gridArr = [];

function createArr(rows, columns) {
  for(var y = 0; y < rows; y++) {
    gridArr[y] = new Array();
    for(var x = 0; x < columns; x++) {
      gridArr[y][x] = 0;
    }
  }
  return gridArr;
}


// populate randomly the grid (1 is alive, 0 is dead)

function populateGrid(gridArr) {
  for(var y = 0, colLen = gridArr.length; y < colLen; y++) {
    for(var i = 0, rowLen = gridArr[0].length; i < rowLen; i++) {
        gridArr[y][i] = Math.round(Math.random() < 0.1);
    }
  }
}


// append the grid to the DOM (using fragment to bypass recalculating, painting and layout for every element, as explained here: https://coderwall.com/p/o9ws2g/why-you-should-always-append-dom-elements-using-documentfragments)

function createGrid(gridArr) {

  var el;
  var br;
  var fragment = document.createDocumentFragment();

  for(var y = 0, colLen = gridArr.length; y < colLen; y++) {
    for(var i = 0, rowLen = gridArr[0].length; i < rowLen; i++) {
        el = document.createElement('span');
        if (gridArr[y][i] === 1) {
          el.className = 'alive';
        }
        if (el.className === 'alive') {
          gridArr[y][i] = 1;
        }
        fragment.appendChild(el);
    }
    br = document.createElement('br');
    fragment.appendChild(br);
  }
  document.querySelector('.grid').appendChild(fragment);
}


// calculate next step

function updateArray(gridArr) {
  for(var y = 1, colLen = gridArr.length - 1; y < colLen; y++) {
    for(var i = 1, rowLen = gridArr[0].length - 1; i < rowLen; i++) {
      var sum = gridArr[y-1][i-1] + gridArr[y-1][i] + gridArr[y-1][i+1] + gridArr[y][i-1] + gridArr[y][i+1] + gridArr[y+1][i-1] + gridArr[y+1][i] + gridArr[y+1][i+1];
      if(sum < 2) {
        gridArr[y][i] = 0;
      } else if(sum === 3) {
        gridArr[y][i] = 1;
      } else if(sum > 3) {
        gridArr[y][i] = 0;
      }
    }
  }
}


// start the animation (setInterval)

var life;

function animateGrid(gridArr) {
  console.log(gridArr);
  var generations = 0;
  life = setInterval(function(){
    updateArray(gridArr);
    var grid = document.querySelector('.grid');
    while (grid.hasChildNodes()) {
      grid.removeChild(grid.lastChild);
    }
    createGrid(gridArr);
    generations = generations + 1;
    document.getElementById('generations').innerText = generations;
  }, 200);
}


// Reset the grid

function resetArr(gridArr) {
  clearInterval(life);
  document.getElementById('generations').innerText = 0;
  for(var y = 0, colLen = gridArr.length; y < colLen; y++) {
    for(var i = 0, rowLen = gridArr[0].length; i < rowLen; i++) {
        gridArr[y][i] = 0;
    }
  }
  var grid = document.querySelector('.grid');
  while (grid.hasChildNodes()) {
    grid.removeChild(grid.lastChild);
  }
}

// randomize again the grid

function randomizeGrid(gridArr) {
  resetArr(gridArr);
  populateGrid(gridArr);
  createGrid(gridArr);
}

// start game

function startGame(rows, columns) {
  createArr(rows, columns);
  populateGrid(gridArr);
  createGrid(gridArr);
  animateGrid(gridArr);
}


// buttons events

document.getElementById('run').addEventListener("click", function() {clearInterval(life); animateGrid(gridArr)}, false);
document.getElementById('stop').addEventListener("click", function() {clearInterval(life)}, false);
document.getElementById('reset').addEventListener("click", function() {resetArr(gridArr); createGrid(gridArr);}, false);
document.getElementById('randomize').addEventListener("click", function() {randomizeGrid(gridArr)}, false);


// populate on click

// using event delegation, as here http://jsfiddle.net/ArNJA/

window.onload = startGame(50,70);

window.onload = function() {
  document.querySelector('.grid').onclick = function(e){
    var e = e || window.event;
    var target = e.target || e.srcElement;
    if(target.tagName.toLowerCase() ==  "span") {
        target.className = 'alive';
    }
  };
};
