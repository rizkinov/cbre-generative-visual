/**
 * Vertical Bars Pattern Generator
 * Creates density ramp with vertical bars
 */

import React from 'react';
import type { VerticalBarsParams, GlobalState, DensityCurve } from '../lib/types';
import { mulberry32 } from '../lib/seeding';

// Density curve functions
// Returns a value from 0 to 1 representing density along the progression
function applyCurve(t: number, curve: DensityCurve, intensity: number): number {
  switch (curve) {
    case 'linear':
      // Linear: always returns 0 (no density variation, uniform spacing)
      return 0;
    case 'ease':
      // Ease In: quadratic easing - starts slow, accelerates
      // This is the original calculation: t * t
      const easeIn = t * t;
      return easeIn * (intensity / 100);
    default:
      return 0;
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
      // t goes from 0 to 1 across all bars
      const t = params.barCount > 1 ? i / (params.barCount - 1) : 0.5;

      // Apply curve and intensity
      const density = applyCurve(t, params.densityCurve, params.curveIntensity);

      // For LTR: density increases (gap decreases) from left to right
      // For RTL: density increases (gap decreases) from right to left (reverse the curve)
      const maxDensity = (params.curveIntensity / 100);
      const finalDensity = params.direction === 'LTR' ? density : maxDensity * (1 - t * t);

      const barWidth = Math.max(lineWeight, params.barWidth);

      // Gap reduces as density increases - amplify the effect for more dramatic squeeze
      // Multiply by 3 to make the gap reduction more aggressive
      const gapReduction = Math.min(1, finalDensity * 3);
      let gap = params.gapWidth * (1 - gapReduction);

      // When gap gets very small (< 5px), make bars overlap for solid appearance
      // This eliminates any hairline gaps at the densest end
      const finalGap = gap < 5 ? -2 : gap;

      // Always extend the last bar drawn to fill remaining space
      // This works for all directions (LTR, RTL, etc.)
      const isLastBar = i === params.barCount - 1;
      const actualBarWidth = (isLastBar && params.extendLastBar)
        ? (width - padding - params.edgePadding - x) // Fill remaining space
        : barWidth;

      bars.push(
        <rect
          key={i}
          x={x}
          y={padding}
          width={actualBarWidth}
          height={height - 2 * padding}
          fill="currentColor"
        />
      );

      x += barWidth + finalGap;
    }
  } else {
    // Horizontal bars (top-bottom)
    let y = padding + params.edgePadding;

    for (let i = 0; i < params.barCount && y < height - padding - params.edgePadding; i++) {
      // t goes from 0 to 1 across all bars
      const t = params.barCount > 1 ? i / (params.barCount - 1) : 0.5;

      // Apply curve and intensity
      const density = applyCurve(t, params.densityCurve, params.curveIntensity);

      // For TTB: density increases (gap decreases) from top to bottom
      // For BTT: density increases (gap decreases) from bottom to top (reverse the curve)
      const maxDensity = (params.curveIntensity / 100);
      const finalDensity = params.direction === 'TTB' ? density : maxDensity * (1 - t * t);

      const barHeight = Math.max(lineWeight, params.barWidth);

      // Gap reduces as density increases - amplify the effect for more dramatic squeeze
      // Multiply by 3 to make the gap reduction more aggressive
      const gapReduction = Math.min(1, finalDensity * 3);
      let gap = params.gapWidth * (1 - gapReduction);

      // When gap gets very small (< 5px), make bars overlap for solid appearance
      // This eliminates any hairline gaps at the densest end
      const finalGap = gap < 5 ? -2 : gap;

      // Always extend the last bar drawn to fill remaining space
      // This works for all directions (TTB, BTT, etc.)
      const isLastBar = i === params.barCount - 1;
      const actualBarHeight = (isLastBar && params.extendLastBar)
        ? (height - padding - params.edgePadding - y) // Fill remaining space
        : barHeight;

      bars.push(
        <rect
          key={i}
          x={padding}
          y={y}
          width={width - 2 * padding}
          height={actualBarHeight}
          fill="currentColor"
        />
      );

      y += barHeight + finalGap;
    }
  }

  return <g>{bars}</g>;
}

// Default parameters
export const defaultVerticalBarsParams: VerticalBarsParams = {
  barCount: 30,
  barWidth: 20,
  gapWidth: 40,
  densityCurve: 'ease',
  curveIntensity: 50, // 0-100 scale
  direction: 'LTR',
  edgePadding: 0,
  extendLastBar: true,
};
