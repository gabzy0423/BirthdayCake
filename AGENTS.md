<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Interactive 3D Birthday Cake: Development Guide

## Scope and instruction handling

- Treat this file as the primary repository guide. Preserve the generated Next.js block above; do not remove it or replace version-specific guidance with assumptions from older Next.js releases.
- Before interpreting a user request, read `C:\Users\Acer\Documents\Obsidian\Knowledge Vault\Codex Skills\ALIASES.md` for personal skill aliases. Apply an alias only when invoked as described there, not when merely discussed. Read its mapped `SKILL.md` before following that workflow. Aliases do not register native slash commands or override project instructions or permissions.
- The initialization task is documentation only. Do not implement the cake, microphone detection, UI, scaffolding, or dependency changes until the user requests application development.
- Once implementation is requested, make the smallest complete change for that request. Do not add authentication, persistence, a backend, recording, analytics, or other unrelated features without a requirement.
- Inspect affected code and callers before editing. Preserve unrelated user changes. Keep this guide aligned with configuration when architecture or workflows actually change.

## Product and required experience

Build an immersive birthday experience centered on a polished 3D cake, not a conventional static page. The intended sequence is:

1. Render a responsive cake with frosting, decorations, candles, and animated lit flames.
2. Offer an explicit microphone enable action; never request access automatically.
3. Analyze microphone input locally for a sustained blowing-like sound.
4. Extinguish the candles, smoothly transition the flames out, and play a brief smoke effect.
5. Reveal a birthday greeting or surprise animation.

Keep a manual blow button available so the same celebration works without microphone access. Detection is a heuristic; do not promise perfect rejection of speech or background noise. Preserve the experience when WebGL, microphone access, or motion is unavailable.

## Verified repository baseline

Inspected on 2026-11-08. This is an initialized Next.js App Router project, not an empty repository. The home page, metadata, README, and public SVGs are still Create Next App starter content. No cake, audio detector, custom 3D assets, or test suite has been implemented.

The table records locally resolved versions at inspection, not permanent version requirements. `package.json` and `package-lock.json` remain authoritative.

| Technology | Installed version | Responsibility |
| --- | --- | --- |
| Next.js | 16.4.5 | App Router, layouts, metadata, loading, and server/client composition |
| React / React DOM | 19.3.0 | Components, lifecycle, and experience state |
| TypeScript | 5.9.3 | Strict static typing |
| `@react-three/fiber` | 9.8.2 | React rendering and frame updates for the 3D scene |
| `three` | 0.187.0 | Geometry, materials, lights, cameras, and graphics resources |
| `@react-three/drei` | 10.7.9 | Reusable scene helpers, environments, controls, and asset loading |
| Web Audio API | Browser-provided | Microphone analysis; no npm package required |
| `motion` | 14.10.1 | DOM interface transitions and greeting animation |
| `tailwindcss` / `@tailwindcss/turbopack` | 4.3.5 | Responsive styling and the existing CSS build integration |
| ESLint / `eslint-config-next` | 9.39.5 / 16.4.5 | Next.js, accessibility, and TypeScript lint rules |

Existing conventions and configuration:

- Use npm and the committed `package-lock.json`; do not introduce another package manager or lockfile.
- `app/` is at the repository root; there is no `src/` tree. `@/*` resolves to the repository root.
- TypeScript has `strict: true`, bundler module resolution, and `noEmit`. Use TypeScript for new application code even though `allowJs` is enabled.
- ESLint uses the flat configuration in `eslint.config.mjs`, with Next Core Web Vitals and TypeScript presets.
- `next.config.ts` currently enables `experimental.agentFeedback`, `cacheComponents`, and `partialPrefetching`, and wires CSS through `@tailwindcss/turbopack` in Turbopack rules. Preserve these settings unless a task requires a verified change.
- Tailwind uses `@import "tailwindcss"` and CSS-first `@theme inline` tokens in `app/globals.css`. There is no PostCSS or Tailwind config file. Do not add a second CSS pipeline or copy a Tailwind v3 setup.
- `app/layout.tsx` imports global styles, uses `next/font/google` for Geist fonts, exports metadata, and uses generated `LayoutProps<"/">` types. Keep the layout server-rendered.
- `.env*`, `node_modules/`, `.next/`, build outputs, and generated Next.js types are ignored. Never commit secrets or generated artifacts.

