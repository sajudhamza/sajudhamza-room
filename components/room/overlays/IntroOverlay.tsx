"use client";

import Shell from "./Shell";
import DriveGame from "./DriveGame";

/** The introduction lives on the desk monitor: the camera zooms to the PC and a driving game powers on. */
export default function IntroOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Shell cls="screen-overlay" open={open} onClose={onClose} label="Introduction">
      <div className="screen-overlay__center">
        <div className="monitor monitor--game">
          <div className="monitor__bar">
            <span className="monitor__dots">
              <i />
              <i />
              <i />
            </span>
            <span className="monitor__title">sajud@portfolio ~ /drive</span>
            <span className="monitor__hint">← ↑ → ↓</span>
          </div>
          <div className="monitor__body monitor__body--game">
            <DriveGame active={open} />
          </div>
        </div>
      </div>
    </Shell>
  );
}
