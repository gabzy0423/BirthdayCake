# Stephanie's Birthday Experience

Status: requirements interview complete; user confirmed the consolidated understanding on 2026-11-08. This document does not authorize application implementation. Technical conventions remain in [AGENTS.md](../AGENTS.md), and domain terms are in [GLOSSARY.md](../GLOSSARY.md).

## Confirmed decisions

- Build a personalized birthday experience for Stephanie.
- Use the confirmed Sage Green + Cream + White palette with warm lighting and a playful 3D cake. Sage green is the primary accent for decorations and controls, cream is the main background and cake base, and white provides frosting/highlights and supporting surfaces. Green is Stephanie's favorite color; this palette replaces the earlier pink direction. Exact color values remain to be selected and checked for contrast during visual implementation.
- Present the experience with a pixel-game visual style: readable pixel typography, square controls, crisp offset shadows, pixel decorations, and pixelated rendering of the actual 3D cake. Preserve the round cake, numeral candles, agreed palette, and reduced-motion support.
- Keep the lower area free of grass, garden plants, flowers, and butterflies; the user removed these decorations. Keep the normal portrait experience compact enough to fit without scrolling; allow scrolling when needed for accessibility or unusually short screens.
- Display three decorative pixel cats facing the viewer in cute, relaxed sitting poses, with visible faces, ears, and front paws. Group them around the lower base of the cake, slightly forward: black cat on the left, cream-white Siamese with dark points and blue eyes at center-front below the plate, and white calico with orange and black patches on the right. Keep small gaps and no surrounding container. Preserve responsive enlarged cats (up to 96px each), with the cake and numeral candles clearly visible. This replaces the separate bottom-center footer placement; the user confirmed the arrangement and requested implementation.
- Give the seated cats gentle in-place head/body sway and occasional blinking, with different timing for each cat. Their positions stay fixed; this replaces the earlier side-view walking direction. Preserve a pause control for continuous animation and render still cats for reduced-motion preferences. The user confirmed this refinement and requested implementation.
- Prioritize phone portrait layouts while retaining desktop and other responsive layouts required by AGENTS.md.
- One successful blow extinguishes all candles together, rather than targeting individual candles.
- Include soft birthday instrumental music with an on/off toggle in place of the original Music badge/Play-Mute presentation. Playback starts through a user action, not autoplay. Keep the toggle disabled and off until actual playback is connected.
- Automatically pause playing music while the microphone is listening. After extinguishing, resume only music that was playing beforehand; preserve the user's mute/pause choice. Do not start previously unstarted music automatically. On listening failure or cancellation, restore the prior playback choice without overriding subsequent user actions.
- Use one round cake with a cream base, white frosting, and sage green decorations, with two numeral-shaped candles: "2" and "0". Both have flames and extinguish together. Do not add five regular candles from the earlier recommendation.
- After the smoke, show a short confetti burst and this exact greeting:

  > Happy Birthday, Stephanie!
  > May all your wishes come true. ✨

- Do not include a replay or "Make another wish" button.
- After confetti finishes, retain the greeting and cake with extinguished candles. A page refresh starts a fresh experience with lit candles; do not persist completion or automatically reopen microphone access.
- Preserve the established flow: lit cake, explicit microphone action, local blow detection or manual blow, flame exit, smoke, and birthday greeting.
- Keep microphone access optional through an always-available manual blow action.

## Acceptance checklist for future implementation

These are required checks, not results of tests already performed.

- The portrait-first opening uses the Sage Green + Cream + White palette and shows the round cake and lit "20" candles with clear controls; desktop remains usable.
- Music begins only through user interaction; the on/off toggle controls playback, and audio-loading/playback failure does not block the celebration.
- Enabling the microphone explicitly requests access and pauses playing music while listening. Denial, missing hardware, and unsupported APIs leave manual blow usable.
- A sustained actual blow extinguishes both candles once. Brief noise and ordinary speech do not routinely trigger it under the tested conditions; record device/environment limitations rather than claiming perfect detection.
- Manual blow produces the same flame exit, smoke, confetti, and exact greeting without microphone permission.
- Microphone capture and analysis stop on completion, disable, failure, and unmount. Music returns only according to the user's prior playback choice.
- Smoke follows extinguishing, then a short confetti burst and the greeting. Reduced-motion mode simplifies effects while retaining the greeting and completion behavior.
- The finished cake and greeting remain visible without a replay action. Refresh restores the opening, without autoplay or automatic microphone access.
- Keyboard controls, accessible status text, responsive framing, and a usable WebGL fallback meet the existing AGENTS.md requirements.
- Run the proportionate lint, type, build, focused logic, and real-device checks specified in AGENTS.md once application code exists.

## Remaining setup and handoff

- No actual instrumental audio asset has been supplied or acquired. Select a suitable track with permission for site use and record its source/attribution before delivery; the music requirement is agreed, but its asset is not ready.
- The user confirmed the consolidated understanding and closed the interview. Begin application development only on an implementation request; do not repeat settled questions.
- Do not install dependencies, scaffold components, or push documentation as part of this interview unless separately requested.

## Interview record

- Cat display refinement: user confirmed relaxed front-facing sitting poses; a bottom-center trio with small gaps and no container; and gentle in-place sway plus occasional blinking with individual timing. Black/Siamese/calico order and approximately 64px size were accepted with the arrangement recommendation. The user confirmed the consolidated design and requested implementation; the refinement interview is complete.

- 2026-11-08, round 1: user chose Stephanie, accepted the recommended soft pastel direction, prioritized portrait, chose simultaneous extinguishing, and requested music instead of the proposed silent first version.
- 2026-11-08, round 2: user chose soft birthday instrumental music and Play/Mute controls; specified one round cake and number 20; accepted smoke followed by short confetti and the exact greeting above; declined replay. The response explicitly confirmed controls but did not explicitly settle automatic pause/resume during listening.
- 2026-11-08, round 3: user confirmed two numeral-shaped candles (2 and 0), music pause/resume during microphone listening with mute preserved, and a persistent completed screen without replay that resets on page refresh.
- 2026-11-08, final confirmation: user accepted the complete consolidated experience ("okay sya mate goods"). Requirements interview complete; application implementation has not started.
- 2026-11-08, color correction: user specified that Stephanie's favorite color is green. Green supersedes pink for the experience's accents and cake decorations; keep the cream background, pastel styling, and warm lighting.
- 2026-11-08, palette refinement: user specified Sage Green + Cream + White as the theme, refining the earlier generic green direction.
