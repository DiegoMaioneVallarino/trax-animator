import "./ExportPanel.css";

interface ExportPanelProps {
  isRendering: boolean;
  progress: number;
  onRender: () => void;
}

export function ExportPanel({
  isRendering,
  progress,
  onRender,
}: ExportPanelProps) {
  return (
    <section className="export-panel">
      <div>
        <h2>Render Preview</h2>
        <p>
          Generate a 10-second preview
          at 960 × 540.
        </p>
      </div>

      {isRendering && (
        <div className="export-panel__progress">
          <div
            className="export-panel__progress-fill"
            style={{
              width: `${progress * 100}%`,
            }}
          />

          <span>
            {Math.round(progress * 100)}%
          </span>
        </div>
      )}

      <button
  type="button"
  disabled={isRendering}
  onClick={onRender}
>
  {isRendering
    ? "Rendering..."
    : "Render Preview"}
</button>
    </section>
  );
}