"use client";

import { useState, useRef, useMemo } from 'react';
import { CBRECard } from '@/src/components/cbre/CBRECard';
import { CBREButton } from '@/src/components/cbre/CBREButton';
import { Slider } from '@/src/components/ui/slider';
import { cbreColors } from './generative-patterns/lib/colors';
import { GlobalControls } from './generative-patterns/components/GlobalControls';
import { ControlsPanel } from './generative-patterns/components/ControlsPanel';
import { PreviewSurface } from './generative-patterns/components/PreviewSurface';
import { ExportMenu } from './generative-patterns/components/ExportMenu';
import {
  generateHorizontalBands,
  defaultHorizontalBandsParams,
} from './generative-patterns/patterns/horizontalBands';
import {
  generateVerticalBars,
  defaultVerticalBarsParams,
} from './generative-patterns/patterns/verticalBars';
import {
  generateDiagonalContours,
  defaultDiagonalContoursParams,
} from './generative-patterns/patterns/diagonalContours';
import {
  generateMultidimensionalLoS,
  defaultMultidimensionalLoSParams,
} from './generative-patterns/patterns/multidimensionalLoS';
import {
  generateGlaze,
  defaultGlazeParams,
} from './generative-patterns/patterns/glaze';
import type {
  GlobalState,
  HorizontalBandsParams,
  VerticalBarsParams,
  DiagonalContoursParams,
  MultidimensionalLoSParams,
  GlazeParams,
} from './generative-patterns/lib/types';

export default function Home() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Global state
  const [globals, setGlobals] = useState<GlobalState>({
    canvas: { width: 2000, height: 2000, padding: 0, dimension: '1:1' },
    brand: { bg: cbreColors['dark-green'], fg: cbreColors['white'] },
    lineWeight: 7,
    seed: 12345,
    pattern: 'verticalBars',
  });

  // Zoom state
  const [zoom, setZoom] = useState<number>(0.35);

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
  const [glazeParams, setGlazeParams] = useState<GlazeParams>(
    defaultGlazeParams
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
      case 'glaze':
        return generateGlaze(glazeParams, globals);
      case 'portal':
        // Coming soon - render empty for now
        return <g />;
      default:
        return <g />;
    }
  }, [globals, horizontalBandsParams, verticalBarsParams, diagonalContoursParams, multidimensionalLoSParams, glazeParams]);

  return (
    <div className="min-h-screen bg-lighter-grey">
      <div className="py-8 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1800px] mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-calibre text-dark-grey tracking-wider uppercase mb-2">
            THE CREATIVE COE
          </p>
          <h1 className="text-4xl md:text-5xl font-financier text-cbre-green mb-3">
            Generative Visuals
          </h1>
          <p className="text-dark-grey font-calibre text-base max-w-3xl">
            Create brand-consistent generative visuals with five unique styles: Horizontal Bands, Vertical Bars, Diagonal Contours, Multidimensional LoS, and Glaze. Control every detail from colors to line weight, export as SVG or PNG at any scale.
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
              <h2 className="text-2xl font-financier text-cbre-green mb-4">Controls</h2>
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
                glazeParams={glazeParams}
                onGlazeChange={setGlazeParams}
                lineWeight={globals.lineWeight}
                onLineWeightChange={(lineWeight) => setGlobals({ ...globals, lineWeight })}
                brand={globals.brand}
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
