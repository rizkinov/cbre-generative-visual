/**
 * Transformational Color Background Pattern Generator
 * Creates mesh gradients with positioned color pins
 */

import React from 'react';
import type { TransformationalColorBackgroundParams, GlobalState, ColorPin } from '../lib/types';
import { cbreColors } from '../lib/colors';

/**
 * Calculate color at a point using inverse distance weighting
 */
function calculateMeshColor(
  x: number,
  y: number,
  pins: ColorPin[],
  blendStrength: number
): string {
  const enabledPins = pins.filter(p => p.enabled);

  if (enabledPins.length === 0) {
    return '#FFFFFF';
  }

  if (enabledPins.length === 1) {
    return enabledPins[0].color;
  }

  // Calculate distances and weights
  const distances = enabledPins.map(pin => {
    const dx = x - pin.x;
    const dy = y - pin.y;
    return Math.sqrt(dx * dx + dy * dy);
  });

  // Inverse distance weighting with power (higher = sharper transitions)
  const power = 2 + blendStrength * 2;
  const weights = distances.map(d => {
    if (d < 0.001) return 1000000; // Very close to pin
    return 1 / Math.pow(d, power);
  });

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  // Parse colors and blend
  const parseHex = (hex: string): [number, number, number] => {
    const cleaned = hex.replace('#', '');
    return [
      parseInt(cleaned.substring(0, 2), 16),
      parseInt(cleaned.substring(2, 4), 16),
      parseInt(cleaned.substring(4, 6), 16),
    ];
  };

  let r = 0, g = 0, b = 0;

  enabledPins.forEach((pin, i) => {
    const weight = weights[i] / totalWeight;
    const [pr, pg, pb] = parseHex(pin.color);
    r += pr * weight;
    g += pg * weight;
    b += pb * weight;
  });

  const toHex = (value: number) => Math.round(value).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Generate mesh gradient as SVG using defs and filters
 */
function generateMeshGradientSVG(
  width: number,
  height: number,
  pins: ColorPin[],
  blendStrength: number,
  idPrefix: string
): React.ReactElement {
  const enabledPins = pins.filter(p => p.enabled);

  if (enabledPins.length === 0) {
    return <rect width={width} height={height} fill="#FFFFFF" />;
  }

  if (enabledPins.length === 1) {
    return <rect width={width} height={height} fill={enabledPins[0].color} />;
  }

  // Create a high-resolution grid for smooth gradients
  // Increased grid resolution for smoother blending and fewer artifacts
  const gridSize = Math.min(150, Math.max(100, Math.floor(Math.min(width, height) / 20)));

  // Extend grid beyond visible area to prevent edge darkening (like AE's "Repeat Edge Pixels")
  const edgeExtension = 0.15; // Extend 15% beyond edges
  const extendedWidth = width * (1 + edgeExtension * 2);
  const extendedHeight = height * (1 + edgeExtension * 2);
  const offsetX = -width * edgeExtension;
  const offsetY = -height * edgeExtension;

  const rects: React.ReactElement[] = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      // Map to 0-1 range (will go slightly beyond for edge extension)
      const x = (col / (gridSize - 1)) * (1 + edgeExtension * 2) - edgeExtension;
      const y = (row / (gridSize - 1)) * (1 + edgeExtension * 2) - edgeExtension;

      // Clamp to 0-1 for color calculation to repeat edge colors
      const clampedX = Math.max(0, Math.min(1, x));
      const clampedY = Math.max(0, Math.min(1, y));

      const color = calculateMeshColor(clampedX, clampedY, pins, blendStrength);

      const rectX = offsetX + (col / gridSize) * extendedWidth;
      const rectY = offsetY + (row / gridSize) * extendedHeight;
      const rectWidth = extendedWidth / gridSize + 2;
      const rectHeight = extendedHeight / gridSize + 2;

      rects.push(
        <rect
          key={`${idPrefix}-${row}-${col}`}
          x={rectX}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
          fill={color}
        />
      );
    }
  }

  // Calculate blur strength for smooth blending
  // Increased blur for smoother gradients and reduced artifacts
  const blurAmount = Math.max(30, width / gridSize * 1.5);

  return (
    <g>
      <defs>
        <filter id={`${idPrefix}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blurAmount} />
        </filter>
      </defs>
      <clipPath id={`${idPrefix}-clip`}>
        <rect x="0" y="0" width={width} height={height} />
      </clipPath>
      <g clipPath={`url(#${idPrefix}-clip)`}>
        <g filter={`url(#${idPrefix}-blur)`}>
          {rects}
        </g>
      </g>
    </g>
  );
}

export function generateTransformationalColorBackground(
  params: TransformationalColorBackgroundParams,
  globals: GlobalState
): React.ReactElement {
  const { width, height, padding } = globals.canvas;

  // Create inverted pins for frame
  const invertedPins: [ColorPin, ColorPin, ColorPin, ColorPin, ColorPin] = params.pins.map(pin => ({
    ...pin,
    x: 1 - pin.x,
    y: 1 - pin.y,
  })) as [ColorPin, ColorPin, ColorPin, ColorPin, ColorPin];

  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  return (
    <g>
      {/* Frame (if enabled) - render first so main gradient overlays it */}
      {params.frameEnabled && (
        <>
          {/* Create mask for frame border */}
          <defs>
            <mask id="frame-mask">
              {/* White = visible, Black = hidden */}
              <rect x={padding} y={padding} width={innerWidth} height={innerHeight} fill="white" />
              {/* Cut out inner area */}
              <rect
                x={padding + params.frameThickness}
                y={padding + params.frameThickness}
                width={innerWidth - params.frameThickness * 2}
                height={innerHeight - params.frameThickness * 2}
                fill="black"
              />
            </mask>
          </defs>

          {/* Render full inverted gradient with frame mask */}
          <g transform={`translate(${padding}, ${padding})`} mask="url(#frame-mask)">
            {generateMeshGradientSVG(innerWidth, innerHeight, invertedPins, params.blendStrength, 'frame')}
          </g>
        </>
      )}

      {/* Main gradient */}
      <g transform={`translate(${padding}, ${padding})`}>
        {params.frameEnabled && (
          // Clip main gradient to not overlap frame
          <defs>
            <clipPath id="main-clip">
              <rect
                x={params.frameThickness}
                y={params.frameThickness}
                width={innerWidth - params.frameThickness * 2}
                height={innerHeight - params.frameThickness * 2}
              />
            </clipPath>
          </defs>
        )}
        <g clipPath={params.frameEnabled ? "url(#main-clip)" : undefined}>
          {generateMeshGradientSVG(innerWidth, innerHeight, params.pins, params.blendStrength, 'main')}
        </g>
      </g>
    </g>
  );
}

// Preset configurations
export const transformationalPresets = {
  'sageHorizon': {
    name: 'Sage Horizon',
    params: {
      pins: [
        { enabled: true, x: 0.1, y: 0.2, color: cbreColors['sage-tint'] },
        { enabled: true, x: 0.9, y: 0.3, color: cbreColors['celadon'] },
        { enabled: true, x: 0.5, y: 0.8, color: cbreColors['wheat-tint'] },
        { enabled: true, x: 0.2, y: 0.6, color: cbreColors['midnight'] },
        { enabled: false, x: 0.5, y: 0.5, color: cbreColors['accent-green'] },
      ],
      blendStrength: 0.1,
      frameEnabled: false,
      frameThickness: 100,
    } as TransformationalColorBackgroundParams,
  },
  'midnightBloom': {
    name: 'Midnight Bloom',
    params: {
      pins: [
        { enabled: true, x: 0.15, y: 0.15, color: cbreColors['accent-green'] },
        { enabled: true, x: 0.85, y: 0.2, color: cbreColors['midnight'] },
        { enabled: true, x: 0.5, y: 0.9, color: cbreColors['sage'] },
        { enabled: true, x: 0.8, y: 0.75, color: cbreColors['celadon-tint'] },
        { enabled: false, x: 0.5, y: 0.5, color: '#FFFFFF' },
      ],
      blendStrength: 0.1,
      frameEnabled: false,
      frameThickness: 100,
    } as TransformationalColorBackgroundParams,
  },
  'wheatFields': {
    name: 'Wheat Fields',
    params: {
      pins: [
        { enabled: true, x: 0.2, y: 0.3, color: cbreColors['celadon-tint'] },
        { enabled: true, x: 0.7, y: 0.25, color: cbreColors['sage'] },
        { enabled: true, x: 0.4, y: 0.7, color: cbreColors['wheat-tint'] },
        { enabled: true, x: 0.85, y: 0.8, color: cbreColors['midnight-tint'] },
        { enabled: false, x: 0.5, y: 0.5, color: '#FFFFFF' },
      ],
      blendStrength: 0.1,
      frameEnabled: false,
      frameThickness: 100,
    } as TransformationalColorBackgroundParams,
  },
  'celadonDream': {
    name: 'Celadon Dream',
    params: {
      pins: [
        { enabled: true, x: 0.25, y: 0.25, color: cbreColors['midnight'] },
        { enabled: true, x: 0.75, y: 0.35, color: cbreColors['celadon'] },
        { enabled: true, x: 0.5, y: 0.75, color: cbreColors['wheat-tint'] },
        { enabled: true, x: 0.15, y: 0.65, color: cbreColors['sage-tint'] },
        { enabled: true, x: 0.85, y: 0.85, color: cbreColors['cement-tint'] },
      ],
      blendStrength: 0.1,
      frameEnabled: false,
      frameThickness: 100,
    } as TransformationalColorBackgroundParams,
  },
};

// Default parameters (Sage Horizon preset)
export const defaultTransformationalColorBackgroundParams: TransformationalColorBackgroundParams =
  transformationalPresets.sageHorizon.params;
