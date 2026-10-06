import type {
  BackgroundMotion,
  BackgroundSettings,
} from "../../features/project/project.types";

import "./Controls.css";

interface BackgroundControlsProps {
  background: BackgroundSettings;

  onChange: (
    changes: Partial<BackgroundSettings>,
  ) => void;
}

export function BackgroundControls({
  background,
  onChange,
}: BackgroundControlsProps) {
  return (
    <section className="control-panel">
      <div className="control-panel__header">
        <div>
          <h2>Background</h2>

          <p>
            Appearance and movement
          </p>
        </div>
      </div>

      <div className="control">
        <div className="control__header">
          <label>
            Position X
          </label>

          <span>
            {Math.round(
              background.x * 100,
            )}
            %
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={background.x}
          onChange={(event) => {
            onChange({
              x: Number(
                event.target.value,
              ),
            });
          }}
        />
      </div>

      <div className="control">
        <div className="control__header">
          <label>
            Position Y
          </label>

          <span>
            {Math.round(
              background.y * 100,
            )}
            %
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={background.y}
          onChange={(event) => {
            onChange({
              y: Number(
                event.target.value,
              ),
            });
          }}
        />
      </div>

      <div className="control">
        <div className="control__header">
          <label>
            Zoom
          </label>

          <span>
            {background.scale.toFixed(2)}×
          </span>
        </div>

        <input
          type="range"
          min={1}
          max={2}
          step={0.01}
          value={background.scale}
          onChange={(event) => {
            onChange({
              scale: Number(
                event.target.value,
              ),
            });
          }}
        />
      </div>

      <div className="control">
        <div className="control__header">
          <label>
            Blur
          </label>

          <span>
            {background.blur}px
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={40}
          step={1}
          value={background.blur}
          onChange={(event) => {
            onChange({
              blur: Number(
                event.target.value,
              ),
            });
          }}
        />
      </div>

      <div className="control">
        <div className="control__header">
          <label>
            Brightness
          </label>

          <span>
            {Math.round(
              background.brightness *
                100,
            )}
            %
          </span>
        </div>

        <input
          type="range"
          min={0.2}
          max={1.5}
          step={0.01}
          value={background.brightness}
          onChange={(event) => {
            onChange({
              brightness: Number(
                event.target.value,
              ),
            });
          }}
        />
      </div>

      <div className="control">
        <div className="control__header">
          <label>
            Motion
          </label>
        </div>

        <select
          className="control__select"
          value={background.motion}
          onChange={(event) => {
            onChange({
              motion:
                event.target.value as BackgroundMotion,
            });
          }}
        >
          <option value="static">
            Static
          </option>

          <option value="zoom-in">
            Slow zoom in
          </option>

          <option value="zoom-out">
            Slow zoom out
          </option>

          <option value="drift-left">
            Drift left
          </option>

          <option value="drift-right">
            Drift right
          </option>
        </select>
      </div>

      {background.motion !==
        "static" && (
        <div className="control">
          <div className="control__header">
            <label>
              Motion amount
            </label>

            <span>
              {Math.round(
                background.motionAmount *
                  100,
              )}
              %
            </span>
          </div>

          <input
            type="range"
            min={0.01}
            max={0.2}
            step={0.01}
            value={
              background.motionAmount
            }
            onChange={(event) => {
              onChange({
                motionAmount:
                  Number(
                    event.target.value,
                  ),
              });
            }}
          />
        </div>
      )}
    </section>
  );
}