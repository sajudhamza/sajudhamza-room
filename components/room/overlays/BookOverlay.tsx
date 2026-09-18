"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode, type TouchEvent as RTouchEvent, type WheelEvent as RWheelEvent } from "react";
import { articlesBook, publicationsBook, type BookItem } from "@/data/room";

export type BookType = "articles" | "publications";

type Flip = { dir: "forward" | "backward"; front: ReactNode; back: ReactNode; to: number; id: number };

const TURN_MS = 1250;

function ItemPage({ item, idx, type }: { item: BookItem; idx: number; type: BookType }) {
  const tags = item.tags.map((t) => (
    <span className="article-tag" key={t}>
      {t}
    </span>
  ));
  if (type === "publications") {
    return (
      <>
        <h2>{item.title}</h2>
        <h3>Publication {idx + 1}</h3>
        <p style={{ fontStyle: "italic", color: "#6b5c4a", marginBottom: 4 }}>{item.authors}</p>
        <p style={{ color: "#8b7355", fontSize: 13, marginBottom: 12 }}>
          {item.venue}, {item.year}
        </p>
        {item.summary ? <p>{item.summary}</p> : null}
        {tags.length ? <div style={{ margin: "14px 0" }}>{tags}</div> : null}
        {item.link ? (
          <p>
            <a href={item.link} target="_blank" rel="noreferrer">
              View publication &rarr;
            </a>
          </p>
        ) : null}
      </>
    );
  }
  return (
    <>
      <h2>{item.title}</h2>
      <h3>
        Article {idx + 1} · {item.venue}
        {item.year ? ` · ${item.year}` : ""}
      </h3>
      <p>{item.summary}</p>
      {tags.length ? <div style={{ margin: "14px 0" }}>{tags}</div> : null}
      {item.link ? (
        <p>
          <a href={item.link} target="_blank" rel="noreferrer">
            Read full article &rarr;
          </a>
        </p>
      ) : null}
    </>
  );
}

