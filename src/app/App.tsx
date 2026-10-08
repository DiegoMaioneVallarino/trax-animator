
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  VideoPreview,
} from "../components/Preview/VideoPreview";

import {
  RenderedPreview,
} from "../components/Preview/RenderedPreview";

import {
  UploadPanel,
} from "../components/UploadPanel/UploadPanel";

import {
  AudioControls,
} from "../components/Controls/AudioControls";

import {
  BackgroundControls,
} from "../components/Controls/BackgroundControls";

import {
  VinylControls,
} from "../components/Controls/VinylControls";

import {
  ExportPanel,
} from "../components/ExportPanel/ExportPanel";

import {
  createProject,
} from "../features/project/project.store";

import type {
  VideoProject,
} from "../features/project/project.types";

import type {
  AudioAnalysis,
} from "../features/audio/audioAnalysis.types";

import {
  useAudio,
} from "../hooks/useAudio";

import {
  analyzeAudio,
} from "../features/audio/analyzeAudio";

import {
  renderPreview,
} from "../features/export/renderPreview";

import "./App.css";

export default function App() {
  const [project, setProject] =
    useState<VideoProject>(createProject);

  const [audioAnalysis, setAudioAnalysis] =
    useState<AudioAnalysis | null>(null);

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [isRendering, setIsRendering] =
    useState(false);

  const [renderProgress, setRenderProgress] =
    useState(0);

  const [renderedUrl, setRenderedUrl] =
    useState<string | null>(null);

  const renderedUrlRef =
    useRef<string | null>(null);

  const audio = useAudio({
    url: project.audio.url,
  });

  // Release temporary uploaded-file URLs.

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

  useEffect(() => {
    return () => {
      if (renderedUrlRef.current) {
        URL.revokeObjectURL(
          renderedUrlRef.current,
        );
      }
    };
  }, []);

  function closeRenderedPreview() {
    if (renderedUrlRef.current) {
      URL.revokeObjectURL(
        renderedUrlRef.current,
      );

      renderedUrlRef.current = null;
    }

    setRenderedUrl(null);
  }

  // Audio upload and analysis.

  async function setAudio(file: File) {
    const url = URL.createObjectURL(file);

    closeRenderedPreview();

    setProject((current) => ({
      ...current,
      audio: {
        ...current.audio,
        file,
        url,
        name: file.name,
        duration: 0,
      },
    }));

    setAudioAnalysis(null);
    setIsAnalyzing(true);

    try {
      const analysis = await analyzeAudio(file);

      setAudioAnalysis(analysis);

      setProject((current) => {
        if (current.audio.file !== file) {
          return current;
        }

        return {
          ...current,
          audio: {
            ...current.audio,
            duration: analysis.duration,
          },
        };
      });

      console.log(
        "[Trax] Audio analysis:",
        analysis,
      );
    } catch (error) {
      console.error(
        "[Trax] Audio analysis failed:",
        error,
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  // Background upload and controls.

  function setBackground(file: File) {
    const url = URL.createObjectURL(file);

    closeRenderedPreview();

    setProject((current) => ({
      ...current,
      background: {
        ...current.background,
        file,
        url,
      },
    }));
  }

  function updateBackground(
    changes: Partial<VideoProject["background"]>,
  ) {
    setProject((current) => ({
      ...current,
      background: {
        ...current.background,
        ...changes,
      },
    }));
  }

  // Vinyl upload and controls.

  function setVinyl(file: File) {
    const url = URL.createObjectURL(file);

    closeRenderedPreview();

    setProject((current) => ({
      ...current,
      vinyl: {
        ...current.vinyl,
        file,
        url,
      },
    }));
  }

  function updateVinyl(
    changes: Partial<VideoProject["vinyl"]>,
  ) {
    setProject((current) => ({
      ...current,
      vinyl: {
        ...current.vinyl,
        ...changes,
      },
    }));
  }

  // Render video preview with embedded audio.

  async function handleRenderPreview() {
    if (isRendering || isAnalyzing) {
      return;
    }

    if (!project.audio.file) {
      alert(
        "Upload an audio file before rendering.",
      );
      return;
    }

    audio.pause();

    closeRenderedPreview();

    setIsRendering(true);
    setRenderProgress(0);

    console.log("[Trax] Render requested");

    try {
      const result = await renderPreview({
        project,
        audioAnalysis,
        duration: Math.min(
          10,
          project.audio.duration ||
            audio.duration ||
            10,
        ),
        fps: 30,
        onProgress: (status) => {
          setRenderProgress(status.progress);
        },
      });

      renderedUrlRef.current = result.url;

      setRenderedUrl(result.url);

      console.log(
        "[Trax] Render completed:",
        result,
      );
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

  return (
    <main className="app">
      <header className="app__header">
        <div>
          <h1>Trax Animator</h1>
          <p>Vinyl video generator</p>
        </div>
      </header>

      <section className="app__workspace">
        {/* Editor or rendered video */}

        {renderedUrl ? (
          <div className="app__rendered-preview">
            <RenderedPreview
              url={renderedUrl}
            />

            <button
              type="button"
              onClick={closeRenderedPreview}
            >
              Back to Editor
            </button>
          </div>
        ) : (
          <VideoPreview
            project={project}
            time={audio.currentTime}
            audioAnalysis={audioAnalysis}
            onVinylChange={updateVinyl}
          />
        )}

        {/* Video rendering */}

        <ExportPanel
          isRendering={isRendering}
          progress={renderProgress}
          onRender={handleRenderPreview}
        />

        {/* File uploads */}

        <UploadPanel
          onAudioChange={setAudio}
          onBackgroundChange={setBackground}
          onVinylChange={setVinyl}
        />

        {/* Vinyl settings */}

        <VinylControls
          vinyl={project.vinyl}
          onChange={updateVinyl}
        />

        {/* Background settings */}

        <BackgroundControls
          background={project.background}
          onChange={updateBackground}
        />

        {/* Editor audio playback */}

        {!renderedUrl && (
          <AudioControls
            isPlaying={audio.isPlaying}
            currentTime={audio.currentTime}
            duration={audio.duration}
            onToggle={() => {
              void audio.toggle();
            }}
            onSeek={audio.seek}
          />
        )}
      </section>
    </main>
  );
}
