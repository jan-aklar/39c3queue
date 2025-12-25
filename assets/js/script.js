let currentValue = 0;
let counterEl = document.getElementById("counter");

const ANIMATION_DURATION = 1000; // 1 Sekunde

const SWITCH_FRACTION = 0.5;
const NUMBER_DELAY = ANIMATION_DURATION * SWITCH_FRACTION;

let isAnimating = false;


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


function updateCounter(direction) {
  if (!counterEl) {
    counterEl = document.getElementById("counter");
  }
  if (!counterEl) return;


  if (isAnimating) return;
  isAnimating = true;

  const delta = direction === "up" ? 1 : -1;
  const nextValue = currentValue + delta;

  counterEl.classList.remove("animate-up", "animate-down");

  void counterEl.offsetWidth;

  if (direction === "up") {
    counterEl.classList.add("animate-up");
  } else {
    counterEl.classList.add("animate-down");
  }

  setTimeout(() => {
    currentValue = nextValue;
    counterEl.textContent = currentValue;

    fitCounterFont();
  }, NUMBER_DELAY);

  setTimeout(() => {
    isAnimating = false;
  }, ANIMATION_DURATION);
}

//Enter hoch, Leertaste runter
window.addEventListener("keydown", (event) => {
  // Enter → hochzählen
  if (event.key === "Enter") {
    updateCounter("up");
    return;
  }

  if (event.key === " " || event.code === "Space") {
    event.preventDefault();
    updateCounter("down");
  }
});

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
});

window.addEventListener("resize", () => {
  fitCounterFont();
});
