"use client";

import { CBREButton } from '@/src/components/cbre/CBREButton';
import { CBRECard } from '@/src/components/cbre/CBRECard';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { Slider } from '@/src/components/ui/slider';
import { cbreColors } from '../lib/colors';
import type { BrandPair, CanvasSpec, PatternType } from '../lib/types';
import { generateRandomSeed } from '../lib/seeding';

interface GlobalControlsProps {
  seed: number;
  onSeedChange: (seed: number) => void;
  brandPair: BrandPair;
  onBrandPairChange: (pair: BrandPair) => void;
  canvas: CanvasSpec;
  onCanvasChange: (canvas: CanvasSpec) => void;
  lineWeight: number;
  onLineWeightChange: (weight: number) => void;
  currentPattern: PatternType;
}

// Brand color pair presets
const colorPairs: Array<{ name: string; pair: BrandPair }> = [
  {
    name: 'Dark Green / Accent Mint',
    pair: { bg: cbreColors['dark-green'], fg: cbreColors['accent-green'] }
  },
  {
    name: 'Midnight / Celadon',
    pair: { bg: cbreColors.midnight, fg: cbreColors.celadon }
  },
  {
    name: 'Cement / CBRE Green',
    pair: { bg: cbreColors['cement-tint'], fg: cbreColors['cbre-green'] }
  },
  {
    name: 'Light Grey / Dark Grey',
    pair: { bg: cbreColors['lighter-grey'], fg: cbreColors['dark-grey'] }
  },
  {
    name: 'White / CBRE Green',
    pair: { bg: '#FFFFFF', fg: cbreColors['cbre-green'] }
  },
  {
    name: 'CBRE Green / Accent',
    pair: { bg: cbreColors['cbre-green'], fg: cbreColors['accent-green'] }
  },
];

// Canvas size presets
const canvasSizes = [
  { name: '1024×1024', width: 1024, height: 1024 },
  { name: '2000×2000', width: 2000, height: 2000 },
  { name: '3000×3000', width: 3000, height: 3000 },
];

export function GlobalControls({
  seed,
  onSeedChange,
  brandPair,
  onBrandPairChange,
  canvas,
  onCanvasChange,
  lineWeight,
  onLineWeightChange,
  currentPattern,
}: GlobalControlsProps) {
  const currentPairIndex = colorPairs.findIndex(
    (cp) => cp.pair.bg === brandPair.bg && cp.pair.fg === brandPair.fg
  );

  const currentSizeIndex = canvasSizes.findIndex(
    (cs) => cs.width === canvas.width && cs.height === canvas.height
  );

  return (
    <CBRECard className="mb-4">
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-financier text-cbre-green">Global Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Brand Color Pair */}
          <div className="space-y-2">
            <Label htmlFor="brand-pair" className="font-calibre">
              Color Palette
            </Label>
            <div className="flex gap-2">
              <Select
                value={currentPairIndex.toString()}
                onValueChange={(v) => onBrandPairChange(colorPairs[Number(v)].pair)}
              >
                <SelectTrigger id="brand-pair" className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorPairs.map((cp, idx) => (
                    <SelectItem key={idx} value={idx.toString()}>
                      {cp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <CBREButton
                variant="outline"
                size="icon"
                onClick={() => onBrandPairChange({ bg: brandPair.fg, fg: brandPair.bg })}
                title="Swap colors"
              >
                ⇄
              </CBREButton>
            </div>
          </div>

          {/* Canvas Size */}
          <div className="space-y-2">
            <Label htmlFor="canvas-size" className="font-calibre">
              Canvas Size
            </Label>
            <Select
              value={currentSizeIndex.toString()}
              onValueChange={(v) => {
                const size = canvasSizes[Number(v)];
                onCanvasChange({ ...canvas, width: size.width, height: size.height });
              }}
            >
              <SelectTrigger id="canvas-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {canvasSizes.map((cs, idx) => (
                  <SelectItem key={idx} value={idx.toString()}>
                    {cs.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Canvas Padding */}
          <div className="space-y-2">
            <Label htmlFor="padding" className="font-calibre">
              Padding: {canvas.padding}px
            </Label>
            <Slider
              id="padding"
              min={0}
              max={200}
              step={10}
              value={[canvas.padding]}
              onValueChange={(v) => onCanvasChange({ ...canvas, padding: v[0] })}
            />
          </div>
        </div>

        {/* Seed Controls - Hidden for now */}
        {/* <div className="flex items-end gap-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="seed" className="font-calibre">
              Random Seed
            </Label>
            <Input
              id="seed"
              type="number"
              value={seed}
              onChange={(e) => onSeedChange(Number(e.target.value))}
              className="font-mono"
            />
          </div>
          <CBREButton
            variant="outline"
            onClick={() => onSeedChange(generateRandomSeed())}
          >
            Randomize
          </CBREButton>
        </div> */}
      </div>
    </CBRECard>
  );
}
