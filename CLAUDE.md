# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **CBRE Web Elements**, a React component library built on top of shadcn/ui and styled according to CBRE's design system. The project serves dual purposes:

1. **Component Library** (`src/`): A publishable npm package providing UI components
2. **Demo Application** (`app/`): A Next.js 15 application showcasing the components, including a Generative Patterns tool

**Key Technologies:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, ES Modules

## Development Commands

```bash
# Install dependencies (requires legacy peer deps flag due to React 19)
npm install --legacy-peer-deps

# Development server (runs Next.js demo app)
npm run dev

# Build library for distribution
npm run build:lib

# Build Next.js app
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:src  # lint only src/ directory

# Run tests
npm test

# Full validation (type-check + lint + build library)
npm run validate:full

# Generate new component interactively
npm run generateComp

# Clean build artifacts
npm run clean
```

## Architecture

### Module System

The project uses **ES Modules** (`"type": "module"` in package.json). All config files (next.config.js, tailwind.config.js, rollup.config.js) must use `import`/`export` syntax.

### Component Organization

Components are organized in **three namespaces** to avoid naming conflicts:

```typescript
import { UI, CBRE, Blocks } from 'cbre-web-elements';

// UI namespace: Base shadcn components (src/components/ui/)
<UI.Button>, <UI.Slider>, <UI.Select>, etc.

// CBRE namespace: CBRE-styled components (src/components/cbre/)
<CBRE.CBREButton>, <CBRE.CBRECard>, <CBRE.CBRETable>, etc.

// Blocks namespace: Higher-level compositions (src/components/blocks/)
<Blocks.CBRECtaBlock>, <Blocks.CBREQuoteBlock>
```

**Export structure** (`src/index.ts`):
- Exports three namespaces: UI, CBRE, Blocks
- Exports utility functions from `lib/utils`
- Exports `cbreTheme` from `config/cbre-theme.js`

### Theme System

**CBRE theme** is centralized in `config/cbre-theme.js`:
- **Primary Colors**: cbre-green (#003F2D), accent-green (#17E88F), dark-green, dark-grey, light-grey, lighter-grey
- **Secondary Colors**: midnight, sage, celadon, wheat, cement (with tints)
- **Typography**: Financier Display (headings), Calibre (UI/body)
- **Border Radius**: All set to 0 (CBRE uses sharp corners)
- **shadcn Mapping**: Maps shadcn color variables to CBRE tokens

**Accessing theme:**
```typescript
import { cbreTheme } from 'cbre-web-elements/theme';
// Access: cbreTheme.colors, cbreTheme.typography, cbreTheme.borderRadius
```

### Path Aliases

```typescript
"@/*" → root directory
"@/src/*" → ./src/*
"@/components/*" → ./src/components/*
"@/lib/*" → ./src/lib/*
"@/hooks/*" → ./src/hooks/*
```

### Build System

**Rollup** is used to build the library (see `rollup.config.js`):
- Outputs both CommonJS (`dist/index.js`) and ESM (`dist/index.esm.js`)
- Generates TypeScript declarations (`dist/index.d.ts`)
- Uses `tsconfig.lib.json` for library-specific TypeScript config
- Processes CSS with PostCSS
- Babel transpiles JSX/TypeScript

**Library build outputs:**
- `dist/index.js` (CommonJS)
- `dist/index.esm.js` (ES Module)
- `dist/index.d.ts` (TypeScript declarations)

## Generative Patterns Application

The Generative Patterns tool is a client-side application for generating CBRE brand-consistent visual patterns. The main page lives at the root (`app/page.tsx`), while pattern components and utilities are organized in `app/generative-patterns/`.

### Architecture

```
app/generative-patterns/
├── components/
│   ├── GlobalControls.tsx      # Seed, colors, canvas, line weight
│   ├── ControlsPanel.tsx       # Pattern-specific parameters
│   ├── PreviewSurface.tsx      # SVG rendering surface
│   └── ExportMenu.tsx          # SVG/PNG export controls
├── patterns/
│   ├── horizontalBands.tsx                      # Gradient field pattern
│   ├── verticalBars.tsx                         # Density ramp pattern
│   ├── diagonalContours.tsx                     # Rooflines pattern
│   ├── multidimensionalLoS.tsx                  # Multi-angle line pattern
│   └── transformationalColorBackground.tsx      # Color gradient mesh
├── lib/
│   ├── types.ts                # TypeScript type definitions
│   ├── colors.ts               # CBRE color mappings
│   ├── seeding.ts              # Deterministic RNG (mulberry32)
│   └── export.ts               # SVG/PNG export functions
```

### Pattern Types

1. **Horizontal Bands** - Gradient field with vignette effects
   - Parameters: band count, thickness, gap, vignette depth, tilt angle

2. **Vertical Bars** - Density ramp with variable spacing
   - Parameters: bar count, width, gap, density curve, curve intensity, direction, edge padding

3. **Diagonal Contours** - Roofline patterns with slope control
   - Parameters: line count, gap, slope angle, dual peak positions, peak heights, skew factor, line length, opacity step

4. **Multidimensional LoS** - Multi-angle line of sight pattern
   - Parameters: line count, gap, master position (X/Y/Z), corner position, line positions, angles, line extension, stroke width range, gradient options

5. **Transformational Color Background** - Color gradient mesh with pin points
   - Parameters: 5 color pins (enabled/disabled, position, color), blend strength, frame options

### Deterministic Randomization

Uses **mulberry32** seeded PRNG (`lib/seeding.ts`) to ensure same seed produces identical output. All random operations must use the seeded RNG, not `Math.random()`.

### Export System

- **SVG**: Uses `renderToStaticMarkup` to serialize React SVG to string
- **PNG**: Converts SVG → Canvas → Data URL with 1×-4× scaling options

## Component Development Guidelines

### Creating New Components

Use the interactive generator:
```bash
npm run generateComp
```

This creates:
- Properly structured component file in correct directory
- Correct naming convention (UI: `Button`, CBRE: `CBREButton`, Block: `CBRECtaBlock`)
- Automatic index.ts export update

### Component Patterns

**UI Components** (base shadcn):
```typescript
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <button className={cn("base-styles", className)} ref={ref} {...props} />
  )
);
```

**CBRE Components** (styled wrappers):
```typescript
export const CBREButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  CBREButtonProps
>(({ className, ...props }, ref) => (
  <Button className={cn('cbre-specific-styles', className)} ref={ref} {...props} />
));
```

### Styling Conventions

- Use Tailwind utility classes
- Apply CBRE color tokens via `text-cbre-green`, `bg-accent-green`, etc.
- Use font classes: `font-financier` (headings), `font-calibre` (body)
- NO rounded corners (CBRE brand guideline)
- Maintain WCAG AA contrast ratios

## Important Notes

- **Always use `--legacy-peer-deps`** when installing dependencies (React 19 compatibility)
- **ES Modules only** - no CommonJS `require()` in config files
- **CBRE tokens only** - never use arbitrary colors/fonts outside theme
- **Dual entry points**: Main package exports components, `/theme` exports theme config
- **Library vs App**: Changes in `src/` affect published package; changes in `app/` only affect demo
- TypeScript configs: `tsconfig.json` for app, `tsconfig.lib.json` for library
- **Deterministic patterns**: Always use seeded RNG in generative patterns, never `Math.random()`
