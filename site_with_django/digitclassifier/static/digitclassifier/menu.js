const probsToggle = document.getElementById('probsToggle');
const probs = document.getElementById('probs');
const prediction = document.getElementById('prediction');
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
    const response = await fetch('http://127.0.0.1:8000/pred', {
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



document.getElementById('predict').addEventListener('click', sendDataToAPI);

probsToggle.addEventListener('click', () => {
    changeDisplay();
});






function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
