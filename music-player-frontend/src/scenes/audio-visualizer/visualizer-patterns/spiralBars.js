// visualizer-patterns/spiralBars.js
export function spiralBars(
  ctx,
  width,
  height,
  bufferLength,
  dataArray,
  barWidth
) {
  const centerX = width / 2;
  const centerY = height / 2;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] * 1.5;
    const angle = (i * Math.PI * 2) / bufferLength;
    const hue = i * 5;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(0, 0, barWidth, barHeight);
    ctx.restore();
  }
}
