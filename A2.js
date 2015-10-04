//

$(document).ready(function () {
// block size`
var blockSize = 10;
// Grid on/off
var grid = true;
// get some info about the canvas
var canvas = document.getElementById('c');
var context = canvas.getContext('2d');
// how many cells fit on the canvas
var w = Math.floor((canvas.width / blockSize));
var h = Math.floor((canvas.height / blockSize));
// Creating states enum
var status = {
    alive: 1,
    dead: 0,
    killed: 2
};
// Neighbor radius / loneliness threshold / overpopulation / generation threshold
var radius = 1;
var loneliness = 2;
var overpopulation = 3;
var genMin = 3;
var genMax = 3;

// create empty state array
var state = new Array(h);
for (var y = 0; y < h; ++y) {
    state[y] = new Array(w);
} 

// Initialize array
for (var i = 0; i < state.length; i++) {
    for (var j = 0; j < state[i].length; j++) {
        fill('#c0c0c0', i, j);
        state[j][i] = status.dead;
    }
}


var drawGrid = function() {   
    // draw vertical lines
    for (var x = 0; x <= canvas.width; x += blockSize) {
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
    }

    // draw horizontal lines
    for (var y = 0; y <= canvas.height; y += blockSize) {
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
    }

    context.strokeStyle = "black";
    // Scaling for retina displays
    // context.scale(2,2);
    context.stroke();
}

drawGrid();

// click event, using jQuery for cross-browser convenience
$(canvas).click(function(e) {

    // get mouse click position
    var mx = e.offsetX;
    var my = e.offsetY;

    // calculate grid square numbers
    var gx = Math.floor((mx / blockSize));
    var gy = Math.floor((my / blockSize));
    
    // make sure we're in bounds
    if (gx < 0 || gx >= w || gy < 0 || gy >= h) {
        return;
    }

    if (state[gy][gx]) {
        // if pressed before, flash red
        fill('red', gx, gy);
        setTimeout(function() {
            fill('black', gx, gy)
        }, 1000);
    } else {
        state[gy][gx] = status.alive;
        fill('black', gx, gy);
    }
});

$("#setHW").click(function(e) {
    e.preventDefault();
    // reset grid
    context.clearRect(0, 0, canvas.width, canvas.height);

    // recolor states
    drawStates();

    canvas.height = $("#height").val()*10;
    canvas.width = $("#width").val()*10;

    // how many cells fit on the canvas
    w = Math.floor((canvas.width / blockSize));
    h = Math.floor((canvas.height / blockSize));

    // Create new array for new w and h
    for (var y = 0; y < h; ++y) {
        state[y] = new Array(w);
    }

    // blockSize = canvas.height / $("#height").val();
    if (grid) {
        drawGrid();
    }
});

$("#gridIO").click(function(e) {
    e.preventDefault();
    if (grid) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawStates();
        grid = false;
    }
    else {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        drawStates();
        grid = true;
    }
});

$("#start").click(function(e){
    startGame();
    $("#next").prop('disabled', true);
});

$("#stop").click(function(e){
    $("#next").prop('disabled', false);
});

$("#next").click(function(e){
    console.log("Height" + state.length);
    for (var i = 0; i < state.length; i++) {
        for (var j = 0; j < state[i].length; j++) {
            determineFate(i,j);
        }
    };
});

// Fill in state colors
function fill(s, gx, gy) {
    context.fillStyle = s;
    context.fillRect(gx * blockSize, gy * blockSize, blockSize, blockSize);
}

var startGame = function() {
    for (var i = 0; i < state.length; i++) {
        for (var j = 0; j < state[i].length; j++) {
            console.log(state[i][j]);
        }
    }
}

var drawStates = function() {
    for (var i = 0; i < state.length; i++) {
        for (var j = 0; j < state[i].length; j++) {
            if (state[j][i] == status.alive) {
                fill('black', i, j);
            }
            if (state[j][i] == status.killed) {
                fill('red', i, j);
            }
            if (state[j][i] == status.dead) {
                fill('#c0c0c0', i, j);
            }
        }
    }
}

var determineFate = function(x, y) {
    var count = 0;
    var yCorner = y - radius;
    var xCorner = x - radius;
    var length = (2*radius)+1;

    // console.log(xCorner);
    // console.log(yCorner);

    for (var i = 0; i < length; i++) {
        for (var j = 0; j < length; j++) {

            // Don't check Corner Cases: <0 or >height
            if (((yCorner+i) >= 0) && ((xCorner+j) >= 0) && ((yCorner+i) < state.length) && ((xCorner+j) < state[i].length)) {
                // console.log("y: " + (yCorner+i) + " x: " + (xCorner+j));
                // console.log(yCorner+i);
                // console.log(xCorner+j);
                if (state[yCorner+i][xCorner+j] == status.alive) {
                    count++;
                    console.log("count: " + count);
                }
            }
        }
    }

    if (state[y][x] == status.alive) {
        // account for the state in the center
        count--;

        if (count < loneliness) {
            state[y][x] = status.killed;
            fill('red', x, y);
        }
        // Equallibrium hard coded???
        else if (count > 1 && count < 4) {
            state[y][x] = status.alive;
            fill('black', x, y);
        }
        else if (count > overpopulation) {
            state[y][x] = status.killed;
            fill('red', x, y);
        }
    }
    // Generation
    else {
        if (count > 2) {
            state[y][x] = status.alive;
            fill('black', x, y);
        }
    }    
}

});