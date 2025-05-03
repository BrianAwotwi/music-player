export function mirroredBars(
  ctx,
  width,
  height,
  bufferLength,
  dataArray,
  barWidth
) {
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    let barHeight = dataArray[i] * 2;
    const red = (i * barHeight) / 20;
    const green = i / 2;
    const blue = barHeight / 2;

    // Left mirrored bar
    ctx.fillStyle = "white";
    ctx.fillRect(width / 2 - x, height - barHeight - 30, barWidth, 15);
    ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
    ctx.fillRect(width / 2 - x, height - barHeight, barWidth, barHeight);

    x += barWidth;
  }

  x = 0; // Reset x for right side

  for (let i = 0; i < bufferLength; i++) {
    let barHeight = dataArray[i] * 2;
    const red = (i * barHeight) / 20;
    const green = i * 4;
    const blue = barHeight / 2;

    // Right mirrored bar
    ctx.fillStyle = "white";
    ctx.fillRect(width / 2 + x, height - barHeight - 30, barWidth, 15);
    ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
    ctx.fillRect(width / 2 + x, height - barHeight, barWidth, barHeight);

    x += barWidth;
  }
}
