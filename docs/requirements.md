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
- Include a soft 8-bit/chiptune Happy Birthday instrumental with no vocals and gentle volume, playing one full rendition before stopping. The "Let's celebrate" action initiates the sequence; actual playback begins when the cake finishes landing. Keep the music toggle available to turn playback off/on, preserving any off choice made before landing. No audio starts on the untouched invitation. Do not add an "Opens with music" note.
- After the gift transition, the ready 3D cake and plate descend softly from above with one small bounce. Trigger music from landing completion, not a guessed scene-loading timeout. Under reduced motion, show the cake instantly and use its ready appearance as the equivalent music trigger. Cake loading or WebGL failure must not block the page; playback rejection leaves the toggle available for a user retry.
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

- Music is synthesized locally with Web Audio: a square-wave arrangement of the traditional Happy Birthday melody, with gentle note envelopes and no automatic repetition. No sampled recording or external music asset is used. Actual phone/speaker listening checks remain necessary.
- The user confirmed the consolidated understanding and closed the interview. Begin application development only on an implementation request; do not repeat settled questions.
- Do not install dependencies, scaffold components, or push documentation as part of this interview unless separately requested.

## Interview record

- Blow-prompt refinement: user confirmed that the first full Happy Birthday rendition stops instead of looping, then a centered page prompt below the cats reads exactly "make a wish, then blow out the candles!". Keep it visible until candle extinguishing and separate from cat speech bubbles. This supersedes the earlier looping-music requirement. User confirmed that muted or blocked music must not prevent progress: show the cue after cat greetings finish in that case. If music finishes while the cats are paused, wait for the remaining cat greetings before showing the cue. Do not overlap the page prompt with a cat speech bubble. The user confirmed this flow and requested implementation. The prompt and one-shot music are implemented; microphone detection and actual candle extinguishing remain separate future work.

- Cat greeting sequence interview: user confirmed messages after cake landing, in this order: black cat says "happy birthday mom" for 2 seconds; Siamese says "happy bday mommy!" for 2 seconds; calico says "happy birthday mowm!" for 2 seconds. Preserve exact lowercase wording. Show one pixel speech bubble at a time above its speaker, with a pointer toward the cat and the complete message visible immediately. After calico, dismiss the bubble and retain normal idle cats. Run once per page opening; refresh resets it. These are landing-time cat greetings, separate from the planned post-blow birthday greeting. User confirmed that the existing Pause animations control and a hidden browser tab pause the greeting timer, preserving the active bubble and remaining display time. Resume only when the tab is visible and animation pause is off. The user confirmed the consolidated sequence and requested implementation. The sequence is implemented and browser-checked for order, duration, pause/resume, hidden-tab behavior, and phone-width fit. The pause control remains available under reduced motion because it also controls reading time.

- Hat silhouette redesign: user rejected the initial squat hat appearance and confirmed a taller, pointed classic triangular party-hat silhouette with a wider base and thin brim, keeping ears visible. The cone must dominate; reduce the pom-pom to a small tip accent. Preserve sage/cream/white, make cream stripes on the black cat and white dots on the Siamese clearly visible, and retain plain cream with sage outline for the calico. Keep existing head sway. The user confirmed this redesign and requested implementation. Taller cones and tiny pom-poms are implemented; a 390px phone browser preview verified visible hats and faces without tip clipping.

- Cat birthday-hat refinement: user confirmed small classic cone party hats with pixel pom-poms on all three cats, using Sage Green + Cream + White. Use distinct patterns in cat order: stripes for black, dots for Siamese, plain for calico. Give each hat a slight tilt and let it follow the existing head sway. Preserve visible faces and ears, and do not obscure cake details. Keep the hats readable at responsive cat sizes and avoid clipping the tips/pom-poms during sway. The user confirmed the consolidated hat design and requested implementation. Hats are implemented; browser checks of clipping and visual balance remain pending.

- Splash interview (2026-11-09): user confirmed an invitation before the cake, staying until the "Let's celebrate" button is activated, with no automatic countdown. Show a centered pixel gift box, short "For Stephanie" heading, and one start button in the Sage Green + Cream + White palette. Keep it compact. Refresh or a new page load shows the invitation again.
- Entry transition: the gift opens, then fades into the cake page in approximately half a second; use an instant transition with reduced motion. Prevent repeated activation during entry. The invitation replaces the opening view rather than obscuring an otherwise interactive cake page.
- Revised landing/music flow: entering starts the cake entrance sequence, with music beginning at landing completion. Microphone enablement remains a separate explicit action. This supersedes the earlier toggle-only music start decision.
- Reserve the cake area with a short loading status while the 3D scene loads; do not display a temporary cake drawing that flashes before the actual cake. Fit the camera immediately on scene mount. Keep the static cake fallback for WebGL failures. Do not show fabricated loading percentages or impose an extra countdown.
- The invitation, cake landing, and landing-triggered music are implemented. Microphone interaction remains a separate future feature, including its required music-pause integration.
- Landing/music refinement: user accepted soft descent with one small bounce, instant reduced-motion appearance, gentle looping chiptune Happy Birthday with short gaps, and the music toggle as the off control. User rejected the additional "Opens with music" text, then requested implementation after pushing the earlier changes. This refinement is implemented.

- Cat display refinement: user confirmed relaxed front-facing sitting poses; a bottom-center trio with small gaps and no container; and gentle in-place sway plus occasional blinking with individual timing. Black/Siamese/calico order and approximately 64px size were accepted with the arrangement recommendation. The user confirmed the consolidated design and requested implementation; the refinement interview is complete.

- 2026-11-08, round 1: user chose Stephanie, accepted the recommended soft pastel direction, prioritized portrait, chose simultaneous extinguishing, and requested music instead of the proposed silent first version.
- 2026-11-08, round 2: user chose soft birthday instrumental music and Play/Mute controls; specified one round cake and number 20; accepted smoke followed by short confetti and the exact greeting above; declined replay. The response explicitly confirmed controls but did not explicitly settle automatic pause/resume during listening.
- 2026-11-08, round 3: user confirmed two numeral-shaped candles (2 and 0), music pause/resume during microphone listening with mute preserved, and a persistent completed screen without replay that resets on page refresh.
- 2026-11-08, final confirmation: user accepted the complete consolidated experience ("okay sya mate goods"). Requirements interview complete; application implementation has not started.
- 2026-11-08, color correction: user specified that Stephanie's favorite color is green. Green supersedes pink for the experience's accents and cake decorations; keep the cream background, pastel styling, and warm lighting.
- 2026-11-08, palette refinement: user specified Sage Green + Cream + White as the theme, refining the earlier generic green direction.
