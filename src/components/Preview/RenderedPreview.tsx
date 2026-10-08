
interface RenderedPreviewProps {
  url: string;
}

export function RenderedPreview({
  url,
}: RenderedPreviewProps) {
  return (
    <div className="rendered-preview">
      <video
        src={url}
        controls
        playsInline
        style={{
          width: "100%",
          borderRadius: 12,
          background: "#000",
        }}
      />
    </div>
  );
}
