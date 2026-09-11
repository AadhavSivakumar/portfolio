// Where this site's images, video and PDFs come from.
//
// These were absolute `https://aadhavsivakumar.github.io/Media/...` URLs, which
// meant this site served its media out of a DIFFERENT repository's GitHub Pages
// deployment — the one behind the root domain. Nothing here hosted them. On
// 2026-08-12 that repo trimmed what it publishes (it had been uploading ~390MB
// of unreferenced originals on every push) and 53 of this site's images and
// videos 404'd overnight.
//
// The assets now live in this repo under `public/`, so Vite emits them beside
// the bundle and `BASE_URL` ('/portfolio/' in production, '/' in dev) points at
// them. Keep it that way: no asset URL here should name a host.
export const ASSET_BASE = import.meta.env.BASE_URL;
