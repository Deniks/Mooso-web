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
/*
const ec = new emotionClassifier();
ec.init(emotionModel);
const emotionData = ec.getBlank();
if (emotionData) {
    EMOTION_CONTAINER.value = emotionData;
    console.log(EMOTION_CONTAINER);
}
*/
const AZURE_IMAGE = canvas.toDataURL();

function processImage() {
    // Replace <Subscription Key> with your valid subscription key.
    var subscriptionKey = "b5099da494d349e88129fbdccb354982";

    // NOTE: You must use the same region in your REST call as you used to
    // obtain your subscription keys. For example, if you obtained your
    // subscription keys from westus, replace "westcentralus" in the URL
    // below with "westus".
    //
    // Free trial subscription keys are generated in the westcentralus region.
    // If you use a free trial subscription key, you shouldn't need to change 
    // this region.
    var uriBase =
        "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

    // Request parameters.
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes":
            "age,gender,headPose,smile,facialHair,glasses,emotion," +
            "hair,makeup,occlusion,accessories,blur,exposure,noise"
    };

    // Display the image.
    var sourceImageUrl = document.getElementById("inputImage").value = AZURE_IMAGE;
    document.querySelector("#sourceImage").src = sourceImageUrl;

    // Perform the REST API call.
    $.ajax({
        url: uriBase + "?" + $.param(params),

        // Request headers.
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },

        type: "POST",

        // Request body.
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })

    .done(function(data) {
        // Show formatted JSON on webpage.
        $("#responseTextArea").val(JSON.stringify(data, null, 2));
    })

        .fail(function (jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ?
                "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ?
                "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                jQuery.parseJSON(jqXHR.responseText).message :
                jQuery.parseJSON(jqXHR.responseText).error.message;
            alert(errorString);
        });
};
/*stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
document.getElementById('container').appendChild(stats.domElement);

// update stats on every iteration
document.addEventListener('clmtrackrIteration', function (event) {
    stats.update();
}, false);*/