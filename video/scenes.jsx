// video/scenes.jsx — Orchestrate all scenes in the Stage timeline

const {
  Easing, interpolate, animate, clamp,
  useTime, useTimeline, Sprite, useSprite,
  Phone, Cursor, Icon, Logo, BRAND,
  DashboardScreen, TemplatePickerScreen, ScanPickerScreen,
  ScanningScreen, AutoFillScreen, PreviewSignScreen, DoneScreen,
} = window;

// ─── Scene timings (seconds, absolute) ───────────────────────────────────────
const T = {
  hook:     [0,    3.6],
  intro:    [3.6,  7.0],
  step1:    [7.0,  11.5],
  step2:    [11.5, 17.0],
  step3:    [17.0, 23.0],
  step4:    [23.0, 28.0],
  done:     [28.0, 33.0],
};
const DURATION = 33;

// ─── Background (constant) ───────────────────────────────────────────────────
function Background() {
  const t = useTime();
  // Slow drift for parallax feel
  const drift = Math.sin(t * 0.3) * 20;
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0b1220', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(80% 60% at ${30 + drift * 0.4}% 30%, rgba(37,99,235,0.18) 0%, transparent 60%),
          radial-gradient(70% 60% at ${70 - drift * 0.3}% 80%, rgba(16,185,129,0.12) 0%, transparent 55%),
          linear-gradient(180deg, #0b1220 0%, #0f172a 100%)
        `,
      }} />
      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.07,
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),' +
          'linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        transform: `translate(${drift * 0.2}px, 0)`,
      }} />
    </div>
  );
}

// ─── Small UI primitives ─────────────────────────────────────────────────────
function StepNumber({ n, color = BRAND.blue }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{
        fontSize: 80, fontWeight: 800, lineHeight: 1,
        background: `linear-gradient(180deg, ${color} 0%, ${color}99 100%)`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        letterSpacing: -3,
      }}>0{n}</span>
      <div>
        <p style={{ color: BRAND.mute2, fontSize: 16, fontWeight: 600, letterSpacing: 6, textTransform: 'uppercase' }}>Pasul {n}</p>
        <p style={{ color: '#fff', fontSize: 18, fontWeight: 500, opacity: 0.7 }}>din 4</p>
      </div>
    </div>
  );
}

function BigHeadline({ children, color = '#fff', size = 78 }) {
  return (
    <h1 style={{
      color, fontSize: size, fontWeight: 800, lineHeight: 1.02,
      letterSpacing: -2.5, textWrap: 'balance',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
    }}>{children}</h1>
  );
}

function Caption({ children, color = BRAND.mute2 }) {
  return (
    <p style={{ color, fontSize: 22, fontWeight: 500, lineHeight: 1.45, maxWidth: 540, textWrap: 'pretty' }}>
      {children}
    </p>
  );
}

// ─── PhoneStage: phone with side-panel text + cursor ────────────────────────
// Auto-positions phone on the right; text on the left.
function PhoneStage({ phoneScale = 0.95, phoneX = 1320, phoneY = 540, children, cursor }) {
  return (
    <>
      <div style={{
        position: 'absolute', left: phoneX, top: phoneY,
        transform: `translate(-50%, -50%) scale(${phoneScale})`,
        transformOrigin: 'center center',
        willChange: 'transform',
      }}>
        <Phone>{children}</Phone>
      </div>
      {cursor}
    </>
  );
}

// ─── Animated cursor helper ──────────────────────────────────────────────────
// Tween cursor between waypoints, with optional tap pulses.
// waypoints: [{t, x, y, tap?: boolean}]
function useCursorAt(localTime, waypoints) {
  // find segment
  let wp = waypoints[0];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i], b = waypoints[i + 1];
    if (localTime >= a.t && localTime <= b.t) {
      const span = b.t - a.t;
      const p = span > 0 ? Easing.easeInOutCubic((localTime - a.t) / span) : 0;
      return {
        x: a.x + (b.x - a.x) * p,
        y: a.y + (b.y - a.y) * p,
        tap: false,
      };
    }
  }
  if (localTime >= waypoints[waypoints.length - 1].t) {
    const last = waypoints[waypoints.length - 1];
    return { x: last.x, y: last.y, tap: !!last.tap };
  }
  return { x: wp.x, y: wp.y, tap: false };
}

// ─── SCENE 1: HOOK ───────────────────────────────────────────────────────────
function Scene_Hook() {
  return (
    <Sprite start={T.hook[0]} end={T.hook[1]}>
      {({ progress, localTime }) => {
        const opIn  = clamp(localTime / 0.5, 0, 1);
        const opOut = 1 - clamp((localTime - 3.0) / 0.6, 0, 1);
        const op = Math.min(opIn, opOut);
        const lift = (1 - opIn) * 30;
        const tickerN = Math.floor(interpolate([0, 2.8], [12, 1], Easing.easeOutQuart)(localTime));
        const padNum = String(tickerN).padStart(2, '0');

        return (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: op, transform: `translateY(${lift}px)`,
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}>
            <div style={{ textAlign: 'center', maxWidth: 1700, padding: '0 80px' }}>
              {/* Pill */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 99, padding: '10px 22px', marginBottom: 56,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e', boxShadow: '0 0 12px #f43f5e' }} />
                <span style={{ color: BRAND.mute2, fontSize: 18, fontWeight: 600, letterSpacing: 1 }}>
                  Realitatea unui contract pe hârtie
                </span>
              </div>

              {/* Big stat — single horizontal line with stacked numbers */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 64,
              }}>
                {/* Before — paper */}
                <div style={{ textAlign: 'left' }}>
                  <p style={{ color: BRAND.mute2, fontSize: 22, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 4, marginBottom: 6 }}>Pe hârtie</p>
                  <p style={{
                    fontSize: 180, fontWeight: 800, lineHeight: 0.95, letterSpacing: -5,
                    background: 'linear-gradient(180deg, #f43f5e 0%, #f97316 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    fontVariantNumeric: 'tabular-nums',
                    whiteSpace: 'nowrap',
                  }}>{padNum}<span style={{ fontSize: 70, color: '#f97316', WebkitTextFillColor: '#f97316', marginLeft: 12, fontWeight: 700, letterSpacing: 0 }}>min</span></p>
                </div>

                {/* Arrow */}
                <div style={{
                  fontSize: 80, color: BRAND.mute2, fontWeight: 300,
                  opacity: clamp((localTime - 0.4) / 0.4, 0, 1),
                  transform: `translateX(${(1 - clamp((localTime - 0.4) / 0.4, 0, 1)) * -20}px)`,
                }}>→</div>

                {/* After — RapidAct */}
                <div style={{ textAlign: 'left' }}>
                  <p style={{ color: BRAND.green, fontSize: 22, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 4, marginBottom: 6 }}>Cu RapidAct</p>
                  <p style={{
                    fontSize: 180, fontWeight: 800, lineHeight: 0.95, letterSpacing: -5,
                    background: `linear-gradient(180deg, ${BRAND.green} 0%, #34d399 100%)`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    whiteSpace: 'nowrap',
                  }}>30<span style={{ fontSize: 70, color: '#34d399', WebkitTextFillColor: '#34d399', marginLeft: 12, fontWeight: 700, letterSpacing: 0 }}>sec</span></p>
                </div>
              </div>

              <p style={{
                marginTop: 64, color: BRAND.mute2, fontSize: 30, fontWeight: 500,
                letterSpacing: 0.3, opacity: clamp((localTime - 0.7) / 0.6, 0, 1),
              }}>
                Cât de ușor este să faci un contract cu RapidAct
              </p>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ─── SCENE 2: INTRO with logo + phone reveal ─────────────────────────────────
function Scene_Intro() {
  return (
    <Sprite start={T.intro[0]} end={T.intro[1]}>
      {({ localTime, duration }) => {
        const dur = duration;
        const opIn  = clamp(localTime / 0.5, 0, 1);
        const opOut = 1 - clamp((localTime - (dur - 0.5)) / 0.5, 0, 1);
        const op = Math.min(opIn, opOut);

        // Phone rises from below
        const phoneY = interpolate([0, 1.2], [1500, 540], Easing.easeOutCubic)(localTime);
        const phoneScale = interpolate([0, 1.2, dur - 0.4, dur], [0.7, 0.95, 0.95, 0.92], [Easing.easeOutCubic, Easing.linear, Easing.easeInCubic])(localTime);
        const logoY   = interpolate([0.4, 1.4], [80, 0], Easing.easeOutBack)(localTime);
        const logoOp  = clamp((localTime - 0.4) / 0.6, 0, 1);
        const subOp   = clamp((localTime - 1.6) / 0.6, 0, 1);

        return (
          <>
            <div style={{
              position: 'absolute', left: 0, right: 0, top: 240,
              textAlign: 'center', opacity: op,
            }}>
              <div style={{ opacity: logoOp, transform: `translateY(${logoY}px)` }}>
                <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 130, fontWeight: 800, color: '#fff', letterSpacing: -4 }}>Rapid</span>
                  <span style={{ fontSize: 130, fontWeight: 800, color: BRAND.green, letterSpacing: -4 }}>Act</span>
                  <span style={{ fontSize: 56, fontWeight: 600, color: BRAND.mute2, marginLeft: 4 }}>.ro</span>
                </div>
              </div>
              <p style={{
                marginTop: 16, color: BRAND.mute2, fontSize: 26, fontWeight: 500,
                opacity: subOp, letterSpacing: 0.5,
              }}>
                Contract gata în 4 pași simpli
              </p>
            </div>

            <PhoneStage phoneScale={phoneScale} phoneX={960} phoneY={phoneY + 280}>
              <DashboardScreen />
            </PhoneStage>
          </>
        );
      }}
    </Sprite>
  );
}