## Architecture and ownership

Keep rendering, audio analysis, interface presentation, and application state separate. Start with local React state in a small client experience coordinator; do not add a global state library for this flow.

- `app/page.tsx` composes the server-rendered page and its interactive experience boundary.
- A client coordinator owns candle state (`lit` or `extinguished`) and the celebration sequence. Microphone and manual actions invoke the same extinguish handler. Ignore repeated triggers after extinguishing.
- `useBlowDetection` owns microphone lifecycle and detection status. It reports a blow event; it must not manipulate scene objects, extinguish candles directly, or control greeting animation.
- 3D components receive typed state/props and own visual behavior. Flame exit and smoke timing stay with scene animation logic, separate from detection.
- UI components expose accessible controls and presentation. Keep microphone status distinct from candle state: unsupported, idle, requesting, listening, denied/error, and stopped should not be confused with extinguished candles.
- Put pure signal-analysis helpers and typed detection settings in `lib/audio/` when needed. Keep browser resource ownership in the hook. Use shared types only where multiple modules need them.

Target organization below is a guide for future implementation, not a claim that these files exist. Create directories only when adding real files; do not scaffold empty components or utilities.

```text
app/
  layout.tsx                    # Existing root layout and metadata
  page.tsx                      # Existing page; future experience composition
  globals.css                   # Existing global styles and theme tokens
components/
  BirthdayExperience.tsx        # Future client coordinator and shared state
  3d/
    BirthdayScene.tsx           # Canvas, camera, lighting, loading/fallback
    Cake.tsx                    # Cake geometry/materials and decorations
    Candle.tsx                  # Candle composition driven by candle state
    Flame.tsx                   # Flame animation and exit
    Smoke.tsx                   # Bounded smoke effect after extinguishing
  ui/
    BirthdayGreeting.tsx
    MicrophoneControl.tsx
    BlowButton.tsx
  sections/                     # Only if distinct page sections become necessary
hooks/
  useBlowDetection.ts
lib/
  audio/                        # Pure analysis helpers and detection settings
types/                          # Only genuinely shared domain types
public/
  models/                       # Future licensed local models
  textures/                     # Future optimized texture assets
  audio/                        # Only if actual playback assets are requested
AGENTS.md
package.json
package-lock.json
```

## Next.js and browser boundaries

- Read relevant installed guides before coding, especially `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` and `node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md`.
- Keep pages, layouts, metadata, and static content as Server Components where possible. Put `"use client"` at the smallest boundary needing state, effects, events, Motion interactions, or a 3D canvas. Imported descendants belong to that client graph; do not add the directive indiscriminately.
- Client Components can still be prerendered. Do not access `window`, `navigator`, microphone APIs, or construct an `AudioContext` during module evaluation or render. Initialize browser resources in user actions/effects with cleanup.
- If the scene or a dependency needs browser-only evaluation, dynamically import the scene with `ssr: false` from a Client Component. This option is not allowed in a Server Component. Provide a stable loading placeholder with reserved dimensions.
- Pass serializable props across the server/client boundary. Keep scene objects, audio nodes, and callbacks within the client graph.
- Handle asset failures, unavailable WebGL, and context loss with a usable DOM fallback and access to the manual celebration. Avoid hydration-dependent random values in server-rendered markup.

## React Three Fiber, Three.js, and Drei

