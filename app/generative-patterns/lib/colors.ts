/**
 * CBRE Brand Colors
 * Extracted from cbre-theme for browser compatibility
 */

export const cbreColors = {
  // ===== PRIMARY COLORS =====
  "cbre-green": "#003F2D",
  "dark-grey": "#435254",
  "light-grey": "#CAD1D3",

  // ===== SECONDARY COLORS =====

  // Accent Green Family
  "accent-green": "#17E88F",
  "accent-green-shade-1": "#45EDA5",
  "accent-green-shade-2": "#74F1BC",
  "accent-green-shade-3": "#A2F6D2",

  // Dark Green Family
  "dark-green": "#012A2D",
  "dark-green-shade-1": "#355456",
  "dark-green-shade-2": "#677F80",
  "dark-green-shade-3": "#9AA9AB",

  // Midnight Blue Family
  "midnight": "#032842",
  "midnight-shade-1": "#355268",
  "midnight-shade-2": "#677D8E",
  "midnight-shade-3": "#9AA9B3",
  "midnight-tint": "#778F9C",

  // Sage Family
  "sage": "#538184",
  "sage-shade-1": "#759A9D",
  "sage-shade-2": "#97B3B5",
  "sage-shade-3": "#BACDCE",
  "sage-tint": "#96B3B6",

  // Celadon Family
  "celadon": "#80BBAD",
  "celadon-shade-1": "#99C9BD",
  "celadon-shade-2": "#B3D6CE",
  "celadon-shade-3": "#CCE4DE",
  "celadon-tint": "#C0D4CB",

  // Wheat Family
  "wheat": "#DBD99A",
  "wheat-tint": "#EFECD2",

  // Cement Family
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
