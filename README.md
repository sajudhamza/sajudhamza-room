# sajudhamza.com — interactive 3D room portfolio (Next.js 14)

The site is a 3D room you can look around in. Glowing dots on objects open each
section (introduction, qualifications, publications, articles, patents, judging,
media, testimonials, memberships) and a password-protected document vault.
The scene is a Three.js port of the `sajudhamza-room` project (Bruno Simon's
"My Room in 3D" base) rebuilt inside Next.js with React overlays.

## Run

```bash
npm install
cp .env.example .env.local     # then set VAULT_PASSWORD
npm run dev                    # http://localhost:3000
npm run build && npm start     # production
```

Deploys directly to Vercel (set `VAULT_PASSWORD` in Project → Settings → Environment Variables).

## Where things live

| Path | What |
|---|---|
| `data/content.ts` | **All copy** shared across the site: hero, about, education, skills, publications, articles, media, judging, memberships, patents, testimonials, contact. |
| `data/room.ts` | Room-specific data: hotspot positions/labels, the bottom menu, work-experience timeline, and the extra links/certificate/photo paths each overlay needs. |
| `components/room/engine/` | The Three.js engine (no React): `Experience` owns the loop; `Navigation` (orbit/pan/zoom), `Hotspots` (glowing dots, hover tooltip, picking), `Resources` (GLTF + Draco + textures), `World` and `world/*` (baked room shader, LEDs, coffee steam, chair, screens, wall text), `shaders.ts`. |
| `components/room/RoomScene.tsx` | Mounts the engine into a full-screen div (client only). |
| `components/room/RoomUI.tsx` | Loader, brand, day/night toggle, contact chips, hint and the section menu. |
| `components/room/overlays/` | One React overlay per section, plus `Shell` (shared close button / a11y) and `VaultOverlay`. |
| `app/page.tsx` | Wires scene, HUD and overlays; one `active` key decides which overlay is open. |
| `app/globals.css` | Base styles, HUD, loader, vault and small additions. |
| `app/themes.css` | Monitor/TV frames, book cover and page-turn, rise-in animations. |
| `app/objects.css` | Driving game HUD, video player, TV channels, résumé sheet, Switch console, chat, ID-card drawer. |
| `app/overlays.css` | Overlay styles ported from the room project (intro, qualifications, newspaper, judging, testimonials, memberships, book). |
| `app/api/vault/route.ts` | Password gate for the Document Vault. Edit the `FILES` list; drop real files in `public/vault/`. |
| `public/assets/` | Room model, baked day/night textures, light map, screen videos. `public/draco/` holds the Draco decoder. |
| `components/_legacy/` | The previous scroll-based design, kept for reference. Not imported anywhere; safe to delete. |

## Interaction

- Drag to orbit, right-drag / shift-drag (two fingers on touch) to pan, wheel or pinch to zoom.
- Hover a dot to see its label; click it (or a menu chip) and the camera flies to that object before the
  section appears. `Esc` closes it and the camera flies back. Poses are the `view` values in `data/room.ts`.
- Each section is presented inside its object:
  - Introduction is the desk monitor: a top-down **driving game**. Arrow keys / WASD steer, space brakes,
    and driving into a glowing zone (About, What I do, Journey, Projects, Numbers, Contact) opens that card.
    Phones get on-screen buttons. Code: `components/room/overlays/DriveGame.tsx`.
  - Patents is the laptop: a **video player** with chapters, scrubber, play/pause (space) and ← → to skip.
  - Media is the TV: every article is a **channel**. CH+/CH− buttons, arrow keys, or wait for the auto-flip;
    static noise between channels, headline ticker underneath.
  - Publications and Articles are the shelf books: the cover opens, then scrolling, swiping, arrow keys or
    the buttons turn pages (a page scrolls its own text first; when it reaches the end the next scroll turns it).
    Phones show one page at a time.
  - Qualifications is a printed **résumé sheet** lifted off the coffee table.
  - Judging is the Switch by the TV: a **console home screen**, each event a game tile (← → select, Enter/A opens the certificate).
  - Testimonials arrive as **chat messages** from the people who wrote them (attachments open the letters).
  - Memberships are **ID cards** in the desk drawer; the drawer slides open and cards flip on click.
- ☀ / ☾ toggles between the baked day and night lighting.

## Assets you still need to add

The overlays reference files that were not in either repo. Add them under `public/` and the UI picks them up (until then avatars fall back to initials and certificate buttons open a 404):

- `public/assets/profile.jpg` — hero photo in the Introduction.
- `public/Testimonial/*.jpg|png` and `public/Testimonial/pdfs/*.pdf` — photos and letters (paths in `data/room.ts`).
- `public/membercert/*` — judging certificates.
- `public/memberships/*` — organisation logos.
- `public/vault/*` — files listed in `app/api/vault/route.ts`.

## Notes

- Inter, JetBrains Mono and Playfair Display are self-hosted (`@fontsource-variable/*`). UnifrakturCook (newspaper masthead) and Libre Baskerville (newspaper body) load from Google Fonts.
- The two screen videos are the ones shipped with the room project; replace `public/assets/videoPortfolio.mp4` and `videoStream.mp4` to show your own.
- Hotspot positions are in `data/room.ts`; tweak the `[x, y, z]` values to move a dot.
