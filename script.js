let constraint = {"video": true}
const video = document.getElementById("webcam")
var tag = document.createElement("script")
var firstScriptTag = document.getElementsByTagName('script')[0];
var player;
var done = false;

async function getMedia(constraints){
    let stream = null
    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream
    } catch(err){console.error('Error acessing media devices.', err)}

}
async function setup() {
    try{
        await faceapi.nets.tinyFaceDetector.loadFromUri('./models')
        await faceapi.nets.faceExpressionNet.loadFromUri('./models')
    } catch(err){console.error('Error setting up', err)}
    
    getMedia(constraint)
    const canvas = document.getElementById('overlay')
    canvas.width = video.width
    canvas.height = video.height
    tag.src = "https://www.youtube.com/iframe_api";
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    video.addEventListener('play', () => {
        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions()
            const resizedDetections = faceapi.resizeResults(detections, { width: video.width, height: video.height })
            console.log(detections)
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            faceapi.draw.drawDetections(canvas, resizedDetections)
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        }, 100)
    })
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: 'M7lc1UVf-VE',
      playerVars: {
        'playsinline': 1
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }
function onPlayerReady(event) {
    //  event.target.playVideo();
    }
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
      setTimeout(stopVideo, 6000);
      done = true;
    }
  }


function stopVideo() {
    player.stopVideo();
}


setup()