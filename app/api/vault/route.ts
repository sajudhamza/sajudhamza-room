import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

/**
 * Document vault gate.
 * Set VAULT_PASSWORD in your environment (.env.local / Vercel project settings).
 * Files listed here should live in /public/vault or be signed URLs from your storage.
 */
const FILES = [
  { name: "Ph.D. Enrollment Verification — Pace University", size: "PDF · 0.4 MB", href: "/vault/phd-verification.pdf" },
  { name: "UK Registered Design 6439245 — Certificate", size: "PDF · 1.1 MB", href: "/vault/uk-6439245.pdf" },
  { name: "UK Registered Design 6504358 — Certificate", size: "PDF · 1.0 MB", href: "/vault/uk-6504358.pdf" },
  { name: "Judging Certificates — Titan, Globee, QS, BIG", size: "ZIP · 6.2 MB", href: "/vault/judging-certificates.zip" },
  { name: "Reference Letters (4)", size: "PDF · 2.3 MB", href: "/vault/reference-letters.pdf" },
];

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  const expected = process.env.VAULT_PASSWORD;

  if (!expected) {
    return NextResponse.json({ ok: false, error: "Vault is not configured. Set VAULT_PASSWORD." }, { status: 503 });
  }
  // small constant delay to blunt brute force
  await new Promise((r) => setTimeout(r, 400));

  if (!password || !safeEqual(password, expected)) {
    return NextResponse.json({ ok: false, error: "Access denied." }, { status: 401 });
  }
  return NextResponse.json({ ok: true, files: FILES });
}
