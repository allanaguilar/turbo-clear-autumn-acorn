import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  Bomb,
  Coins,
  Crosshair,
  FastForward,
  Flame,
  Heart,
  Pause,
  Play,
  Sword,
  Volume2,
  VolumeX,
} from "lucide-react";
import { MAX_RANK, TARGET_HINT, TARGET_LABEL, TOWER_ORDER, TOWERS, type TowerKind } from "@/game/content";
import { computeLayout, draw, type Layout } from "@/game/draw";
import { isMuted, playSfx, resumeAudio, setMuted, unlockAudio } from "@/game/audio";
import { Sim, type Hud } from "@/game/sim";

const ICONS = {
  ballista: Crosshair,
  mortar: Bomb,
  lance: Sword,
  cinder: Flame,
} as const;

function useSim(): { sim: Sim; hud: Hud } {
  const ref = useRef<Sim | null>(null);
  if (!ref.current) ref.current = new Sim();
  const sim = ref.current;
  const [hud, setHud] = useState<Hud>(() => sim.snapshot());
  useEffect(() => sim.subscribe(() => setHud(sim.snapshot())), [sim]);
  return { sim, hud };
}

export function SendaGame() {
  const { sim, hud } = useSim();
  const boardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layoutRef = useRef<Layout>({ cell: 32, ox: 0, oy: 0 });
  const [muted, setMutedState] = useState(false);
  const [lifeHit, setLifeHit] = useState(false);
  const livesRef = useRef(hud.lives);
  const playing = hud.phase === "prep" || hud.phase === "combat";

  useEffect(() => {
    if (hud.lives < livesRef.current) {
      setLifeHit(true);
      const timer = window.setTimeout(() => setLifeHit(false), 280);
      livesRef.current = hud.lives;
      return () => window.clearTimeout(timer);
    }
    livesRef.current = hud.lives;
  }, [hud.lives]);

  useEffect(() => {
    sim.hydrate();
    sim.setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    (window as unknown as { __senda?: Sim }).__senda = sim;
    const onVis = () => {
      if (document.visibilityState === "visible") resumeAudio();
    };
    document.addEventListener("visibilitychange", onVis);
    const board = boardRef.current;
    const canvas = canvasRef.current;
    let frame = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const raw = (now - last) / 1000;
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

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("button")) return;
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

  function cellFromEvent(event: PointerEvent<HTMLCanvasElement>): { c: number; r: number } | null {
    const canvas = canvasRef.current;
    const layout = layoutRef.current;
    if (!canvas || layout.cell <= 0) return null;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return {
      c: Math.floor((x - layout.ox) / layout.cell),
      r: Math.floor((y - layout.oy) / layout.cell),
    };
  }

  function onPointerDown(event: PointerEvent<HTMLCanvasElement>) {
    unlockAudio();
    const cell = cellFromEvent(event);
    if (!cell) return;
    sim.pointer(cell.c, cell.r);
  }

  function onPointerMove(event: PointerEvent<HTMLCanvasElement>) {
    const cell = cellFromEvent(event);
    if (!cell) return;
    sim.hover(cell.c, cell.r);
  }

  const waveLabel = hud.phase === "victory" ? hud.total : Math.min(hud.total, hud.wave + 1);
  const launchLabel =
    hud.phase === "combat"
      ? "Oleada en curso"
      : hud.auto
        ? hud.prepBonus > 0
          ? `Adelantar +${hud.prepBonus} oro`
          : "Oleada en camino"
        : "Lanzar oleada";

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <p className="eyebrow">Valle en ascuas</p>
          <h1 className="wordmark">Senda Ígnea</h1>
        </div>
        <div className="stats">
          <span className={lifeHit ? "chip lives hit" : "chip lives"} title="Vidas">
            <Heart aria-hidden />
            {hud.lives}
            <span className="sr-only">vidas</span>
          </span>
          <span className="chip gold" title="Oro">
            <Coins aria-hidden />
            {hud.gold}
            <span className="sr-only">oro</span>
          </span>
          <span className="chip wave">
            {waveLabel}/{hud.total}
            <span className="sr-only">oleada</span>
          </span>
        </div>
        <div className="tools">
          <button
            type="button"
            className="icon-btn"
            aria-label={muted ? "Activar sonido" : "Silenciar"}
            aria-pressed={muted}
            onClick={() => {
              unlockAudio();
              const next = !isMuted();
              setMuted(next);
              setMutedState(next);
              if (!next) playSfx("click");
            }}
          >
            {muted ? <VolumeX aria-hidden /> : <Volume2 aria-hidden />}
          </button>
          <button
            type="button"
            className="icon-btn"
            disabled={!playing}
            aria-pressed={hud.paused}
            aria-label={hud.paused ? "Reanudar" : "Pausa"}
            onClick={() => {
              unlockAudio();
              sim.togglePause();
            }}
          >
            {hud.paused ? <Play aria-hidden /> : <Pause aria-hidden />}
          </button>
          <button
            type="button"
            className="icon-btn"
            disabled={!playing}
            aria-pressed={hud.speed === 2}
            aria-label={hud.speed === 2 ? "Velocidad normal" : "Velocidad doble"}
            onClick={() => {
              unlockAudio();
              sim.toggleSpeed();
            }}
          >
            <FastForward aria-hidden />
            ×{hud.speed}
          </button>
        </div>
      </header>

      <div className="stage">
        <div className="board" ref={boardRef}>
          <canvas
            ref={canvasRef}
            className="board-canvas"
            role="application"
            aria-label="Campo de batalla. Toca una casilla libre para construir o una torre para mejorarla."
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerLeave={() => sim.clearHover()}
          />
          {hud.paused && playing ? <div className="pause-flag">Pausa</div> : null}
          {hud.phase === "menu" ? (
            <div className="overlay">
              <section className="card-panel">
                <p className="eyebrow">Defensa de torres</p>
                <h2>La senda arde</h2>
                <p className="lede">
                  Planta torres junto al camino de brasas. El oro cae con cada baja. Mejora el daño o la
                  cadencia antes de que el heraldo llegue a la puerta.
                </p>
                {hud.best > 0 ? (
                  <p className="record">
                    Récord: {hud.best === hud.total ? "victoria" : hud.best === 1 ? "1 oleada" : `${hud.best} oleadas`}
                    {hud.wins > 0 ? ` · ${hud.wins} ${hud.wins === 1 ? "victoria" : "victorias"}` : ""}
                  </p>
                ) : null}
                <button
                  type="button"
                  className="primary"
                  onClick={() => {
                    unlockAudio();
                    sim.begin();
                  }}
                >
                  Defender la puerta
                </button>
              </section>
            </div>
          ) : null}
          {hud.phase === "victory" || hud.phase === "defeat" ? (
            <div className="overlay">
              <section className="card-panel">
                <p className="eyebrow">{hud.phase === "victory" ? "Victoria" : "Derrota"}</p>
                <h2>{hud.phase === "victory" ? "El valle resiste" : "La puerta cedió"}</h2>
                <p className="lede">
                  {hud.phase === "victory"
                    ? "El heraldo cayó. La puerta sigue en pie."
                    : `Las brasas cruzaron en la oleada ${hud.wave + 1}. La senda queda abierta.`}
                </p>
                <div className="end-stats">
                  <div>
                    <strong>{hud.phase === "victory" ? hud.total : hud.wave}</strong>
                    <span>Superadas</span>
                  </div>
                  <div>
                    <strong>{hud.kills}</strong>
                    <span>Bajas</span>
                  </div>
                  <div>
                    <strong>{hud.leaked}</strong>
                    <span>Cruzaron</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="primary"
                  onClick={() => {
                    unlockAudio();
                    sim.restart();
                  }}
                >
                  Reintentar
                </button>
              </section>
            </div>
          ) : null}
        </div>

        <aside className="dock">
          <div className="launch">
            <button
              type="button"
              className="primary"
              disabled={hud.phase !== "prep"}
              onClick={() => {
                unlockAudio();
                sim.launch();
              }}
            >
              {playing ? launchLabel : "En espera"}
            </button>
            {playing ? (
              <p className="roster">
                <b>{hud.rosterLabel}.</b> {hud.roster}
                {hud.phase === "combat" ? ` · ${hud.creeps} en pie` : ""}
                {hud.auto && hud.phase === "prep" ? ` · sale en ${hud.prepLeft}s` : ""}
              </p>
            ) : (
              <p className="roster">Diez oleadas. Cuatro torres. Una puerta.</p>
            )}
          </div>

          <div className="shop">
            {TOWER_ORDER.map((kind, index) => {
              const def = TOWERS[kind];
              const Icon = ICONS[kind];
              const active = hud.placing === kind;
              const broke = hud.gold < def.cost && !active;
              return (
                <button
                  key={kind}
                  type="button"
                  className={active ? "tower-card on" : "tower-card"}
                  disabled={!playing || broke}
                  title={def.blurb}
                  onClick={() => {
                    unlockAudio();
                    sim.choose(kind as TowerKind);
                  }}
                >
                  <span className="tower-ico">
                    <Icon aria-hidden />
                  </span>
                  <span className="tower-copy">
                    <strong>
                      {index + 1}. {def.name}
                    </strong>
                    <span>{def.cost} oro</span>
                  </span>
                </button>
              );
            })}
          </div>

          <p className="hint" aria-live="polite">
            {hud.hint || "Toca una torre colocada para mejorar daño, cadencia o prioridad."}
          </p>

          {hud.selection ? (
            <section className="inspector" aria-label={`${hud.selection.name} seleccionada`}>
              <header>
                <h3>{hud.selection.name}</h3>
                <span>alcance {hud.selection.range.toFixed(1)}</span>
              </header>
              <p>{hud.selection.blurb}</p>
              <button
                type="button"
                className="upgrade"
                disabled={hud.selection.dmgCost === null || hud.gold < (hud.selection.dmgCost ?? 0)}
                onClick={() => sim.upgrade("dmg")}
              >
                <span>
                  <b>Daño</b>
                  <small>
                    {hud.selection.damage}
                    {hud.selection.nextDamage !== null ? ` → ${hud.selection.nextDamage}` : " al máximo"}
                  </small>
                </span>
                <Ranks value={hud.selection.dmgRank} />
                <em>{hud.selection.dmgCost === null ? "Máx" : `${hud.selection.dmgCost}`}</em>
              </button>
              <button
                type="button"
                className="upgrade"
                disabled={hud.selection.rateCost === null || hud.gold < (hud.selection.rateCost ?? 0)}
                onClick={() => sim.upgrade("rate")}
              >
                <span>
                  <b>Cadencia</b>
                  <small>
                    {hud.selection.rate}/s
                    {hud.selection.nextRate !== null ? ` → ${hud.selection.nextRate}/s` : " al máximo"}
                  </small>
                </span>
                <Ranks value={hud.selection.rateRank} />
                <em>{hud.selection.rateCost === null ? "Máx" : `${hud.selection.rateCost}`}</em>
              </button>
              <div className="row-actions">
                <button
                  type="button"
                  className="ghost"
                  title={TARGET_HINT[hud.selection.mode]}
                  onClick={() => sim.cycleTarget()}
                >
                  {TARGET_LABEL[hud.selection.mode]}
                </button>
                <button type="button" className="ghost sell" onClick={() => sim.sell()}>
                  Vender +{hud.selection.sell}
                </button>
              </div>
            </section>
          ) : null}

          <p className="keys">1–4 torres · espacio oleada · P pausa · F velocidad</p>
        </aside>
      </div>
    </main>
  );
}

function Ranks({ value }: { value: number }) {
  return (
    <span className="ranks" aria-label={`nivel ${value} de ${MAX_RANK}`}>
      {Array.from({ length: MAX_RANK }, (_, index) => (
        <span key={index} className={index < value ? "pip on" : "pip"} />
      ))}
    </span>
  );
}
