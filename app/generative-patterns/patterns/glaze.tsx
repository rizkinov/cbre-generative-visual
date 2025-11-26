/**
 * Glaze Pattern Generator
 * Creates mesh gradients with positioned color pins
 */

import React from 'react';
import type { GlazeParams, GlobalState, ColorPin } from '../lib/types';
import { cbreColors } from '../lib/colors';

/**
 * Calculate color at a point using inverse distance weighting
 */
/**
 * Calculate color components at a point using inverse distance weighting
 */
function calculateMeshColorComponents(
  x: number,
  y: number,
  pins: ColorPin[],
  blendStrength: number,
  aspectRatio: number = 1
): { r: number; g: number; b: number; a: number } {
  const enabledPins = pins.filter(p => p.enabled);

  if (enabledPins.length === 0) {
    return { r: 255, g: 255, b: 255, a: 1 };
  }

  if (enabledPins.length === 1) {
    const hex = enabledPins[0].color;
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return { r, g, b, a: enabledPins[0].opacity ?? 1 };
  }

  // Calculate distances and weights
  const distances = enabledPins.map(pin => {
    const dx = (x - pin.x) * aspectRatio;
    const dy = y - pin.y;
    return Math.sqrt(dx * dx + dy * dy);
  });

  const power = 1.5 + blendStrength * 2;
  const weights = distances.map(d => {
    if (d < 0.001) return 1000000;
    return 1 / Math.pow(d, power);
  });

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  const parseHex = (hex: string): [number, number, number] => {
    const cleaned = hex.replace('#', '');
    return [
      parseInt(cleaned.substring(0, 2), 16),
      parseInt(cleaned.substring(2, 4), 16),
      parseInt(cleaned.substring(4, 6), 16),
    ];
  };

  let r = 0, g = 0, b = 0, a = 0;

  enabledPins.forEach((pin, i) => {
    const weight = weights[i] / totalWeight;
    const [pr, pg, pb] = parseHex(pin.color);
    r += pr * weight;
    g += pg * weight;
    b += pb * weight;
    a += (pin.opacity !== undefined ? pin.opacity : 1) * weight;
  });

  return { r: Math.round(r), g: Math.round(g), b: Math.round(b), a };
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
  // Calculate aspect ratio
  const aspectRatio = width / height;

  // Grid resolution - reduced slightly to compensate for double rendering (RGB + Alpha)
  // The masking technique allows for lower resolution without overlap artifacts
  const gridSize = Math.min(120, Math.max(80, Math.floor(Math.min(width, height) / 15)));

  const edgeExtension = 0.15;
  const extendedWidth = width * (1 + edgeExtension * 2);
  const extendedHeight = height * (1 + edgeExtension * 2);
  const offsetX = -width * edgeExtension;
  const offsetY = -height * edgeExtension;

  const rectsColor: React.ReactElement[] = [];
  const rectsAlpha: React.ReactElement[] = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = (col / (gridSize - 1)) * (1 + edgeExtension * 2) - edgeExtension;
      const y = (row / (gridSize - 1)) * (1 + edgeExtension * 2) - edgeExtension;

      const clampedX = Math.max(0, Math.min(1, x));
      const clampedY = Math.max(0, Math.min(1, y));

      const { r, g, b, a } = calculateMeshColorComponents(clampedX, clampedY, pins, blendStrength, aspectRatio);

      const rectX = offsetX + (col / gridSize) * extendedWidth;
      const rectY = offsetY + (row / gridSize) * extendedHeight;
      // Overlap is fine now because rects are opaque
      const rectWidth = extendedWidth / gridSize + 2;
      const rectHeight = extendedHeight / gridSize + 2;

      const key = `${row}-${col}`;

      rectsColor.push(
        <rect
          key={`c-${key}`}
          x={rectX}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
          fill={`rgb(${r},${g},${b})`}
        />
      );

      // Alpha map: White = opaque, Black = transparent
      const alphaVal = Math.round(a * 255);
      rectsAlpha.push(
        <rect
          key={`a-${key}`}
          x={rectX}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
          fill={`rgb(${alphaVal},${alphaVal},${alphaVal})`}
        />
      );
    }
  }

  const blurAmount = Math.max(40, Math.min(width, height) / gridSize * 2.5);

  return (
    <g>
      <defs>
        <filter id={`${idPrefix}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blurAmount} result="blurred" />
          {/* Noise dithering */}
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.04 0" in="noise" result="weakNoise" />
          <feComposite operator="in" in="weakNoise" in2="blurred" result="noiseOverlay" />
          <feBlend mode="overlay" in="noiseOverlay" in2="blurred" />
        </filter>

        <mask id={`${idPrefix}-alpha-mask`}>
          {/* Blur the alpha mask too for smooth transitions */}
          <g filter={`url(#${idPrefix}-blur)`}>
            {rectsAlpha}
          </g>
        </mask>
      </defs>

      <clipPath id={`${idPrefix}-clip`}>
        <rect x="0" y="0" width={width} height={height} />
      </clipPath>

      <g clipPath={`url(#${idPrefix}-clip)`}>
        <g mask={`url(#${idPrefix}-alpha-mask)`}>
          <g filter={`url(#${idPrefix}-blur)`}>
            {rectsColor}
          </g>
        </g>
      </g>
    </g>
  );
}

export function generateGlaze(
  params: GlazeParams,
  globals: GlobalState
): React.ReactElement {
  const { width, height, padding } = globals.canvas;

  // Fill the entire canvas while maintaining gradient proportions
  // The gradient will expand to fill the full canvas without distortion
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  // Create inverted pins for frame
  const invertedPins: [ColorPin, ColorPin, ColorPin, ColorPin, ColorPin] = params.pins.map(pin => ({
    ...pin,
    x: 1 - pin.x,
    y: 1 - pin.y,
  })) as [ColorPin, ColorPin, ColorPin, ColorPin, ColorPin];

  return (
    <g>
      {/* Background Color - Covers entire canvas to override global background */}
      <rect x={0} y={0} width={width} height={height} fill={params.backgroundColor || '#FFFFFF'} />

      {/* Frame (if enabled) - render first so main gradient overlays it */}
      {params.frameEnabled && (
        <>
          {/* Create mask for frame border */}
          <defs>
            <mask id="frame-mask">
              {/* White = visible, Black = hidden */}
              <rect x={0} y={0} width={innerWidth} height={innerHeight} fill="white" />
              {/* Cut out inner area */}
              <rect
                x={params.frameThickness}
                y={params.frameThickness}
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
export const glazePresets = {
  'preset1': {
    name: 'Preset 1',
    params: {
      pins: [
        { enabled: true, x: 0.0, y: 0.0, color: cbreColors['cbre-green'], opacity: 0.47 },
        { enabled: true, x: 1.0, y: 0.0, color: cbreColors['sage'], opacity: 1.0 },
        { enabled: true, x: 1.0, y: 1.0, color: cbreColors['celadon-shade-3'], opacity: 0.77 },
        { enabled: true, x: 0.67, y: 1.0, color: cbreColors['accent-green-shade-2'], opacity: 0.45 },
        { enabled: false, x: 0.5, y: 0.5, color: cbreColors['dark-green-shade-1'], opacity: 1 },
      ],
      blendStrength: 0.5,
      frameEnabled: false,
      frameThickness: 100,
      backgroundColor: cbreColors['midnight'],
    } as GlazeParams,
  },
  'preset2': {
    name: 'Preset 2',
    params: {
      pins: [
        { enabled: true, x: 0.0, y: 1.0, color: cbreColors['midnight-shade-1'], opacity: 0.8 },
        { enabled: true, x: 1.0, y: 0.0, color: cbreColors['celadon-shade-1'], opacity: 0.79 },
        { enabled: true, x: 0.0, y: 1.0, color: cbreColors['midnight-shade-2'], opacity: 0.9 },
        { enabled: true, x: 1.0, y: 1.0, color: cbreColors['wheat-tint'], opacity: 0.59 },
        { enabled: true, x: 0.5, y: 0.5, color: cbreColors['sage-tint'], opacity: 0.18 },
      ],
      blendStrength: 0.5,
      frameEnabled: false,
      frameThickness: 100,
      backgroundColor: cbreColors['celadon-shade-1'],
    } as GlazeParams,
  },
  'preset3': {
    name: 'Preset 3',
    params: {
      pins: [
        { enabled: true, x: 0.10, y: 0.0, color: cbreColors['white'], opacity: 0.73 },
        { enabled: true, x: 0.37, y: 1.0, color: cbreColors['accent-green'], opacity: 0.55 },
        { enabled: true, x: 1.0, y: 0.10, color: cbreColors['midnight-shade-1'], opacity: 0.74 },
        { enabled: true, x: 1.0, y: 1.0, color: cbreColors['sage-shade-1'], opacity: 0.66 },
        { enabled: true, x: 0.5, y: 0.5, color: cbreColors['celadon-tint'], opacity: 0.30 },
      ],
      blendStrength: 0.5,
      frameEnabled: false,
      frameThickness: 100,
      backgroundColor: cbreColors['accent-green-shade-2'],
    } as GlazeParams,
  },
  'preset4': {
    name: 'Preset 4',
    params: {
      pins: [
        { enabled: true, x: 0.0, y: 1.0, color: cbreColors['dark-green'], opacity: 0.55 },
        { enabled: true, x: 1.0, y: 0.0, color: cbreColors['celadon-shade-2'], opacity: 0.85 },
        { enabled: true, x: 0.0, y: 0.72, color: cbreColors['dark-green'], opacity: 0.40 },
        { enabled: true, x: 1.0, y: 1.0, color: cbreColors['sage-tint'], opacity: 0.88 },
        { enabled: false, x: 0.5, y: 0.5, color: cbreColors['cbre-green'], opacity: 0.5 },
      ],
      blendStrength: 0.5,
      frameEnabled: false,
      frameThickness: 100,
      backgroundColor: cbreColors['midnight'],
    } as GlazeParams,
  },
};

// Default parameters (Preset 1)
export const defaultGlazeParams: GlazeParams =
  glazePresets.preset1.params;
