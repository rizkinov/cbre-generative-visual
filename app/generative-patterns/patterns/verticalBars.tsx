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
      // Modified to use linear t so the effect is visible from the start
      // Previously t * t (quadratic) which made the start very subtle

      // Handle negative intensity: reverse the direction of density
      if (intensity < 0) {
        // When intensity is negative, density decreases as t increases
        // t=0 -> high density, t=1 -> low density
        return (1 - t) * (Math.abs(intensity) / 100);
      }

      // Positive intensity: density increases as t increases
      // t=0 -> low density, t=1 -> high density
      return t * (intensity / 100);
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

  // Helper for full bleed rendering when padding color is used
  const useFullBleed = !!params.paddingColor;

  if (useFullBleed) {
    // 1. Draw full content background (matches the gaps)
    // We use globals.brand.fg because in PreviewSurface, colors are swapped for Vertical Bars,
    // so the background (gaps) becomes the foreground color (Accent Green).
    bars.push(
      <rect
        key="bg-full-bleed"
        x={0}
        y={0}
        width={width}
        height={height}
        fill={globals.brand.fg}
      />
    );
  }

  // Determine mirroring bounds
  let effectiveWidth = width;
  let effectiveHeight = height;
  let renderWidth = width;
  let renderHeight = height;

  if (params.mirror === 'horizontal') {
    effectiveWidth = width / 2;
    renderWidth = width / 2;
  } else if (params.mirror === 'vertical') {
    effectiveHeight = height / 2;
    renderHeight = height / 2;
  }

  if (isVertical) {
    // Vertical bars (left-right)
    const barWidth = Math.max(lineWeight, params.barWidth);

    // Determine vertical extent
    const barY = useFullBleed ? 0 : padding;
    const barHeight = useFullBleed ? height : height - 2 * padding;

    if (params.direction === 'LTR') {
      // Left to Right: density increases rightward
      // If mirrored horizontally: Left Edge -> Center
      let x = padding + params.edgePadding;
      const limit = params.mirror === 'horizontal' ? effectiveWidth : width - padding - params.edgePadding;

      for (let i = 0; i < params.barCount && x < limit; i++) {
        const t = params.barCount > 1 ? i / (params.barCount - 1) : 0.5;

        // Gap density
        const gapDensity = applyCurve(t, params.densityCurve, params.curveIntensity);
        const gapReduction = Math.min(1, gapDensity * 3);
        let gap = params.gapWidth * (1 - gapReduction);
        const finalGap = gap < 10 ? -Math.max(1, Math.floor(gapDensity * 10)) : gap;

        // Bar density
        const barDensity = applyCurve(t, params.densityCurve, params.barCurveIntensity);
        const barReduction = Math.min(0.9, barDensity * 2); // Limit reduction so bars don't disappear completely
        const currentBarWidth = Math.max(lineWeight, barWidth * (1 - barReduction));

        const isLastBar = i === params.barCount - 1;
        const actualBarWidth = (isLastBar && params.extendLastBar)
          ? (limit - x)
          : currentBarWidth;

        bars.push(
          <rect
            key={`ltr-${i}`}
            x={x}
            y={barY}
            width={actualBarWidth}
            height={barHeight}
            fill="currentColor"
          />
        );

        x += currentBarWidth + finalGap;
      }
    } else {
      // Right to Left: density increases leftward
      // If mirrored horizontally: Center -> Left Edge
      let startX = params.mirror === 'horizontal' ? effectiveWidth : width - padding - params.edgePadding;
      let limit = padding + params.edgePadding;
      let x = startX;

      for (let i = 0; i < params.barCount && x > limit; i++) {
        const t = params.barCount > 1 ? i / (params.barCount - 1) : 0.5;

        // Gap density
        const gapDensity = applyCurve(t, params.densityCurve, params.curveIntensity);
        const gapReduction = Math.min(1, gapDensity * 3);
        let gap = params.gapWidth * (1 - gapReduction);
        const finalGap = gap < 10 ? -Math.max(1, Math.floor(gapDensity * 10)) : gap;

        // Bar density
        const barDensity = applyCurve(t, params.densityCurve, params.barCurveIntensity);
        const barReduction = Math.min(0.9, barDensity * 2);
        const currentBarWidth = Math.max(lineWeight, barWidth * (1 - barReduction));

        const isLastBar = i === params.barCount - 1;
        const actualBarWidth = (isLastBar && params.extendLastBar)
          ? (x - limit)
          : currentBarWidth;

        bars.push(
          <rect
            key={`rtl-${i}`}
            x={x - actualBarWidth}
            y={barY}
            width={actualBarWidth}
            height={barHeight}
            fill="currentColor"
          />
        );

        x -= currentBarWidth + finalGap;
      }
    }
  } else {
    // Horizontal bars (top-bottom)
    const barHeight = Math.max(lineWeight, params.barWidth);

    // Determine horizontal extent
    const barX = useFullBleed ? 0 : padding;
    const barWidth = useFullBleed ? width : width - 2 * padding;

    if (params.direction === 'TTB') {
      // Top to Bottom: density increases downward
      // If mirrored vertically: Top Edge -> Center
      let y = padding + params.edgePadding;
      const limit = params.mirror === 'vertical' ? effectiveHeight : height - padding - params.edgePadding;

      for (let i = 0; i < params.barCount && y < limit; i++) {
        const t = params.barCount > 1 ? i / (params.barCount - 1) : 0.5;

        // Gap density
        const gapDensity = applyCurve(t, params.densityCurve, params.curveIntensity);
        const gapReduction = Math.min(1, gapDensity * 3);
        let gap = params.gapWidth * (1 - gapReduction);
        const finalGap = gap < 10 ? -Math.max(1, Math.floor(gapDensity * 10)) : gap;

        // Bar density
        const barDensity = applyCurve(t, params.densityCurve, params.barCurveIntensity);
        const barReduction = Math.min(0.9, barDensity * 2);
        const currentBarHeight = Math.max(lineWeight, barHeight * (1 - barReduction));

        const isLastBar = i === params.barCount - 1;
        const actualBarHeight = (isLastBar && params.extendLastBar)
          ? (limit - y)
          : currentBarHeight;

        bars.push(
          <rect
            key={`ttb-${i}`}
            x={barX}
            y={y}
            width={barWidth}
            height={actualBarHeight}
            fill="currentColor"
          />
        );

        y += currentBarHeight + finalGap;
      }
    } else {
      // Bottom to Top: density increases upward
      // If mirrored vertically: Center -> Top Edge
      let startY = params.mirror === 'vertical' ? effectiveHeight : height - padding - params.edgePadding;
      let limit = padding + params.edgePadding;
      let y = startY;

      for (let i = 0; i < params.barCount && y > limit; i++) {
        const t = params.barCount > 1 ? i / (params.barCount - 1) : 0.5;

        // Gap density
        const gapDensity = applyCurve(t, params.densityCurve, params.curveIntensity);
        const gapReduction = Math.min(1, gapDensity * 3);
        let gap = params.gapWidth * (1 - gapReduction);
        const finalGap = gap < 10 ? -Math.max(1, Math.floor(gapDensity * 10)) : gap;

        // Bar density
        const barDensity = applyCurve(t, params.densityCurve, params.barCurveIntensity);
        const barReduction = Math.min(0.9, barDensity * 2);
        const currentBarHeight = Math.max(lineWeight, barHeight * (1 - barReduction));

        const isLastBar = i === params.barCount - 1;
        const actualBarHeight = (isLastBar && params.extendLastBar)
          ? (y - limit)
          : currentBarHeight;

        bars.push(
          <rect
            key={`btt-${i}`}
            x={barX}
            y={y - actualBarHeight}
            width={barWidth}
            height={actualBarHeight}
            fill="currentColor"
          />
        );

        y -= currentBarHeight + finalGap;
      }
    }
  }

  // Handle Mirroring Duplication
  if (params.mirror === 'horizontal') {
    // Duplicate bars to the right side
    const mirroredBars = bars.map((bar, i) => {
      if (bar.type !== 'rect') return null;
      const props = bar.props as any;
      // Mirror X: newX = width - x - width
      const newX = width - props.x - props.width;
      return (
        <rect
          key={`mirror-h-${i}`}
          {...props}
          x={newX}
        />
      );
    });
    bars.push(...mirroredBars.filter((b): b is React.ReactElement => b !== null));
  } else if (params.mirror === 'vertical') {
    // Duplicate bars to the bottom side
    const mirroredBars = bars.map((bar, i) => {
      if (bar.type !== 'rect') return null;
      const props = bar.props as any;
      // Mirror Y: newY = height - y - height
      const newY = height - props.y - props.height;
      return (
        <rect
          key={`mirror-v-${i}`}
          {...props}
          y={newY}
        />
      );
    });
    bars.push(...mirroredBars.filter((b): b is React.ReactElement => b !== null));
  }

  // Apply padding mask if color is specified
  // We draw these ON TOP of the bars to create a clean edge
  if (params.paddingColor) {
    // Calculate mask dimensions based on direction
    const topHeight = isVertical ? padding : padding + params.edgePadding;
    const bottomHeight = isVertical ? padding : padding + params.edgePadding;
    const leftWidth = isVertical ? padding + params.edgePadding : padding;
    const rightWidth = isVertical ? padding + params.edgePadding : padding;

    // Top Mask
    bars.push(
      <rect
        key="mask-top"
        x={0}
        y={0}
        width={width}
        height={topHeight}
        fill={params.paddingColor}
      />
    );

    // Bottom Mask
    bars.push(
      <rect
        key="mask-bottom"
        x={0}
        y={height - bottomHeight}
        width={width}
        height={bottomHeight}
        fill={params.paddingColor}
      />
    );

    // Left Mask
    bars.push(
      <rect
        key="mask-left"
        x={0}
        y={topHeight} // Start below top mask to avoid double draw (though harmless)
        width={leftWidth}
        height={height - topHeight - bottomHeight}
        fill={params.paddingColor}
      />
    );

    // Right Mask
    bars.push(
      <rect
        key="mask-right"
        x={width - rightWidth}
        y={topHeight}
        width={rightWidth}
        height={height - topHeight - bottomHeight}
        fill={params.paddingColor}
      />
    );
  }

  return <g>{bars}</g>;
}

