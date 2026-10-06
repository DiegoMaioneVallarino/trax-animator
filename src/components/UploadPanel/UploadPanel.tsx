import "./UploadPanel.css";

interface UploadPanelProps {
  onBackgroundChange:
    (file: File) => void;

  onVinylChange:
    (file: File) => void;
}

export function UploadPanel({
  onBackgroundChange,
  onVinylChange,
}: UploadPanelProps) {
  return (
    <div className="upload-panel">
      <label className="upload-box">
        <span>Background</span>

        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file =
              event.target.files?.[0];

            if (file) {
              onBackgroundChange(file);
            }
          }}
        />
      </label>

      <label className="upload-box">
        <span>Vinyl / Disc</span>

        <input
          type="file"
          accept="image/png,image/webp"
          onChange={(event) => {
            const file =
              event.target.files?.[0];

            if (file) {
              onVinylChange(file);
            }
          }}
        />
      </label>
    </div>
  );
}