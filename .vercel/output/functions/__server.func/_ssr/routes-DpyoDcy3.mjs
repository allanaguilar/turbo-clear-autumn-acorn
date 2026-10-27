import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Play, c as Flame, d as Coins, f as Bomb, i as Sword, l as FastForward, n as Volume2, o as Pause, s as Heart, t as VolumeX, u as Crosshair } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DpyoDcy3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var WAY_CELLS = [
	[0, 1],
	[11, 1],
	[11, 3],
	[1, 3],
	[1, 5],
	[11, 5],
	[11, 7],
	[0, 7]
];
var SELL_RATIO = .6;
var SAVE_KEY = "senda-ignea-save-v1";
var TOWERS = {
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
		style: "bolt"
	},
	mortar: {
		kind: "mortar",
		name: "Mortero",
		blurb: "Lento. La granada estalla en área.",
		cost: 115,
		range: 2.55,
		damage: 28,
		fireRate: .42,
		shotSpeed: 3.5,
		splash: 1.05,
		slow: 0,
		slowDur: 0,
		pierce: .1,
		style: "shell"
	},
	lance: {
		kind: "lance",
		name: "Aguja",
		blurb: "Largo alcance. Ignora la armadura.",
		cost: 150,
		range: 2.85,
		damage: 34,
		fireRate: .64,
		shotSpeed: 0,
		splash: 0,
		slow: 0,
		slowDur: 0,
		pierce: 1,
		style: "beam"
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
		slow: .46,
		slowDur: 2.3,
		pierce: 0,
		style: "orb"
	}
};
var TOWER_ORDER = [
	"ballista",
	"mortar",
	"lance",
	"cinder"
];
var ENEMIES = {
	grunt: {
		kind: "grunt",
		name: "Peón",
		plural: "Peones",
		hp: 30,
		speed: 1.22,
		gold: 6,
		armor: 0,
		radius: .28,
		leak: 1
	},
	runner: {
		kind: "runner",
		name: "Veloz",
		plural: "Veloces",
		hp: 24,
		speed: 2.15,
		gold: 8,
		armor: 0,
		radius: .2,
		leak: 1
	},
	brute: {
		kind: "brute",
		name: "Acorazado",
		plural: "Acorazados",
		hp: 140,
		speed: .74,
		gold: 18,
		armor: .55,
		radius: .38,
		leak: 1
	},
	swarm: {
		kind: "swarm",
		name: "Chispa",
		plural: "Chispas",
		hp: 14,
		speed: 1.55,
		gold: 4,
		armor: 0,
		radius: .16,
		leak: 1
	},
	boss: {
		kind: "boss",
		name: "Heraldo",
		plural: "Heraldos",
		hp: 1280,
		speed: .52,
		gold: 120,
		armor: .35,
		radius: .52,
		leak: 4
	}
};
var WAVES = [
	[{
		kind: "grunt",
		count: 8,
		interval: .92
	}],
	[{
		kind: "grunt",
		count: 12,
		interval: .7
	}],
	[{
		kind: "grunt",
		count: 6,
		interval: .6
	}, {
		kind: "runner",
		count: 7,
		interval: .5
	}],
	[{
		kind: "runner",
		count: 12,
		interval: .42
	}, {
		kind: "grunt",
		count: 6,
		interval: .55
	}],
	[{
		kind: "brute",
		count: 5,
		interval: 1.15
	}, {
		kind: "grunt",
		count: 8,
		interval: .5
	}],
	[{
		kind: "swarm",
		count: 16,
		interval: .26
	}, {
		kind: "runner",
		count: 6,
		interval: .45
	}],
	[{
		kind: "brute",
		count: 7,
		interval: .95
	}, {
		kind: "runner",
		count: 8,
		interval: .4
	}],
	[{
		kind: "swarm",
		count: 14,
		interval: .24
	}, {
		kind: "brute",
		count: 8,
		interval: .9
	}],
	[
		{
			kind: "runner",
			count: 10,
			interval: .38
		},
		{
			kind: "brute",
			count: 8,
			interval: .8
		},
		{
			kind: "swarm",
			count: 12,
			interval: .22
		}
	],
	[
		{
			kind: "boss",
			count: 1,
			interval: .4
		},
		{
			kind: "brute",
			count: 6,
			interval: 1
		},
		{
			kind: "runner",
			count: 10,
			interval: .4
		}
	]
];
var TARGET_LABEL = {
	first: "Primero",
	last: "Último",
	close: "Cercano",
	strong: "Fuerte"
};
var TARGET_HINT = {
	first: "El que más ha avanzado",
	last: "El que acaba de entrar",
	close: "El más cercano a la torre",
	strong: "El que tiene más vida"
};
function cellKey(c, r) {
	return `${c},${r}`;
}
function buildMap() {
	const path = /* @__PURE__ */ new Set();
	const waypoints = [];
	for (let i = 0; i < WAY_CELLS.length; i++) {
		const [c, r] = WAY_CELLS[i];
		waypoints.push({
			x: c + .5,
			y: r + .5
		});
		if (i === 0) {
			path.add(cellKey(c, r));
			continue;
		}
		const [pc, pr] = WAY_CELLS[i - 1];
		const steps = Math.max(Math.abs(c - pc), Math.abs(r - pr));
		for (let s = 0; s <= steps; s++) {
			const cc = pc + Math.round((c - pc) * s / steps);
			const rr = pr + Math.round((r - pr) * s / steps);
			path.add(cellKey(cc, rr));
		}
	}
	let length = 0;
	for (let i = 1; i < waypoints.length; i++) length += Math.hypot(waypoints[i].x - waypoints[i - 1].x, waypoints[i].y - waypoints[i - 1].y);
	return {
		path,
		waypoints,
		length
	};
}
var MAP = buildMap();
function pathSample(dist) {
	const pts = MAP.waypoints;
	let remaining = (dist % MAP.length + MAP.length) % MAP.length;
	for (let i = 1; i < pts.length; i++) {
		const a = pts[i - 1];
		const b = pts[i];
		const len = Math.hypot(b.x - a.x, b.y - a.y);
		if (remaining <= len) {
			const t = len === 0 ? 0 : remaining / len;
			return {
				x: a.x + (b.x - a.x) * t,
				y: a.y + (b.y - a.y) * t
			};
		}
		remaining -= len;
	}
	return pts[pts.length - 1];
}
function upgradeCost(base, rank) {
	return Math.round(base * [
		.5,
		.85,
		1.25
	][rank]);
}
function damageFactor(rank) {
	return 1 + rank * .48;
}
function rateFactor(rank) {
	return 1 + rank * .26;
}
function rangeFor(def, rank) {
	return def.range + rank * .04;
}
function waveScale(index) {
	return 1 + index * .1;
}
function describeWave(index) {
	const wave = WAVES[index];
	if (!wave) return "";
	return wave.map((group) => {
		const enemy = ENEMIES[group.kind];
		const name = group.count === 1 ? enemy.name : enemy.plural;
		return `${group.count} ${name.toLowerCase()}`;
	}).join(" · ");
}
var PAL = {
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
	danger: "#c44832"
};
function computeLayout(w, h) {
	const cell = Math.max(8, Math.min((w - 24) / 13, (h - 24) / 9));
	const gw = cell * 13;
	const gh = cell * 9;
	return {
		cell,
		ox: (w - gw) / 2,
		oy: (h - gh) / 2
	};
}
function hash(n) {
	let x = n | 0;
	x = Math.imul(x ^ x >>> 16, 2146121005);
	x = Math.imul(x ^ x >>> 15, 2221713035);
	return (x ^ x >>> 16) >>> 0;
}
function px(layout, x, y) {
	return [layout.ox + x * layout.cell, layout.oy + y * layout.cell];
}
function strokePath(ctx, layout) {
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
function draw(ctx, sim, layout, w, h) {
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
	const vignette = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * .35, w / 2, h / 2, Math.max(w, h) * .72);
	vignette.addColorStop(0, "rgba(16,14,12,0)");
	vignette.addColorStop(1, "rgba(16,14,12,0.55)");
	ctx.fillStyle = vignette;
	ctx.fillRect(0, 0, w, h);
}
function drawGround(ctx, layout) {
	for (let r = 0; r < 9; r++) for (let c = 0; c < 13; c++) {
		const x = layout.ox + c * layout.cell;
		const y = layout.oy + r * layout.cell;
		const h = hash(c * 17 + r * 131);
		const onPath = MAP.path.has(cellKey(c, r));
		ctx.fillStyle = onPath ? PAL.trench : h % 5 === 0 ? PAL.soilAlt : PAL.soil;
		ctx.fillRect(x, y, layout.cell + .5, layout.cell + .5);
		if (!onPath) {
			ctx.strokeStyle = "rgba(246,239,226,0.045)";
			ctx.lineWidth = 1;
			ctx.strokeRect(x + 1.5, y + 1.5, layout.cell - 3, layout.cell - 3);
			if (h % 8 === 0) {
				ctx.fillStyle = "rgba(228,177,90,0.18)";
				ctx.beginPath();
				ctx.arc(x + layout.cell * .32, y + layout.cell * .68, Math.max(1.2, layout.cell * .035), 0, Math.PI * 2);
				ctx.fill();
			}
		}
	}
}
function drawPath(ctx, sim, layout) {
	const cell = layout.cell;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.strokeStyle = "#0a0807";
	ctx.lineWidth = cell * .78;
	strokePath(ctx, layout);
	ctx.strokeStyle = PAL.crust;
	ctx.lineWidth = cell * .46;
	strokePath(ctx, layout);
	ctx.strokeStyle = PAL.emberDeep;
	ctx.lineWidth = cell * .14;
	strokePath(ctx, layout);
	ctx.save();
	ctx.strokeStyle = PAL.ember;
	ctx.globalAlpha = .9;
	ctx.lineWidth = Math.max(1.5, cell * .055);
	ctx.setLineDash([cell * .16, cell * .38]);
	ctx.lineDashOffset = -sim.anim * cell * .4;
	strokePath(ctx, layout);
	ctx.restore();
	for (let i = 0; i < 10; i++) {
		const spot = pathSample(sim.anim * 1.4 + MAP.length / 10 * i);
		const [x, y] = px(layout, spot.x, spot.y);
		const pulse = .45 + .55 * Math.sin(sim.anim * 3 + i);
		ctx.fillStyle = PAL.emberHot;
		ctx.globalAlpha = .35 + pulse * .4;
		ctx.beginPath();
		ctx.arc(x, y, cell * (.035 + pulse * .02), 0, Math.PI * 2);
		ctx.fill();
		ctx.globalAlpha = 1;
	}
}
function drawPortals(ctx, sim, layout) {
	const cell = layout.cell;
	const spawn = MAP.waypoints[0];
	const gate = MAP.waypoints[MAP.waypoints.length - 1];
	const [sx, sy] = px(layout, spawn.x, spawn.y);
	const [gx, gy] = px(layout, gate.x, gate.y);
	ctx.save();
	ctx.translate(sx, sy);
	ctx.strokeStyle = PAL.ember;
	ctx.lineWidth = 2;
	ctx.globalAlpha = .85;
	ctx.beginPath();
	ctx.arc(0, 0, cell * .28, sim.anim * .8, sim.anim * .8 + Math.PI * 1.4);
	ctx.stroke();
	ctx.fillStyle = PAL.emberDeep;
	ctx.globalAlpha = .9;
	ctx.beginPath();
	ctx.arc(0, 0, cell * .12, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
	ctx.save();
	ctx.translate(gx, gy);
	ctx.fillStyle = PAL.iron;
	ctx.beginPath();
	ctx.moveTo(-cell * .34, cell * .32);
	ctx.lineTo(-cell * .34, -cell * .08);
	ctx.quadraticCurveTo(0, -cell * .48, cell * .34, -cell * .08);
	ctx.lineTo(cell * .34, cell * .32);
	ctx.closePath();
	ctx.fill();
	ctx.strokeStyle = PAL.brass;
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.fillStyle = PAL.ember;
	ctx.globalAlpha = .8 + Math.sin(sim.anim * 4) * .2;
	ctx.beginPath();
	ctx.arc(0, cell * .02, cell * .08, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
	ctx.globalAlpha = 1;
}
function drawRange(ctx, sim, layout) {
	const selected = sim.towers.find((tower) => tower.id === sim.selectedId);
	if (selected) ring(ctx, layout, selected.x, selected.y, rangeFor(TOWERS[selected.kind], selected.dmgRank), true);
	if (sim.placing && sim.hoverC >= 0 && sim.hoverR >= 0) {
		const range = TOWERS[sim.placing].range;
		ring(ctx, layout, sim.hoverC + .5, sim.hoverR + .5, range, simOpen(sim));
	}
}
function simOpen(sim) {
	if (sim.hoverC < 0 || sim.hoverR < 0 || sim.hoverC >= 13 || sim.hoverR >= 9) return false;
	if (MAP.path.has(cellKey(sim.hoverC, sim.hoverR))) return false;
	return !sim.towers.some((tower) => tower.c === sim.hoverC && tower.r === sim.hoverR);
}
function ring(ctx, layout, x, y, range, ok) {
	const [px0, py0] = px(layout, x, y);
	ctx.beginPath();
	ctx.arc(px0, py0, range * layout.cell, 0, Math.PI * 2);
	ctx.fillStyle = ok ? "rgba(239,107,50,0.1)" : "rgba(196,72,50,0.1)";
	ctx.fill();
	ctx.strokeStyle = ok ? "rgba(228,177,90,0.8)" : "rgba(196,72,50,0.85)";
	ctx.lineWidth = 1.5;
	ctx.stroke();
}
function drawHover(ctx, sim, layout) {
	if (sim.hoverC < 0 || sim.hoverR < 0 || sim.hoverC >= 13 || sim.hoverR >= 9) return;
	const x = layout.ox + sim.hoverC * layout.cell;
	const y = layout.oy + sim.hoverR * layout.cell;
	const open = simOpen(sim);
	ctx.fillStyle = sim.placing ? open ? "rgba(239,107,50,0.16)" : "rgba(196,72,50,0.18)" : "rgba(246,239,226,0.05)";
	ctx.fillRect(x + 1, y + 1, layout.cell - 2, layout.cell - 2);
	if (sim.placing && open) {
		ctx.save();
		ctx.globalAlpha = .55;
		drawTowerSprite(ctx, sim.placing, x + layout.cell / 2, y + layout.cell / 2, layout.cell, -Math.PI / 2, sim.anim, 0);
		ctx.restore();
	}
}
function drawCreeps(ctx, sim, layout) {
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
		if (creep.kind === "boss" || creep.hp < creep.maxHp - .5) {
			const bw = s * (creep.kind === "boss" ? .7 : .46);
			const bh = 3;
			const hx = x - bw / 2;
			const hy = y - creep.radius * s - 7;
			ctx.fillStyle = "#140f0c";
			ctx.fillRect(hx, hy, bw, bh);
			const ratio = Math.max(0, creep.hp / creep.maxHp);
			ctx.fillStyle = ratio > .35 ? PAL.brass : PAL.danger;
			ctx.fillRect(hx, hy, bw * ratio, bh);
		}
	}
}
function drawCreepBody(ctx, kind, s, dist, flash) {
	const bob = Math.sin(dist * 9) * s * .03;
	ctx.translate(0, bob);
	const body = flash > .04 ? PAL.parchment : PAL.iron;
	const edge = flash > .04 ? PAL.emberHot : PAL.ember;
	if (kind === "runner") {
		ctx.fillStyle = body;
		ctx.beginPath();
		ctx.moveTo(s * .22, 0);
		ctx.lineTo(-s * .16, -s * .12);
		ctx.lineTo(-s * .1, 0);
		ctx.lineTo(-s * .16, s * .12);
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = edge;
		ctx.fillRect(s * .02, -1.2, s * .08, 2.4);
		return;
	}
	if (kind === "swarm") {
		ctx.fillStyle = edge;
		ctx.beginPath();
		ctx.moveTo(0, -s * .12);
		ctx.lineTo(s * .1, s * .08);
		ctx.lineTo(-s * .1, s * .08);
		ctx.closePath();
		ctx.fill();
		return;
	}
	if (kind === "brute") {
		ctx.fillStyle = body;
		ctx.beginPath();
		ctx.arc(0, 0, s * .22, 0, Math.PI * 2);
		ctx.fill();
		ctx.strokeStyle = PAL.brass;
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.fillStyle = PAL.plate;
		ctx.fillRect(-s * .08, -s * .16, s * .16, s * .32);
		ctx.fillStyle = edge;
		ctx.fillRect(-s * .03, -s * .04, s * .06, s * .08);
		return;
	}
	if (kind === "boss") {
		ctx.fillStyle = "#1a1613";
		ctx.beginPath();
		ctx.arc(0, 0, s * .32, 0, Math.PI * 2);
		ctx.fill();
		ctx.strokeStyle = PAL.brass;
		ctx.lineWidth = 2.5;
		ctx.stroke();
		ctx.strokeStyle = PAL.emberDeep;
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.arc(0, 0, s * .2, 0, Math.PI * 2);
		ctx.stroke();
		ctx.fillStyle = edge;
		ctx.beginPath();
		ctx.arc(0, 0, s * .09, 0, Math.PI * 2);
		ctx.fill();
		return;
	}
	ctx.fillStyle = body;
	ctx.beginPath();
	ctx.moveTo(0, -s * .16);
	ctx.lineTo(s * .14, -s * .05);
	ctx.lineTo(s * .1, s * .14);
	ctx.lineTo(-s * .1, s * .14);
	ctx.lineTo(-s * .14, -s * .05);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = edge;
	ctx.fillRect(-s * .035, -s * .02, s * .07, s * .045);
}
function drawTowers(ctx, sim, layout) {
	for (const tower of sim.towers) {
		const [x, y] = px(layout, tower.x, tower.y);
		ctx.save();
		ctx.fillStyle = "rgba(0,0,0,0.28)";
		ctx.beginPath();
		ctx.ellipse(x, y + layout.cell * .18, layout.cell * .22, layout.cell * .08, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
		drawTowerSprite(ctx, tower.kind, x, y, layout.cell, tower.aim, sim.anim, tower.dmgRank);
		if (tower.id === sim.selectedId) {
			ctx.strokeStyle = PAL.brass;
			ctx.lineWidth = 1.5;
			ctx.beginPath();
			ctx.arc(x, y, layout.cell * .46, 0, Math.PI * 2);
			ctx.stroke();
		}
	}
}
function drawTowerSprite(ctx, kind, x, y, s, aim, anim, rank) {
	ctx.save();
	ctx.translate(x, y);
	ctx.fillStyle = PAL.iron;
	ctx.beginPath();
	ctx.arc(0, 0, s * .28, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = rank > 0 ? PAL.brass : "#5c5146";
	ctx.lineWidth = rank > 1 ? 2.5 : 1.5;
	ctx.stroke();
	if (rank > 2) {
		ctx.strokeStyle = PAL.ember;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.arc(0, 0, s * .34, 0, Math.PI * 2);
		ctx.stroke();
	}
	ctx.rotate(aim);
	if (kind === "ballista") {
		ctx.strokeStyle = PAL.wood;
		ctx.lineWidth = Math.max(1.5, s * .06);
		ctx.beginPath();
		ctx.moveTo(s * .02, -s * .2);
		ctx.lineTo(s * .18, -s * .12);
		ctx.moveTo(s * .02, s * .2);
		ctx.lineTo(s * .18, s * .12);
		ctx.stroke();
		ctx.strokeStyle = PAL.brass;
		ctx.lineWidth = Math.max(1.2, s * .04);
		ctx.beginPath();
		ctx.moveTo(-s * .06, 0);
		ctx.lineTo(s * .28, 0);
		ctx.stroke();
	} else if (kind === "mortar") {
		ctx.fillStyle = PAL.plate;
		ctx.beginPath();
		ctx.roundRect(s * .02, -s * .09, s * .28, s * .18, 3);
		ctx.fill();
		ctx.strokeStyle = PAL.brass;
		ctx.lineWidth = 1.4;
		ctx.stroke();
		ctx.fillStyle = PAL.emberDeep;
		ctx.beginPath();
		ctx.arc(s * .3, 0, s * .05, 0, Math.PI * 2);
		ctx.fill();
	} else if (kind === "lance") {
		ctx.strokeStyle = PAL.emberHot;
		ctx.lineWidth = Math.max(1.4, s * .035);
		ctx.beginPath();
		ctx.moveTo(-s * .02, 0);
		ctx.lineTo(s * .34, 0);
		ctx.stroke();
		ctx.fillStyle = PAL.parchment;
		ctx.beginPath();
		ctx.moveTo(s * .36, 0);
		ctx.lineTo(s * .22, -s * .07);
		ctx.lineTo(s * .22, s * .07);
		ctx.closePath();
		ctx.fill();
	} else {
		ctx.rotate(-aim);
		const flicker = .7 + Math.sin(anim * 8) * .3;
		ctx.fillStyle = PAL.emberDeep;
		ctx.beginPath();
		ctx.ellipse(0, s * .02, s * .12, s * .08, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = PAL.ember;
		ctx.globalAlpha = flicker;
		ctx.beginPath();
		ctx.moveTo(0, -s * .28);
		ctx.quadraticCurveTo(s * .12, -s * .08, 0, s * .02);
		ctx.quadraticCurveTo(-s * .12, -s * .08, 0, -s * .28);
		ctx.fill();
		ctx.globalAlpha = 1;
		ctx.rotate(aim);
		ctx.strokeStyle = PAL.brass;
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(s * .22, 0);
		ctx.stroke();
	}
	ctx.restore();
}
function drawShots(ctx, sim, layout) {
	for (const beam of sim.beams) {
		const [x1, y1] = px(layout, beam.x1, beam.y1);
		const [x2, y2] = px(layout, beam.x2, beam.y2);
		ctx.strokeStyle = PAL.emberHot;
		ctx.globalAlpha = Math.max(.2, beam.life / beam.max);
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
		const lift = shot.style === "shell" ? Math.sin(progress * Math.PI) * layout.cell * .55 : 0;
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
function drawParticles(ctx, sim, layout) {
	for (const particle of sim.particles) {
		const [x, y] = px(layout, particle.x, particle.y);
		ctx.globalAlpha = Math.max(0, particle.life / particle.max);
		ctx.fillStyle = particle.tone === "brass" ? PAL.brass : particle.tone === "ash" ? PAL.mist : particle.tone === "dust" ? PAL.parchment : PAL.ember;
		ctx.beginPath();
		ctx.arc(x, y, Math.max(1, particle.size * layout.cell), 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.globalAlpha = 1;
}
function drawFloaters(ctx, sim, layout) {
	ctx.font = `600 ${Math.max(11, layout.cell * .28)}px Outfit, sans-serif`;
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
var ctx = null;
var master = null;
var noise = null;
var muted = false;
var voices = 0;
function context() {
	return ctx;
}
function isMuted() {
	return muted;
}
function unlockAudio() {
	const AC = window.AudioContext || window.webkitAudioContext;
	if (!AC) return;
	if (!ctx) {
		ctx = new AC({ latencyHint: "interactive" });
		master = ctx.createGain();
		master.gain.value = .7;
		master.connect(ctx.destination);
		const samples = ctx.sampleRate * .4;
		noise = ctx.createBuffer(1, samples, ctx.sampleRate);
		const data = noise.getChannelData(0);
		for (let i = 0; i < samples; i++) data[i] = Math.random() * 2 - 1;
	}
	if (ctx.state === "suspended") ctx.resume();
}
function resumeAudio() {
	if (ctx && ctx.state === "suspended") ctx.resume();
}
function setMuted(next) {
	muted = next;
	if (!ctx || !master) return;
	master.gain.setTargetAtTime(next ? 0 : .7, ctx.currentTime, .02);
}
function gainNode(peak, dur) {
	if (!ctx || !master || muted) return null;
	if (voices > 14) return null;
	const gain = ctx.createGain();
	const now = ctx.currentTime;
	gain.connect(master);
	gain.gain.setValueAtTime(1e-4, now);
	gain.gain.exponentialRampToValueAtTime(Math.max(.001, peak), now + .012);
	gain.gain.exponentialRampToValueAtTime(1e-4, now + Math.max(.04, dur));
	return gain;
}
function tone(freq, dur, type, peak, slide = 0) {
	if (!ctx) return;
	const gain = gainNode(peak, dur);
	if (!gain) return;
	const osc = ctx.createOscillator();
	osc.type = type;
	osc.frequency.setValueAtTime(freq, ctx.currentTime);
	if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), ctx.currentTime + dur);
	osc.connect(gain);
	voices += 1;
	osc.onended = () => {
		voices = Math.max(0, voices - 1);
		osc.disconnect();
		gain.disconnect();
	};
	osc.start();
	osc.stop(ctx.currentTime + dur + .02);
}
function hiss(dur, peak, rate = 1) {
	if (!ctx || !noise) return;
	const gain = gainNode(peak, dur);
	if (!gain) return;
	const src = ctx.createBufferSource();
	src.buffer = noise;
	src.playbackRate.value = rate;
	const filter = ctx.createBiquadFilter();
	filter.type = "bandpass";
	filter.frequency.value = 900 * rate;
	filter.Q.value = .6;
	src.connect(filter);
	filter.connect(gain);
	voices += 1;
	src.onended = () => {
		voices = Math.max(0, voices - 1);
		src.disconnect();
		filter.disconnect();
		gain.disconnect();
	};
	src.start();
	src.stop(ctx.currentTime + dur);
}
function playSfx(name) {
	if (!context() || muted) return;
	switch (name) {
		case "place":
			tone(210, .08, "triangle", .08);
			hiss(.06, .04, .6);
			break;
		case "deny":
			tone(140, .09, "square", .04, -40);
			break;
		case "bolt":
			tone(520 + Math.random() * 60, .05, "square", .035, 80);
			break;
		case "shell":
			tone(130, .12, "sine", .07, -70);
			break;
		case "beam":
			tone(880, .07, "sawtooth", .03, 220);
			break;
		case "orb":
			tone(360 + Math.random() * 40, .08, "triangle", .04);
			break;
		case "boom":
			tone(90, .16, "sine", .08, -40);
			hiss(.12, .05, .4);
			break;
		case "kill":
			tone(660, .06, "triangle", .05);
			tone(880, .08, "sine", .04);
			break;
		case "leak":
			tone(180, .2, "sine", .07, -100);
			break;
		case "wave":
			tone(196, .18, "triangle", .06, 40);
			tone(294, .22, "sine", .04);
			break;
		case "coin":
			tone(740, .07, "sine", .05);
			tone(980, .1, "triangle", .04);
			break;
		case "upgrade":
			tone(440, .07, "triangle", .05, 80);
			tone(660, .1, "sine", .04);
			break;
		case "click":
			tone(480, .04, "square", .03);
			break;
		case "boss":
			tone(90, .35, "sawtooth", .05, -30);
			tone(140, .3, "sine", .05);
			break;
		case "win":
			tone(392, .12, "triangle", .06);
			tone(523, .14, "sine", .05);
			tone(659, .2, "triangle", .05);
			break;
		case "lose":
			tone(311, .18, "sine", .06, -40);
			tone(196, .28, "triangle", .05, -60);
	}
}
function lerpAngle(a, b, t) {
	let d = b - a;
	while (d > Math.PI) d -= Math.PI * 2;
	while (d < -Math.PI) d += Math.PI * 2;
	return a + d * t;
}
function round1(n) {
	return Math.round(n * 10) / 10;
}
var Sim = class {
	gold = 140;
	lives = 18;
	wave = 0;
	phase = "menu";
	paused = false;
	speed = 1;
	placing = null;
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
	towers = [];
	creeps = [];
	shots = [];
	beams = [];
	particles = [];
	floaters = [];
	queue = [];
	nextId = 1;
	acc = 0;
	sig = "";
	listeners = /* @__PURE__ */ new Set();
	subscribe(fn) {
		this.listeners.add(fn);
		return () => this.listeners.delete(fn);
	}
	setReduced(value) {
		this.reduced = value;
	}
	hydrate() {
		try {
			const raw = localStorage.getItem(SAVE_KEY);
			if (!raw) return;
			const data = JSON.parse(raw);
			if (data.version !== 1) return;
			this.best = data.best ?? 0;
			this.wins = data.wins ?? 0;
			this.emitNow();
		} catch {}
	}
	snapshot() {
		const tower = this.towers.find((item) => item.id === this.selectedId) ?? null;
		let selection = null;
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
				nextDamage: tower.dmgRank < 3 ? round1(def.damage * damageFactor(tower.dmgRank + 1)) : null,
				rate: round1(def.fireRate * rateFactor(tower.rateRank)),
				nextRate: tower.rateRank < 3 ? round1(def.fireRate * rateFactor(tower.rateRank + 1)) : null,
				dmgCost: tower.dmgRank < 3 ? upgradeCost(def.cost, tower.dmgRank) : null,
				rateCost: tower.rateRank < 3 ? upgradeCost(def.cost, tower.rateRank) : null,
				sell: Math.floor(tower.spent * SELL_RATIO),
				range: rangeFor(def, tower.dmgRank)
			};
		}
		const playing = this.phase === "prep" || this.phase === "combat";
		let hint = "";
		if (playing && this.towers.length === 0 && !this.placing) hint = "Elige una torre y toca el terreno oscuro. La senda no se construye.";
		else if (this.placing) hint = TOWERS[this.placing].blurb;
		else if (this.phase === "combat" && this.wave === WAVES.length - 1) hint = "El heraldo aguanta mucho. Prioridad Fuerte lo ignora menos.";
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
			selection
		};
	}
	frame(raw) {
		const dt = Math.min(.05, Math.max(0, raw));
		if (!(this.paused && (this.phase === "combat" || this.phase === "prep"))) this.anim += dt;
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
	begin() {
		this.reset(true);
		this.phase = "prep";
		this.auto = false;
		this.wave = 0;
		this.prepLeft = 0;
		playSfx("wave");
		this.emitNow();
	}
	restart() {
		this.begin();
	}
	launch() {
		if (this.phase !== "prep") return;
		if (this.paused) this.paused = false;
		if (this.auto && this.prepLeft > .2) {
			const bonus = Math.ceil(this.prepLeft / 2);
			if (bonus > 0) {
				this.gold += bonus;
				const gate = MAP.waypoints[0];
				this.float(gate.x, gate.y - .4, `+${bonus}`, "gold");
				playSfx("coin");
			}
		}
		this.prepLeft = 0;
		this.startWaveNow();
		this.emitNow();
	}
	togglePause() {
		if (this.phase !== "prep" && this.phase !== "combat") return;
		this.paused = !this.paused;
		playSfx("click");
		this.emitNow();
	}
	toggleSpeed() {
		if (this.phase !== "prep" && this.phase !== "combat") return;
		this.speed = this.speed === 1 ? 2 : 1;
		playSfx("click");
		this.emitNow();
	}
	choose(kind) {
		if (!this.canBuild()) return;
		if (kind && this.placing === kind) this.placing = null;
		else this.placing = kind;
		if (kind) this.selectedId = 0;
		playSfx("click");
		this.emitNow();
	}
	upgrade(stat) {
		const tower = this.selected();
		if (!tower || !this.canBuild()) return;
		const def = TOWERS[tower.kind];
		const rank = stat === "dmg" ? tower.dmgRank : tower.rateRank;
		if (rank >= 3) return;
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
	cycleTarget() {
		const tower = this.selected();
		if (!tower || !this.canBuild()) return;
		const order = [
			"first",
			"last",
			"close",
			"strong"
		];
		tower.mode = order[(order.indexOf(tower.mode) + 1) % order.length];
		playSfx("click");
		this.emitNow();
	}
	sell() {
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
	pointer(c, r) {
		if (!this.canBuild()) return;
		if (c < 0 || r < 0 || c >= 13 || r >= 9) return;
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
	hover(c, r) {
		this.hoverC = c;
		this.hoverR = r;
	}
	clearHover() {
		this.hoverC = -1;
		this.hoverR = -1;
	}
	canBuild() {
		return this.phase === "prep" || this.phase === "combat";
	}
	selected() {
		return this.towers.find((item) => item.id === this.selectedId) ?? null;
	}
	remaining() {
		let count = this.creeps.length;
		for (const group of this.queue) count += group.left;
		return count;
	}
	reset(keepMeta) {
		const best = this.best;
		const wins = this.wins;
		this.gold = 140;
		this.lives = 18;
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
	persist() {
		try {
			localStorage.setItem(SAVE_KEY, JSON.stringify({
				version: 1,
				best: this.best,
				wins: this.wins
			}));
		} catch {}
	}
	noteProgress(cleared) {
		if (cleared > this.best) this.best = cleared;
		this.persist();
	}
	isOpen(c, r) {
		if (c < 0 || r < 0 || c >= 13 || r >= 9) return false;
		if (MAP.path.has(cellKey(c, r))) return false;
		return !this.towers.some((tower) => tower.c === c && tower.r === r);
	}
	tryPlace(c, r) {
		const kind = this.placing;
		if (!kind) return;
		if (!this.isOpen(c, r)) {
			playSfx("deny");
			if (MAP.path.has(cellKey(c, r))) this.float(c + .5, r + .2, "Senda", "hurt");
			this.emitNow();
			return;
		}
		const def = TOWERS[kind];
		if (this.gold < def.cost) {
			playSfx("deny");
			this.float(c + .5, r + .2, "Sin oro", "hurt");
			this.emitNow();
			return;
		}
		this.gold -= def.cost;
		this.towers.push({
			id: ++this.nextId,
			kind,
			c,
			r,
			x: c + .5,
			y: r + .5,
			aim: -Math.PI / 2,
			cooldown: .15,
			dmgRank: 0,
			rateRank: 0,
			spent: def.cost,
			mode: "first"
		});
		this.burst(c + .5, r + .5, 7, "dust");
		playSfx("place");
		this.emitNow();
	}
	startWaveNow() {
		const groups = WAVES[this.wave];
		this.queue = groups.map((group, index) => ({
			kind: group.kind,
			left: group.count,
			interval: group.interval,
			timer: index === 0 ? .3 : 0
		}));
		this.phase = "combat";
		playSfx("wave");
	}
	onWaveCleared() {
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
		this.prepLeft = 14;
	}
	tick(dt) {
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
	tickSpawn(dt) {
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
			if (this.queue[0]) this.queue[0].timer += .45;
		}
	}
	spawn(kind) {
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
			radius: def.radius
		});
		if (kind === "boss") {
			this.shake = Math.min(1, this.shake + .75);
			this.float(start.x + .2, start.y - .35, "Heraldo", "info");
			playSfx("boss");
		}
	}
	tickCreeps(dt) {
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
			if (dist <= step || dist < .001) {
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
	leak(index) {
		const creep = this.creeps[index];
		if (!creep || !creep.alive) return;
		creep.alive = false;
		this.creeps.splice(index, 1);
		this.lives = Math.max(0, this.lives - creep.leak);
		this.leaked += 1;
		if (!this.reduced) this.shake = Math.min(1, this.shake + .5);
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
	tickTowers(dt) {
		for (const tower of this.towers) {
			tower.cooldown -= dt;
			const target = this.acquire(tower);
			if (!target) continue;
			const desired = Math.atan2(target.y - tower.y, target.x - tower.x);
			tower.aim = lerpAngle(tower.aim, desired, 1 - Math.exp(-14 * dt));
			if (tower.cooldown <= 0) this.fire(tower, target);
		}
	}
	acquire(tower) {
		const range = rangeFor(TOWERS[tower.kind], tower.dmgRank);
		const r2 = range * range;
		let best = null;
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
	fire(tower, target) {
		const def = TOWERS[tower.kind];
		const damage = def.damage * damageFactor(tower.dmgRank);
		tower.cooldown = 1 / (def.fireRate * rateFactor(tower.rateRank));
		if (def.style === "beam") {
			this.hurt(target, damage, def.pierce);
			this.beams.push({
				x1: tower.x,
				y1: tower.y,
				x2: target.x,
				y2: target.y,
				life: .09,
				max: .09
			});
			playSfx("beam");
			return;
		}
		const pred = this.predict(tower, target, def.shotSpeed);
		const dx = pred.x - tower.x;
		const dy = pred.y - tower.y;
		const dist = Math.hypot(dx, dy) || .001;
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
			style: def.style
		});
		playSfx(def.style === "shell" ? "shell" : def.style === "orb" ? "orb" : "bolt");
	}
	predict(tower, creep, shotSpeed) {
		let px = creep.x;
		let py = creep.y;
		for (let i = 0; i < 2; i++) {
			const t = Math.hypot(px - tower.x, py - tower.y) / shotSpeed;
			px = creep.x + creep.vx * t;
			py = creep.y + creep.vy * t;
		}
		return {
			x: px,
			y: py
		};
	}
	tickShots(dt) {
		for (let i = this.shots.length - 1; i >= 0; i--) {
			const shot = this.shots[i];
			const step = shot.speed * dt;
			const travel = Math.min(step, shot.left);
			shot.x += shot.dx * travel;
			shot.y += shot.dy * travel;
			shot.left -= travel;
			if (shot.splash <= 0) {
				const hit = this.creepNear(shot.x, shot.y, .36);
				if (hit) {
					this.impactSingle(shot, hit);
					this.shots.splice(i, 1);
					continue;
				}
			}
			if (shot.left <= 1e-4) {
				this.impact(shot);
				this.shots.splice(i, 1);
			}
		}
		for (let i = this.beams.length - 1; i >= 0; i--) {
			this.beams[i].life -= dt;
			if (this.beams[i].life <= 0) this.beams.splice(i, 1);
		}
	}
	creepNear(x, y, rad) {
		const r2 = rad * rad;
		let best = null;
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
	impact(shot) {
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
			if (!this.reduced) this.shake = Math.min(1, this.shake + .14);
			playSfx("boom");
			return;
		}
		const hit = this.creepNear(shot.x, shot.y, .5);
		if (hit) this.impactSingle(shot, hit);
		else this.burst(shot.x, shot.y, 3, "ash");
	}
	impactSingle(shot, creep) {
		this.hurt(creep, shot.damage, shot.pierce);
		this.applySlow(creep, shot);
		this.burst(shot.x, shot.y, 4, shot.style === "orb" ? "ember" : "brass");
	}
	applySlow(creep, shot) {
		if (shot.slow <= 0) return;
		const factor = 1 - shot.slow;
		if (factor < creep.slowFactor) creep.slowFactor = factor;
		creep.slowLeft = Math.max(creep.slowLeft, shot.slowDur);
	}
	hurt(creep, amount, pierce) {
		if (!creep.alive) return;
		const reduction = creep.armor * (1 - pierce);
		creep.hp -= amount * (1 - reduction);
		creep.flash = .1;
		if (creep.hp <= 0) {
			creep.alive = false;
			this.gold += creep.gold;
			this.kills += 1;
			this.float(creep.x, creep.y - .15, `+${creep.gold}`, "gold");
			this.burst(creep.x, creep.y, creep.kind === "boss" ? 20 : 8, "ember");
			playSfx("kill");
			if (creep.kind === "boss" && !this.reduced) this.shake = Math.min(1, this.shake + .55);
		}
	}
	sweep() {
		for (let i = this.creeps.length - 1; i >= 0; i--) if (!this.creeps[i].alive) this.creeps.splice(i, 1);
	}
	tickFx(dt) {
		for (let i = this.particles.length - 1; i >= 0; i--) {
			const particle = this.particles[i];
			particle.life -= dt;
			if (particle.life <= 0) {
				this.particles.splice(i, 1);
				continue;
			}
			particle.x += particle.vx * dt;
			particle.y += particle.vy * dt;
			particle.vy += .35 * dt;
		}
		for (let i = this.floaters.length - 1; i >= 0; i--) {
			const floater = this.floaters[i];
			floater.life -= dt;
			if (floater.life <= 0) {
				this.floaters.splice(i, 1);
				continue;
			}
			floater.y -= dt * .45;
		}
		this.shake *= Math.exp(-dt * 6);
		if (this.reduced || this.shake < .02) {
			this.shakeX = 0;
			this.shakeY = 0;
			this.shake = this.reduced ? 0 : this.shake;
		} else {
			this.shakeX = (Math.random() - .5) * this.shake * 7;
			this.shakeY = (Math.random() - .5) * this.shake * 7;
		}
	}
	burst(x, y, count, tone) {
		const n = this.reduced ? Math.ceil(count / 3) : count;
		for (let i = 0; i < n; i++) {
			if (this.particles.length > 260) this.particles.shift();
			const angle = Math.random() * Math.PI * 2;
			const speed = .35 + Math.random() * 1.7;
			const life = .28 + Math.random() * .35;
			this.particles.push({
				x,
				y,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed,
				life,
				max: life,
				size: .05 + Math.random() * .07,
				tone
			});
		}
	}
	float(x, y, text, tone) {
		if (this.floaters.length > 36) this.floaters.shift();
		this.floaters.push({
			x,
			y,
			text,
			life: .85,
			max: .85,
			tone
		});
	}
	emitNow() {
		this.sig = this.signature();
		for (const fn of this.listeners) fn();
	}
	maybeEmit() {
		const next = this.signature();
		if (next === this.sig) return;
		this.sig = next;
		for (const fn of this.listeners) fn();
	}
	signature() {
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
			this.towers.length
		].join("|");
	}
};
var ICONS = {
	ballista: Crosshair,
	mortar: Bomb,
	lance: Sword,
	cinder: Flame
};
function useSim() {
	const ref = (0, import_react.useRef)(null);
	if (!ref.current) ref.current = new Sim();
	const sim = ref.current;
	const [hud, setHud] = (0, import_react.useState)(() => sim.snapshot());
	(0, import_react.useEffect)(() => sim.subscribe(() => setHud(sim.snapshot())), [sim]);
	return {
		sim,
		hud
	};
}
function SendaGame() {
	const { sim, hud } = useSim();
	const boardRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const layoutRef = (0, import_react.useRef)({
		cell: 32,
		ox: 0,
		oy: 0
	});
	const [muted, setMutedState] = (0, import_react.useState)(false);
	const [lifeHit, setLifeHit] = (0, import_react.useState)(false);
	const livesRef = (0, import_react.useRef)(hud.lives);
	const playing = hud.phase === "prep" || hud.phase === "combat";
	(0, import_react.useEffect)(() => {
		if (hud.lives < livesRef.current) {
			setLifeHit(true);
			const timer = window.setTimeout(() => setLifeHit(false), 280);
			livesRef.current = hud.lives;
			return () => window.clearTimeout(timer);
		}
		livesRef.current = hud.lives;
	}, [hud.lives]);
	(0, import_react.useEffect)(() => {
		sim.hydrate();
		sim.setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
		window.__senda = sim;
		const onVis = () => {
			if (document.visibilityState === "visible") resumeAudio();
		};
		document.addEventListener("visibilitychange", onVis);
		const board = boardRef.current;
		const canvas = canvasRef.current;
		let frame = 0;
		let last = performance.now();
		const loop = (now) => {
			const raw = (now - last) / 1e3;
			last = now;
			sim.frame(raw);
			if (board && canvas) {
				const rect = board.getBoundingClientRect();
				const dpr = Math.min(2, window.devicePixelRatio || 1);
				const w = Math.max(1, Math.floor(rect.width));
				const h = Math.max(1, Math.floor(rect.height));
				const bw = Math.floor(w * dpr);
				const bh = Math.floor(h * dpr);
				if (canvas.width !== bw || canvas.height !== bh) {
					canvas.width = bw;
					canvas.height = bh;
				}
				const ctx = canvas.getContext("2d");
				if (ctx) {
					ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
					const layout = computeLayout(w, h);
					layoutRef.current = layout;
					draw(ctx, sim, layout, w, h);
				}
			}
			frame = requestAnimationFrame(loop);
		};
		frame = requestAnimationFrame(loop);
		return () => {
			cancelAnimationFrame(frame);
			document.removeEventListener("visibilitychange", onVis);
		};
	}, [sim]);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			if (event.target?.closest("button")) return;
			if (event.key === "1") sim.choose("ballista");
			else if (event.key === "2") sim.choose("mortar");
			else if (event.key === "3") sim.choose("lance");
			else if (event.key === "4") sim.choose("cinder");
			else if (event.key === "Escape") sim.choose(null);
			else if (event.key === "p" || event.key === "P") sim.togglePause();
			else if (event.key === "f" || event.key === "F") sim.toggleSpeed();
			else if (event.key === " ") {
				event.preventDefault();
				sim.launch();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [sim]);
	function cellFromEvent(event) {
		const canvas = canvasRef.current;
		const layout = layoutRef.current;
		if (!canvas || layout.cell <= 0) return null;
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		return {
			c: Math.floor((x - layout.ox) / layout.cell),
			r: Math.floor((y - layout.oy) / layout.cell)
		};
	}
	function onPointerDown(event) {
		unlockAudio();
		const cell = cellFromEvent(event);
		if (!cell) return;
		sim.pointer(cell.c, cell.r);
	}
	function onPointerMove(event) {
		const cell = cellFromEvent(event);
		if (!cell) return;
		sim.hover(cell.c, cell.r);
	}
	const waveLabel = hud.phase === "victory" ? hud.total : Math.min(hud.total, hud.wave + 1);
	const launchLabel = hud.phase === "combat" ? "Oleada en curso" : hud.auto ? hud.prepBonus > 0 ? `Adelantar +${hud.prepBonus} oro` : "Oleada en camino" : "Lanzar oleada";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "app-shell",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "topbar",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "brand",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "Valle en ascuas"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "wordmark",
						children: "Senda Ígnea"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "stats",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: lifeHit ? "chip lives hit" : "chip lives",
							title: "Vidas",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { "aria-hidden": true }),
								hud.lives,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "vidas"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "chip gold",
							title: "Oro",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { "aria-hidden": true }),
								hud.gold,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "oro"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "chip wave",
							children: [
								waveLabel,
								"/",
								hud.total,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "oleada"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "tools",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "icon-btn",
							"aria-label": muted ? "Activar sonido" : "Silenciar",
							"aria-pressed": muted,
							onClick: () => {
								unlockAudio();
								const next = !isMuted();
								setMuted(next);
								setMutedState(next);
								if (!next) playSfx("click");
							},
							children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { "aria-hidden": true }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { "aria-hidden": true })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "icon-btn",
							disabled: !playing,
							"aria-pressed": hud.paused,
							"aria-label": hud.paused ? "Reanudar" : "Pausa",
							onClick: () => {
								unlockAudio();
								sim.togglePause();
							},
							children: hud.paused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { "aria-hidden": true }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { "aria-hidden": true })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "icon-btn",
							disabled: !playing,
							"aria-pressed": hud.speed === 2,
							"aria-label": hud.speed === 2 ? "Velocidad normal" : "Velocidad doble",
							onClick: () => {
								unlockAudio();
								sim.toggleSpeed();
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FastForward, { "aria-hidden": true }),
								"×",
								hud.speed
							]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "stage",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "board",
				ref: boardRef,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
						ref: canvasRef,
						className: "board-canvas",
						role: "application",
						"aria-label": "Campo de batalla. Toca una casilla libre para construir o una torre para mejorarla.",
						onPointerDown,
						onPointerMove,
						onPointerLeave: () => sim.clearHover()
					}),
					hud.paused && playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pause-flag",
						children: "Pausa"
					}) : null,
					hud.phase === "menu" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overlay",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "card-panel",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "eyebrow",
									children: "Defensa de torres"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "La senda arde" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "lede",
									children: "Planta torres junto al camino de brasas. El oro cae con cada baja. Mejora el daño o la cadencia antes de que el heraldo llegue a la puerta."
								}),
								hud.best > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "record",
									children: [
										"Récord: ",
										hud.best === hud.total ? "victoria" : hud.best === 1 ? "1 oleada" : `${hud.best} oleadas`,
										hud.wins > 0 ? ` · ${hud.wins} ${hud.wins === 1 ? "victoria" : "victorias"}` : ""
									]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "primary",
									onClick: () => {
										unlockAudio();
										sim.begin();
									},
									children: "Defender la puerta"
								})
							]
						})
					}) : null,
					hud.phase === "victory" || hud.phase === "defeat" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overlay",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "card-panel",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "eyebrow",
									children: hud.phase === "victory" ? "Victoria" : "Derrota"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: hud.phase === "victory" ? "El valle resiste" : "La puerta cedió" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "lede",
									children: hud.phase === "victory" ? "El heraldo cayó. La puerta sigue en pie." : `Las brasas cruzaron en la oleada ${hud.wave + 1}. La senda queda abierta.`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "end-stats",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: hud.phase === "victory" ? hud.total : hud.wave }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Superadas" })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: hud.kills }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Bajas" })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: hud.leaked }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cruzaron" })] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "primary",
									onClick: () => {
										unlockAudio();
										sim.restart();
									},
									children: "Reintentar"
								})
							]
						})
					}) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "dock",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "launch",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "primary",
							disabled: hud.phase !== "prep",
							onClick: () => {
								unlockAudio();
								sim.launch();
							},
							children: playing ? launchLabel : "En espera"
						}), playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "roster",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [hud.rosterLabel, "."] }),
								" ",
								hud.roster,
								hud.phase === "combat" ? ` · ${hud.creeps} en pie` : "",
								hud.auto && hud.phase === "prep" ? ` · sale en ${hud.prepLeft}s` : ""
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "roster",
							children: "Diez oleadas. Cuatro torres. Una puerta."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "shop",
						children: TOWER_ORDER.map((kind, index) => {
							const def = TOWERS[kind];
							const Icon = ICONS[kind];
							const active = hud.placing === kind;
							const broke = hud.gold < def.cost && !active;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: active ? "tower-card on" : "tower-card",
								disabled: !playing || broke,
								title: def.blurb,
								onClick: () => {
									unlockAudio();
									sim.choose(kind);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tower-ico",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { "aria-hidden": true })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "tower-copy",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
										index + 1,
										". ",
										def.name
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [def.cost, " oro"] })]
								})]
							}, kind);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "hint",
						"aria-live": "polite",
						children: hud.hint || "Toca una torre colocada para mejorar daño, cadencia o prioridad."
					}),
					hud.selection ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "inspector",
						"aria-label": `${hud.selection.name} seleccionada`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: hud.selection.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["alcance ", hud.selection.range.toFixed(1)] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: hud.selection.blurb }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "upgrade",
								disabled: hud.selection.dmgCost === null || hud.gold < (hud.selection.dmgCost ?? 0),
								onClick: () => sim.upgrade("dmg"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Daño" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [hud.selection.damage, hud.selection.nextDamage !== null ? ` → ${hud.selection.nextDamage}` : " al máximo"] })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ranks, { value: hud.selection.dmgRank }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: hud.selection.dmgCost === null ? "Máx" : `${hud.selection.dmgCost}` })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "upgrade",
								disabled: hud.selection.rateCost === null || hud.gold < (hud.selection.rateCost ?? 0),
								onClick: () => sim.upgrade("rate"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Cadencia" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
										hud.selection.rate,
										"/s",
										hud.selection.nextRate !== null ? ` → ${hud.selection.nextRate}/s` : " al máximo"
									] })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ranks, { value: hud.selection.rateRank }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: hud.selection.rateCost === null ? "Máx" : `${hud.selection.rateCost}` })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "row-actions",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "ghost",
									title: TARGET_HINT[hud.selection.mode],
									onClick: () => sim.cycleTarget(),
									children: TARGET_LABEL[hud.selection.mode]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "ghost sell",
									onClick: () => sim.sell(),
									children: ["Vender +", hud.selection.sell]
								})]
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "keys",
						children: "1–4 torres · espacio oleada · P pausa · F velocidad"
					})
				]
			})]
		})]
	});
}
function Ranks({ value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "ranks",
		"aria-label": `nivel ${value} de 3`,
		children: Array.from({ length: 3 }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: index < value ? "pip on" : "pip" }, index))
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SendaGame, {});
}
//#endregion
export { Home as component };
