import { COLS, MAP, ROWS, TOWERS, cellKey, pathSample, rangeFor, type TowerKind } from "./content";
import type { Sim } from "./sim";

export interface Layout {
  cell: number;
  ox: number;
  oy: number;
}

export const PAL = {
  ink: "#100e0c",
  soil: "#1c1814",
  soilAlt: "#241e19",
  trench: "#120e0c",
  crust: "#3c2618",
  ember: "#ef6b32",
  emberHot: "#ffc089",
  emberDeep: "#9a3a14",
  brass: "#e4b15a",
  parchment: "#f6efe2",
  mist: "#a89884",
  iron: "#2a2622",
  plate: "#3c362f",
  wood: "#6d4630",
  danger: "#c44832",
};

export function computeLayout(w: number, h: number): Layout {
  const margin = 12;
  const cell = Math.max(8, Math.min((w - margin * 2) / COLS, (h - margin * 2) / ROWS));
  const gw = cell * COLS;
  const gh = cell * ROWS;
  return { cell, ox: (w - gw) / 2, oy: (h - gh) / 2 };
}

function hash(n: number): number {
  let x = n | 0;
  x = Math.imul(x ^ (x >>> 16), 0x7feb352d);
  x = Math.imul(x ^ (x >>> 15), 0x846ca68b);
  return (x ^ (x >>> 16)) >>> 0;
}

function px(layout: Layout, x: number, y: number): [number, number] {
  return [layout.ox + x * layout.cell, layout.oy + y * layout.cell];
}

