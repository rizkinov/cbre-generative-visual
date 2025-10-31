"use client";

import { Label } from '@/src/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover';
import { cbreColors } from '../lib/colors';

interface CBREColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  helperText?: string;
}

export function CBREColorPicker({ label, value, onChange, helperText }: CBREColorPickerProps) {
  return (
    <div className="space-y-2">
      <Label className="font-calibre text-sm">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full flex items-center gap-2 p-2 border border-light-grey rounded hover:border-dark-grey transition-colors"
          >
            <div
              className="w-8 h-8 rounded border-2 border-light-grey"
              style={{ backgroundColor: value }}
            />
            <span className="text-sm font-calibre text-dark-grey flex-1 text-left">
              {Object.entries(cbreColors).find(([, hex]) => hex === value)?.[0]?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Select color'}
            </span>
            <svg className="w-4 h-4 text-dark-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3 space-y-3 max-h-[400px] overflow-y-auto" align="start">
          {/* Primary Colors */}
          <div className="space-y-1">
            <div className="text-xs font-calibre text-dark-grey font-semibold uppercase tracking-wide">Primary Colors</div>
            <div className="grid grid-cols-5 gap-1.5">
              {['cbre-green', 'accent-green', 'dark-green', 'dark-grey', 'light-grey'].map((colorKey) => {
                const colorHex = cbreColors[colorKey as keyof typeof cbreColors];
                return (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => onChange(colorHex)}
                    className={`w-full aspect-square rounded border-2 transition-all hover:scale-110 ${
                      value === colorHex
                        ? 'border-cbre-green shadow-md ring-2 ring-cbre-green ring-offset-1'
                        : 'border-light-grey hover:border-dark-grey'
                    }`}
                    style={{ backgroundColor: colorHex }}
                    title={colorKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  />
                );
              })}
            </div>
          </div>

          {/* Secondary Colors Header */}
          <div className="pt-2 border-t border-light-grey">
            <div className="text-xs font-calibre text-dark-grey font-semibold uppercase tracking-wide mb-3">Secondary Colors</div>
          </div>

          {/* Midnight Family */}
          <div className="space-y-1">
            <div className="text-xs font-calibre text-dark-grey">Midnight</div>
            <div className="grid grid-cols-6 gap-1.5">
              {['midnight', 'midnight-shade-1', 'midnight-shade-2', 'midnight-shade-3', 'midnight-tint'].map((colorKey) => {
                const colorHex = cbreColors[colorKey as keyof typeof cbreColors];
                return (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => onChange(colorHex)}
                    className={`w-full aspect-square rounded border-2 transition-all hover:scale-110 ${
                      value === colorHex
                        ? 'border-cbre-green shadow-md ring-2 ring-cbre-green ring-offset-1'
                        : 'border-light-grey hover:border-dark-grey'
                    }`}
                    style={{ backgroundColor: colorHex }}
                    title={colorKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  />
                );
              })}
            </div>
          </div>

          {/* Sage Family */}
          <div className="space-y-1">
            <div className="text-xs font-calibre text-dark-grey">Sage</div>
            <div className="grid grid-cols-6 gap-1.5">
              {['sage', 'sage-shade-1', 'sage-shade-2', 'sage-shade-3', 'sage-tint'].map((colorKey) => {
                const colorHex = cbreColors[colorKey as keyof typeof cbreColors];
                return (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => onChange(colorHex)}
                    className={`w-full aspect-square rounded border-2 transition-all hover:scale-110 ${
                      value === colorHex
                        ? 'border-cbre-green shadow-md ring-2 ring-cbre-green ring-offset-1'
                        : 'border-light-grey hover:border-dark-grey'
                    }`}
                    style={{ backgroundColor: colorHex }}
                    title={colorKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  />
                );
              })}
            </div>
          </div>

          {/* Celadon Family */}
          <div className="space-y-1">
            <div className="text-xs font-calibre text-dark-grey">Celadon</div>
            <div className="grid grid-cols-6 gap-1.5">
              {['celadon', 'celadon-shade-1', 'celadon-shade-2', 'celadon-shade-3', 'celadon-tint'].map((colorKey) => {
                const colorHex = cbreColors[colorKey as keyof typeof cbreColors];
                return (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => onChange(colorHex)}
                    className={`w-full aspect-square rounded border-2 transition-all hover:scale-110 ${
                      value === colorHex
                        ? 'border-cbre-green shadow-md ring-2 ring-cbre-green ring-offset-1'
                        : 'border-light-grey hover:border-dark-grey'
                    }`}
                    style={{ backgroundColor: colorHex }}
                    title={colorKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  />
                );
              })}
            </div>
          </div>

          {/* Wheat Family */}
          <div className="space-y-1">
            <div className="text-xs font-calibre text-dark-grey">Wheat</div>
            <div className="grid grid-cols-6 gap-1.5">
              {['wheat', 'wheat-tint'].map((colorKey) => {
                const colorHex = cbreColors[colorKey as keyof typeof cbreColors];
                return (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => onChange(colorHex)}
                    className={`w-full aspect-square rounded border-2 transition-all hover:scale-110 ${
                      value === colorHex
                        ? 'border-cbre-green shadow-md ring-2 ring-cbre-green ring-offset-1'
                        : 'border-light-grey hover:border-dark-grey'
                    }`}
                    style={{ backgroundColor: colorHex }}
                    title={colorKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  />
                );
              })}
            </div>
          </div>

          {/* Cement Family */}
          <div className="space-y-1">
            <div className="text-xs font-calibre text-dark-grey">Cement</div>
            <div className="grid grid-cols-6 gap-1.5">
              {['cement', 'cement-tint'].map((colorKey) => {
                const colorHex = cbreColors[colorKey as keyof typeof cbreColors];
                return (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => onChange(colorHex)}
                    className={`w-full aspect-square rounded border-2 transition-all hover:scale-110 ${
                      value === colorHex
                        ? 'border-cbre-green shadow-md ring-2 ring-cbre-green ring-offset-1'
                        : 'border-light-grey hover:border-dark-grey'
                    }`}
                    style={{ backgroundColor: colorHex }}
                    title={colorKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  />
                );
              })}
            </div>
          </div>

          {/* Extended Shades (bonus) */}
          <div className="pt-2 border-t border-light-grey">
            <div className="text-xs font-calibre text-dark-grey font-semibold uppercase tracking-wide mb-3">Extended Shades</div>
          </div>

          {/* Accent Green Shades */}
          <div className="space-y-1">
            <div className="text-xs font-calibre text-dark-grey">Accent Green Shades</div>
            <div className="grid grid-cols-6 gap-1.5">
              {['accent-green-shade-1', 'accent-green-shade-2', 'accent-green-shade-3'].map((colorKey) => {
                const colorHex = cbreColors[colorKey as keyof typeof cbreColors];
                return (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => onChange(colorHex)}
                    className={`w-full aspect-square rounded border-2 transition-all hover:scale-110 ${
                      value === colorHex
                        ? 'border-cbre-green shadow-md ring-2 ring-cbre-green ring-offset-1'
                        : 'border-light-grey hover:border-dark-grey'
                    }`}
                    style={{ backgroundColor: colorHex }}
                    title={colorKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  />
                );
              })}
            </div>
          </div>

          {/* Dark Green Shades */}
          <div className="space-y-1">
            <div className="text-xs font-calibre text-dark-grey">Dark Green Shades</div>
            <div className="grid grid-cols-6 gap-1.5">
              {['dark-green-shade-1', 'dark-green-shade-2', 'dark-green-shade-3'].map((colorKey) => {
                const colorHex = cbreColors[colorKey as keyof typeof cbreColors];
                return (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => onChange(colorHex)}
                    className={`w-full aspect-square rounded border-2 transition-all hover:scale-110 ${
                      value === colorHex
                        ? 'border-cbre-green shadow-md ring-2 ring-cbre-green ring-offset-1'
                        : 'border-light-grey hover:border-dark-grey'
                    }`}
                    style={{ backgroundColor: colorHex }}
                    title={colorKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  />
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {helperText && (
        <p className="text-xs text-dark-grey font-calibre">{helperText}</p>
      )}
    </div>
  );
}
