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
    // Use consistent thickness and gap
    const thickness = params.bandThickness;
    const gap = params.bandGap;

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
        y={y}
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
  bandCount: 45,
  bandThickness: 25,
  bandGap: 20,
  vignetteDepth: 0.20,
  tiltAngle: 0,
};
