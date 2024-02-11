const hour1 = document.querySelectorAll(".hours .digit")[0];
const hour2 = document.querySelectorAll(".hours .digit")[1];
const minute1 = document.querySelectorAll(".minutes .digit")[0];
const minute2 = document.querySelectorAll(".minutes .digit")[1];
const second1 = document.querySelectorAll(".seconds .digit")[0];
const second2 = document.querySelectorAll(".seconds .digit")[1];
const setNumber = (element, number) => {
    const show = element.querySelectorAll(`.n${number}`);
    const hide = element.querySelectorAll(`:not(.n${number})`);

    hide.forEach((el) => {
        el.classList.remove("active");
    });
    show.forEach((el) => {
        el.classList.add("active");
    });
};

// By Mostafa Alvandi
// https://codepen.io/alvandisetvat/pen/WNzJaOB

setInterval(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    setNumber(hour1, Math.floor(hours / 10));
    setNumber(hour2, Math.floor(hours % 10));
    setNumber(minute1, Math.floor(minutes / 10));
    setNumber(minute2, Math.floor(minutes % 10));
    setNumber(second1, Math.floor(seconds / 10));
    setNumber(second2, Math.floor(seconds % 10));
}, 1000);


// hold a few "keyframes" for the background
var interpolationTimes = {
    0: [0, 0, 0, 1],
    1: [0, 0, 0, 1],
    4: [0, 0, 0, 1],
    6: [210, 179, 180, 0.85],
    7: [210, 198, 179, 0.21],
    11: [210, 228, 179, 0.1],
    13: [220, 218, 159, 0.1],
    17: [220, 218, 159, 0.1],
    19: [120,100,200, 0.8],
    21: [5, 0, 20, 0.9],
    23: [0, 0, 0, 1],
    24: [0, 0, 0, 1],
}

// my own function
function updateBG() {
    var c = document.querySelector('.clock')
    var values = [0,0,0,0]
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
    var now = hour + (minute * 1.6665)/100
    for (var i = 0; i < 4; i++) {
        values[i] = lowerValues[i] + (upperValues[i] - lowerValues[i]) * (now - lower) / (upper - lower)
    }
    console.log("now",now)
    console.log("lower",lower)
    console.log("upper",upper)
    console.log("values", values);
    c.style['backgroundColor'] = 'rgba('+ values.join(',') +')'
}

// based on time of day, let's update the illumination
// setInterval(updateBG, 60 * 1000);
updateBG();



function openFullscreen(el) {
    // debugger
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
    el.style['opacity'] = 0
}
