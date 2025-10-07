/**
 * Export functions for SVG and PNG
 */

import type { GlobalState } from './types';

/**
 * Convert SVG element to string for download
 */
export function toSVG(svgElement: SVGSVGElement): string {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
${svgString}`;
}

/**
 * Download SVG as file
 */
export function downloadSVG(svgElement: SVGSVGElement, filename: string = 'cbre-pattern.svg') {
  const svgString = toSVG(svgElement);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Convert SVG to PNG with scale multiplier
 */
export async function svgToPng(svgElement: SVGSVGElement, scale: number = 1): Promise<string> {
  return new Promise((resolve, reject) => {
    const svgString = toSVG(svgElement);
    const img = new Image();
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG'));
    };

    img.src = url;
  });
}

/**
 * Download PNG with scale multiplier
 */
export async function downloadPNG(
  svgElement: SVGSVGElement,
  scale: number = 1,
  filename: string = 'cbre-pattern.png'
) {
  const dataUrl = await svgToPng(svgElement, scale);

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
