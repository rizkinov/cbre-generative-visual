"use client";

import { useState } from 'react';
import { CBREButton } from '@/src/components/cbre/CBREButton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog';
import { Label } from '@/src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { downloadSVG, downloadPNG } from '../lib/export';

interface ExportMenuProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export function ExportMenu({ svgRef }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState<number>(1);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportSVG = () => {
    if (svgRef.current) {
      downloadSVG(svgRef.current);
      setIsOpen(false);
    }
  };

  const handleExportPNG = async () => {
    if (svgRef.current) {
      setIsExporting(true);
      try {
        await downloadPNG(svgRef.current, scale);
        setIsOpen(false);
      } catch (error) {
        console.error('Export failed:', error);
      } finally {
        setIsExporting(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <CBREButton variant="primary">Export</CBREButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-financier text-cbre-green">Export Pattern</DialogTitle>
          <DialogDescription className="font-calibre">
            Choose your export format and settings.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="scale" className="font-calibre">
              PNG Scale: {scale}×
            </Label>
            <Select value={scale.toString()} onValueChange={(v) => setScale(Number(v))}>
              <SelectTrigger id="scale">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1× (Normal)</SelectItem>
                <SelectItem value="2">2× (High DPI)</SelectItem>
                <SelectItem value="3">3× (Very High DPI)</SelectItem>
                <SelectItem value="4">4× (Ultra High DPI)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <CBREButton variant="outline" onClick={handleExportSVG}>
            Export SVG
          </CBREButton>
          <CBREButton
            variant="primary"
            onClick={handleExportPNG}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export PNG'}
          </CBREButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
