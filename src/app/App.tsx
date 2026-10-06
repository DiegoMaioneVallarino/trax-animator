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
  createProject,
} from "../features/project/project.store";

import type {
  VideoProject,
} from "../features/project/project.types";

import "./App.css";

export default function App() {
  const [
    project,
    setProject,
  ] = useState<VideoProject>(
    createProject,
  );

  useEffect(() => {
    return () => {
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
    project.background.url,
    project.vinyl.url,
  ]);

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

  return (
    <main className="app">
      <header className="app__header">
        <div>
          <h1>Trax Animator</h1>

          <p>
            Vinyl video generator
          </p>
        </div>
      </header>

      <section className="app__workspace">
        <VideoPreview
          project={project}
        />

        <UploadPanel
          onBackgroundChange={
            setBackground
          }
          onVinylChange={
            setVinyl
          }
        />
      </section>
    </main>
  );
}