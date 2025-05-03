import { useEffect, useRef, useState } from "react";
import { IoChevronForwardOutline, IoChevronBackOutline } from "react-icons/io5";
import { spiralBars } from "./visualizer-patterns/spiralBars";
import { mirroredBars } from "./visualizer-patterns/mirroredBars";
import "./visualizerStyle.css";

export default function AudioVisualizer({ audioRef }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const analyserRef = useRef(null);

  const [index, setIndex] = useState(0);
  const patterns = [
    {
      name: "Spiral Bars",
      draw: spiralBars,
      fftSize: 256,
      barWidth: 2,
    },
    {
      name: "Mirrored Bars",
      draw: mirroredBars,
      fftSize: 64,
      barWidth: 3,
    },
  ];

  useEffect(() => {
    if (!audioRef.current) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    const audioCtx = audioContextRef.current;

    if (!sourceRef.current && audioRef.current) {
      try {
        sourceRef.current = audioCtx.createMediaElementSource(audioRef.current);
        analyserRef.current = audioCtx.createAnalyser();

        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioCtx.destination);
      } catch (err) {
        console.warn("MediaElementSourceNode already exists:", err.message);
        return;
      }
    }

    const { fftSize, barWidth, draw } = patterns[index];

    const analyser = analyserRef.current;
    analyser.fftSize = fftSize;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = containerRef.current.clientWidth;
    canvas.height = containerRef.current.clientHeight;

    const drawPattern = () => {
      animationRef.current = requestAnimationFrame(drawPattern);

      analyser.getByteFrequencyData(dataArray);
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      draw(ctx, canvas.width, canvas.height, bufferLength, dataArray, barWidth);
    };

    drawPattern();

    return () => cancelAnimationFrame(animationRef.current);
  }, [audioRef.current, index]);

  const goForwardPattern = () => {
    setIndex((prev) => (prev + 1) % 2);
  };

  const goBackPattern = () => {
    setIndex((prev) => (prev - 1 + 2) % 2);
  };

  return (
    <div ref={containerRef} className="relative w-full h-64 bg-black">
      <canvas ref={canvasRef} className="w-full h-full" />
      <p className="absolute bottom-2 left-2 text-white text-sm">
        {patterns[index].name}
      </p>

      <div className="absolute bottom-2 right-2 flex gap-2 text-white">
        <button onClick={goBackPattern}>
          <IoChevronBackOutline />
        </button>
        <button onClick={goForwardPattern}>
          <IoChevronForwardOutline />
        </button>
      </div>
    </div>
  );
}
