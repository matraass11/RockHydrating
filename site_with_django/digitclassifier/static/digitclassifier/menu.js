const probsToggle = document.getElementById('probsToggle');
const probs = document.getElementById('probs');
const canvas = document.getElementById('probsCanvas');
const ctx = canvas.getContext("2d");

ctx.lineWidth = 2;

const changeDisplay = () => {
    if (probs.style.display === 'none') {
        probs.style.display = 'block';
    }
    else {
        probs.style.display = 'none';
    }
}

const drawDigits = (probs) => {
    
    const zero = (xStart, yStart) => {
        ctx.moveTo(xStart+3, yStart);
        ctx.lineTo(xStart+7, yStart);
        ctx.moveTo(xStart+8, yStart+1);
        ctx.lineTo(xStart+8, yStart+11);
        ctx.moveTo(xStart+7, yStart+12);
        ctx.lineTo(xStart+3, yStart+12);
        ctx.moveTo(xStart+2, yStart+11);
        ctx.lineTo(xStart+2, yStart+1);
        ctx.stroke();
    }

    // let toDraw = [zero, one, two, three, four, five, six, seven, eight, nine]
    let toDraw = [zero];

    for (i=0; i < 1; i++) {
        let luminance = probs[i] * 255;
        ctx.strokeStyle = `rgba(${luminance}, ${luminance}, ${luminance}, 1)`;
        toDraw[i](0, 3);
    }
}

drawDigits([1]);
probsToggle.addEventListener('click', () => {
    changeDisplay();
});