function strokePath(ctx: CanvasRenderingContext2D, layout: Layout): void {
  const pts = MAP.waypoints;
  ctx.beginPath();
  const [x0, y0] = px(layout, pts[0].x, pts[0].y);
  ctx.moveTo(x0, y0);
  for (let i = 1; i < pts.length; i++) {
    const [x, y] = px(layout, pts[i].x, pts[i].y);
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

export function draw(ctx: CanvasRenderingContext2D, sim: Sim, layout: Layout, w: number, h: number): void {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = PAL.ink;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(sim.shakeX, sim.shakeY);

  drawGround(ctx, layout);
  drawPath(ctx, sim, layout);
  drawPortals(ctx, sim, layout);
  drawRange(ctx, sim, layout);
  drawHover(ctx, sim, layout);
  drawCreeps(ctx, sim, layout);
  drawTowers(ctx, sim, layout);
  drawShots(ctx, sim, layout);
  drawParticles(ctx, sim, layout);
  drawFloaters(ctx, sim, layout);

  ctx.restore();

  const vignette = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.72);
  vignette.addColorStop(0, "rgba(16,14,12,0)");
  vignette.addColorStop(1, "rgba(16,14,12,0.55)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
}

function drawGround(ctx: CanvasRenderingContext2D, layout: Layout): void {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = layout.ox + c * layout.cell;
      const y = layout.oy + r * layout.cell;
      const h = hash(c * 17 + r * 131);
      const onPath = MAP.path.has(cellKey(c, r));
      ctx.fillStyle = onPath ? PAL.trench : h % 5 === 0 ? PAL.soilAlt : PAL.soil;
      ctx.fillRect(x, y, layout.cell + 0.5, layout.cell + 0.5);
      if (!onPath) {
        ctx.strokeStyle = "rgba(246,239,226,0.045)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 1.5, y + 1.5, layout.cell - 3, layout.cell - 3);
        if (h % 8 === 0) {
          ctx.fillStyle = "rgba(228,177,90,0.18)";
          ctx.beginPath();
          ctx.arc(x + layout.cell * 0.32, y + layout.cell * 0.68, Math.max(1.2, layout.cell * 0.035), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }
}

function drawPath(ctx: CanvasRenderingContext2D, sim: Sim, layout: Layout): void {
  const cell = layout.cell;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#0a0807";
  ctx.lineWidth = cell * 0.78;
  strokePath(ctx, layout);
  ctx.strokeStyle = PAL.crust;
  ctx.lineWidth = cell * 0.46;
  strokePath(ctx, layout);
  ctx.strokeStyle = PAL.emberDeep;
  ctx.lineWidth = cell * 0.14;
  strokePath(ctx, layout);

  ctx.save();
  ctx.strokeStyle = PAL.ember;
  ctx.globalAlpha = 0.9;
  ctx.lineWidth = Math.max(1.5, cell * 0.055);
  ctx.setLineDash([cell * 0.16, cell * 0.38]);
  ctx.lineDashOffset = -sim.anim * cell * 0.4;
  strokePath(ctx, layout);
  ctx.restore();

  for (let i = 0; i < 10; i++) {
    const spot = pathSample(sim.anim * 1.4 + (MAP.length / 10) * i);
    const [x, y] = px(layout, spot.x, spot.y);
    const pulse = 0.45 + 0.55 * Math.sin(sim.anim * 3 + i);
    ctx.fillStyle = PAL.emberHot;
    ctx.globalAlpha = 0.35 + pulse * 0.4;
    ctx.beginPath();
    ctx.arc(x, y, cell * (0.035 + pulse * 0.02), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function drawPortals(ctx: CanvasRenderingContext2D, sim: Sim, layout: Layout): void {
  const cell = layout.cell;
  const spawn = MAP.waypoints[0];
  const gate = MAP.waypoints[MAP.waypoints.length - 1];
  const [sx, sy] = px(layout, spawn.x, spawn.y);
  const [gx, gy] = px(layout, gate.x, gate.y);

  ctx.save();
  ctx.translate(sx, sy);
  ctx.strokeStyle = PAL.ember;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.arc(0, 0, cell * 0.28, sim.anim * 0.8, sim.anim * 0.8 + Math.PI * 1.4);
  ctx.stroke();
  ctx.fillStyle = PAL.emberDeep;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.arc(0, 0, cell * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(gx, gy);
  ctx.fillStyle = PAL.iron;
  ctx.beginPath();
  ctx.moveTo(-cell * 0.34, cell * 0.32);
  ctx.lineTo(-cell * 0.34, -cell * 0.08);
  ctx.quadraticCurveTo(0, -cell * 0.48, cell * 0.34, -cell * 0.08);
  ctx.lineTo(cell * 0.34, cell * 0.32);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = PAL.brass;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = PAL.ember;
  ctx.globalAlpha = 0.8 + Math.sin(sim.anim * 4) * 0.2;
  ctx.beginPath();
  ctx.arc(0, cell * 0.02, cell * 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawRange(ctx: CanvasRenderingContext2D, sim: Sim, layout: Layout): void {
  const selected = sim.towers.find((tower) => tower.id === sim.selectedId);
  if (selected) ring(ctx, layout, selected.x, selected.y, rangeFor(TOWERS[selected.kind], selected.dmgRank), true);
  if (sim.placing && sim.hoverC >= 0 && sim.hoverR >= 0) {
    const range = TOWERS[sim.placing].range;
    ring(ctx, layout, sim.hoverC + 0.5, sim.hoverR + 0.5, range, simOpen(sim));
  }
}

function simOpen(sim: Sim): boolean {
  if (sim.hoverC < 0 || sim.hoverR < 0 || sim.hoverC >= COLS || sim.hoverR >= ROWS) return false;
  if (MAP.path.has(cellKey(sim.hoverC, sim.hoverR))) return false;
  return !sim.towers.some((tower) => tower.c === sim.hoverC && tower.r === sim.hoverR);
}

function ring(ctx: CanvasRenderingContext2D, layout: Layout, x: number, y: number, range: number, ok: boolean): void {
  const [px0, py0] = px(layout, x, y);
  ctx.beginPath();
  ctx.arc(px0, py0, range * layout.cell, 0, Math.PI * 2);
  ctx.fillStyle = ok ? "rgba(239,107,50,0.1)" : "rgba(196,72,50,0.1)";
  ctx.fill();
  ctx.strokeStyle = ok ? "rgba(228,177,90,0.8)" : "rgba(196,72,50,0.85)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function drawHover(ctx: CanvasRenderingContext2D, sim: Sim, layout: Layout): void {
  if (sim.hoverC < 0 || sim.hoverR < 0 || sim.hoverC >= COLS || sim.hoverR >= ROWS) return;
  const x = layout.ox + sim.hoverC * layout.cell;
  const y = layout.oy + sim.hoverR * layout.cell;
  const open = simOpen(sim);
  ctx.fillStyle = sim.placing ? (open ? "rgba(239,107,50,0.16)" : "rgba(196,72,50,0.18)") : "rgba(246,239,226,0.05)";
  ctx.fillRect(x + 1, y + 1, layout.cell - 2, layout.cell - 2);
  if (sim.placing && open) {
    ctx.save();
    ctx.globalAlpha = 0.55;
    drawTowerSprite(ctx, sim.placing, x + layout.cell / 2, y + layout.cell / 2, layout.cell, -Math.PI / 2, sim.anim, 0);
    ctx.restore();
  }
}

function drawCreeps(ctx: CanvasRenderingContext2D, sim: Sim, layout: Layout): void {
  for (const creep of sim.creeps) {
    const [x, y] = px(layout, creep.x, creep.y);
    const s = layout.cell;
    if (creep.slowFactor < 1) {
      ctx.strokeStyle = "rgba(246,239,226,0.55)";
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.arc(x, y, creep.radius * s + 3, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.save();
    ctx.translate(x, y);
    if (creep.flash > 0) ctx.globalAlpha = 1;
    drawCreepBody(ctx, creep.kind, s, creep.dist, creep.flash);
    ctx.restore();

    if (creep.kind === "boss" || creep.hp < creep.maxHp - 0.5) {
      const bw = s * (creep.kind === "boss" ? 0.7 : 0.46);
      const bh = 3;
      const hx = x - bw / 2;
      const hy = y - creep.radius * s - 7;
      ctx.fillStyle = "#140f0c";
      ctx.fillRect(hx, hy, bw, bh);
      const ratio = Math.max(0, creep.hp / creep.maxHp);
      ctx.fillStyle = ratio > 0.35 ? PAL.brass : PAL.danger;
      ctx.fillRect(hx, hy, bw * ratio, bh);
    }
  }
}

function drawCreepBody(ctx: CanvasRenderingContext2D, kind: string, s: number, dist: number, flash: number): void {
  const bob = Math.sin(dist * 9) * s * 0.03;
  ctx.translate(0, bob);
  const body = flash > 0.04 ? PAL.parchment : PAL.iron;
  const edge = flash > 0.04 ? PAL.emberHot : PAL.ember;
  if (kind === "runner") {
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(s * 0.22, 0);
    ctx.lineTo(-s * 0.16, -s * 0.12);
    ctx.lineTo(-s * 0.1, 0);
    ctx.lineTo(-s * 0.16, s * 0.12);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = edge;
    ctx.fillRect(s * 0.02, -1.2, s * 0.08, 2.4);
    return;
  }
  if (kind === "swarm") {
    ctx.fillStyle = edge;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.12);
    ctx.lineTo(s * 0.1, s * 0.08);
    ctx.lineTo(-s * 0.1, s * 0.08);
    ctx.closePath();
    ctx.fill();
    return;
  }
  if (kind === "brute") {
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = PAL.brass;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = PAL.plate;
    ctx.fillRect(-s * 0.08, -s * 0.16, s * 0.16, s * 0.32);
    ctx.fillStyle = edge;
    ctx.fillRect(-s * 0.03, -s * 0.04, s * 0.06, s * 0.08);
    return;
  }
  if (kind === "boss") {
    ctx.fillStyle = "#1a1613";
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.32, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = PAL.brass;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.strokeStyle = PAL.emberDeep;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = edge;
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.09, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.16);
  ctx.lineTo(s * 0.14, -s * 0.05);
  ctx.lineTo(s * 0.1, s * 0.14);
  ctx.lineTo(-s * 0.1, s * 0.14);
  ctx.lineTo(-s * 0.14, -s * 0.05);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = edge;
  ctx.fillRect(-s * 0.035, -s * 0.02, s * 0.07, s * 0.045);
}

function drawTowers(ctx: CanvasRenderingContext2D, sim: Sim, layout: Layout): void {
  for (const tower of sim.towers) {
    const [x, y] = px(layout, tower.x, tower.y);
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.beginPath();
    ctx.ellipse(x, y + layout.cell * 0.18, layout.cell * 0.22, layout.cell * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    drawTowerSprite(ctx, tower.kind, x, y, layout.cell, tower.aim, sim.anim, tower.dmgRank);
    if (tower.id === sim.selectedId) {
      ctx.strokeStyle = PAL.brass;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, layout.cell * 0.46, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

function drawTowerSprite(
  ctx: CanvasRenderingContext2D,
  kind: TowerKind,
  x: number,
  y: number,
  s: number,
  aim: number,
  anim: number,
  rank: number,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = PAL.iron;
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = rank > 0 ? PAL.brass : "#5c5146";
  ctx.lineWidth = rank > 1 ? 2.5 : 1.5;
  ctx.stroke();
  if (rank > 2) {
    ctx.strokeStyle = PAL.ember;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.34, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.rotate(aim);
  if (kind === "ballista") {
    ctx.strokeStyle = PAL.wood;
    ctx.lineWidth = Math.max(1.5, s * 0.06);
    ctx.beginPath();
    ctx.moveTo(s * 0.02, -s * 0.2);
    ctx.lineTo(s * 0.18, -s * 0.12);
    ctx.moveTo(s * 0.02, s * 0.2);
    ctx.lineTo(s * 0.18, s * 0.12);
    ctx.stroke();
    ctx.strokeStyle = PAL.brass;
    ctx.lineWidth = Math.max(1.2, s * 0.04);
    ctx.beginPath();
    ctx.moveTo(-s * 0.06, 0);
    ctx.lineTo(s * 0.28, 0);
    ctx.stroke();
  } else if (kind === "mortar") {
    ctx.fillStyle = PAL.plate;
    ctx.beginPath();
    ctx.roundRect(s * 0.02, -s * 0.09, s * 0.28, s * 0.18, 3);
    ctx.fill();
    ctx.strokeStyle = PAL.brass;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.fillStyle = PAL.emberDeep;
    ctx.beginPath();
    ctx.arc(s * 0.3, 0, s * 0.05, 0, Math.PI * 2);
    ctx.fill();
  } else if (kind === "lance") {
    ctx.strokeStyle = PAL.emberHot;
    ctx.lineWidth = Math.max(1.4, s * 0.035);
    ctx.beginPath();
    ctx.moveTo(-s * 0.02, 0);
    ctx.lineTo(s * 0.34, 0);
    ctx.stroke();
    ctx.fillStyle = PAL.parchment;
    ctx.beginPath();
    ctx.moveTo(s * 0.36, 0);
    ctx.lineTo(s * 0.22, -s * 0.07);
    ctx.lineTo(s * 0.22, s * 0.07);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.rotate(-aim);
    const flicker = 0.7 + Math.sin(anim * 8) * 0.3;
    ctx.fillStyle = PAL.emberDeep;
    ctx.beginPath();
    ctx.ellipse(0, s * 0.02, s * 0.12, s * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = PAL.ember;
    ctx.globalAlpha = flicker;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.28);
    ctx.quadraticCurveTo(s * 0.12, -s * 0.08, 0, s * 0.02);
    ctx.quadraticCurveTo(-s * 0.12, -s * 0.08, 0, -s * 0.28);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.rotate(aim);
    ctx.strokeStyle = PAL.brass;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(s * 0.22, 0);
    ctx.stroke();
  }
  ctx.restore();
}

function drawShots(ctx: CanvasRenderingContext2D, sim: Sim, layout: Layout): void {
  for (const beam of sim.beams) {
    const [x1, y1] = px(layout, beam.x1, beam.y1);
    const [x2, y2] = px(layout, beam.x2, beam.y2);
    ctx.strokeStyle = PAL.emberHot;
    ctx.globalAlpha = Math.max(0.2, beam.life / beam.max);
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  for (const shot of sim.shots) {
    const [x, y] = px(layout, shot.x, shot.y);
    const progress = shot.total > 0 ? 1 - shot.left / shot.total : 1;
    const lift = shot.style === "shell" ? Math.sin(progress * Math.PI) * layout.cell * 0.55 : 0;
    if (shot.style === "shell") {
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.beginPath();
      ctx.ellipse(x, y + 4, 3, 1.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = shot.style === "bolt" ? PAL.brass : shot.style === "shell" ? PAL.emberHot : PAL.ember;
    ctx.beginPath();
    ctx.arc(x, y - lift, shot.style === "shell" ? 4.2 : 2.6, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawParticles(ctx: CanvasRenderingContext2D, sim: Sim, layout: Layout): void {
  for (const particle of sim.particles) {
    const [x, y] = px(layout, particle.x, particle.y);
    const alpha = Math.max(0, particle.life / particle.max);
    ctx.globalAlpha = alpha;
    ctx.fillStyle =
      particle.tone === "brass" ? PAL.brass : particle.tone === "ash" ? PAL.mist : particle.tone === "dust" ? PAL.parchment : PAL.ember;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(1, particle.size * layout.cell), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawFloaters(ctx: CanvasRenderingContext2D, sim: Sim, layout: Layout): void {
  ctx.font = `600 ${Math.max(11, layout.cell * 0.28)}px Outfit, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const floater of sim.floaters) {
    const [x, y] = px(layout, floater.x, floater.y);
    ctx.globalAlpha = Math.max(0, floater.life / floater.max);
    ctx.fillStyle = floater.tone === "gold" ? PAL.brass : floater.tone === "hurt" ? "#ffb0a4" : PAL.parchment;
    ctx.fillText(floater.text, x, y);
  }
  ctx.globalAlpha = 1;
}
