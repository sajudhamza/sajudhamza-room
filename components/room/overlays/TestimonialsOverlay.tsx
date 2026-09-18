"use client";

import { useEffect, useRef, useState } from "react";
import Shell, { Avatar } from "./Shell";
import { testimonialItems } from "@/data/room";

/** Testimonials arrive as chat messages from the people who wrote them. */
export default function TestimonialsOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [shown, setShown] = useState(-1);
  const [typing, setTyping] = useState(false);
  const [pdf, setPdf] = useState<string | null>(null);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setPdf(null);
      setShown(-1);
      setTyping(false);
      return;
    }
    let i = -1;
    let cancelled = false;
    const timers: number[] = [];
    const nextMessage = () => {
      if (cancelled || i + 1 >= testimonialItems.length) return;
      setTyping(true);
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return;
          i += 1;
          setTyping(false);
          setShown(i);
          timers.push(window.setTimeout(nextMessage, 900));
        }, 1300)
      );
    };
    timers.push(window.setTimeout(nextMessage, 500));
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [open]);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [shown, typing]);

  return (
    <Shell cls="chat-overlay" open={open} onClose={onClose} label="Testimonials">
      <div className="chat-overlay__center" style={{ display: pdf ? "none" : undefined }}>
        <div className="chat">
          <div className="chat__head">
            <div className="chat__avatars">
              {testimonialItems.map((t) => (
                <Avatar key={t.name} src={t.photo} name={t.name} className="chat__avatar" />
              ))}
            </div>
            <div>
              <div className="chat__title">Recommendations</div>
              <div className="chat__sub">{testimonialItems.map((t) => t.name.split(" ")[0]).join(", ")}</div>
            </div>
          </div>

          <div className="chat__list" ref={list}>
            <div className="chat__system">Colleagues, mentors and collaborators on working with Sajud</div>
            {testimonialItems.slice(0, shown + 1).map((t) => (
              <div className="msg" key={t.name}>
                <Avatar src={t.photo} name={t.name} className="msg__avatar" />
                <div className="msg__col">
                  <div className="msg__name">
                    {t.name} <span>· {t.role}</span>
                  </div>
                  <div className="msg__bubble">{t.quote}</div>
                  {t.pdf ? (
                    <button className="msg__file" onClick={() => setPdf(t.pdf!)}>
                      <i>PDF</i> Recommendation letter · open
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
            {typing ? (
              <div className="msg msg--typing">
                <Avatar
                  src={testimonialItems[shown + 1]?.photo}
                  name={testimonialItems[shown + 1]?.name ?? ""}
                  className="msg__avatar"
                />
                <div className="msg__col">
                  <div className="msg__bubble msg__bubble--typing">
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="chat__foot">
            <span className="chat__input">Say thanks…</span>
            <span className="chat__send">➤</span>
          </div>
        </div>
      </div>

      <div className={`test-pdf${pdf ? " is-open" : ""}`}>
        <button className="test-pdf__back" onClick={() => setPdf(null)}>
          &#9664; Back to chat
        </button>
        {pdf ? <iframe src={pdf} title="Recommendation letter" /> : null}
      </div>
    </Shell>
  );
}
