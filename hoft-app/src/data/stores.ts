import type { Store, Banner } from '../types'

export const REPS: string[] = [
  'Marc Tremblay',
  'Sophie Gagnon',
  'Luc Bélanger',
  'Émilie Roy',
  'David Côté',
  'Karine Pelletier',
]

export const STORES: Store[] = [
  { id: 'BR-HD',  banner: 'HD',    name: 'BROSSARD',          prov: 'QC', ytd: 19328.48, lastYear: 33328.48, lastVisit: '10-11-2025' },
  { id: 'BB-HD',  banner: 'HD',    name: 'BEAUBIEN',           prov: 'QC', ytd: 39328.48, lastYear: 33328.48, lastVisit: '10-11-2025' },
  { id: '41030',  banner: 'RONA+', name: 'Québec',             prov: 'QC', ytd: 13507.89, lastYear: 12143.85, lastVisit: '28-03-2026' },
  { id: '41050',  banner: 'RONA',  name: 'Trois-Rivières',     prov: 'QC', ytd: 13946.12, lastYear: 18418.06, lastVisit: '02-04-2026' },
  { id: '41060',  banner: 'RONA',  name: 'Chicoutimi',         prov: 'QC', ytd: 9271.76,  lastYear: 10839.62, lastVisit: '15-03-2026' },
  { id: '41380',  banner: 'RONA',  name: 'Granby',             prov: 'QC', ytd: 10151.14, lastYear: 3705.96,  lastVisit: '21-04-2026' },
  { id: '42360',  banner: 'RONA',  name: 'Alma',               prov: 'QC', ytd: 8457.98,  lastYear: 3810.66,  lastVisit: '19-04-2026' },
  { id: '76210',  banner: 'RONA+', name: 'Ste-Foy',            prov: 'QC', ytd: 21640.00, lastYear: 16985.20, lastVisit: '11-04-2026' },
  { id: '41010',  banner: 'RONA+', name: 'Carrefour Laval',    prov: 'QC', ytd: 884.51,   lastYear: 664.50,   lastVisit: '08-04-2026' },
  { id: '41110',  banner: 'RONA+', name: "Galeries d'Anjou",   prov: 'QC', ytd: 23.38,    lastYear: 2229.54,  lastVisit: '30-03-2026' },
  { id: 'TS-HD',  banner: 'HD',    name: 'TASCHEREAU',         prov: 'QC', ytd: 27110.05, lastYear: 24880.00, lastVisit: '05-04-2026' },
  { id: '33040',  banner: 'RONA',  name: 'Hamilton (Rymal)',   prov: 'ON', ytd: 6420.10,  lastYear: 9120.44,  lastVisit: '26-03-2026' },
]

export const BANNER_LABEL: Record<Banner, string> = {
  HD: 'HOME DEPOT',
  RONA: 'RONA',
  'RONA+': 'RONA+',
}

export const PRODUCTS: string[] = [
  'POTEAU LIGNE KIT C AL.3X72"NR',   'POTEAU FIN KIT A AL.3X72"NR',   'POTEAU COIN KIT B AL.3X72"NR',
  "PLANCHE CLOT.1X6\"X6'-4/PK BN",   "PLANCHE CLOT.1X6\"X6'-4/PK NY",  "PLANCHE CLOT.1X6\"X6'-4/PK GG",
  "PANNEAU REMPL.CLOT. NR 6' PK4",   'KIT POTEAU CLOTURE C8 96" ENT.', 'KIT POTEAU CLOTURE A6 ALUM. NR',
  'KIT POTEAU CLOTURE A8 ENTERRE',    'KIT POTEAU COIN B8 ENTERRE',      'CAP.POTEAU SOLAIRE NR ALU. 3"',
  'COUVERCLE PLAQUE DE BASE 3X3"',    'ENS. POTEAU FIN 44X3" NR SOLU.', 'ENS.POTEAU LIGNE 44X3" NR SOLU',
  'ENS. POTEAU COIN 44X3" NR SOLU',   'KIT BARRIERE AJUST ALUM 2X71"',  'JARDINIERE NOIR GRAND 24" HOFT',
  'JARDINIERE MED. 15" NR.',           'CROCHET NOIR ACIER 3" 2/PK',     'LATTE REMPL. 31" NR SOLUTIONS',
  'SCELLANT KIT VERRE 168" NOIR',      'TABLETTE ACIER GALV. 24" NR.',   'ESPACEUR NOIR ALUM.1/2" 12/PK',
  'PRES.PLANCHE CLOTURE 48UN',         'KIT POTEAU CLOTURE A6 ENTERRE',  'ENS. BARRIERE 36" NR SOLUTIONS',
  'POTEAU PORTAIL KIT D AL.3X72"',    'JARDINIERE PETIT 10" NR.',        'CROCHET DOUBLE NR 5" 2/PK',
]

export const HEAT_COLORS = [
  '#6B3A2A', '#B5531F', '#E8731C', '#F2901C', '#F6B41C', '#F7C915',
]

export function fmtMoney(n: number): string {
  const [intp, dec] = n.toFixed(2).replace('.', ',').split(',')
  const spaced = intp.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${spaced},${dec}$`
}
