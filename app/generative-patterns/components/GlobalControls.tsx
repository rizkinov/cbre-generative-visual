"use client";

import { CBREButton } from '@/src/components/cbre/CBREButton';
import { CBRECard } from '@/src/components/cbre/CBRECard';
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
import type { BrandPair, CanvasSpec } from '../lib/types';
import { CBREColorPicker } from './CBREColorPicker';

interface GlobalControlsProps {
  brandPair: BrandPair;
  onBrandPairChange: (pair: BrandPair) => void;
  canvas: CanvasSpec;
  onCanvasChange: (canvas: CanvasSpec) => void;
}

// Brand color pair presets
// Based on color wheel: Primary colors as background (Color 1), Secondary/Tints as foreground (Color 2)
const colorPairs: Array<{ name: string; pair: BrandPair }> = [
  {
    name: 'Custom',
    pair: { bg: cbreColors['cbre-green'], fg: cbreColors['accent-green'] }
  },
  // CBRE Green (Primary) as Background
  {
    name: 'CBRE Green / Accent Green',
    pair: { bg: cbreColors['cbre-green'], fg: cbreColors['accent-green'] }
  },
  {
    name: 'CBRE Green / Sage',
    pair: { bg: cbreColors['cbre-green'], fg: cbreColors.sage }
  },
  {
    name: 'CBRE Green / Celadon',
    pair: { bg: cbreColors['cbre-green'], fg: cbreColors.celadon }
  },
  {
    name: 'CBRE Green / Midnight',
    pair: { bg: cbreColors['cbre-green'], fg: cbreColors.midnight }
  },
  // Dark Green (Primary) as Background
  {
    name: 'Dark Green / Accent Green',
    pair: { bg: cbreColors['dark-green'], fg: cbreColors['accent-green'] }
  },
  {
    name: 'Dark Green / Celadon',
    pair: { bg: cbreColors['dark-green'], fg: cbreColors.celadon }
  },
  {
    name: 'Dark Green / Sage',
    pair: { bg: cbreColors['dark-green'], fg: cbreColors.sage }
  },
  // Dark Grey (Primary) as Background
  {
    name: 'Dark Grey / Light Grey',
    pair: { bg: cbreColors['dark-grey'], fg: cbreColors['light-grey'] }
  },
  {
    name: 'Dark Grey / Wheat',
    pair: { bg: cbreColors['dark-grey'], fg: cbreColors.wheat }
  },
  {
    name: 'Dark Grey / Celadon',
    pair: { bg: cbreColors['dark-grey'], fg: cbreColors.celadon }
  },
  // Light Grey (Primary) as Background
  {
    name: 'Light Grey / Dark Grey',
    pair: { bg: cbreColors['light-grey'], fg: cbreColors['dark-grey'] }
  },
  {
    name: 'Light Grey / CBRE Green',
    pair: { bg: cbreColors['light-grey'], fg: cbreColors['cbre-green'] }
  },
  {
    name: 'Light Grey / Sage',
    pair: { bg: cbreColors['light-grey'], fg: cbreColors.sage }
  },
  {
    name: 'Light Grey / Midnight',
    pair: { bg: cbreColors['light-grey'], fg: cbreColors.midnight }
  },
];

// Canvas size presets
const canvasSizes = [
  { name: '1024×1024', width: 1024, height: 1024 },
  { name: '2000×2000', width: 2000, height: 2000 },
  { name: '3000×3000', width: 3000, height: 3000 },
];

export function GlobalControls({
  brandPair,
  onBrandPairChange,
  canvas,
  onCanvasChange,
}: GlobalControlsProps) {
  // Find matching preset or default to "Custom" (index 0)
  const currentPairIndex = colorPairs.findIndex(
    (cp, idx) => idx > 0 && cp.pair.bg === brandPair.bg && cp.pair.fg === brandPair.fg
  );
  const selectedPresetIndex = currentPairIndex === -1 ? 0 : currentPairIndex;

  const currentSizeIndex = canvasSizes.findIndex(
    (cs) => cs.width === canvas.width && cs.height === canvas.height
  );

  const handlePresetChange = (index: number) => {
    if (index > 0) {
      // Only apply preset if it's not "Custom"
      onBrandPairChange(colorPairs[index].pair);
    }
  };

  const handleColor1Change = (color: string) => {
    onBrandPairChange({ bg: color, fg: brandPair.fg });
  };

  const handleColor2Change = (color: string) => {
    onBrandPairChange({ bg: brandPair.bg, fg: color });
  };

  const handleSwap = () => {
    onBrandPairChange({ bg: brandPair.fg, fg: brandPair.bg });
  };

  return (
    <CBRECard className="mb-4">
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-financier text-cbre-green">Global Settings</h2>

        <div className="space-y-4">
          {/* Color Palette Section */}
          <div className="space-y-3">
            <Label htmlFor="brand-pair" className="font-calibre">
              Color Palette
            </Label>

            {/* Preset Dropdown with Color Swatches */}
            <Select
              value={selectedPresetIndex.toString()}
              onValueChange={(v) => handlePresetChange(Number(v))}
            >
              <SelectTrigger id="brand-pair" className="w-full">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-5 h-5 rounded border border-light-grey" style={{ backgroundColor: brandPair.bg }} />
                      <div className="w-5 h-5 rounded border border-light-grey" style={{ backgroundColor: brandPair.fg }} />
                    </div>
                    <span>{colorPairs[selectedPresetIndex].name}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {colorPairs.map((cp, idx) => (
                  <SelectItem key={idx} value={idx.toString()}>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-5 h-5 rounded border border-light-grey" style={{ backgroundColor: cp.pair.bg }} />
                        <div className="w-5 h-5 rounded border border-light-grey" style={{ backgroundColor: cp.pair.fg }} />
                      </div>
                      <span>{cp.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Custom Color Pickers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <CBREColorPicker
                label="Color 1 (Background)"
                value={brandPair.bg}
                onChange={handleColor1Change}
              />
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <CBREColorPicker
                    label="Color 2 (Foreground)"
                    value={brandPair.fg}
                    onChange={handleColor2Change}
                  />
                </div>
                <CBREButton
                  variant="outline"
                  size="icon"
                  onClick={handleSwap}
                  title="Swap colors"
                  className="mb-[2px]"
                >
                  ⇄
                </CBREButton>
              </div>
            </div>
          </div>

          {/* Canvas Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
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
