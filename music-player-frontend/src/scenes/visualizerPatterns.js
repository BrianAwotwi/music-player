// visualizerPatterns.js

export function rainbowGraph() {
  let timeElapsed = 0;

  return function rotateGradient(analyzer, info) {
    if (info.timestamp - timeElapsed > 100) {
      timeElapsed = info.timestamp;
      const colorStops = [],
        offset = (timeElapsed / 10) % 360;

      for (let i = 360; i >= 0; i -= 60) {
        colorStops.push(`hsl(${offset + i}, 100%, 50%)`);
      }

      analyzer.registerGradient("rainbow", {
        dir: "v",
        colorStops,
      });
    }
  };
}

export function bars(containerRef) {
  return function drawBars(analyzer) {
    const container = containerRef.current;
    const maxHeight = container.clientHeight;

    let html = "";
    for (const bar of analyzer.getBars()) {
      const value = bar.value[0];
      const peak = bar.peak[0];
      const hold = bar.hold[0];
      const isPeakUp = hold > 0 && peak > 0;

      html += `<div class="bar" style="height: ${
        value * 100
      }%; background: rgba(255, 255, 255, ${value})">
                  <div class="peak" style="bottom: ${
                    (peak - value) * -maxHeight
                  }px; ${
        isPeakUp
          ? "box-shadow: 0 0 10px 1px #f00"
          : `opacity: ${peak > 0 ? 0.7 : 0}`
      }"></div>
                </div>`;
    }

    container.innerHTML = html;
  };
}
