import {
  useEffect,
  useState,
} from "react";

import {
  VideoPreview,
} from "../components/Preview/VideoPreview";

import {
  UploadPanel,
} from "../components/UploadPanel/UploadPanel";

import {
  AudioControls,
} from "../components/Controls/AudioControls";

import {
  createProject,
} from "../features/project/project.store";

import type {
  VideoProject,
} from "../features/project/project.types";

import {
  useAudio,
} from "../hooks/useAudio";
import {
  analyzeAudio,
} from "../features/audio/analyzeAudio";

import {
  renderPreview,
} from "../features/export/renderPreview";

import {
  ExportPanel,
} from "../components/ExportPanel/ExportPanel";

import {
  RenderedPreview,
} from "../components/Preview/RenderedPreview";

import type {
  AudioAnalysis,
} from "../features/audio/audioAnalysis.types";
import {
  BackgroundControls,
} from "../components/Controls/BackgroundControls";

import "./App.css";
import {
  VinylControls,
} from "../components/Controls/VinylControls";
export default function App() {
  const [
    project,
    setProject,
  ] = useState<VideoProject>(
    createProject,
  );
const [
  audioAnalysis,
  setAudioAnalysis,
] = useState<AudioAnalysis | null>(
  null,
);

const [
  isAnalyzing,
  setIsAnalyzing,
] = useState(false);
  const audio = useAudio({
    url: project.audio.url,
  });


const [
  isRendering,
  setIsRendering,
] = useState(false);

const [
  renderProgress,
  setRenderProgress,
] = useState(0);

const [
  renderedUrl,
  setRenderedUrl,
] = useState<string | null>(null);

async function handleRenderPreview() {
  if (isRendering) return;

  console.log("[Trax] Render requested");

  setIsRendering(true);
  setRenderProgress(0);

  try {
    console.log("[Trax] Starting renderer");

    const result = await renderPreview({
      project,
      audioAnalysis,
      duration: Math.min(
        10,
        audio.duration || 10,
      ),
      fps: 30,
      onProgress: (status) => {
        console.log(
          "[Trax] Progress:",
          status.currentFrame,
          "/",
          status.totalFrames,
        );

        setRenderProgress(status.progress);
      },
    });

    console.log(
      "[Trax] Render completed:",
      result,
    );

    setRenderedUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }

      return result.url;
    });
  } catch (error) {
    console.error(
      "[Trax] Render failed:",
      error,
    );

    alert(
      error instanceof Error
        ? error.message
        : "Unknown rendering error",
    );
  } finally {
    setIsRendering(false);
  }
}

function updateBackground(
  changes: Partial<
    VideoProject["background"]
  >,
) {
  setProject((current) => ({
    ...current,

    background: {
      ...current.background,
      ...changes,
    },
  }));
}
  async function setAudio(
  file: File,
) {
  const url =
    URL.createObjectURL(file);

  setProject((current) => ({
    ...current,

    audio: {
      ...current.audio,
      file,
      url,
      name: file.name,
    },
  }));

  setAudioAnalysis(null);
  setIsAnalyzing(true);

  try {
    const analysis =
      await analyzeAudio(file);

    setAudioAnalysis(
      analysis,
    );

    console.log(
      "Audio analysis:",
      analysis,
    );
  } catch (error) {
    console.error(
      "Audio analysis failed:",
      error,
    );
  } finally {
    setIsAnalyzing(false);
  }
}

  function setBackground(
    file: File,
  ) {
    const url =
      URL.createObjectURL(file);

    setProject((current) => ({
      ...current,

      background: {
        ...current.background,
        file,
        url,
      },
    }));
  }

  function setVinyl(
    file: File,
  ) {
    const url =
      URL.createObjectURL(file);

    setProject((current) => ({
      ...current,

      vinyl: {
        ...current.vinyl,
        file,
        url,
      },
    }));
  }

  useEffect(() => {
  const url = project.audio.url;

  return () => {
    if (url) {
      URL.revokeObjectURL(url);
    }
  };
}, [project.audio.url]);

useEffect(() => {
  const url = project.background.url;

  return () => {
    if (url) {
      URL.revokeObjectURL(url);
    }
  };
}, [project.background.url]);

useEffect(() => {
  const url = project.vinyl.url;

  return () => {
    if (url) {
      URL.revokeObjectURL(url);
    }
  };
}, [project.vinyl.url]);
function updateVinyl(
  changes: Partial<
    VideoProject["vinyl"]
  >,
) {
  setProject((current) => ({
    ...current,

    vinyl: {
      ...current.vinyl,
      ...changes,
    },
  }));
}
  return (
    <main className="app">
      <header className="app__header">
        <div>
          <h1>
            Trax Animator
          </h1>

          <p>
            Vinyl video generator
          </p>
        </div>
      </header>

      <section className="app__workspace">
{renderedUrl ? (
  <RenderedPreview
    url={renderedUrl}
    audioUrl={project.audio.url}
  />
) : (
  <VideoPreview
    project={project}
    time={audio.currentTime}
    audioAnalysis={audioAnalysis}
    onVinylChange={updateVinyl}
  />
)}

<ExportPanel
  isRendering={isRendering}
  progress={renderProgress}
  onRender={handleRenderPreview}
/>

        <UploadPanel
          onAudioChange={
            setAudio
          }
          onBackgroundChange={
            setBackground
          }
          onVinylChange={
            setVinyl
          }
        />
<VinylControls
  vinyl={project.vinyl}
  onChange={updateVinyl}
/>
<BackgroundControls
  background={project.background}
  onChange={updateBackground}
/>
        <AudioControls
          isPlaying={
            audio.isPlaying
          }
          currentTime={
            audio.currentTime
          }
          duration={
            audio.duration
          }
          onToggle={() => {
            void audio.toggle();
          }}
          onSeek={
            audio.seek
          }
        />
      </section>
    </main>
  );
}