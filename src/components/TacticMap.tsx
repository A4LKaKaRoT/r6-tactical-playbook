import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as RPointerEvent } from 'react';
import type { Floor, Marker, Tactic } from '../types';
import { getMap } from '../lib/queries';
import { mapFloorUrl } from '../lib/paths';
import { MARKER_KINDS, playerColor } from '../lib/colors';
import { useApp } from '../lib/store';
import { assetUrl } from '../lib/paths';
import { addCustomMarker, clearCustomMarkers } from '../lib/storage';

interface Props {
  tactic: Tactic;
  /** Optional: nur Marker bestimmter Slots zeigen. */
  initialSlots?: number[];
  compact?: boolean;
  onFloorChange?: (floor: string) => void;
  /** Höhe der Bühne in px (überschreibt das Seitenverhältnis). */
  tall?: boolean;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 6;

interface ZoomedImage {
  src: string;
  /** Sichtbarer Ausschnitt in Prozent der Originaldatei (0–100). */
  box: { x: number; y: number; w: number; h: number };
}

interface Pt { x: number; y: number }

/**
 * Kartendarstellung mit Zoom/Pan (Mausrad, +/- und Touch-Pinch), Ebenenwechsel,
 * Markerfiltern und eigenen Markern.
 *
 * Koordinaten der Marker sind Prozentwerte der blueprint-Datei (0–100), nicht Pixel.
 *
 * Wichtig für die Lesbarkeit:
 * - Der Zoom skaliert Bild UND Markerpositionen (ein Layer).
 * - Die Marker selbst werden mit `--mk: 1/zoom` invers skaliert, wachsen also
 *   beim Hineinzoomen NICHT mit und bleiben in Bildschirm-Pixeln konstant.
 * - Labels skalieren identisch mit.
 */
export default function TacticMap({ tactic, compact = false, onFloorChange, tall = false }: Props) {
  const map = getMap(tactic.map);
  const { customMarkers, reloadCustomMarkers } = useApp();
  const floors = useMemo(() => {
    const all = new Set<string>();
    tactic.players.forEach((p) => p.markers.forEach((m) => { all.add(m.floor); if (m.toFloor) all.add(m.toFloor); }));
    if (tactic.attackPlan) all.add(tactic.attackPlan.spawnFloor);
    const available = (map?.floors ?? []) as Floor[];
    const relevant = available.filter((f) => all.has(f));
    return relevant.length ? relevant : available;
  }, [tactic, map]);

  const [floor, setFloor] = useState<Floor>(() => {
    const first = tactic.players[0]?.markers[0]?.floor;
    return (first && floors.includes(first as Floor) ? first : floors[0] ?? '1F') as Floor;
  });
  const [hiddenSlots, setHiddenSlots] = useState<number[]>([]);
  const [hiddenKinds, setHiddenKinds] = useState<string[]>([]);
  const [drawKind, setDrawKind] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(zoom);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  const [pan, setPan] = useState<Pt>({ x: 0, y: 0 });
  const [alwaysLabels, setAlwaysLabels] = useState(false);
  const [imgBroken, setImgBroken] = useState<Record<string, boolean>>({});
  const [grid, setGrid] = useState(false);
  const [dragging, setDragging] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  /* ---- Multi-Touch (Pinch) ---- */
  const pointers = useRef<Map<number, Pt>>(new Map());
  const pinchRef = useRef<{ dist: number; zoom: number; cx: number; cy: number; pan: Pt } | null>(null);
  const lastTapRef = useRef<{ t: number; x: number; y: number } | null>(null);
  const tapRef = useRef<{ t: number; x: number; y: number; moved: boolean; control: boolean } | null>(null);

  useEffect(() => { onFloorChange?.(floor); }, [floor, onFloorChange]);

  /* Marker-Koordinaten sind Prozent der kompletten Blueprint-Datei
     (1600×900). Deshalb wird das Bild 1:1 auf die Bühne gelegt –
     Zoom/Pan verändern nur die Ansicht, nie die Referenz. */
  const img: ZoomedImage = useMemo(
    () => ({ src: mapFloorUrl(tactic.map, floor), box: { x: 0, y: 0, w: 100, h: 100 } }),
    [tactic.map, floor],
  );

  const pctX = (x: number) => ((x - img.box.x) / img.box.w) * 100;
  const pctY = (y: number) => ((y - img.box.y) / img.box.h) * 100;
  const inBox = (x: number, y: number) =>
    x >= img.box.x && x <= img.box.x + img.box.w && y >= img.box.y && y <= img.box.y + img.box.h;

  const myMarkers = customMarkers[tactic.id] ?? [];

  const markers = useMemo(() => {
    const out: (Marker & { slot: number; key: string; color: string })[] = [];
    for (const p of tactic.players) {
      if (hiddenSlots.includes(p.slot)) continue;
      p.markers.forEach((m, i) => {
        if (m.floor !== floor || hiddenKinds.includes(m.kind)) return;
        out.push({ ...m, slot: p.slot, key: `${p.slot}-${i}`, color: playerColor(p.slot) });
      });
    }
    if (tactic.attackPlan && tactic.attackPlan.spawnFloor === floor && !hiddenKinds.includes('spawn')) {
      out.push({
        floor: tactic.attackPlan.spawnFloor, x: tactic.attackPlan.spawnX, y: tactic.attackPlan.spawnY,
        kind: 'spawn', label: tactic.attackPlan.spawn, slot: 0, key: 'spawn', color: '#5b88b3',
      });
    }
    if (tactic.attackPlan?.plant.floor === floor && !hiddenKinds.includes('plant')) {
      out.push({
        floor: tactic.attackPlan.plant.floor, x: tactic.attackPlan.plant.x, y: tactic.attackPlan.plant.y,
        kind: 'plant', label: 'Plant', slot: 0, key: 'plant', color: '#c4703f',
      });
    }
    myMarkers
      .filter((m) => m.floor === floor)
      .forEach((m, i) => out.push({
        floor: m.floor as Floor, x: m.x, y: m.y, kind: m.kind as Marker['kind'],
        label: m.label, slot: 99, key: `custom-${i}`, color: '#8f7bb0',
      }));
    return out;
  }, [tactic, floor, hiddenSlots, hiddenKinds, myMarkers]);

  const site = map?.bombSites.find((s) => s.id === tactic.site);

  /* ------------------------------------------------------------- Zoom/Pan */
  /**
   * Zoomt um einen Ankerpunkt (Bildschirm-% der Bühne) herum. Ohne Anker
   * bleibt die Bildmitte stabil. So fühlt sich Pinch-Zoom nativ an.
   */
  const zoomAt = useCallback((factor: number, anchor?: Pt) => {
    setZoom((prevZoom) => {
      const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prevZoom * factor));
      if (z === prevZoom) return prevZoom;
      const ratio = z / prevZoom;
      setPan((prev) => {
        // Ohne Anker bleibt die Bildmitte stabil, mit Anker der Punkt unter dem Finger/Cursor.
        const ax = anchor ? anchor.x : 50;
        const ay = anchor ? anchor.y : 50;
        const nx = ax - (ax - prev.x) * ratio;
        const ny = ay - (ay - prev.y) * ratio;
        return {
          x: Math.min(0, Math.max(100 - 100 * z, nx)),
          y: Math.min(0, Math.max(100 - 100 * z, ny)),
        };
      });
      return z;
    });
  }, []);

  /* Wheel muss als nativer, NON-passiver Listener hängen: React registriert
     onWheel passiv, dort ist preventDefault() wirkungslos (Seite scrollt mit). */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const r = stage.getBoundingClientRect();
      const anchor = { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 };
      const factor = e.deltaY > 0 ? 0.88 : 1.14;
      zoomAt(factor, anchor);
    };
    stage.addEventListener('wheel', handler, { passive: false });
    return () => stage.removeEventListener('wheel', handler);
  }, [zoomAt]);

  const clampPan = useCallback((p: Pt, z: number): Pt => {
    const minX = 100 - 100 * z;
    return {
      x: Math.min(0, Math.max(minX, p.x)),
      y: Math.min(0, Math.max(minX, p.y)),
    };
  }, []);

  const onPointerDown = (e: RPointerEvent) => {
    if (drawKind) return;
    const stage = stageRef.current;
    if (!stage) return;
    // Bedienelemente über der Karte (Zoom-HUD, Legende, Hinweis) dürfen keinen
    // Drag/Capture starten – sonst schluckt die Bühne deren Klicks.
    if ((e.target as HTMLElement).closest('button, select, input, a, .map-hud, .map-legend')) {
      tapRef.current = { t: Date.now(), x: e.clientX, y: e.clientY, moved: false, control: true };
      return;
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    tapRef.current = { t: Date.now(), x: e.clientX, y: e.clientY, moved: false, control: false };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);

    if (pointers.current.size === 2) {
      // Pinch starten
      const [a, b] = Array.from(pointers.current.values());
      const r = stage.getBoundingClientRect();
      pinchRef.current = {
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        zoom,
        cx: ((a.x + b.x) / 2 - r.left) / r.width * 100,
        cy: ((a.y + b.y) / 2 - r.top) / r.height * 100,
        pan,
      };
      dragRef.current = null;
      setDragging(false);
      return;
    }

    if (pointers.current.size === 1) {
      dragRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
      setDragging(true);
    }
  };

  const onPointerMove = (e: RPointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const stage = stageRef.current;
    if (!stage) return;
    const r = stage.getBoundingClientRect();

    /* --- Zwei Finger: Pinch-Zoom + Zwei-Finger-Pan --- */
    if (pointers.current.size >= 2 && pinchRef.current) {
      const [a, b] = Array.from(pointers.current.values());
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const p0 = pinchRef.current;
      if (p0.dist <= 0) return;
      const target = p0.zoom * (dist / p0.dist);
      const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, target));
      const ratio = z / p0.zoom;
      const cx = ((a.x + b.x) / 2 - r.left) / r.width * 100;
      const cy = ((a.y + b.y) / 2 - r.top) / r.height * 100;
      // Ankerpunkt des Pinch-Starts bleibt unter dem Finger-Mittelpunkt
      const nx = cx - (p0.cx - p0.pan.x) * ratio;
      const ny = cy - (p0.cy - p0.pan.y) * ratio;
      setZoom(z);
      setPan(clampPan({ x: nx, y: ny }, z));
      return;
    }

    /* --- Ein Finger: Pan --- */
    const d = dragRef.current;
    if (!d) return;
    if (tapRef.current && Math.hypot(e.clientX - tapRef.current.x, e.clientY - tapRef.current.y) > 6) {
      tapRef.current.moved = true;
    }
    const dx = ((e.clientX - d.x) / r.width) * 100;
    const dy = ((e.clientY - d.y) / r.height) * 100;
    setPan(clampPan({ x: d.panX + dx, y: d.panY + dy }, zoom));
  };

  const onPointerUp = (e: RPointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchRef.current = null;
    if (pointers.current.size === 0) {
      dragRef.current = null;
      setDragging(false);
    }
  };

  /** Doppeltippen/-klicken zoomt gestuft hinein, beim Maximalzoom zurück auf 1. */
  const handleDoubleTap = (clientX: number, clientY: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    const anchor = { x: ((clientX - r.left) / r.width) * 100, y: ((clientY - r.top) / r.height) * 100 };
    if (zoom >= MAX_ZOOM - 0.01) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } else {
      zoomAt(1.8, anchor);
    }
  };

  /**
   * Doppeltipp/-klick zoomt eine Stufe hinein. Wichtig: nur echte Taps auf der
   * Karte zählen – Klicks auf +/−/Fokus oder ein kurzes Ziehen dürfen NICHT als
   * Doppeltipp gewertet werden (sonst springt der Zoom bei schnellem Klicken zurück).
   */
  const onStagePointerUpTap = (e: RPointerEvent) => {
    const start = tapRef.current;
    tapRef.current = null;
    if (drawKind || !start || start.control || start.moved) return;
    const now = Date.now();
    if (now - start.t > 320) { lastTapRef.current = null; return; }
    const last = lastTapRef.current;
    const isDouble = last && now - last.t < 320 && Math.hypot(e.clientX - last.x, e.clientY - last.y) < 26;
    if (isDouble) {
      lastTapRef.current = null;
      handleDoubleTap(e.clientX, e.clientY);
    } else {
      lastTapRef.current = { t: now, x: e.clientX, y: e.clientY };
    }
  };

  const reset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  /**
   * Rahmt die Marker der aktuellen Etage: Die Blueprints sind 1600×900, die
   * bebaute Fläche belegt aber oft nur 30–50 % davon. Ohne Fokus wirken die
   * Marker wie ein Klumpen in der Bildmitte.
   */
  const focusMarkers = useCallback(() => {
    const pts = markers.filter((m) => inBox(m.x, m.y));
    if (!pts.length) { setZoom(1); setPan({ x: 0, y: 0 }); return; }
    const xs = pts.map((m) => m.x);
    const ys = pts.map((m) => m.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    // Rand um die Marker, damit Labels nicht am Bildrand kleben
    const pad = 14;
    const w = Math.max(maxX - minX + pad * 2, 18);
    const h = Math.max(maxY - minY + pad * 2, 12);
    const z = Math.min(MAX_ZOOM, Math.max(1, Math.min(100 / w, 100 / h)));
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    setZoom(z);
    setPan(clampPan({ x: 50 - cx * z, y: 50 - cy * z }, z));
  }, [markers, inBox, clampPan]);

  const onStageClick = useCallback((e: React.MouseEvent) => {
    if (!drawKind || !stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 100;
    const ny = ((e.clientY - r.top) / r.height) * 100;
    // Bildschirm -> Original-Datei (Zoom/Pan rückrechnen)
    const fileX = img.box.x + ((nx - pan.x) / zoom / 100) * img.box.w;
    const fileY = img.box.y + ((ny - pan.y) / zoom / 100) * img.box.h;
    if (fileX < 0 || fileX > 100 || fileY < 0 || fileY > 100) return;
    const label = window.prompt(`Beschriftung für "${MARKER_KINDS.find((k) => k.key === drawKind)?.label}"?`, '');
    if (label === null) return;
    addCustomMarker(tactic.id, {
      floor, x: Math.round(fileX * 10) / 10, y: Math.round(fileY * 10) / 10,
      label: label || (site ? `${site.short} – eigener Marker` : 'Eigener Marker'), kind: drawKind,
    });
    reloadCustomMarkers();
    setDrawKind(null);
  }, [drawKind, floor, zoom, pan, img, tactic.id, reloadCustomMarkers, site]);

  /**
   * Beim Öffnen direkt auf das Setup zoomen: Auf den 1600×900-Blueprints liegt
   * die bebaute Fläche oft nur in der Mitte, ungezoomt überlappen sich die Marker
   * zu einem Haufen. Einmalig, danach bestimmt der Nutzer die Ansicht.
   */
  const autoFocused = useRef(false);
  useEffect(() => {
    if (autoFocused.current || !stageRef.current) return;
    if (!markers.length) return;
    autoFocused.current = true;
    const xs = markers.map((m) => m.x);
    const ys = markers.map((m) => m.y);
    const w = Math.max(...xs) - Math.min(...xs) + 28;
    const h = Math.max(...ys) - Math.min(...ys) + 24;
    if (Math.min(100 / w, 100 / h) < 1.35) return; // Setup füllt die Karte bereits
    focusMarkers();
  }, [markers, focusMarkers]);

  const toggle = (list: number[], v: number) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  /** Inverse Skalierung: Marker bleiben optisch gleich groß, egal wie weit gezoomt. */
  const inv = 1 / zoom;

  return (
    <div className={compact ? 'mapblock compact' : 'panel mapblock'} style={{ minWidth: 0, ...(compact ? undefined : { padding: 10 }) }}>
      {/* Kopfzeile: Etagen links, Spielerfilter rechts */}
      <div className="map-head row-tight">
        <div className="pill-group" role="tablist" aria-label="Etage">
          {floors.map((f) => (
            <button key={f} className={f === floor ? 'on' : ''} onClick={() => { setFloor(f); reset(); }} aria-selected={f === floor}>
              {f === 'B' ? 'KG' : f}
            </button>
          ))}
        </div>
        <span className="spacer" />
        <div className="pill-group" aria-label="Spieler-Filter">
          {tactic.players.map((p) => {
            const on = !hiddenSlots.includes(p.slot);
            return (
              <button
                key={p.slot}
                className={on ? 'on' : ''}
                style={on ? { color: playerColor(p.slot) } : undefined}
                onClick={() => setHiddenSlots((l) => toggle(l, p.slot))}
                title={`Marker von ${p.playerName} ein-/ausblenden`}
                aria-pressed={on}
              >
                P{p.slot}
              </button>
            );
          })}
        </div>
      </div>

      <div
        ref={stageRef}
        className={`mapstage${drawKind ? ' drawing' : ''}${dragging ? ' dragging' : ''}`}
        style={tall ? { aspectRatio: 'auto', minHeight: 420 } : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => { onStagePointerUpTap(e); onPointerUp(e); }}
        onPointerCancel={onPointerUp}
        onPointerLeave={(e) => { if (pointers.current.size === 1) onPointerUp(e); }}
        onClick={onStageClick}
        onDoubleClick={(e) => { if (!drawKind) handleDoubleTap(e.clientX, e.clientY); }}
      >
        <div className="mapview">
          {/* Der Layer wird gezoomt; die Marker darin werden invers skaliert. */}
          <div
            style={{
              position: 'absolute', inset: 0,
              transform: `translate(${pan.x}%, ${pan.y}%) scale(${zoom})`,
              transformOrigin: '0 0',
              willChange: dragging || pinchRef.current ? 'transform' : undefined,
            }}
          >
            {!imgBroken[floor] && (
              <img
                className="floorimg"
                src={img.src}
                onError={() => setImgBroken((prev) => ({ ...prev, [floor]: true }))}
                alt={`${map?.name ?? tactic.map} – Etage ${floor}`}
                draggable={false}
                style={{
                  width: `${(100 / img.box.w) * 100}%`,
                  height: `${(100 / img.box.h) * 100}%`,
                  left: `${(-img.box.x / img.box.w) * 100}%`,
                  top: `${(-img.box.y / img.box.h) * 100}%`,
                  objectFit: 'fill',
                }}
              />
            )}
            {imgBroken[floor] && (
              <div className="center" style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', padding: 20 }}>
                <div className="warnbox" style={{ maxWidth: 380 }}>
                  <b>Blueprint fehlt:</b> <code>public/maps/{tactic.map}/floor-{floor}.webp</code> ist nicht vorhanden
                  oder konnte nicht geladen werden ({assetUrl(`maps/${tactic.map}/floor-${floor}.webp`)}).<br />
                  Marker bleiben sichtbar – Bild über <code>npm run assets:fetch</code> oder manuell ergänzen.
                </div>
              </div>
            )}
            {grid && (
              <div
                className="marker-layer"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(233,236,230,.07) 1px, transparent 1px),' +
                    'linear-gradient(to bottom, rgba(233,236,230,.07) 1px, transparent 1px)',
                  backgroundSize: '5% 8.888%',
                  pointerEvents: 'none',
                }}
              />
            )}
            <div className="marker-layer">
              {markers.filter((m) => inBox(m.x, m.y)).map((m) => (
                <div key={m.key} style={{ ['--mk' as string]: inv }}>
                  <span
                    className={`mk mk-${m.slot === 99 ? 'custom' : m.kind}`}
                    style={{
                      left: `${pctX(m.x)}%`, top: `${pctY(m.y)}%`,
                      boxShadow: `0 0 0 calc(2px * var(--mk,1)) ${m.color}55, 0 1px 3px rgba(0,0,0,.5)`,
                    }}
                    title={`${m.slot === 0 || m.slot === 99 ? '' : `P${m.slot} · `}${m.label}`}
                  >
                    {m.slot > 0 && m.slot < 90 ? m.slot : ''}
                  </span>
                  {(alwaysLabels || zoom >= 3) && (
                    <span
                      className="marker-label"
                      style={{ left: `${pctX(m.x)}%`, top: `calc(${pctY(m.y)}% + ${11 * inv}px)` }}
                    >
                      {m.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HUD: Zoomsteuerung, Reset, Prozentanzeige */}
        <div className="map-hud">
          <button className="btn" onClick={() => zoomAt(1 / 1.35)} title="Herauszoomen" aria-label="Herauszoomen">−</button>
          <span className="zoomval">{Math.round(zoom * 100)}%</span>
          <button className="btn" onClick={() => zoomAt(1.35)} title="Hineinzoomen" aria-label="Hineinzoomen">+</button>
          <button className="btn" onClick={focusMarkers} title="Auf die Marker dieser Etage zoomen" aria-label="Auf Marker fokussieren">Fokus</button>
          <button className="btn" onClick={reset} title="Ganze Karte zeigen" aria-label="Ansicht zurücksetzen">Ganz</button>
        </div>

        <div className="map-legend" aria-hidden="true">
          {MARKER_KINDS.slice(0, 5).map((k) => (
            <span className="legend-row" key={k.key}>
              <i className="legend-dot" style={{ background: k.color }} />
              {k.label.replace(/ \(.*\)/, '')}
            </span>
          ))}
        </div>

        <span className="map-touchhint">2 Finger = Zoom · 1 Finger = Verschieben</span>
      </div>

      {/* Fußzeile: Markerfilter, Labels, Raster, Zeichnen */}
      <div className="map-foot row-tight">
        <div className="pill-group" aria-label="Marker-Typen">
          {MARKER_KINDS.map((k) => (
            <button
              key={k.key}
              className={hiddenKinds.includes(k.key) ? '' : 'on'}
              onClick={() => setHiddenKinds((l) => (l.includes(k.key) ? l.filter((x) => x !== k.key) : [...l, k.key]))}
              title={`${k.label} ein-/ausblenden`}
            >
              <i className="legend-dot" style={{ background: k.color }} />
              {k.short}
            </button>
          ))}
        </div>
        <span className="spacer" />
        <button className="btn btn-sm" onClick={() => setAlwaysLabels((v) => !v)} title="Alle Marker-Beschriftungen dauerhaft einblenden">
          {alwaysLabels ? 'Labels: immer' : 'Labels: Zoom'}
        </button>
        <button className={`btn btn-sm${grid ? ' btn-blue' : ''}`} onClick={() => setGrid((v) => !v)} title="5-%-Raster einblenden">
          Raster
        </button>
        <button
          className={`btn btn-sm${drawKind ? ' btn-primary' : ''}`}
          onClick={() => setDrawKind(drawKind ? null : 'position')}
          title="Eigenen Marker setzen"
        >
          {drawKind ? 'Klick in die Karte …' : 'Marker zeichnen'}
        </button>
        {drawKind && (
          <select className="select" value={drawKind} onChange={(e) => setDrawKind(e.target.value)}>
            {MARKER_KINDS.map((k) => <option key={k.key} value={k.key}>{k.label}</option>)}
          </select>
        )}
        {myMarkers.length > 0 && (
          <button
            className="btn btn-sm btn-danger"
            onClick={() => { clearCustomMarkers(tactic.id); reloadCustomMarkers(); }}
          >
            Eigene ({myMarkers.length}) löschen
          </button>
        )}
      </div>
      <p className="map-note">
        Ziehen = verschieben · Mausrad/Pinch = zoomen · Doppeltipp = Stufe hinein.
        Markerpositionen auf ±3 % geschätzt (Blueprint-Übersichten), im Editor justierbar.
      </p>
    </div>
  );
}
