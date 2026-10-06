import "./Controls.css";

interface AudioControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;

  onToggle: () => void;
  onSeek: (time: number) => void;
}

function formatTime(
  seconds: number,
) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes =
    Math.floor(seconds / 60);

  const remainingSeconds =
    Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

export function AudioControls({
  isPlaying,
  currentTime,
  duration,
  onToggle,
  onSeek,
}: AudioControlsProps) {
  return (
    <div className="audio-controls">
      <button
        className="audio-controls__play"
        type="button"
        onClick={onToggle}
        disabled={duration <= 0}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>

      <span className="audio-controls__time">
        {formatTime(currentTime)}
      </span>

      <input
        className="audio-controls__timeline"
        type="range"
        min={0}
        max={duration || 0}
        step={0.01}
        value={currentTime}
        disabled={duration <= 0}
        onChange={(event) => {
          onSeek(
            Number(
              event.target.value,
            ),
          );
        }}
      />

      <span className="audio-controls__time">
        {formatTime(duration)}
      </span>
    </div>
  );
}