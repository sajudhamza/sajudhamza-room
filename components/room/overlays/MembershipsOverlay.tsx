"use client";

import { useEffect, useState } from "react";
import Shell from "./Shell";
import { site } from "@/data/content";
import { membershipItems } from "@/data/room";

const CARD_COLORS = [
  ["#312e81", "#6366f1"],
  ["#7f1d1d", "#f43f5e"],
  ["#064e3b", "#10b981"],
  ["#1e3a8a", "#0ea5e9"],
];

/** Memberships are ID cards filed in the desk drawer; the drawer slides open and cards flip. */
export default function MembershipsOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [flipped, setFlipped] = useState<number | null>(null);
  useEffect(() => {
    if (!open) setFlipped(null);
  }, [open]);

  return (
    <Shell cls="drawer-overlay" open={open} onClose={onClose} label="Memberships">
      <div className="drawer-overlay__center">
        <div className="cabinet">
          <div className="cabinet__label">MEMBERSHIPS · {membershipItems.length} CARDS · click a card to flip</div>
          <div className="cabinet__drawer">
            <div className="cabinet__cards">
              {membershipItems.map((m, i) => {
                const [c1, c2] = CARD_COLORS[i % CARD_COLORS.length];
                return (
                  <button
                    key={m.name}
                    className={`idcard${flipped === i ? " is-flipped" : ""}`}
                    style={{ ["--c1" as string]: c1, ["--c2" as string]: c2, ["--i" as string]: i }}
                    onClick={() => setFlipped(flipped === i ? null : i)}
                    aria-label={`${m.name} membership card`}
                  >
                    <span className="idcard__inner">
                      <span className="idcard__face idcard__front">
                        <span className="idcard__chip" />
                        <span className="idcard__logo">
                          {m.name.slice(0, 1)}
                          {m.image ? <img src={m.image} alt="" onError={(e) => (e.currentTarget.style.display = "none")} /> : null}
                        </span>
                        <span className="idcard__org">{m.name}</span>
                        <span className="idcard__holder">
                          <small>{m.role.toUpperCase()}</small>
                          {site.name} {site.surname}
                        </span>
                      </span>
                      <span className="idcard__face idcard__back">
                        <span className="idcard__stripe" />
                        <span className="idcard__desc">{m.body}</span>
                        <span className="idcard__sig">{site.name}</span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="cabinet__handle" />
          </div>
          <div className="cabinet__front" />
        </div>
      </div>
    </Shell>
  );
}
