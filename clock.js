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
