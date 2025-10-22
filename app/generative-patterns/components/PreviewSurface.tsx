"use client";

import { forwardRef, ReactElement } from 'react';
import { CBRECard } from '@/src/components/cbre/CBRECard';
import type { GlobalState } from '../lib/types';

interface PreviewSurfaceProps {
  globals: GlobalState;
  patternContent: ReactElement;
}

export const PreviewSurface = forwardRef<SVGSVGElement, PreviewSurfaceProps>(
  ({ globals, patternContent }, ref) => {
    const { width, height } = globals.canvas;
    const { bg, fg } = globals.brand;

    return (
      <CBRECard className="flex items-center justify-center p-8 h-full overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <svg
            ref={ref}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            xmlns="http://www.w3.org/2000/svg"
            style={{
              backgroundColor: bg,
              color: fg,
              maxWidth: '100%',
              maxHeight: '100%',
              height: 'auto',
              width: 'auto',
            }}
          >
            <title>CBRE Generative Pattern</title>
            <rect width={width} height={height} fill={bg} />
            <g style={{ color: fg }}>{patternContent}</g>
          </svg>
        </div>
      </CBRECard>
    );
  }
);

PreviewSurface.displayName = 'PreviewSurface';
