"use client";

import { Label } from '@/src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { Slider } from '@/src/components/ui/slider';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/components/ui/tabs';
import type {
  PatternType,
  HorizontalBandsParams,
  VerticalBarsParams,
  DiagonalContoursParams,
} from '../lib/types';

interface ControlsPanelProps {
  pattern: PatternType;
  onPatternChange: (pattern: PatternType) => void;
  horizontalBandsParams: HorizontalBandsParams;
  onHorizontalBandsChange: (params: HorizontalBandsParams) => void;
  verticalBarsParams: VerticalBarsParams;
  onVerticalBarsChange: (params: VerticalBarsParams) => void;
  diagonalContoursParams: DiagonalContoursParams;
  onDiagonalContoursChange: (params: DiagonalContoursParams) => void;
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
  lineWeight,
  onLineWeightChange,
}: ControlsPanelProps) {
  return (
    <div className="space-y-4">
      <Tabs value={pattern} onValueChange={(v) => onPatternChange(v as PatternType)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="horizontalBands" className="font-calibre">
            Bands
          </TabsTrigger>
          <TabsTrigger value="verticalBars" className="font-calibre">
            Bars
          </TabsTrigger>
          <TabsTrigger value="diagonalContours" className="font-calibre">
            Contours
          </TabsTrigger>
        </TabsList>

        {/* Horizontal Bands Controls */}
        <TabsContent value="horizontalBands" className="space-y-4 mt-4">
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
            <Label htmlFor="thickness-var" className="font-calibre">
              Thickness Variation: {horizontalBandsParams.thicknessVariation.toFixed(2)}
            </Label>
            <Slider
              id="thickness-var"
              min={0}
              max={0.6}
              step={0.05}
              value={[horizontalBandsParams.thicknessVariation]}
              onValueChange={(v) =>
                onHorizontalBandsChange({ ...horizontalBandsParams, thicknessVariation: v[0] })
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
            <Label htmlFor="gap-var" className="font-calibre">
              Gap Variation: {horizontalBandsParams.gapVariation.toFixed(2)}
            </Label>
            <Slider
              id="gap-var"
              min={0}
              max={0.6}
              step={0.05}
              value={[horizontalBandsParams.gapVariation]}
              onValueChange={(v) =>
                onHorizontalBandsChange({ ...horizontalBandsParams, gapVariation: v[0] })
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
            <Label htmlFor="y-jitter" className="font-calibre">
              Y Jitter: {horizontalBandsParams.yJitter}px
            </Label>
            <Slider
              id="y-jitter"
              min={0}
              max={2}
              step={0.1}
              value={[horizontalBandsParams.yJitter]}
              onValueChange={(v) =>
                onHorizontalBandsChange({ ...horizontalBandsParams, yJitter: v[0] })
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
        </TabsContent>

        {/* Vertical Bars Controls */}
        <TabsContent value="verticalBars" className="space-y-4 mt-4">
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
            <Label htmlFor="width-var" className="font-calibre">
              Width Variation: {verticalBarsParams.widthVariation.toFixed(2)}
            </Label>
            <Slider
              id="width-var"
              min={0}
              max={0.5}
              step={0.05}
              value={[verticalBarsParams.widthVariation]}
              onValueChange={(v) =>
                onVerticalBarsChange({ ...verticalBarsParams, widthVariation: v[0] })
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

          <div className="space-y-2">
            <Label htmlFor="density-curve" className="font-calibre">
              Density Curve
            </Label>
            <Select
              value={verticalBarsParams.densityCurve}
              onValueChange={(v) =>
                onVerticalBarsChange({
                  ...verticalBarsParams,
                  densityCurve: v as typeof verticalBarsParams.densityCurve,
                })
              }
            >
              <SelectTrigger id="density-curve">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="easeIn">Ease In</SelectItem>
                <SelectItem value="easeOut">Ease Out</SelectItem>
                <SelectItem value="easeInOut">Ease In Out</SelectItem>
                <SelectItem value="exp">Exponential</SelectItem>
              </SelectContent>
            </Select>
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="direction" className="font-calibre">
              Direction
            </Label>
            <Select
              value={verticalBarsParams.direction}
              onValueChange={(v) =>
                onVerticalBarsChange({
                  ...verticalBarsParams,
                  direction: v as typeof verticalBarsParams.direction,
                })
              }
            >
              <SelectTrigger id="direction">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LTR">Left to Right</SelectItem>
                <SelectItem value="RTL">Right to Left</SelectItem>
                <SelectItem value="TTB">Top to Bottom</SelectItem>
                <SelectItem value="BTT">Bottom to Top</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
        </TabsContent>

        {/* Diagonal Contours Controls */}
        <TabsContent value="diagonalContours" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="line-count" className="font-calibre">
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
            <Label htmlFor="gap-lines" className="font-calibre">
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
            <Label htmlFor="slope-angle" className="font-calibre">
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

          <div className="space-y-2">
            <Label htmlFor="peak-pos" className="font-calibre">
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
            <Label htmlFor="peak-pos-2" className="font-calibre">
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
            <Label htmlFor="skew" className="font-calibre">
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
            <Label htmlFor="line-length" className="font-calibre">
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

          <div className="space-y-2">
            <Label htmlFor="corner-style" className="font-calibre">
              Corner Style
            </Label>
            <Select
              value={diagonalContoursParams.cornerStyle}
              onValueChange={(v) =>
                onDiagonalContoursChange({
                  ...diagonalContoursParams,
                  cornerStyle: v as typeof diagonalContoursParams.cornerStyle,
                })
              }
            >
              <SelectTrigger id="corner-style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="miter">Miter</SelectItem>
                <SelectItem value="round">Round</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="opacity-step" className="font-calibre">
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
            <Label htmlFor="line-weight" className="font-calibre">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
