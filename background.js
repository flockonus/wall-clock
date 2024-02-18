
var video, canvas, context, overlay;
var currentVideo = null


var hourParams = {
    0: {video: null, fontColor: '#9fddff', bg: 1},
    1: {video: null, fontColor: '#9fddff', bg: 1},
    4: {video: 1, fontColor: '#53Fa3e', bg: 0.6},
    5: {video: 1, fontColor: '#53Fa3e', bg: 0.4},
    6: {video: 1, fontColor: '#53Fa3e', bg: 0.2},
    7: {video: 1, fontColor: '#53Fa3e', bg: null},
    10: {video: 7, fontColor: '#53Fa3e', bg: null},
    12: {video: 5, fontColor: '#ff9f44', bg: null},
    14: {video: 8, fontColor: '#ff9f44', bg: null},
    17: {video: 4, fontColor: '#53Fa3e', bg: 0.2},
    18: {video: 4, fontColor: '#53Fa3e', bg: 0.3},
    19: {video: 4, fontColor: '#53Fa3e', bg: 0.4},
    20: {video: 6, fontColor: '#53Fa3e', bg: 0.6},
    23: {video: null, fontColor: '#9fddff', bg: 1},
}

function updateVideoFontBackground() {
    var now = new Date()
    var hour = now.getHours()

    var lower = 0
    var hoursList = Object.keys(hourParams).map(x => parseInt(x, 10)).sort((a, b) => a - b);
    // debugger
    console.log("hoursList", hoursList);
    for (var key of hoursList) {
        key = parseInt(key)
        if (key > hour) break
        lower = key
        console.log("lower", lower);
    }
    var nowParams = hourParams[lower]
    console.log("nowParams", lower, nowParams);

    if (nowParams.bg !== null) {
        overlay.style.backgroundColor = `rgba(100, 0, 0, ${nowParams.bg})`;
    } else {
        overlay.style.backgroundColor = '';
    }

    if (nowParams.video !== null) {
        if (currentVideo !== nowParams.video) {
            sampleColorCache = null;
            currentVideo = nowParams.video;
            video.src = `videos/beach${nowParams.video}_360p.mp4`;
            video.volume = 0;
            video.play();
        }
    } else {
        if (currentVideo !== null) {
            currentVideo = null;
            video.pause();
            video.src = '';
        }
    }

    // Set the font color
    document.querySelectorAll('.colon').forEach(el => el.style.backgroundColor = nowParams.fontColor)
    document.querySelectorAll('.segment').forEach(el => el.style.backgroundColor = nowParams.fontColor)
}


document.addEventListener("DOMContentLoaded", function () {
    video = document.getElementById('backgroundVideo');
    video.volume = 0;
    video.play();

    canvas = document.getElementById('videoCanvas');
    context = canvas.getContext('2d');

    // var background = document.querySelector('.background');
    // var overlay = document.createElement('div');
    // overlay.classList.add('overlay');
    // background.appendChild(overlay);
    overlay = document.querySelector('.background .overlay');

    video.ontimeupdate = function () {
        var timeLeft = video.duration - video.currentTime;
        console.log(timeLeft, overlay.style.opacity);
        if (timeLeft <= 1 && (overlay.style.opacity === "" || overlay.style.opacity === "0")) {

            // Sample color from the canvas
            const sampledColor = sampleColorFromCanvas(context, canvas, video);

            // Set the overlay color
            overlay.style.backgroundColor = `rgba(${sampledColor.r}, ${sampledColor.g}, ${sampledColor.b}, 0.75)`;
            overlay.style.opacity = 1;

            setTimeout(function () {
                video.currentTime = 0;
                video.play();
                overlay.style.opacity = 0; // Fade out the overlay as the video restarts
            }, 700); // Match this with the CSS transition time
        }
    };

    updateVideoFontBackground();
    setInterval(updateVideoFontBackground, 60 * 1000);
});


var sampleColorCache = null;

function sampleColorFromCanvas(context, canvas, video) {
    if (sampleColorCache) {
        return sampleColorCache;
    }

    // Draw the last frame onto the canvas
    var width = canvas.width = video.videoWidth;
    var height = canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);


    // Define the number of sampling points and initialize color accumulators
    const samplePoints = 32;
    let totalR = 0, totalG = 0, totalB = 0;

    // Calculate the distance between sample points, avoiding borders and corners
    const deltaX = width / (Math.sqrt(samplePoints) + 1);
    const deltaY = height / (Math.sqrt(samplePoints) + 1);

    // Sample colors from the calculated points
    for (let i = 1; i <= Math.sqrt(samplePoints); i++) {
        for (let j = 1; j <= Math.sqrt(samplePoints); j++) {
            // Calculate the pixel position
            const x = Math.round(i * deltaX);
            const y = Math.round(j * deltaY);
            const { r, g, b } = getPixelColor(context, x, y);

            // Accumulate the color values
            totalR += r;
            totalG += g;
            totalB += b;
        }
    }

    // Calculate the average color
    const avgR = totalR / samplePoints;
    const avgG = totalG / samplePoints;
    const avgB = totalB / samplePoints;

    sampleColorCache = { r: avgR, g: avgG, b: avgB };

    console.log("sampleColorCache", sampleColorCache);

    return sampleColorCache;
}

function getPixelColor(context, x, y) {
    // Get the pixel data from a single pixel
    const pixelData = context.getImageData(x, y, 1, 1).data;
    console.log("pixelData", pixelData);
    return { r: pixelData[0], g: pixelData[1], b: pixelData[2] };
}