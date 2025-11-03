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
    const barWidth = Math.max(lineWeight, params.barWidth);

    if (params.direction === 'LTR') {
      // Left to Right: density increases rightward
      let x = padding + params.edgePadding;

      for (let i = 0; i < params.barCount && x < width - padding - params.edgePadding; i++) {
        const t = params.barCount > 1 ? i / (params.barCount - 1) : 0.5;
        const density = applyCurve(t, params.densityCurve, params.curveIntensity);

        const gapReduction = Math.min(1, density * 3);
        let gap = params.gapWidth * (1 - gapReduction);
        const finalGap = gap < 10 ? -Math.max(1, Math.floor(density * 10)) : gap;

        const isLastBar = i === params.barCount - 1;
        const actualBarWidth = (isLastBar && params.extendLastBar)
          ? (width - padding - params.edgePadding - x)
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
      // Right to Left: density increases leftward
      let x = width - padding - params.edgePadding;

      for (let i = 0; i < params.barCount && x > padding + params.edgePadding; i++) {
        const t = params.barCount > 1 ? i / (params.barCount - 1) : 0.5;
        const density = applyCurve(t, params.densityCurve, params.curveIntensity);

        const gapReduction = Math.min(1, density * 3);
        let gap = params.gapWidth * (1 - gapReduction);
        const finalGap = gap < 10 ? -Math.max(1, Math.floor(density * 10)) : gap;

        const isLastBar = i === params.barCount - 1;
        const actualBarWidth = (isLastBar && params.extendLastBar)
          ? (x - padding - params.edgePadding)
          : barWidth;

        bars.push(
          <rect
            key={i}
            x={x - actualBarWidth}
            y={padding}
            width={actualBarWidth}
            height={height - 2 * padding}
            fill="currentColor"
          />
        );

        x -= barWidth + finalGap;
      }
    }
  } else {
    // Horizontal bars (top-bottom)
    const barHeight = Math.max(lineWeight, params.barWidth);

    if (params.direction === 'TTB') {
      // Top to Bottom: density increases downward
      let y = padding + params.edgePadding;

      for (let i = 0; i < params.barCount && y < height - padding - params.edgePadding; i++) {
        const t = params.barCount > 1 ? i / (params.barCount - 1) : 0.5;
        const density = applyCurve(t, params.densityCurve, params.curveIntensity);

        const gapReduction = Math.min(1, density * 3);
        let gap = params.gapWidth * (1 - gapReduction);
        const finalGap = gap < 10 ? -Math.max(1, Math.floor(density * 10)) : gap;

        const isLastBar = i === params.barCount - 1;
        const actualBarHeight = (isLastBar && params.extendLastBar)
          ? (height - padding - params.edgePadding - y)
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
    } else {
      // Bottom to Top: density increases upward
      let y = height - padding - params.edgePadding;

      for (let i = 0; i < params.barCount && y > padding + params.edgePadding; i++) {
        const t = params.barCount > 1 ? i / (params.barCount - 1) : 0.5;
        const density = applyCurve(t, params.densityCurve, params.curveIntensity);

        const gapReduction = Math.min(1, density * 3);
        let gap = params.gapWidth * (1 - gapReduction);
        const finalGap = gap < 10 ? -Math.max(1, Math.floor(density * 10)) : gap;

        const isLastBar = i === params.barCount - 1;
        const actualBarHeight = (isLastBar && params.extendLastBar)
          ? (y - padding - params.edgePadding)
          : barHeight;

        bars.push(
          <rect
            key={i}
            x={padding}
            y={y - actualBarHeight}
            width={width - 2 * padding}
            height={actualBarHeight}
            fill="currentColor"
          />
        );

        y -= barHeight + finalGap;
      }
    }
  }

  return <g>{bars}</g>;
}

// Default parameters
export const defaultVerticalBarsParams: VerticalBarsParams = {
  barCount: 24,
  barWidth: 50,
  gapWidth: 30,
  densityCurve: 'ease',
  curveIntensity: 50, // 0-100 scale
  direction: 'LTR',
  edgePadding: 0,
  extendLastBar: true,
};
