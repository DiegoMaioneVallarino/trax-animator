import "./AudioDetectionControls.css";

import type {
  AudioDetectionSettings,
} from "../../features/project/project.types";

interface AudioDetectionControlsProps {
  settings: AudioDetectionSettings;
  onChange: (
    changes: Partial<AudioDetectionSettings>,
  ) => void;
}

export function AudioDetectionControls({
  settings,
  onChange,
}: AudioDetectionControlsProps) {
  return (
    <section className="audio-detection-controls">
      <div className="audio-detection-controls__header">
        <h3>Audio Detection</h3>
        <p>Choose which frequency hits affect the visuals.</p>
      </div>

      <div className="audio-detection-controls__list">
        <label>
          <span>
            <strong>Bass</strong>
            <small>Low frequency hits</small>
          </span>

          <input
            type="checkbox"
            checked={settings.bass}
            onChange={(event) =>
              onChange({
                bass: event.target.checked,
              })
            }
          />
        </label>

        <label>
          <span>
            <strong>Snare</strong>
            <small>Mid frequency hits</small>
          </span>

          <input
            type="checkbox"
            checked={settings.snare}
            onChange={(event) =>
              onChange({
                snare: event.target.checked,
              })
            }
          />
        </label>

        <label>
          <span>
            <strong>Hi-hats</strong>
            <small>High frequency hits</small>
          </span>

          <input
            type="checkbox"
            checked={settings.hat}
            onChange={(event) =>
              onChange({
                hat: event.target.checked,
              })
            }
          />
        </label>
      </div>
    </section>
  );
}
