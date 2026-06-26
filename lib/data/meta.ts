import type { Country, GroupId, KnockoutRound } from "@/lib/types"

/** Official 48 nations — flagcdn slug, FIFA code, confederation */
export const TEAM_META: Record<
  string,
  { flag: string; code: string; confederation: string; titles: number }
> = {
  Algeria: { flag: "dz", code: "ALG", confederation: "CAF", titles: 0 },
  Argentina: { flag: "ar", code: "ARG", confederation: "CONMEBOL", titles: 3 },
  Australia: { flag: "au", code: "AUS", confederation: "AFC", titles: 0 },
  Austria: { flag: "at", code: "AUT", confederation: "UEFA", titles: 0 },
  Belgium: { flag: "be", code: "BEL", confederation: "UEFA", titles: 0 },
  "Bosnia & Herzegovina": { flag: "ba", code: "BIH", confederation: "UEFA", titles: 0 },
  Brazil: { flag: "br", code: "BRA", confederation: "CONMEBOL", titles: 5 },
  Canada: { flag: "ca", code: "CAN", confederation: "CONCACAF", titles: 0 },
  "Cape Verde": { flag: "cv", code: "CPV", confederation: "CAF", titles: 0 },
  Colombia: { flag: "co", code: "COL", confederation: "CONMEBOL", titles: 0 },
  Croatia: { flag: "hr", code: "CRO", confederation: "UEFA", titles: 0 },
  Curaçao: { flag: "cw", code: "CUW", confederation: "CONCACAF", titles: 0 },
  "Czech Republic": { flag: "cz", code: "CZE", confederation: "UEFA", titles: 0 },
  "DR Congo": { flag: "cd", code: "COD", confederation: "CAF", titles: 0 },
  Ecuador: { flag: "ec", code: "ECU", confederation: "CONMEBOL", titles: 0 },
  Egypt: { flag: "eg", code: "EGY", confederation: "CAF", titles: 0 },
  England: { flag: "gb-eng", code: "ENG", confederation: "UEFA", titles: 1 },
  France: { flag: "fr", code: "FRA", confederation: "UEFA", titles: 2 },
  Germany: { flag: "de", code: "GER", confederation: "UEFA", titles: 4 },
  Ghana: { flag: "gh", code: "GHA", confederation: "CAF", titles: 0 },
  Haiti: { flag: "ht", code: "HTI", confederation: "CONCACAF", titles: 0 },
  Iran: { flag: "ir", code: "IRN", confederation: "AFC", titles: 0 },
  Iraq: { flag: "iq", code: "IRQ", confederation: "AFC", titles: 0 },
  "Ivory Coast": { flag: "ci", code: "CIV", confederation: "CAF", titles: 0 },
  Japan: { flag: "jp", code: "JPN", confederation: "AFC", titles: 0 },
  Jordan: { flag: "jo", code: "JOR", confederation: "AFC", titles: 0 },
  Mexico: { flag: "mx", code: "MEX", confederation: "CONCACAF", titles: 0 },
  Morocco: { flag: "ma", code: "MAR", confederation: "CAF", titles: 0 },
  Netherlands: { flag: "nl", code: "NED", confederation: "UEFA", titles: 0 },
  "New Zealand": { flag: "nz", code: "NZL", confederation: "OFC", titles: 0 },
  Norway: { flag: "no", code: "NOR", confederation: "UEFA", titles: 0 },
  Panama: { flag: "pa", code: "PAN", confederation: "CONCACAF", titles: 0 },
  Paraguay: { flag: "py", code: "PAR", confederation: "CONMEBOL", titles: 0 },
  Portugal: { flag: "pt", code: "POR", confederation: "UEFA", titles: 0 },
  Qatar: { flag: "qa", code: "QAT", confederation: "AFC", titles: 0 },
  "Saudi Arabia": { flag: "sa", code: "KSA", confederation: "AFC", titles: 0 },
  Scotland: { flag: "gb-sct", code: "SCO", confederation: "UEFA", titles: 0 },
  Senegal: { flag: "sn", code: "SEN", confederation: "CAF", titles: 0 },
  "South Africa": { flag: "za", code: "RSA", confederation: "CAF", titles: 0 },
  "South Korea": { flag: "kr", code: "KOR", confederation: "AFC", titles: 0 },
  Spain: { flag: "es", code: "ESP", confederation: "UEFA", titles: 1 },
  Sweden: { flag: "se", code: "SWE", confederation: "UEFA", titles: 0 },
  Switzerland: { flag: "ch", code: "SUI", confederation: "UEFA", titles: 0 },
  Tunisia: { flag: "tn", code: "TUN", confederation: "CAF", titles: 0 },
  Turkey: { flag: "tr", code: "TUR", confederation: "UEFA", titles: 0 },
  USA: { flag: "us", code: "USA", confederation: "CONCACAF", titles: 0 },
  Uruguay: { flag: "uy", code: "URU", confederation: "CONMEBOL", titles: 2 },
  Uzbekistan: { flag: "uz", code: "UZB", confederation: "AFC", titles: 0 },
}

