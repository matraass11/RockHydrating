const probsToggle = document.getElementById('probsToggle');
const probs = document.getElementById('probs');

const changeDisplay = () => {
    if (probs.style.display === 'none') {
        probs.style.display = 'block';
    }
    else {
        probs.style.display = 'none';
    }
}

probsToggle.addEventListener('click', () => {
    changeDisplay();
});

