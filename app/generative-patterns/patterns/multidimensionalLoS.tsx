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
  const DEFAULT_GAP = 12.0;

  const lines: React.ReactElement[] = [];

  // Use square reference to prevent non-uniform stretching when aspect ratio changes
  const referenceDimension = Math.min(width, height);

  // Calculate responsive scale factor based on default 2000px size
  // This ensures the pattern maintains its form/proportions across different canvas sizes
  const baseSize = 2000;
  const responsiveScale = referenceDimension / baseSize;

  // Calculate master scale from Z position (mimics 3D depth)
  const scale = params.masterPositionZ;

  // Calculate scaled dimensions based on square reference
  const scaledDimension = referenceDimension * scale;
  const scaledWidth = scaledDimension;
  const scaledHeight = scaledDimension;
  const scaledPadding = padding * scale;

  // Center the pattern in the canvas
  const offsetX = (width - scaledWidth) / 2;
  const offsetY = (height - scaledHeight) / 2;

  // Calculate master offset for entire pattern positioning
  const masterOffsetX = (params.masterPositionX - 0.5) * (scaledWidth - 2 * scaledPadding);
  const masterOffsetY = (params.masterPositionY - 0.5) * (scaledHeight - 2 * scaledPadding);

  // Calculate corner peak position (user controllable) with centering offset
  const cornerX = offsetX + scaledPadding + params.cornerPositionX * (scaledWidth - 2 * scaledPadding) + masterOffsetX;
  const cornerY = offsetY + scaledPadding + params.cornerPositionY * (scaledHeight - 2 * scaledPadding) + masterOffsetY;

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
    const offset = i * params.gapBetweenLines * responsiveScale * scale;
    const progress = params.lineCount > 1 ? i / (params.lineCount - 1) : 0;

    // Calculate stroke width (interpolate from min to max) - scaled by Z and responsive scale
    const strokeWidth =
      (params.strokeWidthMin + progress * (params.strokeWidthMax - params.strokeWidthMin)) * responsiveScale * scale;

    // Calculate color
    let strokeColor: string;
    if (params.useGradient) {
      strokeColor = interpolateColor(colorFrom, colorTo, progress);
    } else {
      strokeColor = globals.brand.fg;
    }

    // Calculate line extension - scaled by Z
    // Extension is now applied as a vector scaling at the end to preserve form

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

    // Calculate the CONSTANT peak offset
    // We anchor this to the DEFAULT first line Y (0.40) so that changing firstLineY
    // moves the entire line (including peak) together, rather than stretching it.
    // This treats "Corner Position Y" as defining the shape relative to a standard baseline,
    // rather than an absolute position that pins the peak.
    const DEFAULT_FIRST_LINE_Y = 0.40;
    const referenceFirstLineYBase = scaledPadding + DEFAULT_FIRST_LINE_Y * (scaledHeight - 2 * scaledPadding);
    const constantPeakOffset = cornerYBase - referenceFirstLineYBase;

    // Now calculate actual positions WITH master offset and centering offset for rendering
    const firstLineYPos = offsetY + firstLineYBase + masterOffsetY;
    const foldLineYPos = offsetY + scaledPadding + params.foldLineY * (scaledHeight - 2 * scaledPadding) + masterOffsetY;
    const lastLineYPos = offsetY + scaledPadding + params.lastLineY * (scaledHeight - 2 * scaledPadding) + masterOffsetY;

    // Base positions
    // We implement a "Dynamic Base" to stabilize the extended tips.
    // We use a dynamic factor so that at ext=1.0, the base is FIXED (Skew behavior),
    // and at ext>1.0, the base moves to stabilize the tips (prevent lever effect).

    // 1. Calculate the movement of the Peak relative to its default position
    const innerWidth = scaledWidth - 2 * scaledPadding;
    const defaultCornerX = offsetX + scaledPadding + 0.42 * innerWidth + masterOffsetX;
    const peakDeltaX = cornerX - defaultCornerX;

    // 2. Calculate the stabilization factor
    // Formula: factor = (ext - 1) / ext
    const stabilizationFactor = (params.lineExtension - 1) / params.lineExtension;
    const baseShiftX = peakDeltaX * stabilizationFactor;

    // 3. Apply shift to the default base positions
    const defaultP1BaseX = offsetX + scaledPadding * 1.5 + masterOffsetX;
    const defaultP3BaseX = offsetX + scaledWidth - scaledPadding * 1.5 + masterOffsetX;

    const p1BaseX = defaultP1BaseX + baseShiftX;
    const p2BaseX = cornerX;
    const p3BaseX = defaultP3BaseX + baseShiftX;

    let leftStartX, leftStartY, peakX, peakY, rightEndX, rightEndY;

    let interpolatedY;

    // Y-Axis Stabilization
    const defaultCornerYBase = scaledPadding + 0.14 * (scaledHeight - 2 * scaledPadding);
    const defaultReferenceFirstLineYBase = scaledPadding + 0.40 * (scaledHeight - 2 * scaledPadding);
    const defaultConstantPeakOffset = defaultCornerYBase - defaultReferenceFirstLineYBase;
    const deltaPeakOffset = constantPeakOffset - defaultConstantPeakOffset;

    const baseShiftY = deltaPeakOffset * stabilizationFactor;

    if (i <= foldLineIndex) {
      // PHASE 1: Moving toward fold (lines 0 to foldLineIndex)
      // Y position interpolates from firstLineY to foldLineY
      const phase1Progress = foldLineIndex > 0 ? i / foldLineIndex : 0;
      interpolatedY = firstLineYPos + phase1Progress * (foldLineYPos - firstLineYPos);

      // Apply gap scaling to Y position to maintain angle/form
      // We scale the distance from the first line based on the gap ratio
      const yDistanceFromFirst = interpolatedY - firstLineYPos;
      const scaledYDistance = yDistanceFromFirst * (params.gapBetweenLines / DEFAULT_GAP);
      interpolatedY = firstLineYPos + scaledYDistance;

      leftStartX = p1BaseX - offset * leftSlopeFactor * 0.8;

      // Apply Y stabilization ONLY to the Base (Start), NOT the Peak
      leftStartY = interpolatedY + baseShiftY;

      peakX = p2BaseX - offset * leftSlopeFactor * 0.55;
      peakY = interpolatedY + constantPeakOffset; // Peak uses original Y to stay anchored to slider

      rightEndX = p3BaseX - offset * leftSlopeFactor * 0.5;
      rightEndY = interpolatedY + baseShiftY;
    } else {
      // PHASE 2: Moving away from fold (lines foldLineIndex+1 to end)
      // Y position interpolates from foldLineY to lastLineY
      const linesSinceFold = i - foldLineIndex;
      const phase2TotalLines = params.lineCount - foldLineIndex - 1;
      const phase2Progress = phase2TotalLines > 0 ? linesSinceFold / phase2TotalLines : 0;
      interpolatedY = foldLineYPos + phase2Progress * (lastLineYPos - foldLineYPos);

      // Apply gap scaling to Y position to maintain angle/form
      const yDistanceFromFirst = interpolatedY - firstLineYPos;
      const scaledYDistance = yDistanceFromFirst * (params.gapBetweenLines / DEFAULT_GAP);
      interpolatedY = firstLineYPos + scaledYDistance;

      // Calculate fold point positions (where phase 1 ended at foldLineIndex)
      const foldOffset = foldLineIndex * params.gapBetweenLines * responsiveScale * scale;
      const foldP1X = p1BaseX - foldOffset * leftSlopeFactor * 0.8;
      const foldP2X = p2BaseX - foldOffset * leftSlopeFactor * 0.55;
      const foldP3X = p3BaseX - foldOffset * leftSlopeFactor * 0.5;

      // Apply RIGHT movement from fold point using phase2 offset
      const phase2Offset = linesSinceFold * params.gapBetweenLines * responsiveScale * scale;
      leftStartX = foldP1X + phase2Offset * rightSlopeFactor * 0.47;

      // Apply Y stabilization ONLY to the Base (Start)
      leftStartY = interpolatedY + baseShiftY;

      peakX = foldP2X + phase2Offset * rightSlopeFactor * 0.72;
      peakY = interpolatedY + constantPeakOffset; // Peak uses original Y

      rightEndX = foldP3X + phase2Offset * rightSlopeFactor * 0.76;
      rightEndY = interpolatedY + baseShiftY;
    }

    // Apply line extension by scaling the vector from Peak to Start/End
    // This extends the lines diagonally, preserving the slope and form
    // We reverted to this logic because the 'Fixed Vector' approach caused instability during extension.
    const finalLeftStartX = peakX + (leftStartX - peakX) * params.lineExtension;
    const finalLeftStartY = peakY + (leftStartY - peakY) * params.lineExtension;
    const finalRightEndX = peakX + (rightEndX - peakX) * params.lineExtension;
    const finalRightEndY = peakY + (rightEndY - peakY) * params.lineExtension;

    const points = `${finalLeftStartX},${finalLeftStartY} ${peakX},${peakY} ${finalRightEndX},${finalRightEndY}`;

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
  lineExtension: 1.0,
  strokeWidthMin: 0.5,
  strokeWidthMax: 2.0,
  useGradient: false,
  gradientColorFrom: '',
  gradientColorTo: '',
};
