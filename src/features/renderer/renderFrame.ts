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
    project,
    time,
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
  project: RenderFrameOptions["project"],
  time: number,
) {
  const {
    width,
    height,
  } = project.output;

  const background =
    project.background;

  const imageRatio =
    image.naturalWidth /
    image.naturalHeight;

  const canvasRatio =
    width / height;

  let baseWidth: number;
  let baseHeight: number;

  if (imageRatio > canvasRatio) {
    baseHeight = height;

    baseWidth =
      baseHeight * imageRatio;
  } else {
    baseWidth = width;

    baseHeight =
      baseWidth / imageRatio;
  }

  let animatedScale = 1;
  let driftX = 0;

  const motionProgress =
    Math.min(
      time / 60,
      1,
    );

  switch (background.motion) {
    case "zoom-in":
      animatedScale =
        1 +
        background.motionAmount *
          motionProgress;

      break;

    case "zoom-out":
      animatedScale =
        1 +
        background.motionAmount *
          (1 - motionProgress);

      break;

    case "drift-left":
      driftX =
        -width *
        background.motionAmount *
        motionProgress;

      break;

    case "drift-right":
      driftX =
        width *
        background.motionAmount *
        motionProgress;

      break;
  }

  const drawWidth =
    baseWidth *
    background.scale *
    animatedScale;

  const drawHeight =
    baseHeight *
    background.scale *
    animatedScale;

  const overflowX =
    drawWidth - width;

  const overflowY =
    drawHeight - height;

  const x =
    -overflowX *
      background.x +
    driftX;

  const y =
    -overflowY *
    background.y;

  ctx.save();

  ctx.filter = [
    `blur(${background.blur}px)`,
    `brightness(${background.brightness})`,
  ].join(" ");

  ctx.drawImage(
    image,
    x,
    y,
    drawWidth,
    drawHeight,
  );

  ctx.restore();
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

  const vinyl =
    project.vinyl;

  const diameter =
    Math.min(width, height) *
    vinyl.size;

  const radius =
    diameter / 2;

  const centerX =
    width * vinyl.x;

  const centerY =
    height * vinyl.y;

  const rotationsPerSecond =
    vinyl.rpm / 60;

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

  // Shadow
  if (
    vinyl.shadowOpacity > 0 &&
    vinyl.shadowBlur > 0
  ) {
    ctx.save();

    ctx.shadowColor =
      `rgba(0, 0, 0, ${vinyl.shadowOpacity})`;

    ctx.shadowBlur =
      vinyl.shadowBlur;

    ctx.shadowOffsetX =
      vinyl.shadowOffsetX;

    ctx.shadowOffsetY =
      vinyl.shadowOffsetY;

    ctx.fillStyle =
      "rgba(0, 0, 0, 1)";

    ctx.beginPath();

    ctx.arc(
      0,
      0,
      radius,
      0,
      Math.PI * 2,
    );

    ctx.fill();

    ctx.restore();
  }

  // Circular image
  ctx.save();

  ctx.beginPath();

  ctx.arc(
    0,
    0,
    radius,
    0,
    Math.PI * 2,
  );

  ctx.clip();

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

  // Border
  if (vinyl.borderWidth > 0) {
    ctx.beginPath();

    ctx.arc(
      0,
      0,
      radius -
        vinyl.borderWidth / 2,
      0,
      Math.PI * 2,
    );

    ctx.strokeStyle =
      vinyl.borderColor;

    ctx.lineWidth =
      vinyl.borderWidth;

    ctx.stroke();
  }

  ctx.restore();
}