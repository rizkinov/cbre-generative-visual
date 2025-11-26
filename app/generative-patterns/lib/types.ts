/**
 * Type definitions for CBRE Generative Patterns
 */

export type PatternType = 'horizontalBands' | 'verticalBars' | 'diagonalContours' | 'multidimensionalLoS' | 'transformationalColorBackground' | 'portal';

export type DimensionPreset = '16:9' | '9:16' | '4:3' | '3:4' | '1:1';

export interface CanvasSpec {
  width: number;
  height: number;
  padding: number;
  dimension: DimensionPreset;
}

export interface BrandPair {
  bg: string;
  fg: string;
}

export interface GlobalState {
  canvas: CanvasSpec;
  brand: BrandPair;
  lineWeight: number;
  seed: number;
  pattern: PatternType;
}

// Horizontal Bands Parameters
export interface HorizontalBandsParams {
  bandCount: number;
  bandThickness: number;
  bandGap: number;
  vignetteDepth: number;
  tiltAngle: number;
}

// Vertical Bars Parameters
export type DensityCurve = 'linear' | 'ease';
export type Direction = 'LTR' | 'RTL' | 'TTB' | 'BTT';

export interface VerticalBarsParams {
  barCount: number;
  barWidth: number;
  gapWidth: number;
  densityCurve: DensityCurve;
  curveIntensity: number; // 0-100 scale (affects gap)
  barCurveIntensity: number; // 0-100 scale (affects bar width)
  direction: Direction;
  edgePadding: number;
  extendLastBar: boolean; // Extend last bar to fill remaining space
  paddingColor?: string; // Optional background color for the padding area
  mirror?: 'none' | 'horizontal' | 'vertical';
  splitCount: 1 | 2 | 3 | 4;
  splits: {
    color?: string; // Custom color for this split
    mirror: boolean; // Whether to reverse direction for this split
  }[];
}

// Diagonal Contours Parameters
export interface DiagonalContoursParams {
  lineCount: number;
  gapBetweenLines: number;
  slopeAngle: number;
  peakPosition: number;
  peakPosition2: number;
  peakHeight1: number;
  peakHeight2: number;
  startHeight: number;
  endHeight: number;
  skewFactor: number;
  lineLength: number;
  opacityStep: number;
}

// Multidimensional LoS Parameters
export interface MultidimensionalLoSParams {
  lineCount: number;
  gapBetweenLines: number;
  masterPositionX: number;
  masterPositionY: number;
  masterPositionZ: number;
  cornerPositionX: number;
  cornerPositionY: number;
  firstLineY: number;
  foldLineY: number;
  lastLineY: number;
  leftAngle: number;
  rightAngle: number;
  lineExtension: number;
  strokeWidthMin: number;
  strokeWidthMax: number;
  useGradient: boolean;
  gradientColorFrom: string;
  gradientColorTo: string;
  masterRotation: number; // 0, 90, 180, 270
  masterFlipX: boolean;
  masterFlipY: boolean;
}

// Transformational Color Background Parameters
export interface ColorPin {
  enabled: boolean;
  x: number;
  y: number;
  color: string;
}

export interface TransformationalColorBackgroundParams {
  pins: [ColorPin, ColorPin, ColorPin, ColorPin, ColorPin];
  blendStrength: number;
  frameEnabled: boolean;
  frameThickness: number;
}

// Pattern render result
export interface PatternRenderResult {
  svg: React.ReactElement;
}

// RNG function type
export type RNG = () => number;
