import type {
  RenderFrameOptions,
} from "./renderer.types";

export function renderFrame({
  ctx,
  project,
  backgroundImage,
  vinylImage,
  time,
}: RenderFrameOptions) {
  const {
    width,
    height,
  } = project.output;

  ctx.clearRect(
    0,
    0,
    width,
    height,
  );

  ctx.fillStyle = "#000";
  ctx.fillRect(
    0,
    0,
    width,
    height,
  );

  if (backgroundImage) {
    drawBackground(
      ctx,
      backgroundImage,
      width,
      height,
      project.background.scale,
    );
  }

  if (vinylImage) {
    drawVinyl(
      ctx,
      vinylImage,
      project,
      time,
    );
  }
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  scale: number,
) {
  const imageRatio =
    image.naturalWidth /
    image.naturalHeight;

  const canvasRatio =
    width / height;

  let drawWidth: number;
  let drawHeight: number;

  if (imageRatio > canvasRatio) {
    drawHeight = height;
    drawWidth =
      drawHeight * imageRatio;
  } else {
    drawWidth = width;
    drawHeight =
      drawWidth / imageRatio;
  }

  drawWidth *= scale;
  drawHeight *= scale;

  const x =
    (width - drawWidth) / 2;

  const y =
    (height - drawHeight) / 2;

  ctx.drawImage(
    image,
    x,
    y,
    drawWidth,
    drawHeight,
  );
}

function drawVinyl(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  project: RenderFrameOptions["project"],
  time: number,
) {
  const {
    width,
    height,
  } = project.output;

  const {
    x,
    y,
    size,
    rpm,
  } = project.vinyl;

  const diameter =
    Math.min(width, height) *
    size;

  const radius =
    diameter / 2;

  const centerX =
    width * x;

  const centerY =
    height * y;

  const rotationsPerSecond =
    rpm / 60;

  const angle =
    time *
    rotationsPerSecond *
    Math.PI *
    2;

  ctx.save();

  ctx.translate(
    centerX,
    centerY,
  );

  ctx.rotate(angle);

  // Circular mask
  ctx.beginPath();

  ctx.arc(
    0,
    0,
    radius,
    0,
    Math.PI * 2,
  );

  ctx.closePath();
  ctx.clip();

  // Draw image inside circle
  const sourceSize =
  Math.min(
    image.naturalWidth,
    image.naturalHeight,
  );

const sourceX =
  (
    image.naturalWidth -
    sourceSize
  ) / 2;

const sourceY =
  (
    image.naturalHeight -
    sourceSize
  ) / 2;

ctx.drawImage(
  image,

  sourceX,
  sourceY,
  sourceSize,
  sourceSize,

  -radius,
  -radius,
  diameter,
  diameter,
);

  ctx.restore();
}