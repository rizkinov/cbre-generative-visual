/**
 * CBRE Brand Colors
 * Extracted from cbre-theme for browser compatibility
 */

export const cbreColors = {
  // Primary Colors
  "cbre-green": "#003F2D",
  "accent-green": "#17E88F",
  "dark-green": "#012A2D",
  "dark-grey": "#435254",
  "light-grey": "#CAD1D3",
  "lighter-grey": "#E6E8E9",

  // Secondary Colors
  "midnight": "#032842",
  "midnight-tint": "#778F9C",
  "sage": "#538184",
  "sage-tint": "#96B3B6",
  "celadon": "#80BBAD",
  "celadon-tint": "#C0D4CB",
  "wheat": "#DBD99A",
  "wheat-tint": "#EFECD2",
  "cement": "#7F8480",
  "cement-tint": "#CBCDCB",
};

/**
 * Interpolate between two hex colors
 * @param fromHex - Starting color (e.g., "#012A2D")
 * @param toHex - Ending color (e.g., "#FFFFFF")
 * @param progress - Value between 0 and 1
 * @returns Interpolated color as hex string
 */
export function interpolateColor(fromHex: string, toHex: string, progress: number): string {
  // Parse hex colors
  const parseHex = (hex: string): [number, number, number] => {
    const cleaned = hex.replace('#', '');
    return [
      parseInt(cleaned.substring(0, 2), 16),
      parseInt(cleaned.substring(2, 4), 16),
      parseInt(cleaned.substring(4, 6), 16),
    ];
  };

  const [r1, g1, b1] = parseHex(fromHex);
  const [r2, g2, b2] = parseHex(toHex);

  // Interpolate each channel
  const r = Math.round(r1 + (r2 - r1) * progress);
  const g = Math.round(g1 + (g2 - g1) * progress);
  const b = Math.round(b1 + (b2 - b1) * progress);

  // Convert back to hex
  const toHexChannel = (value: number) => value.toString(16).padStart(2, '0');
  return `#${toHexChannel(r)}${toHexChannel(g)}${toHexChannel(b)}`;
}
