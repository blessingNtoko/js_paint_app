let canvas;
let context;
let savedImgData;
let dragging = false;
let strokeColor = 'black';
let fillColor = 'black';
let lineWidth = 2;
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
        this.y= y;
    }
}

class Location {
    constructor(x, y) {
        this.x = x;
        this.y= y; 
    }
}

class PolyPoint {
    constructor(x, y) {
        this.x = x;
        this.y= y; 
    }
}

let shapeBoundingBox = new ShapeBoundingBox(0,0,0,0);
let mouseDownPos = new MouseDownPos(0,0);
let location = new Location(0,0);
let polyPoint = new PolyPoint(0,0);