// ─── SCENE 3: Step 1 — Choose template ───────────────────────────────────────
function Scene_Step1() {
  return (
    <Sprite start={T.step1[0]} end={T.step1[1]}>
      {({ localTime, duration }) => {
        const dur = duration;
        const opIn  = clamp(localTime / 0.4, 0, 1);
        const opOut = 1 - clamp((localTime - (dur - 0.4)) / 0.4, 0, 1);
        const op = Math.min(opIn, opOut);

        // Cursor path (phone is at x=1320, y=540, scale 0.95 → maps to phone coords)
        // Phone is 410x860, screen content offset ~ 26px from edges.
        // We position the cursor in absolute video coords, but it visually flies inside the phone.
        // Phone bounds in video coords (scale 0.95 → 390x817):
        //   left ~ 1125, top ~ 131
        // Mapping (px on phone screen) → (px in video):
        //   videoX = 1125 + 0.95 * (phoneScreenX + 10 /*inner padding*/)
        //   videoY = 131 + 0.95 * (phoneScreenY + 18)
        const mapX = (px) => 1125 + 0.95 * px;
        const mapY = (py) => 131  + 0.95 * py;

        // Tap "Contract nou" (around y=160 on screen, button center x=80) on Dashboard
        // Then transitions to Template picker at ~2.0s
        // Then taps "Alege" on Închiriere Auto (around y=200 from top of step bar)
        const waypoints = [
          { t: 0.0, x: 1500, y: 800 },
          { t: 0.8, x: mapX(95), y: mapY(220), tap: true }, // tap "Contract nou" card
          { t: 1.4, x: mapX(95), y: mapY(220) }, // hold
          { t: 2.4, x: mapX(280), y: mapY(150) },
          { t: 3.2, x: mapX(340), y: mapY(150), tap: true }, // tap "Alege" on first template
          { t: dur, x: mapX(340), y: mapY(150) },
        ];
        const c = useCursorAt(localTime, waypoints);
        const tap = waypoints.some(w => w.tap && Math.abs(localTime - w.t) < 0.18);

        // Screen state: dashboard until 1.8s, then template picker
        const showTemplates = localTime > 1.8;
        // highlights: on dashboard, highlight button right before/during tap
        const dashHL  = localTime > 0.6 && localTime < 1.4;
        const tplHL   = localTime > 3.0;

        return (
          <>
            {/* Left panel */}
            <div style={{
              position: 'absolute', left: 110, top: 280, opacity: op, transform: `translateY(${(1-op) * 20}px)`,
              maxWidth: 580,
            }}>
              <StepNumber n={1} color={BRAND.blue} />
              <h2 style={{ color: '#fff', fontSize: 64, fontWeight: 800, marginTop: 24, letterSpacing: -1.5, lineHeight: 1.05 }}>
                Alegi <span style={{ color: BRAND.blue }}>tipul</span><br />de contract
              </h2>
              <Caption>
                Templates pre-completate pentru rent-a-car, imobiliare,<br />resurse umane și mai mult.
              </Caption>
            </div>

            <PhoneStage
              phoneScale={0.95}
              phoneX={1320}
              phoneY={540}
              cursor={<Cursor x={c.x} y={c.y} pressed={tap} />}
            >
              {showTemplates ? <TemplatePickerScreen highlight={tplHL} /> : <DashboardScreen tapHighlight={dashHL} />}
            </PhoneStage>
          </>
        );
      }}
    </Sprite>
  );
}

