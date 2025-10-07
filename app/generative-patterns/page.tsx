"use client";

import { useState, useRef, useMemo } from 'react';
import { CBRECard } from '@/src/components/cbre/CBRECard';
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
import type {
  GlobalState,
  HorizontalBandsParams,
  VerticalBarsParams,
  DiagonalContoursParams,
} from './lib/types';

export default function GenerativePatternsPage() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Global state
  const [globals, setGlobals] = useState<GlobalState>({
    canvas: { width: 2000, height: 2000, padding: 100 },
    brand: { bg: cbreColors['dark-green'], fg: cbreColors['accent-green'] },
    lineWeight: 2,
    seed: 12345,
    pattern: 'horizontalBands',
  });

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

  // Generate current pattern
  const patternContent = useMemo(() => {
    switch (globals.pattern) {
      case 'horizontalBands':
        return generateHorizontalBands(horizontalBandsParams, globals);
      case 'verticalBars':
        return generateVerticalBars(verticalBarsParams, globals);
      case 'diagonalContours':
        return generateDiagonalContours(diagonalContoursParams, globals);
      default:
        return <g />;
    }
  }, [globals, horizontalBandsParams, verticalBarsParams, diagonalContoursParams]);

  return (
    <div className="min-h-screen bg-lighter-grey">
      <div className="py-8 px-4 md:px-8 max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-financier text-cbre-green mb-4">
            CBRE Generative Patterns
          </h1>
          <p className="text-dark-grey font-calibre text-lg max-w-3xl">
            Create brand-consistent line, stripe, and contour motifs for reports, motion
            backgrounds, or brand experiments.
          </p>
        </div>

        {/* Global Controls */}
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
                lineWeight={globals.lineWeight}
                onLineWeightChange={(lineWeight) => setGlobals({ ...globals, lineWeight })}
              />
            </CBRECard>
          </div>

          {/* Right Panel: Preview */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-financier text-cbre-green">Live Preview</h2>
              <ExportMenu svgRef={svgRef} />
            </div>
            <PreviewSurface ref={svgRef} globals={globals} patternContent={patternContent} />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-dark-grey font-calibre">
            All patterns use CBRE brand tokens and are fully deterministic with seeded randomization.
          </p>
        </div>
      </div>
    </div>
  );
}
