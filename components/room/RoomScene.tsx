"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import Experience from "./engine/Experience";
import { hotspots, wallText } from "@/data/room";

type Props = {
  /** Receives the imperative handle (next/dynamic does not forward refs). */
  handleRef: MutableRefObject<RoomHandle | null>;
  interactive: boolean;
  night: boolean;
  onSelect: (key: string) => void;
  onProgress: (loaded: number, total: number) => void;
  onReady: () => void;
  onError: (message: string) => void;
};

export type RoomHandle = {
  /** Fly the camera to a section's object; `onArrive` fires as the camera settles. */
  focus: (key: string, onArrive?: () => void) => void;
  /** Fly back and hand control to the visitor. */
  release: () => void;
};

/** Mounts the Three.js room into a full-screen div. Callbacks are read through refs so the scene is built once. */
export default function RoomScene({ handleRef, interactive, night, onSelect, onProgress, onReady, onError }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const tooltip = useRef<HTMLDivElement>(null);
  const experience = useRef<Experience | null>(null);
  const callbacks = useRef({ onSelect, onProgress, onReady, onError });
  callbacks.current = { onSelect, onProgress, onReady, onError };
  const initialNight = useRef(night);

  useEffect(() => {
    handleRef.current = {
      focus: (key, onArrive) => {
        if (experience.current) experience.current.focus(key, onArrive);
        else onArrive?.();
      },
      release: () => experience.current?.release(),
    };
    return () => {
      handleRef.current = null;
    };
  }, [handleRef]);

  useEffect(() => {
    if (!host.current) return;
    const exp = new Experience({
      target: host.current,
      tooltip: tooltip.current,
      hotspots,
      world: { wallName: wallText.lines, wallSubtitle: wallText.subtitle, night: initialNight.current },
      onSelect: (key) => callbacks.current.onSelect(key),
      onProgress: (l, t) => callbacks.current.onProgress(l, t),
      onReady: () => callbacks.current.onReady(),
      onError: (m) => callbacks.current.onError(m),
    });
    experience.current = exp;
    if (process.env.NODE_ENV !== "production") (window as unknown as { __room?: Experience }).__room = exp;
    return () => {
      exp.destroy();
      experience.current = null;
    };
  }, []);

  useEffect(() => {
    experience.current?.setInteractive(interactive);
  }, [interactive]);

  useEffect(() => {
    experience.current?.setNight(night);
  }, [night]);

  return (
    <div className="experience" ref={host} aria-label="Interactive 3D room">
      <div className="hotspot-tooltip" ref={tooltip} />
    </div>
  );
}
