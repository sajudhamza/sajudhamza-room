"use client";

import { useEffect, useState, type FormEvent } from "react";
import Shell from "./Shell";

type VFile = { name: string; size: string; href: string };

export default function VaultOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [pw, setPw] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "err" | "open">("idle");
  const [msg, setMsg] = useState("Protected files · authorized access only");
  const [files, setFiles] = useState<VFile[]>([]);

  useEffect(() => {
    if (!open) {
      setPw("");
      if (state === "err") setState("idle");
    }
  }, [open, state]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!pw || state === "busy") return;
    setState("busy");
    setMsg("Verifying…");
    try {
      const r = await fetch("/api/vault", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Access denied.");
      setFiles(j.files);
      setState("open");
      setMsg(`${j.files.length} files unlocked`);
    } catch (err) {
      setState("err");
      setMsg(err instanceof Error ? err.message : "Access denied.");
      setTimeout(() => setState((s) => (s === "err" ? "idle" : s)), 1500);
    }
  };

  return (
    <Shell cls="vault-overlay" open={open} onClose={onClose} label="Document vault">
      <div className="vault-overlay__scroll">
        <div className={`vault-box${state === "err" ? " is-shaking" : ""}${state === "open" ? " is-open" : ""}`}>
          <div className="vault-lock" aria-hidden>
            <svg viewBox="0 0 200 200" fill="none">
              <circle className="ring" cx="100" cy="100" r="92" stroke="rgba(129,140,248,0.55)" strokeWidth="1" strokeDasharray="6 10" />
              <circle cx="100" cy="100" r="72" stroke="rgba(226,232,240,0.12)" strokeWidth="1" />
              <g className="shackle">
                <path d="M78 96 V80 a22 22 0 0 1 44 0 V96" stroke="#e2e8f0" strokeWidth="5" strokeLinecap="round" />
              </g>
              <rect x="66" y="94" width="68" height="50" rx="10" fill="#111827" stroke="#818cf8" strokeWidth="1.5" />
              <circle cx="100" cy="116" r="6" fill="#818cf8" />
              <rect x="98" y="118" width="4" height="14" rx="2" fill="#818cf8" />
            </svg>
          </div>
          <h1 className="vault-title">Document Vault</h1>
          <p className="vault-subtitle">Certificates, letters and verifications. Enter the access password to view and download.</p>

          {state !== "open" ? (
            <form className="vault-form" onSubmit={submit}>
              <label htmlFor="vault-pw">Access password</label>
              <div className="vault-field">
                <input
                  id="vault-pw"
                  type="password"
                  autoComplete="off"
                  placeholder="••••••••"
                  value={pw}
                  tabIndex={open ? 0 : -1}
                  onChange={(e) => setPw(e.target.value)}
                />
                <button type="submit" tabIndex={open ? 0 : -1} disabled={state === "busy"}>
                  {state === "busy" ? "…" : "Unlock →"}
                </button>
              </div>
              <div className={`vault-msg${state === "err" ? " is-err" : ""}`}>{msg}</div>
            </form>
          ) : (
            <div>
              <div className="vault-msg is-ok">{msg}</div>
              <div className="vault-files">
                {files.map((f) => (
                  <a className="vault-file" key={f.href} href={f.href} target="_blank" rel="noreferrer">
                    <span>{f.name}</span>
                    <small>{f.size} ↓</small>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
