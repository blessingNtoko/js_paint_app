let canvas;
let context;
let savedImgData;
let dragging = false;
let strokeColor = 'black';
let fillColor = 'black';
let line_Width = 2;
let polySides = 6;
let currentTool = 'brush';
let canvasWidth = 600;
let canvasHeight = 600;

class ShapeBoundingBox {
    constructor(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
}

class MouseDownPos {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Location {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class PolyPoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let shapeBoundingBox = new ShapeBoundingBox(0, 0, 0, 0);
let mouseDownPos = new MouseDownPos(0, 0);
let mouseLocation = new Location(0, 0);
let polyPoint = new PolyPoint(0, 0);

document.addEventListener("DOMContentLoaded", setupCanvas);

function setupCanvas() {
    canvas = document.getElementById("myCanvas");
    context = canvas.getContext('2d');
    context.strokeStyle = strokeColor;
    context.lineWidth = line_Width;
    canvas.addEventListener("mousedown", reactToMouseDown);
    canvas.addEventListener("mousemove", reactToMouseMove);
    canvas.addEventListener("mouseup", reactToMouseUp);
}

function reactToMouseDown(evt) {
    // console.log('Mouse Down event', evt)
    canvas.style.cursor = "crosshair";
    mouseLocation = getMousePos(evt.clientX, evt.clientY);
    saveCanvasImage();
    mouseDownPos.x = mouseLocation.x;
    mouseDownPos.y = mouseLocation.y;
    dragging = true;

    // T

    
}

function reactToMouseMove(evt) {
    // console.log('Mouse Move event', evt)
    // mouseLocation = getMousePos(evt.clientX, evt.clientY);
    // console.log(`Mouse Location -> ${mouseLocation.x}, ${mouseLocation.y}`);
}

function reactToMouseUp(evt) {
    // console.log('Mouse Up event', evt)
}

function openImage() {
    console.log('Opening Image');
}

function saveImage() {
    console.log('Saving Image');
}

function changeTool(tool) {
    console.log(`Selected tool - ${tool}`);

    document.getElementById('open').className = "";
    document.getElementById('save').className = "";
    document.getElementById('brush').className = "";
    document.getElementById('line').className = "";
    document.getElementById('rectangle').className = "";
    document.getElementById('circle').className = "";
    document.getElementById('ellipse').className = "";
    document.getElementById('polygon').className = "";

    document.getElementById(tool).className = 'selected';

    currentTool = tool;
    console.log(`Current Tool -> ${currentTool}`);
}

function getMousePos(x, y) {
    let canvasSizeData = canvas.getBoundingClientRect();
    return {
        x: (x - canvasSizeData.left) * (canvas.width / canvasSizeData.width),
        y: (y - canvasSizeData.top) * (canvas.height / canvasSizeData.height)
    };
}

function saveCanvasImage() {
    savedImgData = context.getImageData(0, 0, canvas.width, canvas.height);
}

function redrawCanvasImg() {
    context.putImageData(savedImgData);
}

function updateRubberBandSizeData(loc) {
    shapeBoundingBox.width = Math.abs(loc.x - mouseDownPos.x);
    shapeBoundingBox.height = Math.abs(loc.y - mouseDownPos.y);

    if (loc.x > mouseDownPos.x) {
        shapeBoundingBox.left = mouseDownPos.x;
    } else {
        shapeBoundingBox.left = loc.x;
    }

    if (loc.y > mouseDownPos.y) {
        shapeBoundingBox.top = mouseDownPos.y;
    } else {
        shapeBoundingBox.top = loc.y;
    }
}

function getAngleUsingXAndY(mouseLocX, mouseLocY) {
    let adjacent = mouseDownPos.x - mouseLocX;
    let opposite = mouseDownPos.y - mouseLocY;
    return radiansToDegrees(Math.atan2(opposite, adjacent));
}

function radiansToDegrees(rad) {
    if (rad < 0) {
        return (360.0 + (rad * (180 / Math.PI))).toFixed(2);
    } else {
        return (rad * (180 / Math.PI)).toFixed(2);
    }
}

function degreesToRadians(deg) {
    return deg * (Math.PI / 180);
}