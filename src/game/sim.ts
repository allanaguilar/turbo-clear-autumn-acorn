import { playSfx } from "./audio";
import {
  COLS,
  ENEMIES,
  MAP,
  MAX_RANK,
  ROWS,
  SAVE_KEY,
  SELL_RATIO,
  START_GOLD,
  START_LIVES,
  PREP_SECONDS,
  TOWERS,
  WAVES,
  cellKey,
  damageFactor,
  describeWave,
  rangeFor,
  rateFactor,
  upgradeCost,
  waveScale,
  type EnemyKind,
  type Phase,
  type ShotStyle,
  type TargetMode,
  type TowerKind,
} from "./content";

export interface SelectionInfo {
  id: number;
  kind: TowerKind;
  name: string;
  blurb: string;
  dmgRank: number;
  rateRank: number;
  mode: TargetMode;
  damage: number;
  nextDamage: number | null;
  rate: number;
  nextRate: number | null;
  dmgCost: number | null;
  rateCost: number | null;
  sell: number;
  range: number;
}

export interface Hud {
  phase: Phase;
  gold: number;
  lives: number;
  wave: number;
  total: number;
  paused: boolean;
  speed: 1 | 2;
  placing: TowerKind | null;
  creeps: number;
  prepLeft: number;
  prepBonus: number;
  auto: boolean;
  kills: number;
  leaked: number;
  best: number;
  wins: number;
  roster: string;
  rosterLabel: string;
  hint: string;
  selection: SelectionInfo | null;
}

interface Creep {
  id: number;
  kind: EnemyKind;
  hp: number;
  maxHp: number;
  x: number;
  y: number;
  wp: number;
  dist: number;
  slowFactor: number;
  slowLeft: number;
  flash: number;
  vx: number;
  vy: number;
  alive: boolean;
  armor: number;
  gold: number;
  speed: number;
  leak: number;
  radius: number;
}

interface Tower {
  id: number;
  kind: TowerKind;
  c: number;
  r: number;
  x: number;
  y: number;
  aim: number;
  cooldown: number;
  dmgRank: number;
  rateRank: number;
  spent: number;
  mode: TargetMode;
}

interface Shot {
  x: number;
  y: number;
  dx: number;
  dy: number;
  left: number;
  total: number;
  speed: number;
  damage: number;
  splash: number;
  slow: number;
  slowDur: number;
  pierce: number;
  style: Exclude<ShotStyle, "beam">;
}

export interface Beam {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  life: number;
  max: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  tone: "ember" | "ash" | "brass" | "dust";
}

export interface Floater {
  x: number;
  y: number;
  text: string;
  life: number;
  max: number;
  tone: "gold" | "hurt" | "info";
}

interface SpawnGroup {
  kind: EnemyKind;
  left: number;
  interval: number;
  timer: number;
}

