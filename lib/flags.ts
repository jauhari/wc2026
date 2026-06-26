/** flagcdn.com slug — ISO 3166-1 alpha-2 or FIFA sub-nation code (gb-eng, gb-sct) */
export type FlagCode = string

const CDN = "https://flagcdn.com"

export function flagUrl(code: FlagCode, width = 40): string {
  return `${CDN}/w${width}/${code}.png`
}

export const FLAG_SIZES = {
  xs: { px: 16, cdn: 20 },
  sm: { px: 20, cdn: 20 },
  md: { px: 24, cdn: 40 },
  lg: { px: 32, cdn: 40 },
  xl: { px: 48, cdn: 80 },
  "2xl": { px: 64, cdn: 80 },
  "3xl": { px: 80, cdn: 160 },
} as const

export type FlagSize = keyof typeof FLAG_SIZES