- Use React Three Fiber's `Canvas` and declarative scene graph. Do not create a competing `WebGLRenderer` or independent render loop.
- Keep Fiber hooks such as `useFrame` inside the Canvas tree. Update refs with frame delta for animation; do not call React state setters on every frame. Use React state for meaningful transitions.
- Reuse geometries, materials, and calculated values. Avoid allocations in frame callbacks. Bound smoke particle counts and lifetime; stop/remove completed effects.
- Make camera framing and canvas dimensions responsive. Limit device pixel ratio, shadows, light counts, geometry complexity, and texture resolution for mobile. Begin with simple geometry and materials before adding expensive effects.
- Use Drei selectively for actual needs; avoid unused controls, helpers, or debug panels in the finished experience. Do not introduce another 3D engine or animation dependency.
- Keep model/texture loading within appropriate Suspense/error handling. Prefer optimized local assets with known licenses; verify paths and do not assume remote environments or models will always load.
- Let Fiber manage declarative resource disposal. Explicitly dispose manually owned resources and remove custom listeners/loops. Do not dispose cached/shared assets while another consumer still uses them.
- Reduced-motion mode must retain candle extinguishing and the greeting while simplifying flame flicker, smoke, camera movement, and decorative effects.

## Microphone and blowing detection

- Use `navigator.mediaDevices.getUserMedia({ audio: ... })`, `AudioContext`, and `AnalyserNode`; no microphone SDK is needed.
- Explain the purpose before the user enables the microphone. Request permission only from that action. Do not request video, record/store/upload audio, or connect microphone output to speakers.
- Feature-detect the APIs and secure context. Microphone access needs HTTPS in deployment or a supported localhost development context. Permission denial, missing hardware, a busy device, and unsupported APIs must leave the manual blow action usable.
- Resume a suspended audio context through the user's enable action as needed, and handle rejected permission/resume requests. Do not repeatedly prompt after denial.
- Make sensitivity, sustained-duration requirements, calibration/noise floor, and cooldown configurable through typed internal settings. Do not add a settings panel unless requested.
- Analyze sustained energy above a measured noise floor and suitable frequency characteristics rather than a single loud sample. Validate thresholds using real blowing, speech, taps, fans, and room noise. Account for device gain and browser audio processing; synthetic samples alone do not prove hardware accuracy.
- Report one blow event per celebration. Do not fake detection with a timer, randomness, or an unrelated click. The explicitly labeled manual button is the intentional fallback.
- Keep high-frequency samples and buffers out of React state. Reuse buffers and cancel sampling when no longer needed.
- On disable, completion, unmount, or failure: cancel analysis callbacks, disconnect owned nodes, stop every acquired audio track, and close the owned context. Handle late permission resolution after cancellation by immediately stopping that returned stream.
- Prevent overlapping enable requests and duplicate loops. Effects and cleanup must tolerate React development lifecycle re-runs. Suspend/stop capture when the page is hidden and make any resume behavior explicit.

## UI, Motion, accessibility, and styling

- Import React animation APIs from `motion/react`; do not install a separate `framer-motion` dependency for the same purpose. Use Motion for DOM transitions and Fiber for scene-frame animation.
- Keep visuals cohesive and centered on the cake. Support narrow screens, portrait/landscape layouts, and touch without requiring drag or hover to finish the experience.
- Use Tailwind utilities and existing theme tokens. Extend `app/globals.css` for shared tokens/global behavior; avoid scattered duplicate values or an unrelated component library.
- Use semantic buttons with visible focus, clear labels, adequate contrast, and accessible touch targets. Show microphone status/errors in text and announce meaningful state changes without announcing every audio sample.
- Respect reduced-motion preferences in both DOM and Canvas effects. Keep celebration text readable and available independently of the canvas; a canvas alone is not an accessible greeting.
- Do not add autoplay audio, obstructive overlays, or unrelated controls. Update starter metadata/content only during the requested implementation work.

## Coding and dependency rules

