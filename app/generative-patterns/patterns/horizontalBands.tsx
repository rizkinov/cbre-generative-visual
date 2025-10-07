/**
 * Horizontal Bands Pattern Generator
 * Creates gradient field with horizontal stripes
 */

import React from 'react';
import type { HorizontalBandsParams, GlobalState, RNG } from '../lib/types';
import { mulberry32 } from '../lib/seeding';

export function generateHorizontalBands(
  params: HorizontalBandsParams,
  globals: GlobalState
): React.ReactElement {
  const rng = mulberry32(globals.seed);
  const { width, height, padding } = globals.canvas;
  const { lineWeight } = globals;

  const bands: React.ReactElement[] = [];
  let y = padding;
  const tiltRad = (params.tiltAngle * Math.PI) / 180;

  for (let i = 0; i < params.bandCount && y < height - padding; i++) {
    // Calculate thickness with variation
    const thicknessVar = rng() * params.thicknessVariation * params.bandThickness;
    const thickness = params.bandThickness + thicknessVar - (params.thicknessVariation * params.bandThickness) / 2;

    // Calculate gap with variation
    const gapVar = rng() * params.gapVariation * params.bandGap;
    const gap = params.bandGap + gapVar - (params.gapVariation * params.bandGap) / 2;

    // Add Y jitter
    const jitterY = (rng() - 0.5) * 2 * params.yJitter;

    // Calculate vignette opacity
    const distFromCenter = Math.abs(y + thickness / 2 - height / 2) / (height / 2);
    const vignetteOpacity = 1 - params.vignetteDepth * distFromCenter;

    // Create band with optional tilt
    const transform = params.tiltAngle !== 0
      ? `rotate(${params.tiltAngle} ${width / 2} ${height / 2})`
      : undefined;

    bands.push(
      <rect
        key={i}
        x={padding}
        y={y + jitterY}
        width={width - 2 * padding}
        height={Math.max(lineWeight, thickness)}
        fill="currentColor"
        opacity={vignetteOpacity}
        transform={transform}
      />
    );

    y += thickness + gap;
  }

  return <g>{bands}</g>;
}

// Default parameters
export const defaultHorizontalBandsParams: HorizontalBandsParams = {
  bandCount: 40,
  bandThickness: 10,
  thicknessVariation: 0.3,
  bandGap: 8,
  gapVariation: 0.3,
  vignetteDepth: 0.4,
  yJitter: 1,
  tiltAngle: 0,
};
