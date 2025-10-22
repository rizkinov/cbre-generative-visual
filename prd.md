Generative Patterns PRD
Executive Summary

Generative Patterns is a CBRE internal web app built entirely on @cbre/web-elements, designed to generate brand-consistent line, stripe, and contour motifs inspired by Generativ.design.
The tool is fully client-side (Next.js 14 + Tailwind + CBRE Web Elements) and exports SVG and PNG assets using only CBRE-approved colors and typography.

1. Objective

Create an internal visual generator that empowers designers to produce on-brand CBRE patterns — horizontal bands, vertical bars, and diagonal contours — for use in reports, motion backgrounds, or brand experiments.

The app must:

Use only components from @cbre/web-elements.

Be responsive, accessible, and deterministic (same seed = same output).

Export SVG and PNG files.

Operate fully client-side, with no backend services.

2. Scope
Included

Pattern generation logic (three pattern types)

Interactive UI with live preview

Brand-token color controls

Deterministic randomization via seed

Export to SVG + PNG (1×–4×)

Tailwind for spacing only

Excluded

User authentication

Database/storage

Collaboration or cloud export

Additional pattern types (future scope)

3. Brand & Design Tokens

Import via:

import { UI, CBRE, Blocks } from 'cbre-web-elements';
import { cbreTheme } from 'cbre-web-elements/theme';


Colors (use tokens only):

cbreTheme.colors.green, .darkgreen, .mint, .neutral, .grey, .white

Suggested pairs:

Dark Green / Accent Mint

Midnight / Celadon Tint

Cement Tint / CBRE Green

Light Grey / Dark Grey

Typography:

Financier Display (headings)

Calibre (UI / labels)

UI Components:

UI.Slider, UI.Select, UI.Accordion, UI.Tabs, UI.Label, UI.Input

CBRE.CBREButton, CBRE.CBRECard

Optional wrappers: UI.Popover, UI.Dialog, UI.Tooltip

4. User Flow & UX Layout
Flow

Select pattern type → adjust parameters via sliders.

Choose brand color pairing → preview updates live.

Adjust seed or randomize.

Export as SVG or PNG.

Layout
Region	Description	Components
Top Bar	Title, brand pairing select, randomize, export buttons	CBRE.CBREButton, UI.Select
Left Panel	Controls by pattern type (Accordion or Tabs)	UI.Accordion, UI.Slider, UI.Select
Right Panel	Live SVG preview inside card	CBRE.CBRECard, <svg>
Modal/Popover	Export options (resolution select)	UI.Dialog or UI.Popover
Canvas

Default size: 2000 × 2000

Presets: 1024, 2000, 3000

White or token-based neutral background

All strokes use currentColor

5. Pattern Types & Controls
A. Horizontal Bands (Gradient Field)
Parameter	Type	Range
Band Count	Slider	10–120
Band Thickness	Slider	1–40 px
Thickness Variation	Slider	0–0.6× base
Band Gap	Slider	0–40 px
Gap Variation	Slider	0–0.6×
Vignette Depth	Slider	0–1
Y Jitter	Slider	0–2 px
Tilt Angle	Slider	−5° to +5°

Logic (pseudocode)

y = pad
repeat bandCount:
  thickness = base ± rand()*thicknessVar
  gap = baseGap ± rand()*gapVar
  draw rect(x=pad, y, w=W, h=thickness)
  y += thickness + gap
apply top/bottom vignette using gradient of fg→bg shades

B. Vertical Bars (Density Ramp)
Parameter	Type	Range
Bar Count	Slider	3–80
Bar Width	Slider	2–80 px
Width Variation	Slider	0–0.5×
Gap Width	Slider	0–60 px
Density Curve	Select	linear / easeIn / easeOut / easeInOut / exp
Direction	Select	LTR / RTL
Edge Padding	Slider	0–200 px

Logic

for i in range(barCount):
  t = i/(barCount-1)
  density = rampCurve(t)
  width = base ± rand()*widthVar
  gap = baseGap*(1-density)
  x += width + gap
  draw rect(x, pad, width, H)

