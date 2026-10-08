
import "./Controls.css";

interface AudioControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onToggle: () => void;
  onSeek: (time: number) => void;
}

export function AudioControls({
  isPlaying,
  currentTime,
  duration,
  onToggle,
  onSeek,
}: AudioControlsProps) {
  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) {
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60);

    return `${minutes}:${String(remaining).padStart(2, "0")}`;
  };

  return (
    <section className="audio-controls">
      <h3>Audio Playback</h3>

      <div className="audio-controls__player">
        <button
          type="button"
          onClick={onToggle}
          disabled={duration <= 0}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <span>{formatTime(currentTime)}</span>

        <input
          type="range"
          min={0}
          max={duration || 1}
          step={0.01}
          value={Math.min(currentTime, duration || 1)}
          disabled={duration <= 0}
          onChange={(event) => {
            onSeek(Number(event.target.value));
          }}
        />

        <span>{formatTime(duration)}</span>
      </div>
    </section>
  );
}
