interface RenderedPreviewProps {
  url: string;
  audioUrl: string | null;
}

export function RenderedPreview({
  url,
  audioUrl,
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

      {audioUrl && (
        <p
          style={{
            color: "#888",
            fontSize: 12,
          }}
        >
          Audio is not embedded in this preview yet.
        </p>
      )}
    </div>
  );
}