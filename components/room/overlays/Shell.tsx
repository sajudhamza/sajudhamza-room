"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  cls: string;
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
};

/** Full-screen overlay wrapper. The class name drives the styling ported from the original room CSS. */
export default function Shell({ cls, open, onClose, label, children }: Props) {
  return (
    <div className={`${cls}${open ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label={label} aria-hidden={!open}>
      <button className={`${cls}__close`} onClick={onClose} aria-label="Close" tabIndex={open ? 0 : -1}>
        &times;
      </button>
      {children}
    </div>
  );
}

/** Circular avatar that falls back to initials when the image is missing. */
export function Avatar({ src, name, className }: { src?: string; name: string; className: string }) {
  const img = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  // A 404 can fire before hydration attaches onError, so also check on mount.
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, [src]);

  const showImage = !!src && !failed;
  return (
    <div className={`${className} avatar`} aria-label={name}>
      {showImage ? <img ref={img} src={src} alt="" onError={() => setFailed(true)} /> : <span className="avatar__initials">{initials}</span>}
    </div>
  );
}
