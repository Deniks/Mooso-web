const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const URL_EXAMPLE = 'https://cdn.vox-cdn.com/thumbor/VkpZk_WQSQvGe9T7YYOZscGsOwI=/0x86:706x557/1200x800/filters:focal(0x86:706x557)/cdn.vox-cdn.com/assets/738480/stevejobs.png';
const PICTURES_FOR_AI = [];
const EMOTIONS = ['smiling', 'calm', 'crying'];
const EMOTION_CONTAINER = document.getElementsByClassName('emotions');
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.oGetUserMedia || navigator.msGetUserMedia;

if (navigator.getUserMedia) {
    navigator.getUserMedia({
        video: true
    }, streamWebCam, throwError);
}

const getNestedObject = (nestedObj, pathArr) => {
    return pathArr.reduce((obj, key) =>
        (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
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
}

const AZURE_IMAGE = canvas.toDataURL();

function processImage() {
    // Replace <Subscription Key> with your valid subscription key.
    var subscriptionKey = "b5099da494d349e88129fbdccb354982";

    // NOTE: You must use the same region in your REST call as you used to
    // obtain your subscription keys. For example, if you obtained your
    // subscription keys from westus, replace "westcentraluss" in the URL
    // below with "westus".
    //
    // Free trial subscription keys are generated in the westcentralus region.
    // If you use a free trial subscription key, you shouldn't need to change 
    // this region.
    var uriBase =
        "https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect";

    // Request parameters.
    var params = {
        "returnFaceId": "false",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes":
            "emotion" 
    };
    // Display the image.
    var sourceImageUrl = document.getElementById("inputImage").value = URL_EXAMPLE;
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
        let domText = JSON.parse(document.getElementById('responseTextArea').value);
        let emotions = domText[0].faceAttributes.emotion;
        console.log(emotions);
        for (const [key, value] of Object.entries(emotions)) {
            if (value) {
                console.log(`${key} - ${value}`);
            }
        }
    /*    if ($("#responseTextArea")) {
            let text = document.getElementById('responseTextArea').value
            text = text[0];
            getNestedObject(text, ['faceAttributes']);
            console.log(text);
        }*/
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
