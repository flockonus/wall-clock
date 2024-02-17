
// hold a few "keyframes" for the background
var interpolationTimes = {
    0: [0, 0, 0, 1],
    1: [0, 0, 0, 1],
    4: [0, 0, 0, 1],
    6: [210, 179, 180, 0.85],
    7: [210, 198, 179, 0.21],
    11: [210, 228, 179, 0.1],
    13: [220, 218, 159, 0.1],
    16: [220, 218, 159, 0.1],
    18: [120, 100, 200, 0.8],
    21: [5, 0, 20, 0.9],
    23: [0, 0, 0, 1],
    24: [0, 0, 0, 1],
}

// my own function
function updateBG() {
    var c = document.querySelector('.clock')
    var values = [0, 0, 0, 0]
    var now = new Date()
    var hour = now.getHours()
    var minute = now.getMinutes()
    // find the closest hour from interpolation, both upper and lower
    var lower = 0
    var upper = 0
    for (var key in interpolationTimes) {
        key = parseInt(key)
        if (key > hour) {
            upper = key
            break
        }
        lower = key
    }
    // interpolate the color
    var lowerValues = interpolationTimes[lower]
    var upperValues = interpolationTimes[upper]
    var now = hour + (minute * 1.6665) / 100
    for (var i = 0; i < 4; i++) {
        values[i] = lowerValues[i] + (upperValues[i] - lowerValues[i]) * (now - lower) / (upper - lower)
    }
    console.log("now", now)
    console.log("lower", lower)
    console.log("upper", upper)
    console.log("values", values);
    c.style['backgroundColor'] = 'rgba(' + values.join(',') + ')'
}

// based on time of day, let's update the illumination
setInterval(updateBG, 60 * 1000);
updateBG();



// ----- VIDEO -----

// var vid = document.querySelector('.background video')
// vid.volume = 0;
// vid.play();
// // make a smooth video transition to replay by fading the video with a black overlay
// vid.addEventListener('ended', function() {
//     var overlay = document.querySelector('.background .overlay')
//     overlay.style['opacity'] = 1;
//     setTimeout(function() {
//         vid.currentTime = 0;
//         vid.play();
//         overlay.style['opacity'] = 0;
//     }, 1000);
// }, false);

document.addEventListener("DOMContentLoaded", function () {
    var video = document.getElementById('backgroundVideo');
    video.volume = 0;
    video.play();

    var canvas = document.getElementById('videoCanvas');
    const context = canvas.getContext('2d');

    // var background = document.querySelector('.background');
    // var overlay = document.createElement('div');
    // overlay.classList.add('overlay');
    // background.appendChild(overlay);
    var overlay = document.querySelector('.background .overlay');

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
