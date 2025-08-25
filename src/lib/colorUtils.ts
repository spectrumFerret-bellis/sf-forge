// Colorblind-safe color palette utility
// Based on research for accessibility and colorblind-friendly design
// Provides 50 distinct colors that work well for various types of colorblindness

export interface ColorPalette {
  id   : number
  hex  : string
}

// Simple color palette array - each index corresponds to a channel row
// These colors are designed to be distinguishable for people with colorblindness
export const COLOR_PALETTE: string[] = [
  '#E207FA', // Magenta
  '#FA0907', // Red
  '#26B317', // Green
  '#F47A38', // Orange
  '#1F6BB3', // Blue
  '#1E7C5C', // Teal
  '#CB4442', // Dark Red
  '#5BC1FF', // Light Blue
  '#8F00DB', // Purple
  '#FFD23B', // Yellow
  '#142D9F', // Dark Blue
  '#666666', // Gray
  '#071DFA', // Bright Blue
  '#FA0707', // Bright Red
  '#D301EA', // Bright Purple
  '#1BCC00', // Bright Green
  '#FFB700', // Gold
  '#36007B', // Dark Purple
  '#A81801', // Brown
  '#A8A9F6', // Light Purple
  '#019BA9', // Cyan
  '#BC8468', // Tan
  '#EF86DE', // Pink
  '#38CDC0', // Mint
]

/**
 * Get a color from the palette by index
 * @param index - The array index (0-based)
 * @param customColors - Optional custom colors from user settings
 * @returns The hex color string
 */
export const getColorByIndex = (index: number, customColors?: Record<number, string>): string => {
  if (index < 0) return '#666666'
  
  // Loop through the palette if index exceeds length
  const paletteIndex = index % COLOR_PALETTE.length
  
  // Check if there's a custom color for this index
  if (customColors && customColors[paletteIndex]) {
    return customColors[paletteIndex]
  }
  
  return COLOR_PALETTE[paletteIndex]
}

/**
 * Get a color for a channel by index (for consistent ordering)
 * @param index - The channel index (0-based)
 * @param customColors - Optional custom colors from user settings
 * @returns The hex color string
 */
export const getChannelColor = (index: number, customColors?: Record<number, string>): string => {
  return getColorByIndex(index, customColors)
}

/**
 * Get a color for a channel by index
 * Returns just the hex string for convenience
 * @param index - The channel index (0-based)
 * @param customColors - Optional custom colors from user settings
 * @returns The hex color string
 */
export const getChannelColorHex = (index: number, customColors?: Record<number, string>): string => {
  return getChannelColor(index, customColors)
}

/**
 * Get all colors from the palette
 */
export const getAllColors = (): string[] => COLOR_PALETTE

/**
 * Get a random color from the palette
 * @returns A random hex color string
 */
export const getRandomColor = (): string => {
  const index = Math.floor(Math.random() * COLOR_PALETTE.length)
  return COLOR_PALETTE[index]
}

/**
 * Get a color with fallback for invalid inputs
 * @param index - The channel index
 * @param fallbackColor - Optional fallback color (defaults to gray)
 * @returns The hex color string
 */
export const getChannelColorSafe = (index: number, fallbackColor: string = '#666666'): string => {
  if (index < 0) {
    return fallbackColor
  }
  return getChannelColorHex(index)
}


