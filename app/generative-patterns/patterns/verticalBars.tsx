/**
 * Vertical Bars Pattern Generator
 * Creates density ramp with vertical bars
 */

import React from 'react';
import type { VerticalBarsParams, GlobalState, DensityCurve } from '../lib/types';
import { mulberry32 } from '../lib/seeding';

// Density curve functions
function applyCurve(t: number, curve: DensityCurve): number {
  switch (curve) {
    case 'linear':
      return t;
    case 'easeIn':
      return t * t;
    case 'easeOut':
      return 1 - (1 - t) * (1 - t);
    case 'easeInOut':
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    case 'exp':
      return Math.pow(t, 2.5);
    default:
      return t;
  }
}

export function generateVerticalBars(
  params: VerticalBarsParams,
  globals: GlobalState
): React.ReactElement {
  const rng = mulberry32(globals.seed);
  const { width, height, padding } = globals.canvas;
  const { lineWeight } = globals;

  const bars: React.ReactElement[] = [];

  // Determine if bars are vertical (LTR/RTL) or horizontal (TTB/BTT)
  const isVertical = params.direction === 'LTR' || params.direction === 'RTL';

  if (isVertical) {
    // Vertical bars (left-right)
    let x = padding + params.edgePadding;

    for (let i = 0; i < params.barCount && x < width - padding - params.edgePadding; i++) {
      const t = params.barCount > 1 ? i / (params.barCount - 1) : 0.5;
      const tCurved = applyCurve(t, params.densityCurve);
      const densityRaw = params.direction === 'LTR' ? tCurved : 1 - tCurved;
      const density = densityRaw * params.curveIntensity;

      const barWidth = Math.max(lineWeight, params.barWidth);
      const gap = params.gapWidth * (1 - density * 0.8);

      bars.push(
        <rect
          key={i}
          x={x}
          y={padding}
          width={barWidth}
          height={height - 2 * padding}
          fill="currentColor"
        />
      );

      x += barWidth + gap;
    }
  } else {
    // Horizontal bars (top-bottom)
    let y = padding + params.edgePadding;

    for (let i = 0; i < params.barCount && y < height - padding - params.edgePadding; i++) {
      const t = params.barCount > 1 ? i / (params.barCount - 1) : 0.5;
      const tCurved = applyCurve(t, params.densityCurve);
      const densityRaw = params.direction === 'TTB' ? tCurved : 1 - tCurved;
      const density = densityRaw * params.curveIntensity;

      const barHeight = Math.max(lineWeight, params.barWidth);
      const gap = params.gapWidth * (1 - density * 0.8);

      bars.push(
        <rect
          key={i}
          x={padding}
          y={y}
          width={width - 2 * padding}
          height={barHeight}
          fill="currentColor"
        />
      );

      y += barHeight + gap;
    }
  }

  return <g>{bars}</g>;
}

// Default parameters
export const defaultVerticalBarsParams: VerticalBarsParams = {
  barCount: 30,
  barWidth: 20,
  gapWidth: 15,
  densityCurve: 'easeInOut',
  curveIntensity: 1.0,
  direction: 'LTR',
  edgePadding: 50,
};
