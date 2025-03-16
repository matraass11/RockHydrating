const probsToggle = document.getElementById('probsToggle');
const probs = document.getElementById('probs');
const prediction = document.getElementById('prediction');
const predict = document.getElementById('predict');
const hiddenData = document.getElementById('hiddenData');

const changeDisplay = () => {
    if (probs.style.display === 'none') {
        probs.style.display = 'block';
    }
    else {
        probs.style.display = 'none';
    }
}

let csrftoken = getCookie('csrftoken');
async function sendDataToAPI() {
    const response = await fetch('http://127.0.0.1:8000/predictAPI', {
        method: 'POST',
        body: JSON.stringify({'hiddenData': hiddenData.value}),
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
          },
    });

    const json = await response.json();
    prediction.innerText = json['prediction'];
    probs.innerText = json['probs'];
} 

predict.addEventListener('click', sendDataToAPI);
probsToggle.addEventListener('click', changeDisplay);

// copypasted from stackoverflow
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }