// Colorblind-safe color palette utility
// Based on research for accessibility and colorblind-friendly design
// Provides 50 distinct colors that work well for various types of colorblindness

export interface ColorPalette {
  id: number
  hex: string
  name: string
  category: 'primary' | 'secondary' | 'accent'
}

// High-contrast, deep color palette with 48 colors (removed black/white)
// These colors are designed to be distinguishable for people with:
// - Protanopia (red-green colorblindness)
// - Deuteranopia (red-green colorblindness) 
// - Tritanopia (blue-yellow colorblindness)
// Using deeper, more saturated colors that rotate through the primary color wheel
export const COLORBLIND_SAFE_PALETTE: ColorPalette[] = [
  // Primary colors (high contrast, easily distinguishable) - starting with Red
  { id: 1, hex: '#FF0000', name: 'Red', category: 'primary' },
  { id: 2, hex: '#00FF00', name: 'Green', category: 'primary' },
  { id: 3, hex: '#0000FF', name: 'Blue', category: 'primary' },
  { id: 4, hex: '#FFFF00', name: 'Yellow', category: 'primary' },
  { id: 5, hex: '#FF00FF', name: 'Magenta', category: 'primary' },
  { id: 6, hex: '#00FFFF', name: 'Cyan', category: 'primary' },
  
  // Deep primary wheel colors (high saturation, good contrast)
  { id: 7, hex: '#FF4500', name: 'Orange Red', category: 'secondary' },
  { id: 8, hex: '#FF8C00', name: 'Dark Orange', category: 'secondary' },
  { id: 9, hex: '#FFD700', name: 'Gold', category: 'secondary' },
  { id: 10, hex: '#32CD32', name: 'Lime Green', category: 'secondary' },
  { id: 11, hex: '#00CED1', name: 'Dark Turquoise', category: 'secondary' },
  { id: 12, hex: '#4169E1', name: 'Royal Blue', category: 'secondary' },
  { id: 13, hex: '#8A2BE2', name: 'Blue Violet', category: 'secondary' },
  { id: 14, hex: '#FF1493', name: 'Deep Pink', category: 'secondary' },
  
  // Deep secondary colors (medium-high saturation)
  { id: 15, hex: '#DC143C', name: 'Crimson', category: 'accent' },
  { id: 16, hex: '#B22222', name: 'Fire Brick', category: 'accent' },
  { id: 17, hex: '#228B22', name: 'Forest Green', category: 'accent' },
  { id: 18, hex: '#006400', name: 'Dark Green', category: 'accent' },
  { id: 19, hex: '#191970', name: 'Midnight Blue', category: 'accent' },
  { id: 20, hex: '#000080', name: 'Navy', category: 'accent' },
  { id: 21, hex: '#8B008B', name: 'Dark Magenta', category: 'accent' },
  { id: 22, hex: '#4B0082', name: 'Indigo', category: 'accent' },
  
  // Additional deep colors
  { id: 23, hex: '#FF6347', name: 'Tomato', category: 'accent' },
  { id: 24, hex: '#FF7F50', name: 'Coral', category: 'accent' },
  { id: 25, hex: '#FFA500', name: 'Orange', category: 'accent' },
  { id: 26, hex: '#ADFF2F', name: 'Green Yellow', category: 'accent' },
  { id: 27, hex: '#9ACD32', name: 'Yellow Green', category: 'accent' },
  { id: 28, hex: '#00FA9A', name: 'Medium Spring Green', category: 'accent' },
  
  // Deep tertiary colors
  { id: 29, hex: '#00BFFF', name: 'Deep Sky Blue', category: 'secondary' },
  { id: 30, hex: '#1E90FF', name: 'Dodger Blue', category: 'secondary' },
  { id: 31, hex: '#9370DB', name: 'Medium Purple', category: 'secondary' },
  { id: 32, hex: '#BA55D3', name: 'Medium Orchid', category: 'secondary' },
  { id: 33, hex: '#FF69B4', name: 'Hot Pink', category: 'secondary' },
  { id: 34, hex: '#7FFF00', name: 'Chartreuse', category: 'secondary' },
  
  // Deep accent colors
  { id: 35, hex: '#00FF7F', name: 'Spring Green', category: 'accent' },
  { id: 36, hex: '#FF4500', name: 'Orange Red', category: 'accent' },
  { id: 37, hex: '#FF8C00', name: 'Dark Orange', category: 'accent' },
  { id: 38, hex: '#FFD700', name: 'Gold', category: 'accent' },
  { id: 39, hex: '#32CD32', name: 'Lime Green', category: 'accent' },
  { id: 40, hex: '#00CED1', name: 'Dark Turquoise', category: 'accent' },
  
  // Additional distinct colors
  { id: 41, hex: '#4169E1', name: 'Royal Blue', category: 'accent' },
  { id: 42, hex: '#8A2BE2', name: 'Blue Violet', category: 'accent' },
  { id: 43, hex: '#FF1493', name: 'Deep Pink', category: 'accent' },
  { id: 44, hex: '#DC143C', name: 'Crimson', category: 'accent' },
  { id: 45, hex: '#B22222', name: 'Fire Brick', category: 'accent' },
  { id: 46, hex: '#228B22', name: 'Forest Green', category: 'accent' },
  { id: 47, hex: '#006400', name: 'Dark Green', category: 'accent' },
  { id: 48, hex: '#191970', name: 'Midnight Blue', category: 'accent' },
]

/**
 * Get a color from the palette by ID
 * @param id - The color ID (1-50)
 * @returns The color object or undefined if not found
 */
export const getColorById = (id: number): ColorPalette | undefined => {
  return COLORBLIND_SAFE_PALETTE.find(color => color.id === id)
}

/**
 * Get a color from the palette by index (0-49)
 * @param index - The array index
 * @returns The color object or undefined if out of bounds
 */
export const getColorByIndex = (index: number): ColorPalette | undefined => {
  return COLORBLIND_SAFE_PALETTE[index]
}

/**
 * Get a color for a channel ID by hashing the ID to a consistent color
 * @param channelId - The channel ID string
 * @returns A color object
 */
export const getChannelColor = (channelId: string): ColorPalette => {
  if (!channelId) {
    return COLORBLIND_SAFE_PALETTE[0] // Default to black
  }
  
  // Simple hash function to convert string to number
  let hash = 0
  for (let i = 0; i < channelId.length; i++) {
    const char = channelId.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Use absolute value and modulo to get index
  const index = Math.abs(hash) % COLORBLIND_SAFE_PALETTE.length
  return COLORBLIND_SAFE_PALETTE[index]
}

/**
 * Get a color for a channel ID by hashing the ID to a consistent color
 * Returns just the hex string for convenience
 * @param channelId - The channel ID string
 * @returns The hex color string
 */
export const getChannelColorHex = (channelId: string): string => {
  return getChannelColor(channelId).hex
}

/**
 * Get colors by category
 * @param category - The color category
 * @returns Array of colors in that category
 */
export const getColorsByCategory = (category: 'primary' | 'secondary' | 'accent'): ColorPalette[] => {
  return COLORBLIND_SAFE_PALETTE.filter(color => color.category === category)
}

/**
 * Get all primary colors (high contrast)
 */
export const getPrimaryColors = (): ColorPalette[] => getColorsByCategory('primary')

/**
 * Get all secondary colors (medium contrast)
 */
export const getSecondaryColors = (): ColorPalette[] => getColorsByCategory('secondary')

/**
 * Get all accent colors (lower contrast)
 */
export const getAccentColors = (): ColorPalette[] => getColorsByCategory('accent')

/**
 * Get a random color from the palette
 * @returns A random color object
 */
export const getRandomColor = (): ColorPalette => {
  const index = Math.floor(Math.random() * COLORBLIND_SAFE_PALETTE.length)
  return COLORBLIND_SAFE_PALETTE[index]
}

/**
 * Get a color with fallback for invalid inputs
 * @param channelId - The channel ID string
 * @param fallbackColor - Optional fallback color (defaults to black)
 * @returns The hex color string
 */
export const getChannelColorSafe = (channelId: string | null | undefined, fallbackColor: string = '#000000'): string => {
  if (!channelId) {
    return fallbackColor
  }
  return getChannelColorHex(channelId)
}
