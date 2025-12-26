let currentValue = 1;
let counterEl = document.getElementById("counter");

const ANIMATION_DURATION = 1000;

const SWITCH_FRACTION = 0.5;
const NUMBER_DELAY = ANIMATION_DURATION * SWITCH_FRACTION;

let isAnimating = false;
const eventSource = new EventSource('https://ntfy.sh/39c3-farbfab-test/sse');
eventSource.onmessage = (e) => {
    var data = JSON.parse(e.data);
    console.log(data.message.split(";"));
    data = data.message.split(";");
    document.querySelector('.total-waiting').innerHTML= data[1] || 0;
    document.querySelector('.waiting-time').innerHTML = new Date(parseInt(data[3]) * 1000).toISOString().slice(11, 19) || 0;
    updateCounter("up", data);
    //                document.querySelector('.running-number').innerHTML = data[1]  || 0;
    var desks = JSON.parse(data[2]);
    document.querySelector('.desk-index').innerHTML = desks.join(", ")  || 0;
};




function fitCounterFont() {
    if (!counterEl) {
        counterEl = document.getElementById("counter");
    }
    if (!counterEl) return;

    const HEIGHT_FACTOR = 1.2;

    // Höhe der Box messen
    const rect = counterEl.getBoundingClientRect();
    const maxHeight = rect.height;

    if (maxHeight <= 0) return;

    const newSize = Math.floor(maxHeight * HEIGHT_FACTOR);


    counterEl.style.fontSize = newSize + "px";
}


function updateCounter(direction, data) {
    if (!counterEl) {
        counterEl = document.getElementById("counter");
    }
    if (!counterEl) return;


    if (isAnimating) return;
    isAnimating = true;

    //    const delta = direction === "up" ? 1 : -1;
    //    const nextValue = parseInt(data.waitingindex);

    counterEl.classList.remove("animate-up", "animate-down");

    void counterEl.offsetWidth;

    if (direction === "up") {
        counterEl.classList.add("animate-up");
    }

    setTimeout(() => {
        counterEl.textContent = parseInt(data[0]);

        fitCounterFont();
    }, NUMBER_DELAY);

    setTimeout(() => {
        isAnimating = false;
    }, ANIMATION_DURATION);
}



window.addEventListener("load", () => {
    if (!counterEl) {
        counterEl = document.getElementById("counter");
    }
    fitCounterFont();

    if (window.ResizeObserver && counterEl) {
        const ro = new ResizeObserver(() => {
            fitCounterFont();
        });
        ro.observe(counterEl);
    }

    fetch('https://ntfy.sh/39c3-farbfab-test/json?poll=1&since=latest').then(response => {
        return response.json();
    }).then(data => {
        data = data.message.split(";");
        document.querySelector('.total-waiting').innerHTML= data[1] || 0;
        document.querySelector('.waiting-time').innerHTML = new Date(parseInt(data[3]) * 1000).toISOString().slice(11, 19) || 0;
        updateCounter("up", data);
        var desks = JSON.parse(data[2]);
        document.querySelector('.desk-index').innerHTML = desks.join(", ")  || 0;
    }).catch(err => {
        console.log(err);
    });
});

window.addEventListener("resize", () => {
    fitCounterFont();
});