- Match existing formatting: two-space indentation, double-quoted strings, and semicolons. Use PascalCase component names and `use...` hook names; type props and callbacks explicitly where inference is insufficient.
- Prefer composition and small named components/hooks. Extract helpers when responsibility or reuse warrants it; do not create generic wrappers or speculative abstractions.
- Avoid `any`, suppressed lint/type errors, and unvalidated external data. Keep errors recoverable and user-facing messages clear.
- Inspect installed package metadata and relevant official/version-matched documentation before changing APIs or versions. Do not blindly upgrade to `latest` or use `--force` / `--legacy-peer-deps` to hide conflicts.
- The inspected peer ranges accept the current web stack: Fiber 9.8.2 requires React/React DOM `>=19 <19.4` and Three.js `>=0.156`; Drei 10.7.9 requires Fiber `^9`, React `^19`, and Three.js `>=0.159`; Motion accepts React 19. This is dependency-level compatibility, not proof of runtime behavior. Optional native/Expo/remix peers are not requirements for this website.
- All requested runtime dependencies are present. `@types/three` 0.187.0 is available transitively, but not declared directly. When application code directly depends on its declarations, declare a compatible direct dev dependency rather than relying on transitive installation.
- Commit manifest and lockfile changes together. Use `npm ci` for a reproducible clean installation; use targeted `npm install` only for intentional dependency changes.
- The latest installation reported eight moderate vulnerabilities. This is an untriaged snapshot, not a permanent count. Inspect `npm audit` when dependency/security work is requested; do not run automatic breaking fixes as unrelated cleanup.

## Development workflow and verification

Use Node.js compatible with installed Next.js (`>=20.9.0` per its package metadata), preferably a supported LTS release. There is no repository-pinned Node version.

| Command | Purpose |
| --- | --- |
| `npm ci` | Install the lockfile on a clean checkout |
| `npm run dev` | Start local Next.js development |
| `npm run lint` | Run the configured ESLint checks separately |
| `npx --no-install next typegen` | Generate route/layout types before standalone type-checking |
| `npx --no-install tsc --noEmit` | Check TypeScript without emitting application JS |
| `npm run build` | Verify the production build |
| `npm start` | Serve the previously built production application |
| `git diff --check` | Check patch whitespace before delivery |

- There are no `test` or `typecheck` npm scripts and no configured test runner or browser-test framework. Do not claim these checks exist or install a framework merely for this documentation task.
- For application changes, run lint, generated-type-aware type-checking, and a production build as appropriate. A successful build does not replace linting or browser/hardware verification. Google font loading in the current layout may require network access during a build; report environmental failures accurately.
- When implementing non-trivial detection/state logic, include a focused executable test or assert-based self-check. Use deterministic signal inputs to check sustained blows, quiet/noisy input, short spikes, speech-like negatives, cooldown, and duplicate-trigger handling. Introduce only the minimal test setup needed at that time.
- Validate microphone lifecycle with mocked success, denial, unsupported APIs, late resolution, repeated starts, and cleanup. Validate the real detector on real desktop/mobile microphones before claiming reliability.
- Manually check the complete sequence: lit cake, user-enabled microphone, actual blow, flame exit, smoke, greeting; repeat using the manual button after denial or without microphone support.
- Verify mobile framing and performance, keyboard operation, reduced motion, WebGL failure, loading/asset errors, and no hydration/runtime errors. Confirm the browser microphone indicator clears after completion/disable/unmount.
- For documentation-only edits, review against actual files and run `git diff --check`; application tests/builds are unnecessary unless documentation reveals an issue requiring a separate authorized change.
- Report what changed, checks performed, and unresolved limitations. Do not claim the app is implemented or hardware-tested because packages are installed. Commit/push only when requested.

## Next implementation session

Wait for an implementation request. Then confirm the requested visual direction and greeting details from available context, implement the smallest coherent slice, and verify it before expanding. Preserve the architecture above: one shared experience state, independent audio detection, reusable scene components, and a manual path that remains usable without hardware support.
