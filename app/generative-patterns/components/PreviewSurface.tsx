"use client";

import { forwardRef, ReactElement } from 'react';
import { CBRECard } from '@/src/components/cbre/CBRECard';
import type { GlobalState } from '../lib/types';

interface PreviewSurfaceProps {
  globals: GlobalState;
  patternContent: ReactElement;
  zoom: number;
}

export const PreviewSurface = forwardRef<SVGSVGElement, PreviewSurfaceProps>(
  ({ globals, patternContent, zoom }, ref) => {
    const { width, height } = globals.canvas;
    const { bg, fg } = globals.brand;

    const displayWidth = width * zoom;
    const displayHeight = height * zoom;

    return (
      <CBRECard className="w-full h-[95vh] overflow-auto flex items-center justify-center">
        <div className="p-8">
          <svg
            ref={ref}
            width={displayWidth}
            height={displayHeight}
            viewBox={`0 0 ${width} ${height}`}
            xmlns="http://www.w3.org/2000/svg"
            style={{
              backgroundColor: bg,
              color: fg,
              display: 'block',
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
