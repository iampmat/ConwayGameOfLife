// change colors
//

$(document).ready(function () {
// block size`
var blockSize = 10;
// Grid on/off
// var grid = true;
// get some info about the canvas
var canvas = document.getElementById('c');
var context = canvas.getContext('2d');
// var used to turn off interval
var time;
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

// Set stop to disabled until start
$("#stop").prop('disabled', true);

// create empty state array and empty count array
var state;
var countArr;

var createArrays = function() {
    // create empty state array and empty count array
    state = [];
    countArr = [];

    console.log(h);

    state = new Array(h);
    countArr = new Array(h);
    for (var y = 0; y < h; ++y) {
        state[y] = new Array(w);
        countArr[y] = new Array(w);
    } 
}

createArrays();

// Initialize arrays
var initializeArrays = function() {
    for (var i = 0; i < state.length; i++) {
        for (var j = 0; j < state[i].length; j++) {
            fill('#c0c0c0', i, j);
            state[i][j] = status.dead;
            countArr[i][j] = 0;
        }
    }
}

initializeArrays();

var drawGrid = function() {  
    console.log(blockSize);
    context.beginPath();
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
$(canvas).click(function(event) {

    if ( event.offsetX == null ) { // Firefox
        mx = event.originalEvent.layerX;
        my = event.originalEvent.layerY;
    } else {                       // Other browsers
        mx = event.offsetX;
        my = event.offsetY;
    }

    // get mouse click position
    // var mx = e.offsetX||e.layerX;
    // var my = e.offsetY||e.layerY;

    console.log(mx);
    console.log(my);

    // calculate grid square numbers
    var gx = Math.floor((mx / blockSize));
    var gy = Math.floor((my / blockSize));
    
    // make sure we're in bounds
    if (gx < 0 || gx >= w || gy < 0 || gy >= h) {
        return;
    }
    if (event.altKey) {
        state[gy][gx] = status.dead;
        fill('#c0c0c0', gx, gy);
    }
    // Force cell to be alive if shift+click
    else if (event.shiftKey) {
        state[gy][gx] = status.alive;
        fill('#FED100', gx, gy);
    }
    else if (state[gy][gx] == status.dead) {
        state[gy][gx] = status.alive;
        fill('#FED100', gx, gy);
    } 
    else if (state[gy][gx] == status.alive) {
        state[gy][gx] = status.killed;
        fill('#999999', gx, gy);
    }
    else {
        state[gy][gx] = status.dead;
        fill('#c0c0c0', gx, gy);
    }

    drawGrid();
});

$("#setHW").click(function(e) {
    e.preventDefault();
    // reset grid
    context.clearRect(0, 0, canvas.width, canvas.height);

    // canvas.height = $("#height").val()*10;
    // canvas.width = $("#width").val()*10;

    blockSize = canvas.height/$("#height").val();

    // how many cells fit on the canvas
    w = Math.floor((canvas.width / blockSize));
    h = Math.floor((canvas.height / blockSize));

    // Set the params
    radius = $("#radius").val();
    loneliness = $("#lonely").val();
    overpopulation = $("#overpop").val();
    genMin = $("#gmin").val();
    genMax = $("#gmax").val();

    // Create new array for new w and h
    createArrays();

    resetBoard();

});

// Turns grid on or off
// $("#gridIO").click(function(e) {
//     e.preventDefault();
//     if (grid) {
//         context.clearRect(0, 0, canvas.width, canvas.height);
//         drawStates();
//         grid = false;
//     }
//     else {
//         context.clearRect(0, 0, canvas.width, canvas.height);
//         drawGrid();
//         drawStates();
//         grid = true;
//     }
// });

// Adjust the speed
$( "#slider" ).slider({
    min: 1,
    max: 1000,
    step: 1,
    change: function( event, ui ) {
        time = Math.abs(ui.value-1000);
    }
});

$("#slider").slider('value', 500);

$("#reset").click(function(e){
    resetBoard();
});

$("#random").click(function(e){
    resetBoard();
    for (var i = 0; i < state.length; i++) {
        for (var j = 0; j < state[i].length; j++) {
            // Random int between 0 or 1
            var ranInt = Math.floor(Math.random() * (2 - 0)) + 0;
            if (ranInt == 0) {
                state[i][j] = status.dead;
                countArr[i][j] = 0;
            }
            else {
                fill('#FED100', i, j);
                state[i][j] = status.alive;
                countArr[i][j] = 0;
            }
        }
    }
    drawGrid();
});

$("#start").click(function(e){
    startGame(time);
    $("#next").prop('disabled', true);
    $("#random").prop('disabled', true);
    $("#reset").prop('disabled', true);
    $("#setHW").prop('disabled', true);
    $("#slider").slider( "option", "disabled", true);
    $('#height').prop('disabled', true);
    $('#width').prop('disabled', true);
    $("#radius").prop('disabled', true);
    $("#lonely").prop('disabled', true);
    $("#overpop").prop('disabled', true);
    $("#gmin").prop('disabled', true);
    $("#gmax").prop('disabled', true);
    // Disable stop until game runs
    $("#stop").prop('disabled', false);
});

$("#stop").click(function(e){
    clearInterval(interval);
    $("#next").prop('disabled', false);
    $("#random").prop('disabled', false);
    $("#reset").prop('disabled', false);
    $("#setHW").prop('disabled', false);
    $("#slider").slider( "option", "disabled", false);
    $('#height').prop('disabled', false);
    $('#width').prop('disabled', false);
    $("#radius").prop('disabled', false);
    $("#lonely").prop('disabled', false);
    $("#overpop").prop('disabled', false);
    $("#gmin").prop('disabled', false);
    $("#gmax").prop('disabled', false);
    // Disable stop until game runs
    $("#stop").prop('disabled', true);
});

$("#next").click(function(e){
    for (var i = 0; i < state.length; i++) {
        for (var j = 0; j < state[i].length; j++) {
            determineCount(i,j);
        }
    }

    for (var i = 0; i < state.length; i++) {
        for (var j = 0; j < state[i].length; j++) {
            determineFate(i,j);
        }
    }

    drawGrid();
});

// Fill in state colors
function fill(s, gx, gy) {
    context.fillStyle = s;
    context.fillRect(gx * blockSize, gy * blockSize, blockSize, blockSize);
}

var startGame = function(time) {
    interval = setInterval(function() {
        for (var i = 0; i < state.length; i++) {
            for (var j = 0; j < state[i].length; j++) {
                determineCount(i,j);
            }
        }

        for (var i = 0; i < state.length; i++) {
            for (var j = 0; j < state[i].length; j++) {
                determineFate(i,j);
            }
        }
        drawGrid();
    }, time);
}

var drawStates = function() {
    for (var i = 0; i < state.length; i++) {
        for (var j = 0; j < state[i].length; j++) {
            if (state[i][j] == status.alive) {
                fill('#FED100', i, j);
            }
            if (state[i][j] == status.killed) {
                fill('#999999', i, j);
            }
            if (state[i][j] == status.dead) {
                fill('#c0c0c0', i, j);
            }
        }
    }
}

var resetBoard = function() {
    for (var i = 0; i < state.length; i++) {
        for (var j = 0; j < state[i].length; j++) {
            fill('#c0c0c0', i, j);
            state[i][j] = status.dead;
            countArr[i][j] = 0;
        }
    }
    drawGrid();
}

var determineCount = function(x, y) {
    var count = 0;
    var yCorner = y - radius;
    var xCorner = x - radius;
    var length = (2*radius)+1;

    for (var i = 0; i < length; i++) {
        for (var j = 0; j < length; j++) {

            // Don't check Corner Cases: <0 or >height
            if (((yCorner+i) >= 0) && ((xCorner+j) >= 0) && ((yCorner+i) < state.length) && ((xCorner+j) < state[i].length)) {

                // console.log("y: " + (yCorner+i) + " x: " + (xCorner+j));
                // console.log(yCorner+i);
                // console.log(xCorner+j);
                if (state[yCorner+i][xCorner+j] == status.alive) {
                    count++;
                }
            }
        }
    }  
    countArr[y][x] = count;  
}

var determineFate = function(x, y) {
    var count = countArr[y][x];

    if (state[y][x] == status.alive) {

        // account for the state in the center
        count--;

        if (count < loneliness) {
            state[y][x] = status.killed;
            fill('#999999', x, y);
        }
        // Equallibrium hard coded???
        else if (count > 1 && count < 4) {
            state[y][x] = status.alive;
            fill('#FED100', x, y);
        }
        else if (count > overpopulation) {
            state[y][x] = status.killed;
            fill('#999999', x, y);
        }
    }
    // Generation
    else {
        if ((count >= genMin) && (count <= genMax)) {
            state[y][x] = status.alive;
            fill('#FED100', x, y);
        }
    }
}

});