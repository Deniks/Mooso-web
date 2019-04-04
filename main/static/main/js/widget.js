const CONFIG = {
    // F A C E  A P I
    azureSubscribtionKey: 'b5099da494d349e88129fbdccb354982',
    azureServerLocation: 'https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect',

    // Y O U T U B E    A P I
    key: 'AIzaSyB_WOhnBx75TDgd-EmVztrnRprPti84TYQ',
    playlistLink: {
        surprise: 'PL5_r3TmE4rBrSJ35B1d5AX3npCyOkurrK',
        happiness: 'PL5_r3TmE4rBox0OvAF89528cVJk-T707G',
        fear: 'PL5_r3TmE4rBqmMwXbpe0j2M7YigI6JmES',
        angrer: 'PL5_r3TmE4rBowJ9YLYhzwuWPkkErRBU72',
        contempt: 'PL5_r3TmE4rBoiKB4qHbirIkUELolT9kQS',
        disgust: 'PL5_r3TmE4rBr3jMr08z_-BTH-UWZYYZwB',
        sadness: 'PL5_r3TmE4rBrWDWsc3yG9lzXVCfxbJtwC',
        neutral: 'PL5_r3TmE4rBpDIL0RlidLvr7tE93EF7Zu',
    },
    api_url: 'https://www.googleapis.com/youtube/v3/playlistItems',
}



const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

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
    video.srcObject = stream;
    video.play();
}

function throwError(e) {
    alert(e.name);
}

function snap() {


    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    context.drawImage(video, 0, 0);
    const FORMAT = 'png';
    let azureImage = canvas.toDataURL('image/' + FORMAT);
    const subscriptionKey = CONFIG.azureSubscribtionKey;
    const uriBase = CONFIG.azureServerLocation;
    const params = {
        "returnFaceId": "false",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": "emotion"
    };

    // Perform the REST API call.
    fetch(azureImage)
        .then(res => res.blob())
        .then(blobData => {
            $.post({
                    url: uriBase + "?" + $.param(params),
                    contentType: 'application/octet-stream',
                    headers: {
                        'Ocp-Apim-Subscription-Key': subscriptionKey,
                    },
                    processData: false,
                    data: blobData,
                    success: console.log('request is sent'),

                })
                .done(data => {
                    // Show formatted JSON on webpage.
                    $("#responseTextArea").val(JSON.stringify(data, null, 2));
                    let domText = JSON.parse(document.getElementById('responseTextArea').value);
                    console.log(domText);

                    let emotions = domText[0].faceAttributes.emotion;
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
                    getSong()
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
        });
        
};
let moodIdentificator = document.querySelector('.mood-identificator i');

//        Y O U T U B E       A P I
function getSong() {
    const options = {
        part: 'snippet',
        key: CONFIG.key,
        maxResults: 50,
        playlistId: window.Character === 'happiness' ? CONFIG.playlistLink.happiness : window.Character === 'neutral' ? CONFIG.playlistLink.neutral : window.Character === 'sadness' ? CONFIG.playlistLink.sadness : window.Character === 'disgust' ? CONFIG.playlistLink.disgust : window.Character === 'contempt' ? CONFIG.playlistLink.contempt : window.Character === 'fear' ? CONFIG.playlistLink.fear : window.Character === 'surprise' ? CONFIG.playlistLink.surprise : window.Character === 'anger' ? CONFIG.playlistLink.anger : false,
    }

    const mainVid = id => {
        $('#youtube-api-result').html(`
            <iframe id="ytplayer" src="https://www.youtube-nocookie.com/embed/${id}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        `);
    }


    $.getJSON(CONFIG.api_url, options, data => {
        const WHOLE_PLAYLIST = data.items
        const id = data.items[Math.floor(Math.random() * WHOLE_PLAYLIST.length)].snippet.resourceId.videoId;
        mainVid(id);
    })
    .then(res => console.log('response: ', res))
    .catch(err => console.log('caught ', err.responseJSON))

    $('main').on('click', 'article', () => {
        const id = $(this).attr('data-key');
        mainVid(id);
    });
    /*
    const el = document.getElementById('youtube-api-result');
    const content = el.contentWindow.document.body.innerHTML;
    console.log(content);*/

    switch (window.Character) {
        case 'neutral':
            moodIdentificator.innerHTML = 'sentiment_dissatisfied';
            break;
        case 'happiness':
            moodIdentificator.innerHTML = 'mood';
            break;
        case 'sadness':
            moodIdentificator.innerHTML = 'sentiment_very_dissatisfied';
            break;
        case 'anger':
            moodIdentificator.innerHTML = 'whatshot';
            break;
        default:
            'Sorry uncaught emotion';
    }

}