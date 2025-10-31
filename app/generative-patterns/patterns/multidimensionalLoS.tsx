/**
 * Multidimensional LoS Pattern Generator
 * Creates angular corner pattern with polylines and color gradients
 */

import React from 'react';
import type { MultidimensionalLoSParams, GlobalState } from '../lib/types';
import { interpolateColor } from '../lib/colors';

export function generateMultidimensionalLoS(
  params: MultidimensionalLoSParams,
  globals: GlobalState
): React.ReactElement {
  const { width, height, padding } = globals.canvas;

  const lines: React.ReactElement[] = [];

  // Calculate master scale from Z position (mimics 3D depth)
  const scale = params.masterPositionZ;

  // Calculate scaled dimensions
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;
  const scaledPadding = padding * scale;

  // Calculate master offset for entire pattern positioning
  const masterOffsetX = (params.masterPositionX - 0.5) * (scaledWidth - 2 * scaledPadding);
  const masterOffsetY = (params.masterPositionY - 0.5) * (scaledHeight - 2 * scaledPadding);

  // Calculate corner peak position (user controllable)
  const cornerX = scaledPadding + params.cornerPositionX * (scaledWidth - 2 * scaledPadding) + masterOffsetX;
  const cornerY = scaledPadding + params.cornerPositionY * (scaledHeight - 2 * scaledPadding) + masterOffsetY;

  // Convert angles to radians (user controllable)
  const leftAngleRad = (params.leftAngle * Math.PI) / 180;
  const rightAngleRad = (params.rightAngle * Math.PI) / 180;

  // Determine gradient colors
  const colorFrom = params.gradientColorFrom || globals.brand.fg;
  const colorTo = params.gradientColorTo || globals.brand.bg;

  // Pattern reverses direction at midpoint creating the fold
  // User can control this via lineCount - fold happens at the middle
  const foldLineIndex = Math.floor(params.lineCount * 0.42); // ~42% through (line 22 of 52 default)

  for (let i = 0; i < params.lineCount; i++) {
    const offset = i * params.gapBetweenLines * scale;
    const progress = params.lineCount > 1 ? i / (params.lineCount - 1) : 0;

    // Calculate stroke width (interpolate from min to max) - scaled by Z
    const strokeWidth =
      (params.strokeWidthMin + progress * (params.strokeWidthMax - params.strokeWidthMin)) * scale;

    // Calculate color
    let strokeColor: string;
    if (params.useGradient) {
      strokeColor = interpolateColor(colorFrom, colorTo, progress);
    } else {
      strokeColor = globals.brand.fg;
    }

    // Calculate line extension - scaled by Z
    const extension = ((params.lineExtension - 1) * scaledWidth) / 2;

    // Pattern has TWO phases creating the fold effect:
    // PHASE 1: Lines move DOWN-LEFT toward the fold
    // PHASE 2: Lines move DOWN-RIGHT away from the fold
    //
    // The angles control the diagonal movement direction
    // Gap controls the spacing between lines

    // Calculate base movement deltas using user-controlled angles
    // Left angle controls phase 1 (down-left movement)
    // Right angle controls phase 2 (down-right movement)
    const leftSlopeFactor = Math.tan(leftAngleRad);
    const rightSlopeFactor = Math.tan(rightAngleRad);

    // Calculate Y positions WITHOUT master offset first (for calculating constant offsets)
    const firstLineYBase = scaledPadding + params.firstLineY * (scaledHeight - 2 * scaledPadding);
    const cornerYBase = scaledPadding + params.cornerPositionY * (scaledHeight - 2 * scaledPadding);

    // Calculate the CONSTANT peak offset (this stays the same regardless of line Y positions)
    const constantPeakOffset = cornerYBase - firstLineYBase;

    // Now calculate actual positions WITH master offset for rendering
    const firstLineYPos = firstLineYBase + masterOffsetY;
    const foldLineYPos = scaledPadding + params.foldLineY * (scaledHeight - 2 * scaledPadding) + masterOffsetY;
    const lastLineYPos = scaledPadding + params.lastLineY * (scaledHeight - 2 * scaledPadding) + masterOffsetY;

    // Base positions - now using user-controlled Y positions
    const p1BaseX = scaledPadding * 1.5 + masterOffsetX;
    const p2BaseX = cornerX;
    const p3BaseX = scaledWidth - scaledPadding * 1.5 + masterOffsetX;

    let leftStartX, leftStartY, peakX, peakY, rightEndX, rightEndY;

    if (i <= foldLineIndex) {
      // PHASE 1: Moving toward fold (lines 0 to foldLineIndex)
      // Y position interpolates from firstLineY to foldLineY
      const phase1Progress = foldLineIndex > 0 ? i / foldLineIndex : 0;
      const interpolatedY = firstLineYPos + phase1Progress * (foldLineYPos - firstLineYPos);

      leftStartX = (p1BaseX - extension) - offset * leftSlopeFactor * 0.8;
      leftStartY = interpolatedY;

      peakX = p2BaseX - offset * leftSlopeFactor * 0.55;
      peakY = interpolatedY + constantPeakOffset; // Use constant offset so peak moves with line

      rightEndX = (p3BaseX + extension) - offset * leftSlopeFactor * 0.5;
      rightEndY = interpolatedY;
    } else {
      // PHASE 2: Moving away from fold (lines foldLineIndex+1 to end)
      // Y position interpolates from foldLineY to lastLineY
      const linesSinceFold = i - foldLineIndex;
      const phase2TotalLines = params.lineCount - foldLineIndex - 1;
      const phase2Progress = phase2TotalLines > 0 ? linesSinceFold / phase2TotalLines : 0;
      const interpolatedY = foldLineYPos + phase2Progress * (lastLineYPos - foldLineYPos);

      // Calculate fold point positions (where phase 1 ended at foldLineIndex)
      const foldOffset = foldLineIndex * params.gapBetweenLines * scale;
      const foldP1X = (p1BaseX - extension) - foldOffset * leftSlopeFactor * 0.8;
      const foldP2X = p2BaseX - foldOffset * leftSlopeFactor * 0.55;
      const foldP3X = (p3BaseX + extension) - foldOffset * leftSlopeFactor * 0.5;

      // Apply RIGHT movement from fold point using phase2 offset
      const phase2Offset = linesSinceFold * params.gapBetweenLines * scale;
      leftStartX = foldP1X + phase2Offset * rightSlopeFactor * 0.47;
      leftStartY = interpolatedY;

      peakX = foldP2X + phase2Offset * rightSlopeFactor * 0.72;
      peakY = interpolatedY + constantPeakOffset; // Use constant offset so peak moves with line

      rightEndX = foldP3X + phase2Offset * rightSlopeFactor * 0.76;
      rightEndY = interpolatedY;
    }

    const points = `${leftStartX},${leftStartY} ${peakX},${peakY} ${rightEndX},${rightEndY}`;

    lines.push(
      <polyline
        key={i}
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
    );
  }

  return <g>{lines}</g>;
}

// Default parameters (based on SVG analysis)
export const defaultMultidimensionalLoSParams: MultidimensionalLoSParams = {
  lineCount: 52,
  gapBetweenLines: 12.0,
  masterPositionX: 0.45, // Master X position (0 = left, 1 = right)
  masterPositionY: 0.55, // Master Y position (0 = top, 1 = bottom)
  masterPositionZ: 1.0, // Master Z position/scale (0.5 = 50%, 1.0 = 100%, 2.0 = 200%)
  cornerPositionX: 0.42,
  cornerPositionY: 0.14, // Peak position (0 = top, 1 = bottom)
  firstLineY: 0.40, // Y position of first line (0 = top, 1 = bottom)
  foldLineY: 0.52, // Y position of fold line
  lastLineY: 0.73, // Y position of last line
  leftAngle: 37,
  rightAngle: 57,
  lineExtension: 0.60,
  strokeWidthMin: 0.5,
  strokeWidthMax: 2.0,
  useGradient: false,
  gradientColorFrom: '',
  gradientColorTo: '',
};
