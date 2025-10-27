"use client";

import { useState } from 'react';
import { Label } from '@/src/components/ui/label';
import { Slider } from '@/src/components/ui/slider';
import {
  CBRETabs,
  CBRETabsContent,
  CBRETabsList,
  CBRETabsTrigger,
} from '@/src/components/cbre/CBRETabs';
import { CBRESelect } from '@/src/components/cbre/CBRESelect';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import type {
  PatternType,
  HorizontalBandsParams,
  VerticalBarsParams,
  DiagonalContoursParams,
  MultidimensionalLoSParams,
  TransformationalColorBackgroundParams,
} from '../lib/types';
import { transformationalPresets } from '../patterns/transformationalColorBackground';

interface ControlsPanelProps {
  pattern: PatternType;
  onPatternChange: (pattern: PatternType) => void;
  horizontalBandsParams: HorizontalBandsParams;
  onHorizontalBandsChange: (params: HorizontalBandsParams) => void;
  verticalBarsParams: VerticalBarsParams;
  onVerticalBarsChange: (params: VerticalBarsParams) => void;
  diagonalContoursParams: DiagonalContoursParams;
  onDiagonalContoursChange: (params: DiagonalContoursParams) => void;
  multidimensionalLoSParams: MultidimensionalLoSParams;
  onMultidimensionalLoSChange: (params: MultidimensionalLoSParams) => void;
  transformationalColorBackgroundParams: TransformationalColorBackgroundParams;
  onTransformationalColorBackgroundChange: (params: TransformationalColorBackgroundParams) => void;
  lineWeight: number;
  onLineWeightChange: (weight: number) => void;
}