export const GROUND_TO_STADIUM: Record<
  string,
  { id: string; name: string; city: string; country: Country; capacity: number }
> = {
  Atlanta: { id: "mer", name: "Mercedes-Benz Stadium", city: "Atlanta", country: "USA", capacity: 71000 },
  "Boston (Foxborough)": { id: "gil", name: "Gillette Stadium", city: "Boston", country: "USA", capacity: 65000 },
  "Dallas (Arlington)": { id: "atnt", name: "AT&T Stadium", city: "Dallas", country: "USA", capacity: 80000 },
  "Guadalajara (Zapopan)": { id: "akr", name: "Estadio Akron", city: "Guadalajara", country: "MEX", capacity: 48000 },
  Houston: { id: "nrg", name: "NRG Stadium", city: "Houston", country: "USA", capacity: 72000 },
  "Kansas City": { id: "arrow", name: "Arrowhead Stadium", city: "Kansas City", country: "USA", capacity: 76000 },
  "Los Angeles (Inglewood)": { id: "sofi", name: "SoFi Stadium", city: "Los Angeles", country: "USA", capacity: 70240 },
  "Mexico City": { id: "azt", name: "Estadio Azteca", city: "Mexico City", country: "MEX", capacity: 87000 },
  "Miami (Miami Gardens)": { id: "hard", name: "Hard Rock Stadium", city: "Miami", country: "USA", capacity: 65000 },
  "Monterrey (Guadalupe)": { id: "bbv", name: "Estadio BBVA", city: "Monterrey", country: "MEX", capacity: 53500 },
  "New York/New Jersey (East Rutherford)": { id: "met", name: "MetLife Stadium", city: "New York/New Jersey", country: "USA", capacity: 82500 },
  Philadelphia: { id: "lin", name: "Lincoln Financial Field", city: "Philadelphia", country: "USA", capacity: 67500 },
  "San Francisco Bay Area (Santa Clara)": { id: "levi", name: "Levi's Stadium", city: "San Francisco Bay Area", country: "USA", capacity: 68500 },
  Seattle: { id: "lumen", name: "Lumen Field", city: "Seattle", country: "USA", capacity: 69000 },
  Toronto: { id: "bmo", name: "BMO Field", city: "Toronto", country: "CAN", capacity: 45000 },
  Vancouver: { id: "bc", name: "BC Place", city: "Vancouver", country: "CAN", capacity: 54500 },
}

export const ROUND_TO_KNOCKOUT: Record<string, KnockoutRound> = {
  "Round of 32": "R32",
  "Round of 16": "R16",
  "Quarter-final": "QF",
  "Semi-final": "SF",
  "Match for third place": "3RD",
  Final: "FINAL",
}

export const KNOCKOUT_LABELS: Record<KnockoutRound, string> = {
  R32: "Babak 32 Besar",
  R16: "Babak 16 Besar",
  QF: "Perempat Final",
  SF: "Semi Final",
  "3RD": "Perebutan Juara 3",
  FINAL: "Final",
}

export const GROUPS: GroupId[] = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
]

export function groupLetter(group?: string): GroupId | null {
  if (!group) return null
  const m = group.match(/Group\s+([A-L])/i)
  return m ? (m[1] as GroupId) : null
}

export function teamSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

/** Knockout slot placeholders — e.g. 1F, 2A, W73, 3A/B/C/D/F */
export function isPlaceholderTeam(name: string): boolean {
  if (TEAM_META[name]) return false
  return (
    /^\d[A-Z]/.test(name) ||
    /^[WL]\d+/.test(name) ||
    /^3[A-Z]\//.test(name) ||
    /^[\dA-Z]{2,3}$/.test(name)
  )
}