function TocPage({ items, type }: { items: BookItem[]; type: BookType }) {
  return (
    <>
      <h2>{type === "publications" ? "Publications" : "Articles"}</h2>
      <h3>Table of Contents</h3>
      <ul style={{ listStyle: "none", padding: 0, marginTop: 10 }}>
        {items.map((a, i) => (
          <li key={a.title} style={{ padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            <strong style={{ color: "#1a0f08" }}>
              {i + 1}. {a.title}
            </strong>
            <br />
            <span style={{ fontSize: 13, color: "#8b7355" }}>
              {type === "publications" ? `${a.venue}, ${a.year}` : a.tags.join(" · ")}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

const EndNote = ({ text }: { text: string }) => (
  <p style={{ color: "#8b7355", textAlign: "center", marginTop: 80 }}>
    <em>{text}</em>
  </p>
);

/** A book on the shelf: the cover opens, then scrolling (or swiping, arrows, buttons) turns the pages. */
export default function BookOverlay({ open, type, onClose }: { open: boolean; type: BookType; onClose: () => void }) {
  const items = type === "publications" ? publicationsBook : articlesBook;
  const totalSpreads = Math.ceil(items.length / 2) + 1;
  const [spread, setSpread] = useState(0);
  const [flip, setFlip] = useState<Flip | null>(null);
  const [coverId, setCoverId] = useState(0);
  const [coverOpen, setCoverOpen] = useState(false);
  // Narrow screens show one page at a time (ToC, then each entry) instead of a two-page spread.
  const [single, setSingle] = useState(false);
  const [page, setPage] = useState(0);
  const flipRef = useRef<Flip | null>(null);
  flipRef.current = flip;
  const lockUntil = useRef(0);
  const wheelAcc = useRef(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setSingle(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Every time the book opens, start closed and play the cover animation.
  useEffect(() => {
    if (open) {
      setSpread(0);
      setPage(0);
      setFlip(null);
      setCoverOpen(false);
      setCoverId((n) => n + 1);
      lockUntil.current = performance.now() + 1600;
    }
  }, [open, type]);

  const leftIdx = (s: number) => s * 2 - 1;
  const rightIdx = (s: number) => (s === 0 ? 0 : s * 2);

  const leftContent = useCallback(
    (s: number) => {
      if (s === 0) return <TocPage items={items} type={type} />;
      const idx = leftIdx(s);
      return idx < items.length ? <ItemPage item={items[idx]} idx={idx} type={type} /> : <EndNote text="— End —" />;
    },
    [items, type]
  );

  const rightContent = useCallback(
    (s: number) => {
      const idx = rightIdx(s);
      if (s === 0) return items[0] ? <ItemPage item={items[0]} idx={0} type={type} /> : null;
      return idx < items.length ? <ItemPage item={items[idx]} idx={idx} type={type} /> : <EndNote text="More coming soon…" />;
    },
    [items, type]
  );

  const totalPages = items.length + 1;

  const next = useCallback(() => {
    if (performance.now() < lockUntil.current) return;
    if (single) {
      if (page >= totalPages - 1) return;
      lockUntil.current = performance.now() + 500;
      setPage(page + 1);
      return;
    }
    if (flipRef.current || spread >= totalSpreads - 1) return;
    lockUntil.current = performance.now() + TURN_MS;
    const to = spread + 1;
    setFlip({ dir: "forward", front: rightContent(spread), back: leftContent(to), to, id: Date.now() });
  }, [single, page, totalPages, spread, totalSpreads, leftContent, rightContent]);

  const prev = useCallback(() => {
    if (performance.now() < lockUntil.current) return;
    if (single) {
      if (page <= 0) return;
      lockUntil.current = performance.now() + 500;
      setPage(page - 1);
      return;
    }
    if (flipRef.current || spread <= 0) return;
    lockUntil.current = performance.now() + TURN_MS;
    const to = spread - 1;
    setFlip({ dir: "backward", front: rightContent(to), back: leftContent(spread), to, id: Date.now() });
  }, [single, page, spread, leftContent, rightContent]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev]);

  /** Scroll reads the page first; once the page has no more to show, the next scroll turns it. */
  const onWheel = (e: RWheelEvent<HTMLDivElement>) => {
    const paper = (e.target as HTMLElement).closest?.(".book__paper") as HTMLElement | null;
    if (paper && paper.scrollHeight > paper.clientHeight + 1) {
      const atEnd = paper.scrollTop + paper.clientHeight >= paper.scrollHeight - 2;
      const atStart = paper.scrollTop <= 1;
      if ((e.deltaY > 0 && !atEnd) || (e.deltaY < 0 && !atStart)) {
        wheelAcc.current = 0;
        return;
      }
    }
    wheelAcc.current += e.deltaY;
    if (wheelAcc.current > 70) {
      wheelAcc.current = 0;
      next();
    } else if (wheelAcc.current < -70) {
      wheelAcc.current = 0;
      prev();
    }
  };

  const onTouchStart = (e: RTouchEvent<HTMLDivElement>) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: RTouchEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? next : prev)();
  };

  const finishFlip = () => {
    if (!flip) return;
    setSpread(flip.to);
    setFlip(null);
  };

  // While a page turns, the static page underneath already shows the destination.
  const leftSpread = flip?.dir === "backward" ? flip.to : spread;
  const rightSpread = flip?.dir === "forward" ? flip.to : spread;
  const num = (idx: number, hide: boolean) => (!hide && idx >= 0 && idx < items.length ? String(idx + 1) : "");
  const title = type === "publications" ? "Publications" : "Articles";
  const singleContent = page === 0 ? <TocPage items={items} type={type} /> : <ItemPage item={items[page - 1]} idx={page - 1} type={type} />;
  const atStart = single ? page === 0 : spread === 0;
  const atEnd = single ? page >= totalPages - 1 : spread >= totalSpreads - 1;

  return (
    <div
      className={`book-overlay${open ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="book-overlay__backdrop" onClick={onClose} />
      <div className={`book book--${type}${coverOpen ? " is-opened" : " is-closed"}${single ? " book--single" : ""}`}>
        {single ? (
          <div className="book__half book__half--right">
            <div className="book__paper" key={page}>
              <div className="book__paper-content">{singleContent}</div>
              <div className="book__paper-num book__paper-num--right">{page === 0 ? "" : String(page)}</div>
            </div>
          </div>
        ) : (
          <>
            <div className="book__half book__half--left">
              <div className="book__paper">
                <div className="book__paper-content">{leftContent(leftSpread)}</div>
                <div className="book__paper-num book__paper-num--left">{num(leftIdx(leftSpread), leftSpread === 0)}</div>
              </div>
            </div>
            <div className="book__half book__half--right">
              <div className="book__paper">
                <div className="book__paper-content">{rightContent(rightSpread)}</div>
                <div className="book__paper-num book__paper-num--right">{num(rightIdx(rightSpread), false)}</div>
              </div>
            </div>
          </>
        )}
        {flip && !single ? (
          <div key={flip.id} className={`book__flipper go-${flip.dir}`} onAnimationEnd={finishFlip}>
            <div className="book__flipper-face book__flipper-front">
              <div className="book__paper-content">{flip.front}</div>
            </div>
            <div className="book__flipper-face book__flipper-back">
              <div className="book__paper-content">{flip.back}</div>
            </div>
          </div>
        ) : null}
        {open && !coverOpen ? (
          <div key={coverId} className="book__cover" onAnimationEnd={() => setCoverOpen(true)}>
            <div className="book__cover-face book__cover-front">
              <div className="book__cover-title">
                <small>Sajud Hamza</small>
                {title}
                <em>{items.length} entries</em>
              </div>
            </div>
            <div className="book__cover-face book__cover-back" />
          </div>
        ) : null}
        <div className="book__spine" />
      </div>
      <button className="book__nav book__nav--prev" onClick={prev} disabled={atStart || !!flip} aria-label="Previous page">
        &#9664;
      </button>
      <button className="book__nav book__nav--next" onClick={next} disabled={atEnd || !!flip} aria-label="Next page">
        &#9654;
      </button>
      <button className="book__close" onClick={onClose} aria-label="Close" tabIndex={open ? 0 : -1}>
        &times;
      </button>
      <div className="book__page-indicator">
        {single ? `${page + 1} / ${totalPages}` : `${spread + 1} / ${totalSpreads}`} · scroll or swipe to turn
      </div>
    </div>
  );
}
