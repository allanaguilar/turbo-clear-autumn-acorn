export const COLS = 13;
export const ROWS = 9;

export const WAY_CELLS: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [11, 1],
  [11, 3],
  [1, 3],
  [1, 5],
  [11, 5],
  [11, 7],
  [0, 7],
];

export const START_GOLD = 140;
export const START_LIVES = 18;
export const PREP_SECONDS = 14;
export const SELL_RATIO = 0.6;
export const MAX_RANK = 3;
export const SAVE_KEY = "senda-ignea-save-v1";

export type TowerKind = "ballista" | "mortar" | "lance" | "cinder";
export type EnemyKind = "grunt" | "runner" | "brute" | "swarm" | "boss";
export type TargetMode = "first" | "last" | "close" | "strong";
export type Phase = "menu" | "prep" | "combat" | "victory" | "defeat";
export type ShotStyle = "bolt" | "shell" | "orb" | "beam";

export interface TowerDef {
  kind: TowerKind;
  name: string;
  blurb: string;
  cost: number;
  range: number;
  damage: number;
  fireRate: number;
  shotSpeed: number;
  splash: number;
  slow: number;
  slowDur: number;
  pierce: number;
  style: ShotStyle;
}

export interface EnemyDef {
  kind: EnemyKind;
  name: string;
  plural: string;
  hp: number;
  speed: number;
  gold: number;
  armor: number;
  radius: number;
  leak: number;
}

export interface WaveGroup {
  kind: EnemyKind;
  count: number;
  interval: number;
}

export const TOWERS: Record<TowerKind, TowerDef> = {
  ballista: {
    kind: "ballista",
    name: "Ballesta",
    blurb: "Disparo rápido contra un solo blanco.",
    cost: 50,
    range: 1.72,
    damage: 8,
    fireRate: 1.75,
    shotSpeed: 9.5,
    splash: 0,
    slow: 0,
    slowDur: 0,
    pierce: 0,
    style: "bolt",
  },
  mortar: {
    kind: "mortar",
    name: "Mortero",
    blurb: "Lento. La granada estalla en área.",
    cost: 115,
    range: 2.55,
    damage: 28,
    fireRate: 0.42,
    shotSpeed: 3.5,
    splash: 1.05,
    slow: 0,
    slowDur: 0,
    pierce: 0.1,
    style: "shell",
  },
  lance: {
    kind: "lance",
    name: "Aguja",
    blurb: "Largo alcance. Ignora la armadura.",
    cost: 150,
    range: 2.85,
    damage: 34,
    fireRate: 0.64,
    shotSpeed: 0,
    splash: 0,
    slow: 0,
    slowDur: 0,
    pierce: 1,
    style: "beam",
  },
  cinder: {
    kind: "cinder",
    name: "Brasero",
    blurb: "Quema poco y frena el paso.",
    cost: 85,
    range: 1.65,
    damage: 5,
    fireRate: 1.25,
    shotSpeed: 7.2,
    splash: 0,
    slow: 0.46,
    slowDur: 2.3,
    pierce: 0,
    style: "orb",
  },
};

export const TOWER_ORDER: TowerKind[] = ["ballista", "mortar", "lance", "cinder"];

export const ENEMIES: Record<EnemyKind, EnemyDef> = {
  grunt: {
    kind: "grunt",
    name: "Peón",
    plural: "Peones",
    hp: 30,
    speed: 1.22,
    gold: 6,
    armor: 0,
    radius: 0.28,
    leak: 1,
  },
  runner: {
    kind: "runner",
    name: "Veloz",
    plural: "Veloces",
    hp: 24,
    speed: 2.15,
    gold: 8,
    armor: 0,
    radius: 0.2,
    leak: 1,
  },
  brute: {
    kind: "brute",
    name: "Acorazado",
    plural: "Acorazados",
    hp: 140,
    speed: 0.74,
    gold: 18,
    armor: 0.55,
    radius: 0.38,
    leak: 1,
  },
  swarm: {
    kind: "swarm",
    name: "Chispa",
    plural: "Chispas",
    hp: 14,
    speed: 1.55,
    gold: 4,
    armor: 0,
    radius: 0.16,
    leak: 1,
  },
  boss: {
    kind: "boss",
    name: "Heraldo",
    plural: "Heraldos",
    hp: 1280,
    speed: 0.52,
    gold: 120,
    armor: 0.35,
    radius: 0.52,
    leak: 4,
  },
};

