import type {
  VinylSettings,
} from "../../features/project/project.types";

import "./Controls.css";

interface VinylControlsProps {
  vinyl: VinylSettings;

  onChange: (
    changes: Partial<VinylSettings>,
  ) => void;
}

export function VinylControls({
  vinyl,
  onChange,
}: VinylControlsProps) {
  return (
    <section className="control-panel">
      <div className="control-panel__header">
        <div>
          <h2>Vinyl</h2>
          <p>
            Position, size and rotation
          </p>
        </div>
      </div>

      <div className="control">
        <div className="control__header">
          <label htmlFor="vinyl-x">
            Position X
          </label>

          <span>
            {Math.round(vinyl.x * 100)}%
          </span>
        </div>

        <input
          id="vinyl-x"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={vinyl.x}
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
          <label htmlFor="vinyl-y">
            Position Y
          </label>

          <span>
            {Math.round(vinyl.y * 100)}%
          </span>
        </div>

        <input
          id="vinyl-y"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={vinyl.y}
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
          <label htmlFor="vinyl-size">
            Size
          </label>

          <span>
            {Math.round(vinyl.size * 100)}%
          </span>
        </div>

        <input
          id="vinyl-size"
          type="range"
          min={0.1}
          max={1}
          step={0.01}
          value={vinyl.size}
          onChange={(event) => {
            onChange({
              size: Number(
                event.target.value,
              ),
            });
          }}
        />
      </div>

      <div className="control">
        <div className="control__header">
          <label htmlFor="vinyl-rpm">
            Rotation
          </label>

          <span>
            {vinyl.rpm} RPM
          </span>
        </div>

        <input
          id="vinyl-rpm"
          type="range"
          min={0}
          max={45}
          step={1}
          value={vinyl.rpm}
          onChange={(event) => {
            onChange({
              rpm: Number(
                event.target.value,
              ),
            });
          }}
        />
      </div>

      <div className="control">
  <div className="control__header">
    <label>
      Border
    </label>

    <span>
      {vinyl.borderWidth}px
    </span>
  </div>

  <input
    type="range"
    min={0}
    max={30}
    step={1}
    value={vinyl.borderWidth}
    onChange={(event) => {
      onChange({
        borderWidth: Number(
          event.target.value,
        ),
      });
    }}
  />
</div>

<div className="control">
  <div className="control__header">
    <label>
      Border color
    </label>

    <input
      type="color"
      value={vinyl.borderColor}
      onChange={(event) => {
        onChange({
          borderColor:
            event.target.value,
        });
      }}
    />
  </div>
</div>

<div className="control">
  <div className="control__header">
    <label>
      Shadow
    </label>

    <span>
      {Math.round(
        vinyl.shadowOpacity *
          100,
      )}
      %
    </span>
  </div>

  <input
    type="range"
    min={0}
    max={1}
    step={0.01}
    value={vinyl.shadowOpacity}
    onChange={(event) => {
      onChange({
        shadowOpacity: Number(
          event.target.value,
        ),
      });
    }}
  />
</div>

<div className="control">
  <div className="control__header">
    <label>
      Shadow blur
    </label>

    <span>
      {vinyl.shadowBlur}px
    </span>
  </div>

  <input
    type="range"
    min={0}
    max={100}
    step={1}
    value={vinyl.shadowBlur}
    onChange={(event) => {
      onChange({
        shadowBlur: Number(
          event.target.value,
        ),
      });
    }}
  />
</div>

<div className="control">
  <div className="control__header">
    <label>
      Shadow X
    </label>

    <span>
      {vinyl.shadowOffsetX}px
    </span>
  </div>

  <input
    type="range"
    min={-100}
    max={100}
    step={1}
    value={vinyl.shadowOffsetX}
    onChange={(event) => {
      onChange({
        shadowOffsetX: Number(
          event.target.value,
        ),
      });
    }}
  />
</div>

<div className="control">
  <div className="control__header">
    <label>
      Shadow Y
    </label>

    <span>
      {vinyl.shadowOffsetY}px
    </span>
  </div>

  <input
    type="range"
    min={-100}
    max={100}
    step={1}
    value={vinyl.shadowOffsetY}
    onChange={(event) => {
      onChange({
        shadowOffsetY: Number(
          event.target.value,
        ),
      });
    }}
  />
</div>
    </section>
  );
}