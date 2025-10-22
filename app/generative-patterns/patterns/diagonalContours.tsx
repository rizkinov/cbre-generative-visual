/**
 * Diagonal Contours Pattern Generator
 * Creates roofline/mountain patterns with diagonal lines
 */

import React from 'react';
import type { DiagonalContoursParams, GlobalState } from '../lib/types';

export function generateDiagonalContours(
  params: DiagonalContoursParams,
  globals: GlobalState
): React.ReactElement {
  const { width, height, padding } = globals.canvas;
  const { lineWeight } = globals;

  const lines: React.ReactElement[] = [];

  // Calculate peak X positions
  const peakX1 = padding + params.peakPosition * (width - 2 * padding);
  const peakX2 = padding + params.peakPosition2 * (width - 2 * padding);

  // Convert slope angle to rise/run
  const slopeRad = (params.slopeAngle * Math.PI) / 180;
  const slopeRise = Math.tan(slopeRad);

  for (let i = 0; i < params.lineCount; i++) {
    const offset = i * params.gapBetweenLines;

    // Calculate opacity with step
    const opacity = Math.max(0.1, 1 - i * params.opacityStep);

    // Apply skew factor (horizontal offset based on Y position)
    const skewOffset = params.skewFactor * offset;

    // Apply line length extension (percentage of canvas width)
    const extension = ((params.lineLength - 1) * width) / 2;

    // Define the contour path with 2 peaks (creating a jagged pattern)
    const leftStartY = padding + offset + params.startHeight;
    const peak1Y = leftStartY + (peakX1 - padding) * slopeRise + params.peakHeight1;
    const peak2Y = peak1Y + Math.abs(peakX2 - peakX1) * slopeRise + params.peakHeight2;
    const rightEndY = peak2Y + (width - padding - peakX2) * slopeRise + params.endHeight;

    const pathData = `
      M ${padding + skewOffset - extension} ${leftStartY}
      L ${peakX1 + skewOffset} ${peak1Y}
      L ${peakX2 + skewOffset} ${peak2Y}
      L ${width - padding + skewOffset + extension} ${rightEndY}
    `;

    lines.push(
      <path
        key={i}
        d={pathData.trim()}
        fill="none"
        stroke="currentColor"
        strokeWidth={lineWeight}
        strokeLinecap="butt"
        strokeLinejoin="miter"
        opacity={opacity}
      />
    );
  }

  return <g>{lines}</g>;
}

// Default parameters
export const defaultDiagonalContoursParams: DiagonalContoursParams = {
  lineCount: 50,
  gapBetweenLines: 40,
  slopeAngle: 10,
  peakPosition: 0.25,
  peakPosition2: 0.70,
  peakHeight1: 200,
  peakHeight2: -100,
  startHeight: 10,
  endHeight: 200,
  skewFactor: 0.0,
  lineLength: 1.0,
  opacityStep: 0.007,
};
