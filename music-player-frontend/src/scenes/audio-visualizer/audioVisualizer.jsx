import { useEffect, useRef, useState } from "react";
import { IoChevronForwardOutline, IoChevronBackOutline } from "react-icons/io5";
import "./visualizerStyle.css";

export default function AudioVisualizer({ audioRef }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const analyserRef = useRef(null);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!audioRef.current) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    const audioCtx = audioContextRef.current;

    // Prevent recreating the MediaElementSourceNode
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

    const analyser = analyserRef.current;
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const barWidth = 2;
    canvas.width = containerRef.current.clientWidth;
    canvas.height = containerRef.current.clientHeight;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

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
    };

    draw();

    return () => cancelAnimationFrame(animationRef.current);
  }, [audioRef.current]);

  // console.log(audioRef);
  // console.log(audioRef.current);
  // console.log(audioRef.current.currentSrc);
  console.log("Visualizer is connected to:", audioRef.current.src);

  const goForwardPattern = () => {
    setIndex((prev) => (prev + 1) % 2);
  };

  const goBackPattern = () => {
    setIndex((prev) => (prev - 1 + 2) % 2);
  };

  return (
    <div ref={containerRef} className="relative w-full h-64 bg-black">
      <canvas ref={canvasRef} className="w-full h-full" />
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
