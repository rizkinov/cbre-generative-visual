"use client";

import { useState, useRef, useMemo } from 'react';
import { CBRECard } from '@/src/components/cbre/CBRECard';
import { CBREButton } from '@/src/components/cbre/CBREButton';
import { Slider } from '@/src/components/ui/slider';
import { cbreColors } from './lib/colors';
import { GlobalControls } from './components/GlobalControls';
import { ControlsPanel } from './components/ControlsPanel';
import { PreviewSurface } from './components/PreviewSurface';
import { ExportMenu } from './components/ExportMenu';
import {
  generateHorizontalBands,
  defaultHorizontalBandsParams,
} from './patterns/horizontalBands';
import {
  generateVerticalBars,
  defaultVerticalBarsParams,
} from './patterns/verticalBars';
import {
  generateDiagonalContours,
  defaultDiagonalContoursParams,
} from './patterns/diagonalContours';
import {
  generateMultidimensionalLoS,
  defaultMultidimensionalLoSParams,
} from './patterns/multidimensionalLoS';
import {
  generateTransformationalColorBackground,
  defaultTransformationalColorBackgroundParams,
} from './patterns/transformationalColorBackground';
import type {
  GlobalState,
  HorizontalBandsParams,
  VerticalBarsParams,
  DiagonalContoursParams,
  MultidimensionalLoSParams,
  TransformationalColorBackgroundParams,
} from './lib/types';

export default function GenerativePatternsPage() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Global state
  const [globals, setGlobals] = useState<GlobalState>({
    canvas: { width: 2000, height: 2000, padding: 0 },
    brand: { bg: cbreColors['dark-green'], fg: cbreColors['accent-green'] },
    lineWeight: 7,
    seed: 12345,
    pattern: 'horizontalBands',
  });

  // Zoom state
  const [zoom, setZoom] = useState<number>(0.25);

  // Pattern-specific params
  const [horizontalBandsParams, setHorizontalBandsParams] = useState<HorizontalBandsParams>(
    defaultHorizontalBandsParams
  );
  const [verticalBarsParams, setVerticalBarsParams] = useState<VerticalBarsParams>(
    defaultVerticalBarsParams
  );
  const [diagonalContoursParams, setDiagonalContoursParams] = useState<DiagonalContoursParams>(
    defaultDiagonalContoursParams
  );
  const [multidimensionalLoSParams, setMultidimensionalLoSParams] = useState<MultidimensionalLoSParams>(
    defaultMultidimensionalLoSParams
  );
  const [transformationalColorBackgroundParams, setTransformationalColorBackgroundParams] = useState<TransformationalColorBackgroundParams>(
    defaultTransformationalColorBackgroundParams
  );

  // Generate current pattern
  const patternContent = useMemo(() => {
    switch (globals.pattern) {
      case 'horizontalBands':
        return generateHorizontalBands(horizontalBandsParams, globals);
      case 'verticalBars':
        return generateVerticalBars(verticalBarsParams, globals);
      case 'diagonalContours':
        return generateDiagonalContours(diagonalContoursParams, globals);
      case 'multidimensionalLoS':
        return generateMultidimensionalLoS(multidimensionalLoSParams, globals);
      case 'transformationalColorBackground':
        return generateTransformationalColorBackground(transformationalColorBackgroundParams, globals);
      default:
        return <g />;
    }
  }, [globals, horizontalBandsParams, verticalBarsParams, diagonalContoursParams, multidimensionalLoSParams, transformationalColorBackgroundParams]);

  return (
    <div className="min-h-screen bg-lighter-grey">
      <div className="py-8 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1800px] mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-financier text-cbre-green mb-2">
            CBRE Generative Patterns
          </h1>
          <p className="text-dark-grey font-calibre text-base max-w-3xl">
            Create brand-consistent line, stripe, and contour motifs for reports, motion
            backgrounds, or brand experiments.
          </p>
        </div>

        {/* Global Controls */}
        <div className="mb-4">
          <GlobalControls
            seed={globals.seed}
            onSeedChange={(seed) => setGlobals({ ...globals, seed })}
            brandPair={globals.brand}
            onBrandPairChange={(brand) => setGlobals({ ...globals, brand })}
            canvas={globals.canvas}
            onCanvasChange={(canvas) => setGlobals({ ...globals, canvas })}
            lineWeight={globals.lineWeight}
            onLineWeightChange={(lineWeight) => setGlobals({ ...globals, lineWeight })}
            currentPattern={globals.pattern}
          />
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
          {/* Left Panel: Controls */}
          <div>
            <CBRECard className="p-6">
              <h2 className="text-2xl font-financier text-cbre-green mb-4">Pattern Controls</h2>
              <ControlsPanel
                pattern={globals.pattern}
                onPatternChange={(pattern) => setGlobals({ ...globals, pattern })}
                horizontalBandsParams={horizontalBandsParams}
                onHorizontalBandsChange={setHorizontalBandsParams}
                verticalBarsParams={verticalBarsParams}
                onVerticalBarsChange={setVerticalBarsParams}
                diagonalContoursParams={diagonalContoursParams}
                onDiagonalContoursChange={setDiagonalContoursParams}
                multidimensionalLoSParams={multidimensionalLoSParams}
                onMultidimensionalLoSChange={setMultidimensionalLoSParams}
                transformationalColorBackgroundParams={transformationalColorBackgroundParams}
                onTransformationalColorBackgroundChange={setTransformationalColorBackgroundParams}
                lineWeight={globals.lineWeight}
                onLineWeightChange={(lineWeight) => setGlobals({ ...globals, lineWeight })}
              />
            </CBRECard>
          </div>

          {/* Right Panel: Preview */}
          <div className="min-w-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-financier text-cbre-green">Live Preview</h2>
              <ExportMenu svgRef={svgRef} />
            </div>

            {/* Zoom Controls */}
            <CBRECard className="w-full p-4 mb-4">
              <div className="flex items-center gap-4">
                <label className="font-calibre text-sm text-dark-grey whitespace-nowrap">
                  Zoom: {Math.round(zoom * 100)}%
                </label>
                <Slider
                  min={0.1}
                  max={2}
                  step={0.05}
                  value={[zoom]}
                  onValueChange={(v) => setZoom(v[0])}
                  className="flex-1"
                />
                <div className="flex gap-2">
                  <CBREButton
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(0.25)}
                  >
                    Fit
                  </CBREButton>
                  <CBREButton
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(0.5)}
                  >
                    50%
                  </CBREButton>
                  <CBREButton
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(1)}
                  >
                    100%
                  </CBREButton>
                </div>
              </div>
            </CBRECard>

            <PreviewSurface ref={svgRef} globals={globals} patternContent={patternContent} zoom={zoom} />
          </div>
        </div>
      </div>
    </div>
  );
}
