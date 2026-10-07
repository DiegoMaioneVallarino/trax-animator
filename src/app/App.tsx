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
    return () => {
      if (project.audio.url) {
        URL.revokeObjectURL(
          project.audio.url,
        );
      }

      if (project.background.url) {
        URL.revokeObjectURL(
          project.background.url,
        );
      }

      if (project.vinyl.url) {
        URL.revokeObjectURL(
          project.vinyl.url,
        );
      }
    };
  }, [
    project.audio.url,
    project.background.url,
    project.vinyl.url,
  ]);
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
       <VideoPreview
  project={project}
  time={audio.currentTime}
  audioAnalysis={audioAnalysis}
  onVinylChange={updateVinyl}
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