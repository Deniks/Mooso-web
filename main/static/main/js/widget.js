

const CONFIG = {
    // F A C E  A P I
    azureSubscribtionKey: 'b5099da494d349e88129fbdccb354982',
    azureServerLocation: 'https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect', 
    
    // Y O U T U B E    A P I
    key: 'AIzaSyB_WOhnBx75TDgd-EmVztrnRprPti84TYQ',
    playlistLink: {
        happy: 'PL7DkqoXVLGXbILlf-zgaEWyRSz0FWrXyY',
        sad: 'PL7DkqoXVLGXZRoFkpIaFlDL_R0JgxqJsv',
        neutral: 'PL7DkqoXVLGXZz2BB-hgR8JwEp0jOEFIYX',
    },
    url: 'https://www.googleapis.com/youtube/v3/playlistItems',
    buildApiRequest: () => ('GET',
                '/youtube/v3/channels',
                {'id': 'UC_KuDw9D6IF_UNAmXiwHSuQ',
                 'part': 'snippet,contentDetails,statistics'}),
}



const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const URL_EXAMPLE = {
    happy: 'https://cdn.tinybuddha.com/wp-content/uploads/2009/10/Happy1.png',
    neutral: 'https://cdn.vox-cdn.com/thumbor/VkpZk_WQSQvGe9T7YYOZscGsOwI=/0x86:706x557/1200x800/filters:focal(0x86:706x557)/cdn.vox-cdn.com/assets/738480/stevejobs.png',
    sadness: 'https://cdn-img.health.com/sites/default/files/styles/large_16_9/public/styles/main/public/gettyimages-471914697.jpg?itok=2RvWMJYg',
    selfie: canvas.value, // This will work only with running hosting
};
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


    const AZURE_IMAGE = canvas.toDataURL();

    // Replace <Subscription Key> with your valid subscription key.
    var subscriptionKey = CONFIG.azureSubscribtionKey;

    // NOTE: You must use the same region in your REST call as you used to
    // obtain your subscription keys. For example, if you obtained your
    // subscription keys from westus, replace "westcentraluss" in the URL
    // below with "westus".
    //
    // Free trial subscription keys are generated in the westcentralus region.
    // If you use a free trial subscription key, you shouldn't need to change 
    // this region.
    var uriBase = CONFIG.azureServerLocation;

    // Request parameters.
    var params = {
        "returnFaceId": "false",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes":
            "emotion" 
    };
    // Display the image.
    var sourceImageUrl = document.getElementById("inputImage").value = URL_EXAMPLE.neutral;
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
        window.Character = '';

        window.EMOTION_LOGGER = () => {
            for (const [key, value] of Object.entries(emotions)) {
                const VALUE = Math.round(value);
                if (VALUE === 1) {
                    Character = key;
                    console.log(`${key}`);
                }
            }
        };


        EMOTION_LOGGER();
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
//        Y O U T U B E       A P I
const options = {
    part: 'snippet',
    key: CONFIG.key,
    maxResults: 20,
    playlistId: window.Character === 'happiness' ? CONFIG.playlistLink.happy : window.Character === 'neutral'  ? CONFIG.playlistLink.neutral : window.Character === 'sadness' ? CONFIG.playlistLink.sad : console.log('none of theese'),
}

const mainVid = id => {
    $('#video').html(`
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    `);
}

const resultsLoop = data => {

    $.each(data.items, (i, item) => {

        var thumb = item.snippet.thumbnails.high.url;
        var title = item.snippet.title;
        var desc = item.snippet.description.substring(0, 100);
        var vid = item.snippet.resourceId.videoId;


        $('main').append(`
            <article class="item" data-key="${vid}">

                <img src="${thumb}" alt="" class="thumb">
                <div class="details">
                    <h4>${title}</h4>
                    <p>${desc}</p>
                </div>

            </article>
        `);
    });
}

const loadVids = () => {
        $.getJSON(CONFIG.url, options, data => {
        const id = data.items[0].snippet.resourceId.videoId;
        mainVid(id);
        resultsLoop(data);
    });
}

loadVids();

$('main').on('click', 'article', () => {
    var id = $(this).attr('data-key');
    mainVid(id);
});

