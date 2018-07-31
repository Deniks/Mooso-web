const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const PICTURES_FOR_AI = [];
const EMOTIONS = ['smiling', 'calm', 'crying'];
const EMOTION_CONTAINER = document.getElementsByClassName('emotions');
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.oGetUserMedia || navigator.msGetUserMedia;

if (navigator.getUserMedia) {
    navigator.getUserMedia({
        video: true
    }, streamWebCam, throwError);
}

function streamWebCam(stream) {
    video.src = window.URL.createObjectURL(stream);
    video.play();
}

function throwError(e) {
    alert(e.name);
}

function snap() {
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    context.drawImage(video, 0, 0);
    PICTURES_FOR_AI.push(context);
    console.log(PICTURES_FOR_AI);
}
const ec = new emotionClassifier();
ec.init(emotionModel);
const emotionData = ec.getBlank();
if (emotionData) {
    EMOTION_CONTAINER.value = emotionData;
    console.log(EMOTION_CONTAINER);
}
/*stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
document.getElementById('container').appendChild(stats.domElement);

// update stats on every iteration
document.addEventListener('clmtrackrIteration', function (event) {
    stats.update();
}, false);*/