// ─── SCENE 4: Step 2 — Scan CI ───────────────────────────────────────────────
function Scene_Step2() {
  return (
    <Sprite start={T.step2[0]} end={T.step2[1]}>
      {({ localTime, duration }) => {
        const dur = duration;
        const opIn  = clamp(localTime / 0.4, 0, 1);
        const opOut = 1 - clamp((localTime - (dur - 0.4)) / 0.4, 0, 1);
        const op = Math.min(opIn, opOut);

        const mapX = (px) => 1125 + 0.95 * px;
        const mapY = (py) => 131  + 0.95 * py;

        // Cursor: glide in, tap "Act de identitate" (first mode card, ~y=240)
        const waypoints = [
          { t: 0.0, x: mapX(280), y: mapY(450) },
          { t: 0.8, x: mapX(195), y: mapY(245), tap: true },
          { t: dur, x: mapX(195), y: mapY(245) },
        ];
        const c = useCursorAt(localTime, waypoints);
        const tap = Math.abs(localTime - 0.8) < 0.18;

        // Screen: picker for first 1.6s, then scanning
        const showScan = localTime > 1.6;
        const scanProgress = clamp((localTime - 1.8) / 3.2, 0, 1);

        // Zoom in when scanning starts
        const phoneScale = interpolate(
          [0, 1.6, 1.9, dur - 0.4, dur],
          [0.95, 0.95, 1.04, 1.04, 1.0],
          [Easing.linear, Easing.easeOutCubic, Easing.linear, Easing.easeInCubic]
        )(localTime);

        return (
          <>
            <div style={{
              position: 'absolute', left: 110, top: 280, opacity: op, transform: `translateY(${(1-op) * 20}px)`,
              maxWidth: 580,
            }}>
              <StepNumber n={2} color={BRAND.green} />
              <h2 style={{ color: '#fff', fontSize: 64, fontWeight: 800, marginTop: 24, letterSpacing: -1.5, lineHeight: 1.05 }}>
                Scanezi <span style={{ color: BRAND.green }}>CI-ul</span><br />clientului
              </h2>
              <Caption>
                O singură poză. AI-ul extrage numele, CNP-ul, seria,<br />numărul și adresa în câteva secunde.
              </Caption>
              {/* Tech tag, appears while scanning */}
              {showScan && (
                <div style={{
                  marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: 99, padding: '10px 18px',
                  color: BRAND.green, fontSize: 16, fontWeight: 700, letterSpacing: 0.3,
                  opacity: clamp((localTime - 1.8) / 0.6, 0, 1),
                }}>
                  <Icon.Sparkle size={16} color={BRAND.green} /> Powered by GPT-4o
                </div>
              )}
            </div>

            <PhoneStage
              phoneScale={phoneScale}
              phoneX={1320}
              phoneY={540}
              cursor={!showScan && <Cursor x={c.x} y={c.y} pressed={tap} />}
            >
              {showScan ? <ScanningScreen progress={scanProgress} /> : <ScanPickerScreen highlight={localTime > 0.5} />}
            </PhoneStage>
          </>
        );
      }}
    </Sprite>
  );
}

