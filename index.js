const canvas = document.getElementById("canvas");
const menu = document.getElementById("menu");
const ctx = canvas.getContext("2d", {willReadFrequently: true});
const drawdiv = document.getElementById("draw");

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

const xScalingFactor = canvas.width/drawdiv.offsetWidth;
const yScalingFactor = canvas.height/drawdiv.offsetHeight;

let isPainting = false;
ctx.lineWidth = 1;
let imageStatesStack = [ctx.getImageData(0, 0, canvas.width, canvas.height)]

const getCoordinates = (e) => {
    return [(e.pageX - canvasOffsetX)*xScalingFactor, (e.pageY-canvasOffsetY)*yScalingFactor];
}

const draw = (e) => {
    if (!isPainting) {
        return;
    }
    let [x, y] = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
}

const undraw = () => {
    if (imageStatesStack.length === 1) {
        return; 
    }
    imageStatesStack.pop();
    let previousImageData = imageStatesStack.at(-1);
    ctx.putImageData(previousImageData, 0, 0);
}


canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
});

canvas.addEventListener('mouseup', (e) => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
    imageStatesStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
});

canvas.addEventListener('mousemove', draw);

document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'z'){
        undraw();
    } 
});