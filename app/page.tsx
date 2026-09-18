"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { OverlayKey } from "@/data/room";
import type { RoomHandle } from "@/components/room/RoomScene";
import RoomUI from "@/components/room/RoomUI";
import IntroOverlay from "@/components/room/overlays/IntroOverlay";
import QualificationsOverlay from "@/components/room/overlays/QualificationsOverlay";
import PatentsOverlay from "@/components/room/overlays/PatentsOverlay";
import BookOverlay, { type BookType } from "@/components/room/overlays/BookOverlay";
import NewsOverlay from "@/components/room/overlays/NewsOverlay";
import JudgingOverlay from "@/components/room/overlays/JudgingOverlay";
import TestimonialsOverlay from "@/components/room/overlays/TestimonialsOverlay";
import MembershipsOverlay from "@/components/room/overlays/MembershipsOverlay";
import VaultOverlay from "@/components/room/overlays/VaultOverlay";

// Three.js needs the DOM, so the scene is only rendered on the client.
const RoomScene = dynamic(() => import("@/components/room/RoomScene"), { ssr: false });

export default function Page() {
  const scene = useRef<RoomHandle>(null);
  const [active, setActive] = useState<OverlayKey | null>(null);
  const [focused, setFocused] = useState(false);
  const [bookType, setBookType] = useState<BookType>("articles");
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [night, setNight] = useState(true);

  /** Fly to the object first; the overlay appears as the camera settles. */
  const open = useCallback((key: OverlayKey) => {
    if (key === "articles" || key === "publications") setBookType(key);
    if (key === "vault") {
      setActive("vault");
      return;
    }
    setActive(null);
    setFocused(true);
    if (scene.current) scene.current.focus(key, () => setActive(key));
    else setActive(key);
  }, []);

  const close = useCallback(() => {
    setActive(null);
    setFocused(false);
    scene.current?.release();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const bookOpen = active === "articles" || active === "publications";

  return (
    <main className="room">
      <RoomScene
        handleRef={scene}
        interactive={active === null && !focused}
        night={night}
        onSelect={(key) => open(key as OverlayKey)}
        onProgress={(loaded, total) => setProgress(loaded / total)}
        onReady={() => setReady(true)}
        onError={setError}
      />

      <RoomUI progress={progress} ready={ready} error={error} active={active} night={night} onOpen={open} onToggleNight={() => setNight((n) => !n)} />

      <IntroOverlay open={active === "introduction"} onClose={close} />
      <QualificationsOverlay open={active === "qualifications"} onClose={close} />
      <PatentsOverlay open={active === "patents"} onClose={close} />
      <BookOverlay open={bookOpen} type={bookType} onClose={close} />
      <NewsOverlay open={active === "media"} onClose={close} />
      <JudgingOverlay open={active === "judging"} onClose={close} />
      <TestimonialsOverlay open={active === "testimonials"} onClose={close} />
      <MembershipsOverlay open={active === "memberships"} onClose={close} />
      <VaultOverlay open={active === "vault"} onClose={close} />
    </main>
  );
}
