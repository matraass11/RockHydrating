const canvas = document.getElementById("canvas");
const menu = document.getElementById("menu");
const clearButton = document.getElementById("clear");
const ctx = canvas.getContext("2d", {willReadFrequently: true});
const drawdiv = document.getElementById("draw");
const hiddenData = document.getElementById("hiddenData");

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;
const xScalingFactor = canvas.width/drawdiv.offsetWidth;
const yScalingFactor = canvas.height/drawdiv.offsetHeight;

let isPainting = false;
ctx.lineWidth = 1;
let imageStatesStack = [ctx.getImageData(0, 0, canvas.width, canvas.height)];

// let imgData = ctx.createImageData(canvas.width, canvas.height);
// let arr = new Uint8ClampedArray(hiddenData.value.split(","));
// imgData.data.set(arr);
// ctx.putImageData(imgData, 0, 0);
// loads the picture drawn previously after showing the prediction, otherwise changes nothing

const getCoordinates = (e) => {
    return [(e.pageX - canvasOffsetX)*xScalingFactor, (e.pageY-canvasOffsetY)*yScalingFactor];
}

const draw = (x, y) => {
    if (!isPainting) {
        return;
    }
    ctx.lineTo(x, y);
    ctx.stroke();
}

const undraw = () => {
    if (imageStatesStack.length === 1) {
        return 1; //stack emptied
    }
    imageStatesStack.pop();
    let previousImageData = imageStatesStack.at(-1);
    ctx.putImageData(previousImageData, 0, 0);
    saveData();
    return 0; //stack not emptied
}

const saveData = () => {
    hiddenData.value = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
}

clearButton.addEventListener('click', () => {
    let stackEmptied = undraw();
    while (stackEmptied === 0){
        stackEmptied = undraw();
    }
});

document.addEventListener('mousedown', (e) => {
    isPainting = true;
});

document.addEventListener('mouseup', (e) => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
    imageStatesStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    saveData();
});

document.addEventListener('mousemove', (e) => {
    hiddenData.value = getCoordinates(e);
    let [x, y] = getCoordinates(e);
    if (x > canvas.width || x < 0 || y > canvas.height || y < 0){
        ctx.beginPath();
        return;
    }
    draw(x, y);
});

document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'z'){
        undraw();
    } 
});

