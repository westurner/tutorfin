# `web/` — TutorFin SPA (Next.js + OpenNext for Cloudflare)

Static SPA that hosts the in-exhibit interactive simulations. Built with:

- **Next.js (App Router)** — UI framework.
- **OpenNext for Cloudflare** (`@opennextjs/cloudflare`) + **Wrangler** —
  deployment target.
- **Zustand** — client-side state store (per-visit scores, replay slider).
- **React-Intl** — i18n. Locales: `en-US`, `es-US`, `fr-CA`.
- **React Three Fiber + Drei + React Three A11y** — accessible 3D scenes.
- **`@tutorfin/ledgertext`** — replay slider scrubs over the parsed Beancount
  AST, synchronized with the 3D animation.

## Reset UX

- **Idle threshold**: 5 minutes (configurable via `NEXT_PUBLIC_IDLE_MS`).
- After idle, a 30-second confirmation prompt blocks the screen; ignoring it
  triggers a reset. See [lib/idle-reset.ts](lib/idle-reset.ts).
- Manual reset (button) requires confirmation as well.
- "Reset" clears the Zustand store and reloads the route.

## Local dev

```bash
cd web && pnpm install
pnpm dev                     # http://localhost:3000
pnpm build && pnpm preview   # local OpenNext preview (wrangler dev)
```

## Notes

- This is a **scaffold**: pages render the providers and a placeholder R3F
  scene. The actual exhibit scenes will land per-module.
- Run `pnpm install` before linting; dependencies are not yet vendored.
