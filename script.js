document.addEventListener("DOMContentLoaded", () => {
  const props = {
    items: [],
    itemBackgroundColors: Array.from({ length: 99 }, (_, i) =>
      i % 2 === 0 ? '#ff6347' : '#fcd34d'
    ),
    itemLabelColors: ['#000'],
    itemLabelFont: 'Arial',
    itemLabelFontSizeMax: 18,
    radius: 0.95,
    pointerAngle: 0,
    lineColor: '#ffffff',
    lineWidth: 1
  };

  for (let i = 1; i <= 99; i++) {
    props.items.push({
      label: i.toString(),
      value: i,
      weight: 1
    });
  }

  const container = document.getElementById('wheel-container');
  const wheel = new SpinWheel.Wheel(container, props); 

  const easing = {
    cubicOut: t => (--t) * t * t + 1
  };

  function spinTheWheel() {
    const randomNumber = Math.floor(Math.random() * 99) + 1;
    const itemIndex = randomNumber - 1;
    const duration = 5000;

    wheel.spinToItem(itemIndex, duration, true, 3, 1, easing.cubicOut);

    wheel.onRest = (event) => {
      const selectedNumber = wheel.items[event.currentIndex].value;
      const prompt = allPrompts[selectedNumber - 1] || "Prompt not found.";
      document.getElementById("result-text").textContent =
        `Prompt #${selectedNumber}: ${prompt}`;
    };
  }

  document.getElementById("spin-button").addEventListener("click", spinTheWheel);
});
