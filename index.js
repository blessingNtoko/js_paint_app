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

let usingBrush = false;
let brushXPoints = new Array();
let brushYPoints = new Array();
let brushDownPos = new Array();

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

    // TODO: handle brush

    
}

function reactToMouseMove(evt) {
    // console.log('Mouse Move event', evt)
    canvas.style.cursor = "crosshair";
    mouseLocation = getMousePos(evt.clientX, evt.clientY);

    if (dragging) {
        redrawCanvasImg();
        updateRubberBandOnMove(mouseLocation);
    }

    // TODO: handle brush

}

function reactToMouseUp(evt) {
    // console.log('Mouse Up event', evt)
    canvas.style.cursor = "default";
    mouseLocation = getMousePos(evt.clientX, evt.clientY);
    redrawCanvasImg();
    updateRubberBandOnMove(mouseLocation);
    dragging = false;
    usingBrush = false;

}

function openImage() {
    let img = new Image();
    img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
    }
    img.src = 'image.png';
}

function saveImage() {
    let imgFile = document.getElementById('imgFile');
    imgFile.setAttribute('download', 'image.png');
    imgFile.setAttribute('href', canvas.toDataURL());
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
    context.putImageData(savedImgData, 0, 0);
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

function getPolyPoints() {
    let angle = degreesToRadians(getAngleUsingXAndY(mouseLocation.x, mouseLocation.y));
    let radiusX = shapeBoundingBox.width;
    let radiusY = shapeBoundingBox.height;
    let polyPoints = [];

    for (i = 0; i < polySides; i++) {
       polyPoints.push(new PolyPoint(mouseLocation.x + radiusX * Math.sin(angle), mouseLocation.y - radiusY * Math.cos(angle)));
       angle += 2 * Math.PI / polySides;
    }
    return polyPoints;
}

function getPoly() {
    let polyPoints = getPolyPoints();
    context.beginPath();
    context.moveTo(polyPoints[0].x, polyPoints[0].y);

    for (i = 1; i < polySides; i++) {
        context.lineTo(polyPoints[i].x, polyPoints[i].y);
    }

    context.closePath();
}

function degreesToRadians(deg) {
    return deg * (Math.PI / 180);
}

function updateRubberBandOnMove(location) {
    updateRubberBandSizeData(location);
    drawRubberBandShape(location);
}

function drawRubberBandShape(mouseLocation) {
    context.strokeStyle = strokeColor;
    context.fillStyle = fillColor;
    context.strokeRect(shapeBoundingBox.left, shapeBoundingBox.top, shapeBoundingBox.width, shapeBoundingBox.height);
}

function addBrushPoint(x, y, mouseDown) {
    brushXPoints.push(x);
    brushYPoints.push(y);
    brushDownPos.push(mouseDown);
}