export function ControlsPanel({
  pattern,
  onPatternChange,
  horizontalBandsParams,
  onHorizontalBandsChange,
  verticalBarsParams,
  onVerticalBarsChange,
  diagonalContoursParams,
  onDiagonalContoursChange,
  multidimensionalLoSParams,
  onMultidimensionalLoSChange,
  transformationalColorBackgroundParams,
  onTransformationalColorBackgroundChange,
  lineWeight,
  onLineWeightChange,
}: ControlsPanelProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('sageHorizon');

  return (
    <div className="space-y-4">
      <CBRETabs
        value={pattern}
        onValueChange={(v) => onPatternChange(v as PatternType)}
        defaultValue="horizontalBands"
        variant="boxed"
      >
        <CBRETabsList className="!grid w-full !h-auto auto-rows-auto gap-2 !p-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
          <CBRETabsTrigger value="horizontalBands">
            Bands
          </CBRETabsTrigger>
          <CBRETabsTrigger value="verticalBars">
            Bars
          </CBRETabsTrigger>
          <CBRETabsTrigger value="diagonalContours">
            Contours
          </CBRETabsTrigger>
          <CBRETabsTrigger value="multidimensionalLoS">
            Dimensional
          </CBRETabsTrigger>
          <CBRETabsTrigger value="transformationalColorBackground">
            Transformational
          </CBRETabsTrigger>
        </CBRETabsList>

        {/* Horizontal Bands Controls */}
        <CBRETabsContent value="horizontalBands" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="band-count" className="font-calibre">
              Band Count: {horizontalBandsParams.bandCount}
            </Label>
            <Slider
              id="band-count"
              min={10}
              max={120}
              step={1}
              value={[horizontalBandsParams.bandCount]}
              onValueChange={(v) =>
                onHorizontalBandsChange({ ...horizontalBandsParams, bandCount: v[0] })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="band-thickness" className="font-calibre">
              Band Thickness: {horizontalBandsParams.bandThickness}px
            </Label>
            <Slider
              id="band-thickness"
              min={1}
              max={40}
              step={1}
              value={[horizontalBandsParams.bandThickness]}
              onValueChange={(v) =>
                onHorizontalBandsChange({ ...horizontalBandsParams, bandThickness: v[0] })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="band-gap" className="font-calibre">
              Band Gap: {horizontalBandsParams.bandGap}px
            </Label>
            <Slider
              id="band-gap"
              min={0}
              max={40}
              step={1}
              value={[horizontalBandsParams.bandGap]}
              onValueChange={(v) =>
                onHorizontalBandsChange({ ...horizontalBandsParams, bandGap: v[0] })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vignette" className="font-calibre">
              Vignette Depth: {horizontalBandsParams.vignetteDepth.toFixed(2)}
            </Label>
            <Slider
              id="vignette"
              min={0}
              max={1}
              step={0.05}
              value={[horizontalBandsParams.vignetteDepth]}
              onValueChange={(v) =>
                onHorizontalBandsChange({ ...horizontalBandsParams, vignetteDepth: v[0] })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tilt" className="font-calibre">
              Tilt Angle: {horizontalBandsParams.tiltAngle}°
            </Label>
            <Slider
              id="tilt"
              min={-5}
              max={5}
              step={0.5}
              value={[horizontalBandsParams.tiltAngle]}
              onValueChange={(v) =>
                onHorizontalBandsChange({ ...horizontalBandsParams, tiltAngle: v[0] })
              }
            />
          </div>
        </CBRETabsContent>

        {/* Vertical Bars Controls */}
        <CBRETabsContent value="verticalBars" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bar-count" className="font-calibre">
              Bar Count: {verticalBarsParams.barCount}
            </Label>
            <Slider
              id="bar-count"
              min={3}
              max={80}
              step={1}
              value={[verticalBarsParams.barCount]}
              onValueChange={(v) =>
                onVerticalBarsChange({ ...verticalBarsParams, barCount: v[0] })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bar-width" className="font-calibre">
              Bar Width: {verticalBarsParams.barWidth}px
            </Label>
            <Slider
              id="bar-width"
              min={2}
              max={80}
              step={1}
              value={[verticalBarsParams.barWidth]}
              onValueChange={(v) =>
                onVerticalBarsChange({ ...verticalBarsParams, barWidth: v[0] })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gap-width" className="font-calibre">
              Gap Width: {verticalBarsParams.gapWidth}px
            </Label>
            <Slider
              id="gap-width"
              min={0}
              max={60}
              step={1}
              value={[verticalBarsParams.gapWidth]}
              onValueChange={(v) =>
                onVerticalBarsChange({ ...verticalBarsParams, gapWidth: v[0] })
              }
            />
          </div>

          <CBRESelect
            label="Density Curve"
            id="density-curve"
            value={verticalBarsParams.densityCurve}
            onValueChange={(v) =>
              onVerticalBarsChange({
                ...verticalBarsParams,
                densityCurve: v as typeof verticalBarsParams.densityCurve,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linear">Linear</SelectItem>
              <SelectItem value="easeIn">Ease In</SelectItem>
              <SelectItem value="easeOut">Ease Out</SelectItem>
              <SelectItem value="easeInOut">Ease In Out</SelectItem>
              <SelectItem value="exp">Exponential</SelectItem>
            </SelectContent>
          </CBRESelect>

          <div className="space-y-2">
            <Label htmlFor="curve-intensity" className="font-calibre">
              Curve Intensity: {verticalBarsParams.curveIntensity.toFixed(2)}
            </Label>
            <Slider
              id="curve-intensity"
              min={0}
              max={2}
              step={0.1}
              value={[verticalBarsParams.curveIntensity]}
              onValueChange={(v) =>
                onVerticalBarsChange({ ...verticalBarsParams, curveIntensity: v[0] })
              }
            />
          </div>

          <CBRESelect
            label="Direction"
            id="direction"
            value={verticalBarsParams.direction}
            onValueChange={(v) =>
              onVerticalBarsChange({
                ...verticalBarsParams,
                direction: v as typeof verticalBarsParams.direction,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LTR">Left to Right</SelectItem>
              <SelectItem value="RTL">Right to Left</SelectItem>
              <SelectItem value="TTB">Top to Bottom</SelectItem>
              <SelectItem value="BTT">Bottom to Top</SelectItem>
            </SelectContent>
          </CBRESelect>

          <div className="space-y-2">
            <Label htmlFor="edge-padding" className="font-calibre">
              Edge Padding: {verticalBarsParams.edgePadding}px
            </Label>
            <Slider
              id="edge-padding"
              min={0}
              max={200}
              step={10}
              value={[verticalBarsParams.edgePadding]}
              onValueChange={(v) =>
                onVerticalBarsChange({ ...verticalBarsParams, edgePadding: v[0] })
              }
            />
          </div>
        </CBRETabsContent>

        {/* Diagonal Contours Controls */}
        <CBRETabsContent value="diagonalContours" className="space-y-4">
          {/* Basic Settings */}
          <div>
            <h3 className="text-sm font-calibre font-semibold text-cbre-green mb-3">Basic Settings</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="line-count" className="font-calibre text-sm">
                  Line Count: {diagonalContoursParams.lineCount}
                </Label>
                <Slider
                  id="line-count"
                  min={3}
                  max={60}
                  step={1}
                  value={[diagonalContoursParams.lineCount]}
                  onValueChange={(v) =>
                    onDiagonalContoursChange({ ...diagonalContoursParams, lineCount: v[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gap-lines" className="font-calibre text-sm">
                  Gap Between Lines: {diagonalContoursParams.gapBetweenLines}px
                </Label>
                <Slider
                  id="gap-lines"
                  min={4}
                  max={40}
                  step={1}
                  value={[diagonalContoursParams.gapBetweenLines]}
                  onValueChange={(v) =>
                    onDiagonalContoursChange({ ...diagonalContoursParams, gapBetweenLines: v[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slope-angle" className="font-calibre text-sm">
                  Slope Angle: {diagonalContoursParams.slopeAngle}°
                </Label>
                <Slider
                  id="slope-angle"
                  min={10}
                  max={60}
                  step={1}
                  value={[diagonalContoursParams.slopeAngle]}
                  onValueChange={(v) =>
                    onDiagonalContoursChange({ ...diagonalContoursParams, slopeAngle: v[0] })
                  }
                />
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-light-grey my-6" />

          {/* Peak Adjustments */}
          <div>
            <h3 className="text-sm font-calibre font-semibold text-cbre-green mb-3">Peak Adjustments</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="peak-pos" className="font-calibre text-sm">
                  Peak Position 1: {diagonalContoursParams.peakPosition.toFixed(2)}
                </Label>
                <Slider
                  id="peak-pos"
                  min={0}
                  max={1}
                  step={0.05}
                  value={[diagonalContoursParams.peakPosition]}
                  onValueChange={(v) =>
                    onDiagonalContoursChange({ ...diagonalContoursParams, peakPosition: v[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="peak-height-1" className="font-calibre text-sm">
                  Peak Height 1: {diagonalContoursParams.peakHeight1}px
                </Label>
                <Slider
                  id="peak-height-1"
                  min={-200}
                  max={200}
                  step={10}
                  value={[diagonalContoursParams.peakHeight1]}
                  onValueChange={(v) =>
                    onDiagonalContoursChange({ ...diagonalContoursParams, peakHeight1: v[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="peak-pos-2" className="font-calibre text-sm">
                  Peak Position 2: {diagonalContoursParams.peakPosition2.toFixed(2)}
                </Label>
                <Slider
                  id="peak-pos-2"
                  min={0}
                  max={1}
                  step={0.05}
                  value={[diagonalContoursParams.peakPosition2]}
                  onValueChange={(v) =>
                    onDiagonalContoursChange({ ...diagonalContoursParams, peakPosition2: v[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="peak-height-2" className="font-calibre text-sm">
                  Peak Height 2: {diagonalContoursParams.peakHeight2}px
                </Label>
                <Slider
                  id="peak-height-2"
                  min={-200}
                  max={200}
                  step={10}
                  value={[diagonalContoursParams.peakHeight2]}
                  onValueChange={(v) =>
                    onDiagonalContoursChange({ ...diagonalContoursParams, peakHeight2: v[0] })
                  }
                />
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-light-grey my-6" />

          {/* Edge & Transform */}
          <div>
            <h3 className="text-sm font-calibre font-semibold text-cbre-green mb-3">Edge & Transform</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="start-height" className="font-calibre text-sm">
                  Start Height: {diagonalContoursParams.startHeight}px
                </Label>
                <Slider
                  id="start-height"
                  min={-200}
                  max={200}
                  step={10}
                  value={[diagonalContoursParams.startHeight]}
                  onValueChange={(v) =>
                    onDiagonalContoursChange({ ...diagonalContoursParams, startHeight: v[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-height" className="font-calibre text-sm">
                  End Height: {diagonalContoursParams.endHeight}px
                </Label>
                <Slider
                  id="end-height"
                  min={-200}
                  max={200}
                  step={10}
                  value={[diagonalContoursParams.endHeight]}
                  onValueChange={(v) =>
                    onDiagonalContoursChange({ ...diagonalContoursParams, endHeight: v[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skew" className="font-calibre text-sm">
                  Skew Factor: {diagonalContoursParams.skewFactor.toFixed(2)}
                </Label>
                <Slider
                  id="skew"
                  min={-0.3}
                  max={0.3}
                  step={0.05}
                  value={[diagonalContoursParams.skewFactor]}
                  onValueChange={(v) =>
                    onDiagonalContoursChange({ ...diagonalContoursParams, skewFactor: v[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="line-length" className="font-calibre text-sm">
                  Line Length: {diagonalContoursParams.lineLength.toFixed(2)}×
                </Label>
                <Slider
                  id="line-length"
                  min={1}
                  max={2}
                  step={0.1}
                  value={[diagonalContoursParams.lineLength]}
                  onValueChange={(v) =>
                    onDiagonalContoursChange({ ...diagonalContoursParams, lineLength: v[0] })
                  }
                />
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-light-grey my-6" />

          {/* Appearance */}
          <div>
            <h3 className="text-sm font-calibre font-semibold text-cbre-green mb-3">Appearance</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="opacity-step" className="font-calibre text-sm">
                  Opacity Step: {diagonalContoursParams.opacityStep.toFixed(3)}
                </Label>
                <Slider
                  id="opacity-step"
                  min={0}
                  max={0.03}
                  step={0.001}
                  value={[diagonalContoursParams.opacityStep]}
                  onValueChange={(v) =>
                    onDiagonalContoursChange({ ...diagonalContoursParams, opacityStep: v[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="line-weight" className="font-calibre text-sm">
                  Line Weight: {lineWeight}px
                </Label>
                <Slider
                  id="line-weight"
                  min={1}
                  max={8}
                  step={0.5}
                  value={[lineWeight]}
                  onValueChange={(v) => onLineWeightChange(v[0])}
                />
              </div>
            </div>
          </div>
        </CBRETabsContent>

        {/* Multidimensional LoS Controls */}
        <CBRETabsContent value="multidimensionalLoS" className="space-y-4">
          {/* Basic Settings */}
          <div>
            <h3 className="text-sm font-calibre font-semibold text-cbre-green mb-3">Basic Settings</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="los-line-count" className="font-calibre text-sm">
                  Line Count: {multidimensionalLoSParams.lineCount}
                </Label>
                <Slider
                  id="los-line-count"
                  min={10}
                  max={100}
                  step={1}
                  value={[multidimensionalLoSParams.lineCount]}
                  onValueChange={(v) =>
                    onMultidimensionalLoSChange({ ...multidimensionalLoSParams, lineCount: v[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="los-gap" className="font-calibre text-sm">
                  Gap Between Lines: {multidimensionalLoSParams.gapBetweenLines.toFixed(1)}px
                </Label>
                <Slider
                  id="los-gap"
                  min={1}
                  max={30}
                  step={0.5}
                  value={[multidimensionalLoSParams.gapBetweenLines]}
                  onValueChange={(v) =>
                    onMultidimensionalLoSChange({ ...multidimensionalLoSParams, gapBetweenLines: v[0] })
                  }
                />
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-light-grey my-6" />

          {/* Master Position */}
          <div>
            <h3 className="text-sm font-calibre font-semibold text-cbre-green mb-3">Master Position</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="master-position-x" className="font-calibre text-sm">
                  Master Position X: {multidimensionalLoSParams.masterPositionX.toFixed(2)}
                </Label>
                <Slider
                  id="master-position-x"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[multidimensionalLoSParams.masterPositionX]}
                  onValueChange={(v) =>
                    onMultidimensionalLoSChange({ ...multidimensionalLoSParams, masterPositionX: v[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="master-position-y" className="font-calibre text-sm">
                  Master Position Y: {multidimensionalLoSParams.masterPositionY.toFixed(2)}
                </Label>
                <Slider
                  id="master-position-y"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[multidimensionalLoSParams.masterPositionY]}
                  onValueChange={(v) =>
                    onMultidimensionalLoSChange({ ...multidimensionalLoSParams, masterPositionY: v[0] })
                  }
                />
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-light-grey my-6" />

          {/* Corner Shape */}
          <div>
            <h3 className="text-sm font-calibre font-semibold text-cbre-green mb-3">Corner Shape</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="corner-x" className="font-calibre text-sm">
                  Corner Position X: {multidimensionalLoSParams.cornerPositionX.toFixed(2)}
                </Label>
                <Slider
                  id="corner-x"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[multidimensionalLoSParams.cornerPositionX]}
                  onValueChange={(v) =>
                    onMultidimensionalLoSChange({ ...multidimensionalLoSParams, cornerPositionX: v[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="corner-y" className="font-calibre text-sm">
                  Corner Position Y: {multidimensionalLoSParams.cornerPositionY.toFixed(2)}
                </Label>
                <Slider
                  id="corner-y"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[multidimensionalLoSParams.cornerPositionY]}
                  onValueChange={(v) =>
                    onMultidimensionalLoSChange({ ...multidimensionalLoSParams, cornerPositionY: v[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="left-angle" className="font-calibre text-sm">
                  Left Angle: {multidimensionalLoSParams.leftAngle}°
                </Label>
                <Slider
                  id="left-angle"
                  min={0}
                  max={90}
                  step={1}
                  value={[multidimensionalLoSParams.leftAngle]}
                  onValueChange={(v) =>
                    onMultidimensionalLoSChange({ ...multidimensionalLoSParams, leftAngle: v[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="right-angle" className="font-calibre text-sm">
                  Right Angle: {multidimensionalLoSParams.rightAngle}°
                </Label>
                <Slider
                  id="right-angle"
                  min={0}
                  max={90}
                  step={1}
                  value={[multidimensionalLoSParams.rightAngle]}
                  onValueChange={(v) =>
                    onMultidimensionalLoSChange({ ...multidimensionalLoSParams, rightAngle: v[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="first-line-y" className="font-calibre text-sm">
                  First Line Y: {multidimensionalLoSParams.firstLineY.toFixed(2)}
                </Label>
                <Slider
                  id="first-line-y"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[multidimensionalLoSParams.firstLineY]}
                  onValueChange={(v) =>
                    onMultidimensionalLoSChange({ ...multidimensionalLoSParams, firstLineY: v[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fold-line-y" className="font-calibre text-sm">
                  Fold Line Y: {multidimensionalLoSParams.foldLineY.toFixed(2)}
                </Label>
                <Slider
                  id="fold-line-y"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[multidimensionalLoSParams.foldLineY]}
                  onValueChange={(v) =>
                    onMultidimensionalLoSChange({ ...multidimensionalLoSParams, foldLineY: v[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last-line-y" className="font-calibre text-sm">
                  Last Line Y: {multidimensionalLoSParams.lastLineY.toFixed(2)}
                </Label>
                <Slider
                  id="last-line-y"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[multidimensionalLoSParams.lastLineY]}
                  onValueChange={(v) =>
                    onMultidimensionalLoSChange({ ...multidimensionalLoSParams, lastLineY: v[0] })
                  }
                />
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-light-grey my-6" />

          {/* Line Appearance */}
          <div>
            <h3 className="text-sm font-calibre font-semibold text-cbre-green mb-3">Line Appearance</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="stroke-min" className="font-calibre text-sm">
                  Stroke Width Min: {multidimensionalLoSParams.strokeWidthMin.toFixed(1)}px
                </Label>
                <Slider
                  id="stroke-min"
                  min={0.5}
                  max={4}
                  step={0.1}
                  value={[multidimensionalLoSParams.strokeWidthMin]}
                  onValueChange={(v) =>
                    onMultidimensionalLoSChange({ ...multidimensionalLoSParams, strokeWidthMin: v[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stroke-max" className="font-calibre text-sm">
                  Stroke Width Max: {multidimensionalLoSParams.strokeWidthMax.toFixed(1)}px
                </Label>
                <Slider
                  id="stroke-max"
                  min={0.5}
                  max={4}
                  step={0.1}
                  value={[multidimensionalLoSParams.strokeWidthMax]}
                  onValueChange={(v) =>
                    onMultidimensionalLoSChange({ ...multidimensionalLoSParams, strokeWidthMax: v[0] })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="line-extension" className="font-calibre text-sm">
                  Line Extension: {multidimensionalLoSParams.lineExtension.toFixed(2)}×
                </Label>
                <Slider
                  id="line-extension"
                  min={0.5}
                  max={2}
                  step={0.05}
                  value={[multidimensionalLoSParams.lineExtension]}
                  onValueChange={(v) =>
                    onMultidimensionalLoSChange({ ...multidimensionalLoSParams, lineExtension: v[0] })
                  }
                />
                <p className="text-xs text-dark-grey font-calibre">0.5 = sharper/shorter, 2.0 = extended/longer</p>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-light-grey my-6" />

          {/* Color Gradient */}
          <div>
            <h3 className="text-sm font-calibre font-semibold text-cbre-green mb-3">Color Gradient</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="use-gradient"
                  checked={multidimensionalLoSParams.useGradient}
                  onChange={(e) =>
                    onMultidimensionalLoSChange({ ...multidimensionalLoSParams, useGradient: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="use-gradient" className="font-calibre text-sm cursor-pointer">
                  Use Gradient
                </Label>
              </div>

              {multidimensionalLoSParams.useGradient && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="gradient-from" className="font-calibre text-sm">
                      Gradient Color From (optional)
                    </Label>
                    <input
                      type="color"
                      id="gradient-from"
                      value={multidimensionalLoSParams.gradientColorFrom || '#17E88F'}
                      onChange={(e) =>
                        onMultidimensionalLoSChange({ ...multidimensionalLoSParams, gradientColorFrom: e.target.value })
                      }
                      className="w-full h-10 border border-light-grey cursor-pointer"
                    />
                    <p className="text-xs text-dark-grey font-calibre">Leave empty to use main foreground color</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gradient-to" className="font-calibre text-sm">
                      Gradient Color To (optional)
                    </Label>
                    <input
                      type="color"
                      id="gradient-to"
                      value={multidimensionalLoSParams.gradientColorTo || '#003F2D'}
                      onChange={(e) =>
                        onMultidimensionalLoSChange({ ...multidimensionalLoSParams, gradientColorTo: e.target.value })
                      }
                      className="w-full h-10 border border-light-grey cursor-pointer"
                    />
                    <p className="text-xs text-dark-grey font-calibre">Leave empty to use main background color</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </CBRETabsContent>

        {/* Transformational Color Background Controls */}
        <CBRETabsContent value="transformationalColorBackground" className="space-y-4">
          {/* Preset Selector */}
          <div>
            <CBRESelect
              label="Preset"
              id="transformational-preset"
              value={selectedPreset}
              onValueChange={(presetKey) => {
                setSelectedPreset(presetKey);
                const preset = transformationalPresets[presetKey as keyof typeof transformationalPresets];
                if (preset) {
                  onTransformationalColorBackgroundChange(preset.params);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a preset..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(transformationalPresets).map(([key, preset]) => (
                  <SelectItem key={key} value={key}>
                    {preset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </CBRESelect>
          </div>

          <div className="h-[1px] bg-light-grey my-6" />

          {/* Blend Strength */}
          <div>
            <h3 className="text-sm font-calibre font-semibold text-cbre-green mb-3">Blend Settings</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="blend-strength" className="font-calibre text-sm">
                  Blend Strength: {transformationalColorBackgroundParams.blendStrength.toFixed(1)}
                </Label>
                <Slider
                  id="blend-strength"
                  min={0.1}
                  max={3}
                  step={0.1}
                  value={[transformationalColorBackgroundParams.blendStrength]}
                  onValueChange={(v) =>
                    onTransformationalColorBackgroundChange({
                      ...transformationalColorBackgroundParams,
                      blendStrength: v[0],
                    })
                  }
                />
                <p className="text-xs text-dark-grey font-calibre">
                  Lower = softer blend, Higher = sharper transitions
                </p>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-light-grey my-6" />

          {/* Color Pins */}
          <div>
            <h3 className="text-sm font-calibre font-semibold text-cbre-green mb-3">Color Pins</h3>
            <div className="space-y-4">
              {transformationalColorBackgroundParams.pins.map((pin, idx) => (
                <div key={idx} className="border border-light-grey p-3 rounded space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-calibre font-semibold text-sm text-cbre-green">
                      Pin {idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`pin-${idx}-enabled`}
                        checked={pin.enabled}
                        onChange={(e) => {
                          const newPins = [...transformationalColorBackgroundParams.pins];
                          newPins[idx] = { ...newPins[idx], enabled: e.target.checked };
                          onTransformationalColorBackgroundChange({
                            ...transformationalColorBackgroundParams,
                            pins: newPins as any,
                          });
                        }}
                        className="w-4 h-4"
                      />
                      <Label htmlFor={`pin-${idx}-enabled`} className="font-calibre text-sm cursor-pointer">
                        Enabled
                      </Label>
                    </div>
                  </div>

                  {pin.enabled && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor={`pin-${idx}-color`} className="font-calibre text-sm">
                          Color
                        </Label>
                        <input
                          type="color"
                          id={`pin-${idx}-color`}
                          value={pin.color}
                          onChange={(e) => {
                            const newPins = [...transformationalColorBackgroundParams.pins];
                            newPins[idx] = { ...newPins[idx], color: e.target.value };
                            onTransformationalColorBackgroundChange({
                              ...transformationalColorBackgroundParams,
                              pins: newPins as any,
                            });
                          }}
                          className="w-full h-10 border border-light-grey cursor-pointer"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`pin-${idx}-x`} className="font-calibre text-sm">
                          X Position: {pin.x.toFixed(2)}
                        </Label>
                        <Slider
                          id={`pin-${idx}-x`}
                          min={0}
                          max={1}
                          step={0.01}
                          value={[pin.x]}
                          onValueChange={(v) => {
                            const newPins = [...transformationalColorBackgroundParams.pins];
                            newPins[idx] = { ...newPins[idx], x: v[0] };
                            onTransformationalColorBackgroundChange({
                              ...transformationalColorBackgroundParams,
                              pins: newPins as any,
                            });
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`pin-${idx}-y`} className="font-calibre text-sm">
                          Y Position: {pin.y.toFixed(2)}
                        </Label>
                        <Slider
                          id={`pin-${idx}-y`}
                          min={0}
                          max={1}
                          step={0.01}
                          value={[pin.y]}
                          onValueChange={(v) => {
                            const newPins = [...transformationalColorBackgroundParams.pins];
                            newPins[idx] = { ...newPins[idx], y: v[0] };
                            onTransformationalColorBackgroundChange({
                              ...transformationalColorBackgroundParams,
                              pins: newPins as any,
                            });
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="h-[1px] bg-light-grey my-6" />

          {/* Frame Settings */}
          <div>
            <h3 className="text-sm font-calibre font-semibold text-cbre-green mb-3">Frame Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="frame-enabled"
                  checked={transformationalColorBackgroundParams.frameEnabled}
                  onChange={(e) =>
                    onTransformationalColorBackgroundChange({
                      ...transformationalColorBackgroundParams,
                      frameEnabled: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="frame-enabled" className="font-calibre text-sm cursor-pointer">
                  Enable Frame
                </Label>
              </div>

              {transformationalColorBackgroundParams.frameEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="frame-thickness" className="font-calibre text-sm">
                    Frame Thickness: {transformationalColorBackgroundParams.frameThickness}px
                  </Label>
                  <Slider
                    id="frame-thickness"
                    min={20}
                    max={300}
                    step={10}
                    value={[transformationalColorBackgroundParams.frameThickness]}
                    onValueChange={(v) =>
                      onTransformationalColorBackgroundChange({
                        ...transformationalColorBackgroundParams,
                        frameThickness: v[0],
                      })
                    }
                  />
                  <p className="text-xs text-dark-grey font-calibre">
                    Frame uses inverted pin positions for gradient
                  </p>
                </div>
              )}
            </div>
          </div>
        </CBRETabsContent>
      </CBRETabs>
    </div>
  );
}