C. Diagonal Contours (Rooflines)
Parameter	Type	Range
Line Count	Slider	3–60
Gap Between Lines	Slider	4–40 px
Slope Angle	Slider	10–60°
Peak Position (X)	Slider	0–1
Skew Factor	Slider	−0.3 to 0.3
Corner Style	Select	miter / round
Opacity Step	Slider	0–0.03 per line

Logic

define base polyline with slopeAngle and peakX
for k in range(lineCount):
  offset = k*gap
  transform with skew
  strokeOpacity = 1 - k*opacityStep
  draw path(offset, slopeAngle)

6. Global Controls
Parameter	Type
Canvas Size	Select (1024, 2000, 3000)
Padding	Slider (0–200 px)
Line Weight	Slider (1–8 px)
Background Color	Select (cbreTheme.colors)
Foreground Color	Select (cbreTheme.colors)
Seed	Input + Randomize Button
Export	Buttons (SVG / PNG + scale select)
7. Architecture
Tech Stack

Next.js 14 (App Router)

TypeScript

Tailwind CSS

@cbre/web-elements (UI / CBRE / Blocks)

Folder Structure
app/
  page.tsx
  components/
    ControlsPanel.tsx
    PreviewSurface.tsx
    ExportMenu.tsx
  patterns/
    horizontalBands.ts
    verticalBars.ts
    diagonalContours.ts
  export/
    svg.ts
    png.ts
  state/
    schema.ts
    presets.ts
    seeding.ts

Data Types
type CanvasSpec = { width:number; height:number; padding:number };
type BrandPair = { bg:string; fg:string };

type GlobalState = {
  canvas: CanvasSpec;
  brand: BrandPair;
  lineWeight: number;
  seed: number;
  pattern: 'horizontalBands' | 'verticalBars' | 'diagonalContours';
};

Deterministic RNG
export function mulberry32(seed:number){
  let t = seed|0;
  return ()=>((t=Math.imul(t+0x6D2B79F5,1))>>>0)/4294967296;
}

8. Rendering Pipeline

Each pattern returns <g> or JSX nodes.

<PreviewSurface> wraps these inside:

<CBRE.CBRECard className="flex items-center justify-center bg-white">
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
    <g style={{ color: fgColor }}>{patternNodes}</g>
  </svg>
</CBRE.CBRECard>


SVG export uses renderToStaticMarkup.

PNG export converts SVG → Canvas → Data URL (download link).

9. Export Functions
SVG
export function toSVG(globals, content){
  const {width, height} = globals.canvas;
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <title>CBRE Generative Pattern</title>
    ${content}
  </svg>`;
}

PNG
export async function svgToPng(svg:string, scale=1){
  const img = new Image();
  const blob = new Blob([svg],{type:'image/svg+xml'});
  img.src = URL.createObjectURL(blob);
  await img.decode();
  const c = document.createElement('canvas');
  c.width = img.width*scale; c.height = img.height*scale;
  c.getContext('2d')!.drawImage(img,0,0,c.width,c.height);
  return c.toDataURL('image/png');
}

10. Components Hierarchy
page.tsx
 ├─ <TopBar> (brand select, seed, randomize, export)
 ├─ <main class="grid grid-cols-[350px_1fr] gap-4">
 │    ├─ <ControlsPanel> → Tabs + Sliders + Selects
 │    └─ <PreviewSurface> → SVG Canvas
 └─ <ExportMenu> (Dialog)

11. Accessibility & Brand Compliance

Use UI.Label and aria-labelledby for all sliders/selects.

Maintain WCAG AA contrast ratios.

Use only CBRE typography and tokens.

Layout grid responsive down to 1024 px.

12. Acceptance Criteria

✅ Patterns generate deterministically per seed
✅ Colors = CBRE tokens only
✅ Export to SVG/PNG works at 1×–4×
✅ Fully client-side, no external dependencies
✅ UI uses only @cbre/web-elements
✅ Accessible controls and responsive layout