function lerpAngle(a: number, b: number, t: number): number {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export class Sim {
  gold = START_GOLD;
  lives = START_LIVES;
  wave = 0;
  phase: Phase = "menu";
  paused = false;
  speed: 1 | 2 = 1;
  placing: TowerKind | null = null;
  selectedId = 0;
  kills = 0;
  leaked = 0;
  best = 0;
  wins = 0;
  auto = false;
  prepLeft = 0;
  anim = 0;
  shake = 0;
  shakeX = 0;
  shakeY = 0;
  reduced = false;
  hoverC = -1;
  hoverR = -1;
  towers: Tower[] = [];
  creeps: Creep[] = [];
  shots: Shot[] = [];
  beams: Beam[] = [];
  particles: Particle[] = [];
  floaters: Floater[] = [];

  private queue: SpawnGroup[] = [];
  private nextId = 1;
  private acc = 0;
  private sig = "";
  private listeners = new Set<() => void>();

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  setReduced(value: boolean): void {
    this.reduced = value;
  }

  hydrate(): void {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as { version?: number; best?: number; wins?: number };
      if (data.version !== 1) return;
      this.best = data.best ?? 0;
      this.wins = data.wins ?? 0;
      this.emitNow();
    } catch {
      /* ignore broken saves */
    }
  }

  snapshot(): Hud {
    const tower = this.towers.find((item) => item.id === this.selectedId) ?? null;
    let selection: SelectionInfo | null = null;
    if (tower) {
      const def = TOWERS[tower.kind];
      selection = {
        id: tower.id,
        kind: tower.kind,
        name: def.name,
        blurb: def.blurb,
        dmgRank: tower.dmgRank,
        rateRank: tower.rateRank,
        mode: tower.mode,
        damage: round1(def.damage * damageFactor(tower.dmgRank)),
        nextDamage: tower.dmgRank < MAX_RANK ? round1(def.damage * damageFactor(tower.dmgRank + 1)) : null,
        rate: round1(def.fireRate * rateFactor(tower.rateRank)),
        nextRate: tower.rateRank < MAX_RANK ? round1(def.fireRate * rateFactor(tower.rateRank + 1)) : null,
        dmgCost: tower.dmgRank < MAX_RANK ? upgradeCost(def.cost, tower.dmgRank) : null,
        rateCost: tower.rateRank < MAX_RANK ? upgradeCost(def.cost, tower.rateRank) : null,
        sell: Math.floor(tower.spent * SELL_RATIO),
        range: rangeFor(def, tower.dmgRank),
      };
    }
    const playing = this.phase === "prep" || this.phase === "combat";
    let hint = "";
    if (playing && this.towers.length === 0 && !this.placing) {
      hint = "Elige una torre y toca el terreno oscuro. La senda no se construye.";
    } else if (this.placing) {
      hint = TOWERS[this.placing].blurb;
    } else if (this.phase === "combat" && this.wave === WAVES.length - 1) {
      hint = "El heraldo aguanta mucho. Prioridad Fuerte lo ignora menos.";
    }
    const rosterIndex = Math.min(this.wave, WAVES.length - 1);
    return {
      phase: this.phase,
      gold: this.gold,
      lives: this.lives,
      wave: this.wave,
      total: WAVES.length,
      paused: this.paused,
      speed: this.speed,
      placing: this.placing,
      creeps: this.remaining(),
      prepLeft: Math.max(0, Math.ceil(this.prepLeft)),
      prepBonus: this.auto ? Math.ceil(Math.max(0, this.prepLeft) / 2) : 0,
      auto: this.auto,
      kills: this.kills,
      leaked: this.leaked,
      best: this.best,
      wins: this.wins,
      roster: describeWave(rosterIndex),
      rosterLabel: this.phase === "combat" ? "En camino" : "Siguiente",
      hint,
      selection,
    };
  }

  frame(raw: number): void {
    const dt = Math.min(0.05, Math.max(0, raw));
    const frozen = this.paused && (this.phase === "combat" || this.phase === "prep");
    if (!frozen) this.anim += dt;
    if ((this.phase === "combat" || this.phase === "prep") && !this.paused) {
      this.acc += dt * this.speed;
      const step = 1 / 60;
      let n = 0;
      while (this.acc >= step && n < 12) {
        this.tick(step);
        this.acc -= step;
        n += 1;
      }
      if (n >= 12) this.acc = 0;
    }
    this.maybeEmit();
  }

  begin(): void {
    this.reset(true);
    this.phase = "prep";
    this.auto = false;
    this.wave = 0;
    this.prepLeft = 0;
    playSfx("wave");
    this.emitNow();
  }

  restart(): void {
    this.begin();
  }

  launch(): void {
    if (this.phase !== "prep") return;
    if (this.paused) this.paused = false;
    if (this.auto && this.prepLeft > 0.2) {
      const bonus = Math.ceil(this.prepLeft / 2);
      if (bonus > 0) {
        this.gold += bonus;
        const gate = MAP.waypoints[0];
        this.float(gate.x, gate.y - 0.4, `+${bonus}`, "gold");
        playSfx("coin");
      }
    }
    this.prepLeft = 0;
    this.startWaveNow();
    this.emitNow();
  }

  togglePause(): void {
    if (this.phase !== "prep" && this.phase !== "combat") return;
    this.paused = !this.paused;
    playSfx("click");
    this.emitNow();
  }

  toggleSpeed(): void {
    if (this.phase !== "prep" && this.phase !== "combat") return;
    this.speed = this.speed === 1 ? 2 : 1;
    playSfx("click");
    this.emitNow();
  }

  choose(kind: TowerKind | null): void {
    if (!this.canBuild()) return;
    if (kind && this.placing === kind) this.placing = null;
    else this.placing = kind;
    if (kind) this.selectedId = 0;
    playSfx("click");
    this.emitNow();
  }

  upgrade(stat: "dmg" | "rate"): void {
    const tower = this.selected();
    if (!tower || !this.canBuild()) return;
    const def = TOWERS[tower.kind];
    const rank = stat === "dmg" ? tower.dmgRank : tower.rateRank;
    if (rank >= MAX_RANK) return;
    const cost = upgradeCost(def.cost, rank);
    if (this.gold < cost) {
      playSfx("deny");
      return;
    }
    this.gold -= cost;
    tower.spent += cost;
    if (stat === "dmg") tower.dmgRank += 1;
    else tower.rateRank += 1;
    this.burst(tower.x, tower.y, 8, "brass");
    playSfx("upgrade");
    this.emitNow();
  }

  cycleTarget(): void {
    const tower = this.selected();
    if (!tower || !this.canBuild()) return;
    const order: TargetMode[] = ["first", "last", "close", "strong"];
    const index = order.indexOf(tower.mode);
    tower.mode = order[(index + 1) % order.length];
    playSfx("click");
    this.emitNow();
  }

  sell(): void {
    const tower = this.selected();
    if (!tower || !this.canBuild()) return;
    const refund = Math.floor(tower.spent * SELL_RATIO);
    this.gold += refund;
    this.float(tower.x, tower.y, `+${refund}`, "gold");
    this.towers = this.towers.filter((item) => item.id !== tower.id);
    this.selectedId = 0;
    playSfx("coin");
    this.emitNow();
  }

  pointer(c: number, r: number): void {
    if (!this.canBuild()) return;
    if (c < 0 || r < 0 || c >= COLS || r >= ROWS) return;
    const tower = this.towers.find((item) => item.c === c && item.r === r);
    if (tower) {
      this.selectedId = tower.id;
      this.placing = null;
      playSfx("click");
      this.emitNow();
      return;
    }
    if (this.placing) {
      this.tryPlace(c, r);
      return;
    }
    if (this.selectedId) {
      this.selectedId = 0;
      this.emitNow();
    }
  }

  hover(c: number, r: number): void {
    this.hoverC = c;
    this.hoverR = r;
  }

  clearHover(): void {
    this.hoverC = -1;
    this.hoverR = -1;
  }

  private canBuild(): boolean {
    return this.phase === "prep" || this.phase === "combat";
  }

  private selected(): Tower | null {
    return this.towers.find((item) => item.id === this.selectedId) ?? null;
  }

  private remaining(): number {
    let count = this.creeps.length;
    for (const group of this.queue) count += group.left;
    return count;
  }

  private reset(keepMeta: boolean): void {
    const best = this.best;
    const wins = this.wins;
    this.gold = START_GOLD;
    this.lives = START_LIVES;
    this.wave = 0;
    this.phase = "menu";
    this.paused = false;
    this.speed = 1;
    this.placing = null;
    this.selectedId = 0;
    this.kills = 0;
    this.leaked = 0;
    this.auto = false;
    this.prepLeft = 0;
    this.shake = 0;
    this.shakeX = 0;
    this.shakeY = 0;
    this.towers = [];
    this.creeps = [];
    this.shots = [];
    this.beams = [];
    this.particles = [];
    this.floaters = [];
    this.queue = [];
    this.acc = 0;
    if (keepMeta) {
      this.best = best;
      this.wins = wins;
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 1, best: this.best, wins: this.wins }));
    } catch {
      /* private mode */
    }
  }

  private noteProgress(cleared: number): void {
    if (cleared > this.best) this.best = cleared;
    this.persist();
  }

  private isOpen(c: number, r: number): boolean {
    if (c < 0 || r < 0 || c >= COLS || r >= ROWS) return false;
    if (MAP.path.has(cellKey(c, r))) return false;
    return !this.towers.some((tower) => tower.c === c && tower.r === r);
  }

  private tryPlace(c: number, r: number): void {
    const kind = this.placing;
    if (!kind) return;
    if (!this.isOpen(c, r)) {
      playSfx("deny");
      if (MAP.path.has(cellKey(c, r))) this.float(c + 0.5, r + 0.2, "Senda", "hurt");
      this.emitNow();
      return;
    }
    const def = TOWERS[kind];
    if (this.gold < def.cost) {
      playSfx("deny");
      this.float(c + 0.5, r + 0.2, "Sin oro", "hurt");
      this.emitNow();
      return;
    }
    this.gold -= def.cost;
    this.towers.push({
      id: ++this.nextId,
      kind,
      c,
      r,
      x: c + 0.5,
      y: r + 0.5,
      aim: -Math.PI / 2,
      cooldown: 0.15,
      dmgRank: 0,
      rateRank: 0,
      spent: def.cost,
      mode: "first",
    });
    this.burst(c + 0.5, r + 0.5, 7, "dust");
    playSfx("place");
    this.emitNow();
  }

  private startWaveNow(): void {
    const groups = WAVES[this.wave];
    this.queue = groups.map((group, index) => ({
      kind: group.kind,
      left: group.count,
      interval: group.interval,
      timer: index === 0 ? 0.3 : 0,
    }));
    this.phase = "combat";
    playSfx("wave");
  }

  private onWaveCleared(): void {
    const cleared = this.wave + 1;
    this.noteProgress(cleared);
    if (cleared >= WAVES.length) {
      this.phase = "victory";
      this.wins += 1;
      this.persist();
      this.queue = [];
      playSfx("win");
      return;
    }
    this.wave += 1;
    this.phase = "prep";
    this.auto = true;
    this.prepLeft = PREP_SECONDS;
  }

  private tick(dt: number): void {
    if (this.phase === "prep") {
      if (this.auto) {
        this.prepLeft -= dt;
        if (this.prepLeft <= 0) {
          this.prepLeft = 0;
          this.startWaveNow();
        }
      }
    } else if (this.phase === "combat") {
      this.tickSpawn(dt);
      this.tickCreeps(dt);
      if (this.phase === "combat") {
        this.tickTowers(dt);
        this.tickShots(dt);
        this.sweep();
        if (this.queue.length === 0 && this.creeps.length === 0) this.onWaveCleared();
      } else {
        this.tickShots(dt);
        this.sweep();
      }
    }
    this.tickFx(dt);
  }

  private tickSpawn(dt: number): void {
    const group = this.queue[0];
    if (!group) return;
    group.timer -= dt;
    while (group.left > 0 && group.timer <= 0) {
      this.spawn(group.kind);
      group.left -= 1;
      group.timer += group.interval;
    }
    if (group.left <= 0) {
      this.queue.shift();
      if (this.queue[0]) this.queue[0].timer += 0.45;
    }
  }

  private spawn(kind: EnemyKind): void {
    const def = ENEMIES[kind];
    const scale = waveScale(this.wave);
    const start = MAP.waypoints[0];
    const hp = def.hp * scale;
    this.creeps.push({
      id: ++this.nextId,
      kind,
      hp,
      maxHp: hp,
      x: start.x,
      y: start.y,
      wp: 1,
      dist: 0,
      slowFactor: 1,
      slowLeft: 0,
      flash: 0,
      vx: 0,
      vy: 0,
      alive: true,
      armor: def.armor,
      gold: def.gold,
      speed: def.speed,
      leak: def.leak,
      radius: def.radius,
    });
    if (kind === "boss") {
      this.shake = Math.min(1, this.shake + 0.75);
      this.float(start.x + 0.2, start.y - 0.35, "Heraldo", "info");
      playSfx("boss");
    }
  }

  private tickCreeps(dt: number): void {
    for (let i = this.creeps.length - 1; i >= 0; i--) {
      const creep = this.creeps[i];
      if (!creep.alive) {
        this.creeps.splice(i, 1);
        continue;
      }
      if (creep.flash > 0) creep.flash -= dt;
      if (creep.slowLeft > 0) {
        creep.slowLeft -= dt;
        if (creep.slowLeft <= 0) {
          creep.slowLeft = 0;
          creep.slowFactor = 1;
        }
      }
      const wp = MAP.waypoints[creep.wp];
      if (!wp) {
        this.leak(i);
        continue;
      }
      const dx = wp.x - creep.x;
      const dy = wp.y - creep.y;
      const dist = Math.hypot(dx, dy);
      const step = creep.speed * creep.slowFactor * dt;
      if (dist <= step || dist < 0.001) {
        creep.dist += dist;
        creep.x = wp.x;
        creep.y = wp.y;
        creep.vx = 0;
        creep.vy = 0;
        creep.wp += 1;
        if (creep.wp >= MAP.waypoints.length) this.leak(i);
      } else {
        const inv = 1 / dist;
        creep.x += dx * inv * step;
        creep.y += dy * inv * step;
        creep.dist += step;
        const speed = creep.speed * creep.slowFactor;
        creep.vx = dx * inv * speed;
        creep.vy = dy * inv * speed;
      }
    }
  }

  private leak(index: number): void {
    const creep = this.creeps[index];
    if (!creep || !creep.alive) return;
    creep.alive = false;
    this.creeps.splice(index, 1);
    this.lives = Math.max(0, this.lives - creep.leak);
    this.leaked += 1;
    if (!this.reduced) this.shake = Math.min(1, this.shake + 0.5);
    this.float(creep.x, creep.y, `−${creep.leak}`, "hurt");
    playSfx("leak");
    if (this.lives <= 0) {
      this.lives = 0;
      this.phase = "defeat";
      this.noteProgress(this.wave);
      this.queue = [];
      playSfx("lose");
    }
  }

  private tickTowers(dt: number): void {
    for (const tower of this.towers) {
      tower.cooldown -= dt;
      const target = this.acquire(tower);
      if (!target) continue;
      const desired = Math.atan2(target.y - tower.y, target.x - tower.x);
      tower.aim = lerpAngle(tower.aim, desired, 1 - Math.exp(-14 * dt));
      if (tower.cooldown <= 0) this.fire(tower, target);
    }
  }

  private acquire(tower: Tower): Creep | null {
    const range = rangeFor(TOWERS[tower.kind], tower.dmgRank);
    const r2 = range * range;
    let best: Creep | null = null;
    let bestScore = 0;
    let ready = false;
    for (const creep of this.creeps) {
      if (!creep.alive) continue;
      const dx = creep.x - tower.x;
      const dy = creep.y - tower.y;
      const d2 = dx * dx + dy * dy;
      if (d2 > r2) continue;
      let score = 0;
      if (tower.mode === "first") score = creep.dist;
      else if (tower.mode === "last") score = -creep.dist;
      else if (tower.mode === "close") score = -d2;
      else score = creep.hp;
      if (!ready || score > bestScore) {
        best = creep;
        bestScore = score;
        ready = true;
      }
    }
    return best;
  }

  private fire(tower: Tower, target: Creep): void {
    const def = TOWERS[tower.kind];
    const damage = def.damage * damageFactor(tower.dmgRank);
    const rate = def.fireRate * rateFactor(tower.rateRank);
    tower.cooldown = 1 / rate;
    if (def.style === "beam") {
      this.hurt(target, damage, def.pierce);
      this.beams.push({
        x1: tower.x,
        y1: tower.y,
        x2: target.x,
        y2: target.y,
        life: 0.09,
        max: 0.09,
      });
      playSfx("beam");
      return;
    }
    const pred = this.predict(tower, target, def.shotSpeed);
    const dx = pred.x - tower.x;
    const dy = pred.y - tower.y;
    const dist = Math.hypot(dx, dy) || 0.001;
    this.shots.push({
      x: tower.x,
      y: tower.y,
      dx: dx / dist,
      dy: dy / dist,
      left: dist,
      total: dist,
      speed: def.shotSpeed,
      damage,
      splash: def.splash,
      slow: def.slow,
      slowDur: def.slowDur,
      pierce: def.pierce,
      style: def.style,
    });
    playSfx(def.style === "shell" ? "shell" : def.style === "orb" ? "orb" : "bolt");
  }

  private predict(tower: Tower, creep: Creep, shotSpeed: number): { x: number; y: number } {
    let px = creep.x;
    let py = creep.y;
    for (let i = 0; i < 2; i++) {
      const dist = Math.hypot(px - tower.x, py - tower.y);
      const t = dist / shotSpeed;
      px = creep.x + creep.vx * t;
      py = creep.y + creep.vy * t;
    }
    return { x: px, y: py };
  }

  private tickShots(dt: number): void {
    for (let i = this.shots.length - 1; i >= 0; i--) {
      const shot = this.shots[i];
      const step = shot.speed * dt;
      const travel = Math.min(step, shot.left);
      shot.x += shot.dx * travel;
      shot.y += shot.dy * travel;
      shot.left -= travel;
      if (shot.splash <= 0) {
        const hit = this.creepNear(shot.x, shot.y, 0.36);
        if (hit) {
          this.impactSingle(shot, hit);
          this.shots.splice(i, 1);
          continue;
        }
      }
      if (shot.left <= 0.0001) {
        this.impact(shot);
        this.shots.splice(i, 1);
      }
    }
    for (let i = this.beams.length - 1; i >= 0; i--) {
      this.beams[i].life -= dt;
      if (this.beams[i].life <= 0) this.beams.splice(i, 1);
    }
  }

  private creepNear(x: number, y: number, rad: number): Creep | null {
    const r2 = rad * rad;
    let best: Creep | null = null;
    let bestD = r2;
    for (const creep of this.creeps) {
      if (!creep.alive) continue;
      const dx = creep.x - x;
      const dy = creep.y - y;
      const d2 = dx * dx + dy * dy;
      if (d2 <= bestD) {
        best = creep;
        bestD = d2;
      }
    }
    return best;
  }

  private impact(shot: Shot): void {
    if (shot.splash > 0) {
      const r2 = shot.splash * shot.splash;
      for (const creep of this.creeps) {
        if (!creep.alive) continue;
        const dx = creep.x - shot.x;
        const dy = creep.y - shot.y;
        if (dx * dx + dy * dy <= r2) {
          this.hurt(creep, shot.damage, shot.pierce);
          this.applySlow(creep, shot);
        }
      }
      this.burst(shot.x, shot.y, 12, "ember");
      if (!this.reduced) this.shake = Math.min(1, this.shake + 0.14);
      playSfx("boom");
      return;
    }
    const hit = this.creepNear(shot.x, shot.y, 0.5);
    if (hit) this.impactSingle(shot, hit);
    else this.burst(shot.x, shot.y, 3, "ash");
  }

  private impactSingle(shot: Shot, creep: Creep): void {
    this.hurt(creep, shot.damage, shot.pierce);
    this.applySlow(creep, shot);
    this.burst(shot.x, shot.y, 4, shot.style === "orb" ? "ember" : "brass");
  }

  private applySlow(creep: Creep, shot: Shot): void {
    if (shot.slow <= 0) return;
    const factor = 1 - shot.slow;
    if (factor < creep.slowFactor) creep.slowFactor = factor;
    creep.slowLeft = Math.max(creep.slowLeft, shot.slowDur);
  }

  private hurt(creep: Creep, amount: number, pierce: number): void {
    if (!creep.alive) return;
    const reduction = creep.armor * (1 - pierce);
    creep.hp -= amount * (1 - reduction);
    creep.flash = 0.1;
    if (creep.hp <= 0) {
      creep.alive = false;
      this.gold += creep.gold;
      this.kills += 1;
      this.float(creep.x, creep.y - 0.15, `+${creep.gold}`, "gold");
      this.burst(creep.x, creep.y, creep.kind === "boss" ? 20 : 8, "ember");
      playSfx("kill");
      if (creep.kind === "boss" && !this.reduced) this.shake = Math.min(1, this.shake + 0.55);
    }
  }

  private sweep(): void {
    for (let i = this.creeps.length - 1; i >= 0; i--) {
      if (!this.creeps[i].alive) this.creeps.splice(i, 1);
    }
  }

  private tickFx(dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.life -= dt;
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += 0.35 * dt;
    }
    for (let i = this.floaters.length - 1; i >= 0; i--) {
      const floater = this.floaters[i];
      floater.life -= dt;
      if (floater.life <= 0) {
        this.floaters.splice(i, 1);
        continue;
      }
      floater.y -= dt * 0.45;
    }
    this.shake *= Math.exp(-dt * 6);
    if (this.reduced || this.shake < 0.02) {
      this.shakeX = 0;
      this.shakeY = 0;
      this.shake = this.reduced ? 0 : this.shake;
    } else {
      this.shakeX = (Math.random() - 0.5) * this.shake * 7;
      this.shakeY = (Math.random() - 0.5) * this.shake * 7;
    }
  }

  private burst(x: number, y: number, count: number, tone: Particle["tone"]): void {
    const n = this.reduced ? Math.ceil(count / 3) : count;
    for (let i = 0; i < n; i++) {
      if (this.particles.length > 260) this.particles.shift();
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.35 + Math.random() * 1.7;
      const life = 0.28 + Math.random() * 0.35;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        max: life,
        size: 0.05 + Math.random() * 0.07,
        tone,
      });
    }
  }

  private float(x: number, y: number, text: string, tone: Floater["tone"]): void {
    if (this.floaters.length > 36) this.floaters.shift();
    this.floaters.push({ x, y, text, life: 0.85, max: 0.85, tone });
  }

  private emitNow(): void {
    this.sig = this.signature();
    for (const fn of this.listeners) fn();
  }

  private maybeEmit(): void {
    const next = this.signature();
    if (next === this.sig) return;
    this.sig = next;
    for (const fn of this.listeners) fn();
  }

  private signature(): string {
    const tower = this.towers.find((item) => item.id === this.selectedId);
    return [
      this.phase,
      this.gold,
      this.lives,
      this.wave,
      this.paused ? 1 : 0,
      this.speed,
      this.placing ?? "",
      this.selectedId,
      tower ? `${tower.dmgRank}${tower.rateRank}${tower.mode}` : "",
      this.auto ? 1 : 0,
      Math.ceil(this.prepLeft),
      this.creeps.length,
      this.queue.reduce((sum, group) => sum + group.left, 0),
      this.kills,
      this.leaked,
      this.best,
      this.wins,
      this.towers.length,
    ].join("|");
  }
}