// Preset configurations
export const verticalBarsPresets = {
  'preset1': {
    name: 'Preset 1',
    params: {
      barCount: 12,
      barWidth: 194,
      gapWidth: 80,
      densityCurve: 'ease',
      curveIntensity: 5,
      barCurveIntensity: -50,
      direction: 'BTT',
      edgePadding: 0,
      extendLastBar: false,
      paddingColor: '',
      mirror: 'none',
    } as VerticalBarsParams,
  },
  'preset2': {
    name: 'Preset 2',
    params: {
      barCount: 30,
      barWidth: 193,
      gapWidth: 93,
      densityCurve: 'ease',
      curveIntensity: 43,
      barCurveIntensity: -57,
      direction: 'TTB',
      edgePadding: 0,
      extendLastBar: false,
      paddingColor: '',
      mirror: 'none',
    } as VerticalBarsParams,
  },
  'preset3': {
    name: 'Preset 3',
    params: {
      barCount: 16,
      barWidth: 130,
      gapWidth: 68,
      densityCurve: 'ease',
      curveIntensity: 5,
      barCurveIntensity: -50,
      direction: 'LTR',
      edgePadding: 0,
      extendLastBar: false,
      paddingColor: '',
      mirror: 'none',
    } as VerticalBarsParams,
  },
  'preset4': {
    name: 'Preset 4',
    params: {
      barCount: 6,
      barWidth: 784,
      gapWidth: 71,
      densityCurve: 'ease',
      curveIntensity: 20,
      barCurveIntensity: 88,
      direction: 'LTR',
      edgePadding: 0,
      extendLastBar: false,
      paddingColor: '',
      mirror: 'none',
    } as VerticalBarsParams,
  },
  'preset5': {
    name: 'Preset 5',
    params: {
      barCount: 12,
      barWidth: 554,
      gapWidth: 75,
      densityCurve: 'ease',
      curveIntensity: 9,
      barCurveIntensity: -50,
      direction: 'TTB',
      edgePadding: 0,
      extendLastBar: false,
      paddingColor: '',
      mirror: 'vertical',
    } as VerticalBarsParams,
  },
  'preset6': {
    name: 'Preset 6',
    params: {
      barCount: 10,
      barWidth: 69,
      gapWidth: 106,
      densityCurve: 'ease',
      curveIntensity: -35,
      barCurveIntensity: 23,
      direction: 'LTR',
      edgePadding: 0,
      extendLastBar: false,
      paddingColor: '',
      mirror: 'horizontal',
    } as VerticalBarsParams,
  },
};

// Default parameters
export const defaultVerticalBarsParams: VerticalBarsParams = verticalBarsPresets.preset1.params;