export const WAVES: WaveGroup[][] = [
  [{ kind: "grunt", count: 8, interval: 0.92 }],
  [{ kind: "grunt", count: 12, interval: 0.7 }],
  [
    { kind: "grunt", count: 6, interval: 0.6 },
    { kind: "runner", count: 7, interval: 0.5 },
  ],
  [
    { kind: "runner", count: 12, interval: 0.42 },
    { kind: "grunt", count: 6, interval: 0.55 },
  ],
  [
    { kind: "brute", count: 5, interval: 1.15 },
    { kind: "grunt", count: 8, interval: 0.5 },
  ],
  [
    { kind: "swarm", count: 16, interval: 0.26 },
    { kind: "runner", count: 6, interval: 0.45 },
  ],
  [
    { kind: "brute", count: 7, interval: 0.95 },
    { kind: "runner", count: 8, interval: 0.4 },
  ],
  [
    { kind: "swarm", count: 14, interval: 0.24 },
    { kind: "brute", count: 8, interval: 0.9 },
  ],
  [
    { kind: "runner", count: 10, interval: 0.38 },
    { kind: "brute", count: 8, interval: 0.8 },
    { kind: "swarm", count: 12, interval: 0.22 },
  ],
  [
    { kind: "boss", count: 1, interval: 0.4 },
    { kind: "brute", count: 6, interval: 1 },
    { kind: "runner", count: 10, interval: 0.4 },
  ],
];

export const TARGET_LABEL: Record<TargetMode, string> = {
  first: "Primero",
  last: "Último",
  close: "Cercano",
  strong: "Fuerte",
};

export const TARGET_HINT: Record<TargetMode, string> = {
  first: "El que más ha avanzado",
  last: "El que acaba de entrar",
  close: "El más cercano a la torre",
  strong: "El que tiene más vida",
};

export interface Point {
  x: number;
  y: number;
}

export function cellKey(c: number, r: number): string {
  return `${c},${r}`;
}

export function buildMap(): { path: Set<string>; waypoints: Point[]; length: number } {
  const path = new Set<string>();
  const waypoints: Point[] = [];
  for (let i = 0; i < WAY_CELLS.length; i++) {
    const [c, r] = WAY_CELLS[i];
    waypoints.push({ x: c + 0.5, y: r + 0.5 });
    if (i === 0) {
      path.add(cellKey(c, r));
      continue;
    }
    const [pc, pr] = WAY_CELLS[i - 1];
    const steps = Math.max(Math.abs(c - pc), Math.abs(r - pr));
    for (let s = 0; s <= steps; s++) {
      const cc = pc + Math.round(((c - pc) * s) / steps);
      const rr = pr + Math.round(((r - pr) * s) / steps);
      path.add(cellKey(cc, rr));
    }
  }
  let length = 0;
  for (let i = 1; i < waypoints.length; i++) {
    length += Math.hypot(waypoints[i].x - waypoints[i - 1].x, waypoints[i].y - waypoints[i - 1].y);
  }
  return { path, waypoints, length };
}

export const MAP = buildMap();

export function pathSample(dist: number): Point {
  const pts = MAP.waypoints;
  let remaining = ((dist % MAP.length) + MAP.length) % MAP.length;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    if (remaining <= len) {
      const t = len === 0 ? 0 : remaining / len;
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
    remaining -= len;
  }
  return pts[pts.length - 1];
}

export function upgradeCost(base: number, rank: number): number {
  const table = [0.5, 0.85, 1.25];
  return Math.round(base * table[rank]);
}

export function damageFactor(rank: number): number {
  return 1 + rank * 0.48;
}

export function rateFactor(rank: number): number {
  return 1 + rank * 0.26;
}

export function rangeFor(def: TowerDef, rank: number): number {
  return def.range + rank * 0.04;
}

export function waveScale(index: number): number {
  return 1 + index * 0.1;
}

export function describeWave(index: number): string {
  const wave = WAVES[index];
  if (!wave) return "";
  return wave
    .map((group) => {
      const enemy = ENEMIES[group.kind];
      const name = group.count === 1 ? enemy.name : enemy.plural;
      return `${group.count} ${name.toLowerCase()}`;
    })
    .join(" · ");
}