// ─── SCENE 5: Step 3 — Auto-fill ─────────────────────────────────────────────
function Scene_Step3() {
  return (
    <Sprite start={T.step3[0]} end={T.step3[1]}>
      {({ localTime, duration }) => {
        const dur = duration;
        const opIn  = clamp(localTime / 0.4, 0, 1);
        const opOut = 1 - clamp((localTime - (dur - 0.4)) / 0.4, 0, 1);
        const op = Math.min(opIn, opOut);

        // Fields fill one by one between 0.8s and 4.0s
        const fillStep = Math.floor(interpolate([0.8, 4.0], [0, 7], Easing.easeOutCubic)(localTime));

        // Big zoom on phone to highlight fields filling
        const phoneScale = interpolate(
          [0, 0.6, dur - 0.4, dur],
          [1.0, 1.05, 1.05, 1.0],
          [Easing.easeOutCubic, Easing.linear, Easing.easeInCubic]
        )(localTime);

        return (
          <>
            <div style={{
              position: 'absolute', left: 110, top: 240, opacity: op, transform: `translateY(${(1-op) * 20}px)`,
              maxWidth: 600,
            }}>
              <StepNumber n={3} color="#f59e0b" />
              <h2 style={{ color: '#fff', fontSize: 64, fontWeight: 800, marginTop: 24, letterSpacing: -1.5, lineHeight: 1.05 }}>
                AI-ul <span style={{ color: BRAND.green }}>completează</span> totul
              </h2>
              <Caption>
                Câmpurile se umplu singure. Datele firmei vin din profil,<br />mașinile dintr-un click. Tu doar verifici.
              </Caption>

              {/* Live counter */}
              <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: 14, padding: '14px 20px',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <Icon.Check size={20} color={BRAND.green} />
                  <span style={{ color: '#fff', fontSize: 22, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                    {Math.min(fillStep, 7)} <span style={{ color: BRAND.mute2 }}>/ 7</span>
                  </span>
                  <span style={{ color: BRAND.mute2, fontSize: 14, fontWeight: 500 }}>câmpuri auto-completate</span>
                </div>
              </div>
            </div>

            <PhoneStage phoneScale={phoneScale} phoneX={1320} phoneY={540}>
              <AutoFillScreen fillStep={fillStep} />
            </PhoneStage>
          </>
        );
      }}
    </Sprite>
  );
}

// ─── SCENE 6: Step 4 — Preview & sign ────────────────────────────────────────
function Scene_Step4() {
  return (
    <Sprite start={T.step4[0]} end={T.step4[1]}>
      {({ localTime, duration }) => {
        const dur = duration;
        const opIn  = clamp(localTime / 0.4, 0, 1);
        const opOut = 1 - clamp((localTime - (dur - 0.4)) / 0.4, 0, 1);
        const op = Math.min(opIn, opOut);

        const mapX = (px) => 1125 + 0.95 * px;
        const mapY = (py) => 131  + 0.95 * py;

        // Signature animation 0.6s..2.6s
        const signProgress = clamp((localTime - 0.6) / 2.0, 0, 1);
        const signed = signProgress >= 1;

        // Cursor: glide to signature line, draw, then tap sign button
        const waypoints = [
          { t: 0.0, x: mapX(200), y: mapY(850) },
          { t: 0.7, x: mapX(70),  y: mapY(715) },   // start of signature line
          { t: 1.5, x: mapX(180), y: mapY(715) },   // middle
          { t: 2.5, x: mapX(310), y: mapY(715) },   // end
          { t: 3.3, x: mapX(180), y: mapY(790), tap: true },  // tap sign button
          { t: dur, x: mapX(180), y: mapY(790) },
        ];
        const c = useCursorAt(localTime, waypoints);
        const tap = Math.abs(localTime - 3.3) < 0.18;

        return (
          <>
            <div style={{
              position: 'absolute', left: 110, top: 280, opacity: op, transform: `translateY(${(1-op) * 20}px)`,
              maxWidth: 580,
            }}>
              <StepNumber n={4} color="#a855f7" />
              <h2 style={{ color: '#fff', fontSize: 64, fontWeight: 800, marginTop: 24, letterSpacing: -1.5, lineHeight: 1.05 }}>
                <span style={{ color: '#a855f7' }}>Semnezi</span> și gata
              </h2>
              <Caption>
                Verifică o ultimă dată, semnează direct pe telefon. <br />Contractul ajunge instant pe e-mail.
              </Caption>
            </div>

            <PhoneStage
              phoneScale={1.0}
              phoneX={1320}
              phoneY={540}
              cursor={<Cursor x={c.x} y={c.y} pressed={tap} />}
            >
              <PreviewSignScreen signProgress={signProgress} signed={signed && localTime > 3.2} />
            </PhoneStage>
          </>
        );
      }}
    </Sprite>
  );
}

// ─── SCENE 7: DONE / final card ──────────────────────────────────────────────
function Scene_Done() {
  return (
    <Sprite start={T.done[0]} end={T.done[1]}>
      {({ localTime, duration }) => {
        const dur = duration;
        const opIn  = clamp(localTime / 0.5, 0, 1);
        const opOut = 1 - clamp((localTime - (dur - 0.5)) / 0.5, 0, 1);
        const op = Math.min(opIn, opOut);

        const ringP = clamp(localTime / 1.4, 0, 1);
        const headlineOp = clamp((localTime - 0.8) / 0.6, 0, 1);
        const headlineY  = (1 - clamp((localTime - 0.8) / 0.6, 0, 1)) * 30;
        const ctaOp      = clamp((localTime - 1.8) / 0.6, 0, 1);

        // Phone shrinks + slides right
        const phoneScale = interpolate([0, 1.0], [1.0, 0.75], Easing.easeInOutCubic)(localTime);
        const phoneX     = interpolate([0, 1.0], [1320, 1500], Easing.easeInOutCubic)(localTime);

        return (
          <>
            <div style={{
              position: 'absolute', left: 110, top: 320, opacity: op,
              maxWidth: 900,
            }}>
              <div style={{ opacity: headlineOp, transform: `translateY(${headlineY}px)` }}>
                <p style={{ color: BRAND.green, fontSize: 22, fontWeight: 700, letterSpacing: 6, textTransform: 'uppercase', marginBottom: 16 }}>
                  ⚡ În mai puțin de 1 minut
                </p>
                <BigHeadline size={110}>
                  Asta a fost <br /><span style={{ color: BRAND.green }}>tot.</span>
                </BigHeadline>
                <p style={{ marginTop: 24, color: BRAND.mute2, fontSize: 28, fontWeight: 500, maxWidth: 700, textWrap: 'pretty' }}>
                  Patru pași. Zero hârtie. Contracte legale, conforme,<br />gata de semnat — pe orice telefon.
                </p>
              </div>

              <div style={{
                marginTop: 48, opacity: ctaOp,
                transform: `translateY(${(1 - ctaOp) * 20}px)`,
                display: 'flex', alignItems: 'center', gap: 24,
              }}>
                <div style={{
                  background: '#fff', color: BRAND.blue,
                  padding: '20px 36px', borderRadius: 16,
                  fontSize: 26, fontWeight: 800, letterSpacing: -0.3,
                  display: 'inline-flex', alignItems: 'center', gap: 12,
                  boxShadow: '0 20px 60px rgba(37,99,235,0.4)',
                }}>
                  Încearcă pe
                  <span style={{ color: BRAND.blue }}>Rapid</span><span style={{ color: BRAND.green }}>Act</span><span style={{ color: BRAND.mute2, fontSize: 18 }}>.ro</span>
                  <span style={{ marginLeft: 4, fontSize: 26 }}>→</span>
                </div>
                <span style={{ color: BRAND.mute2, fontSize: 16 }}>gratuit pentru primele 5 contracte</span>
              </div>
            </div>

            <PhoneStage phoneScale={phoneScale} phoneX={phoneX} phoneY={540}>
              <DoneScreen progress={ringP} />
            </PhoneStage>
          </>
        );
      }}
    </Sprite>
  );
}

// ─── Bottom HUD: scene chip + progress bar ───────────────────────────────────
function HUD() {
  const t = useTime();
  // Determine current scene
  let label = '';
  if (t < T.hook[1])  label = 'Intro';
  else if (t < T.intro[1])  label = 'RapidAct.ro';
  else if (t < T.step1[1])  label = 'Pasul 1 · Template';
  else if (t < T.step2[1])  label = 'Pasul 2 · Scanare CI';
  else if (t < T.step3[1])  label = 'Pasul 3 · Auto-fill';
  else if (t < T.step4[1])  label = 'Pasul 4 · Semnătură';
  else label = 'Gata!';

  const totalP = clamp(t / DURATION, 0, 1);

  return (
    <>
      {/* Top-left brand chip */}
      <div style={{
        position: 'absolute', top: 40, left: 60,
        display: 'flex', alignItems: 'center', gap: 12,
        opacity: t > 3.4 ? 1 : 0, transition: 'opacity 0.5s',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.green})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 18, fontWeight: 800,
        }}>R</div>
        <div>
          <span style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>RapidAct</span>
          <span style={{ color: BRAND.mute2, fontSize: 18, fontWeight: 600 }}>.ro</span>
        </div>
      </div>

      {/* Bottom-right scene chip */}
      <div style={{
        position: 'absolute', top: 40, right: 60,
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 99, padding: '8px 18px',
        opacity: t > 3.4 ? 1 : 0, transition: 'opacity 0.5s',
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: BRAND.green, boxShadow: `0 0 10px ${BRAND.green}` }} />
        <span style={{ color: '#fff', fontSize: 15, fontWeight: 600, letterSpacing: 0.3 }}>{label}</span>
      </div>

      {/* Bottom progress bar */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        height: 4, background: 'rgba(255,255,255,0.06)',
      }}>
        <div style={{
          height: '100%', width: `${totalP * 100}%`,
          background: `linear-gradient(90deg, ${BRAND.blue}, ${BRAND.green})`,
          transition: 'none',
        }} />
      </div>
    </>
  );
}

// ─── Timestamp label updater (for comment context) ───────────────────────────
function TimestampLabel() {
  const t = useTime();
  React.useEffect(() => {
    const sec = Math.floor(t);
    const root = document.querySelector('[data-screen-label-root]');
    if (root) root.setAttribute('data-screen-label', `t=${sec}s`);
  }, [Math.floor(t)]);
  return null;
}

// ─── Top-level scene host ────────────────────────────────────────────────────
function VideoScenes() {
  return (
    <div data-screen-label-root data-screen-label="t=0s" style={{ position: 'absolute', inset: 0 }}>
      <Background />
      <Scene_Hook />
      <Scene_Intro />
      <Scene_Step1 />
      <Scene_Step2 />
      <Scene_Step3 />
      <Scene_Step4 />
      <Scene_Done />
      <HUD />
      <TimestampLabel />
    </div>
  );
}

Object.assign(window, { VideoScenes, DURATION });
