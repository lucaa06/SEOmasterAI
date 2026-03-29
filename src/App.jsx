import { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles, Search, Copy, Check, Globe, Tag, FileText, Shield,
  LogIn, UserPlus, LogOut, Clock, User, Building2, Languages,
  Braces, Eye, EyeOff, RefreshCw, Download, Trash2, CreditCard,
  Bell, Menu, X, Lock, ArrowRight, FileCode, Share2,
  Map, AlertTriangle, XCircle, CheckCircle, ChevronDown
} from "lucide-react";

/* ─── DESIGN TOKENS ─────────────────────────────────────────────── */
const C = {
  bg: "#05081A",
  card: "#0B1124",
  card2: "#0F172A",
  border: "#1B2B45",
  accent: "#5B5FEF",
  accentL: "#818CF8",
  accentDim: "rgba(91,95,239,0.1)",
  text: "#EDF2FF",
  muted: "#6B7EA6",
  dim: "#384F6E",
  success: "#10B981", successBg: "rgba(16,185,129,0.09)",
  warn: "#F59E0B", warnBg: "rgba(245,158,11,0.09)",
  error: "#EF4444", errorBg: "rgba(239,68,68,0.09)",
};
const btnS = (accent, sm) => ({
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: sm ? "6px 12px" : "10px 20px", fontSize: sm ? 12 : 14,
  fontWeight: 500, cursor: "pointer", borderRadius: 10, outline: "none",
  border: `1px solid ${accent ? C.accent : C.border}`,
  background: accent ? C.accent : "transparent",
  color: accent ? "#fff" : C.text, fontFamily: "inherit",
  transition: "all 0.18s ease",
});
const inpS = (err) => ({
  width: "100%", padding: "10px 14px", fontSize: 14, borderRadius: 10,
  border: `1px solid ${err ? C.error : C.border}`,
  background: C.card2, color: C.text, outline: "none",
  fontFamily: "inherit", transition: "border-color 0.18s", boxSizing: "border-box",
});

/* ─── GLOBAL CSS ─────────────────────────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: ${C.card}; }
    ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
    @keyframes jiggle { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(-5deg); } 75% { transform: rotate(5deg); } }
    @keyframes wiggle { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-5px); } 40% { transform: translateX(5px); } 60% { transform: translateX(-3px); } 80% { transform: translateX(3px); } }
    @keyframes popIn { 0% { transform: scale(0.6); opacity: 0; } 65% { transform: scale(1.06); } 100% { transform: scale(1); opacity: 1; } }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes glow { 0%,100% { opacity: 0.25; } 50% { opacity: 0.5; } }
    @keyframes tailWag { 0% { transform: rotate(-8deg); } 100% { transform: rotate(8deg); } }
    @keyframes earTwitch { 0%,80%,100% { transform: rotate(0deg); } 88% { transform: rotate(-8deg); } 95% { transform: rotate(3deg); } }
    @keyframes sparkle { 0%,100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1); } }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════════════
   SERIO MASCOT v2 — Geometric fox with eye tracking, blink & moods
═══════════════════════════════════════════════════════════════════ */
function Serio({ size = 120, mood = "idle", eyesClosed = false, loading = false }) {
  const svgRef = useRef(null);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [blinking, setBlinking] = useState(false);
  const [earAnim, setEarAnim] = useState(false);

  /* Live eye tracking via mouse position */
  useEffect(() => {
    if (eyesClosed || mood !== "idle") return;
    const onMove = (e) => {
      if (!svgRef.current) return;
      const r = svgRef.current.getBoundingClientRect();
      const cx = r.left + r.width * 0.5;
      const cy = r.top + r.height * 0.47;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const t = Math.min(dist, 280) / 280;
      const max = 4;
      setPupil({ x: (dx / dist) * max * t, y: (dy / dist) * max * t });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [eyesClosed, mood]);

  /* Random blink with occasional double-blink */
  useEffect(() => {
    if (eyesClosed) return;
    let t;
    const doBlink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 130);
    };
    const schedule = () => {
      const delay = 2200 + Math.random() * 3800;
      t = setTimeout(() => {
        doBlink();
        if (Math.random() > 0.65) setTimeout(doBlink, 280);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(t);
  }, [eyesClosed]);

  /* Random ear twitch */
  useEffect(() => {
    const id = setInterval(() => {
      setEarAnim(true);
      setTimeout(() => setEarAnim(false), 500);
    }, 3500 + Math.random() * 2500);
    return () => clearInterval(id);
  }, []);

  const shouldClose = eyesClosed || blinking;

  /* Per-eye renderer — cx,cy in viewBox coords (200x244) */
  const Eye = ({ cx, cy }) => {
    if (shouldClose) {
      /* Closed: curved line */
      return (
        <path
          d={`M${cx - 12} ${cy} Q${cx} ${cy - 7} ${cx + 12} ${cy}`}
          fill="none" stroke="#EEF2FF" strokeWidth="3" strokeLinecap="round"
        />
      );
    }
    if (mood === "success") {
      return (
        <path
          d={`M${cx - 12} ${cy + 5} Q${cx} ${cy - 9} ${cx + 12} ${cy + 5}`}
          fill="none" stroke="#EEF2FF" strokeWidth="3.5" strokeLinecap="round"
        />
      );
    }
    if (mood === "error") {
      return (
        <path
          d={`M${cx - 12} ${cy - 3} Q${cx} ${cy + 10} ${cx + 12} ${cy - 3}`}
          fill="none" stroke="#EEF2FF" strokeWidth="3.5" strokeLinecap="round"
        />
      );
    }
    if (mood === "thinking") {
      /* Half-closed squint */
      return (
        <>
          <ellipse cx={cx} cy={cy} rx="12" ry="6" fill="#EEF2FF" />
          <circle cx={cx + pupil.x * 0.6} cy={cy + pupil.y * 0.6} r="4" fill="#1E1B4B" />
          <circle cx={cx + pupil.x * 0.6 + 1.5} cy={cy + pupil.y * 0.6 - 1.5} r="1.4" fill="white" />
        </>
      );
    }
    /* idle — full expressive eye */
    return (
      <>
        {/* sclera */}
        <ellipse cx={cx} cy={cy} rx="13" ry="11" fill="#EEF2FF" />
        {/* iris */}
        <circle cx={cx + pupil.x} cy={cy + pupil.y} r="8" fill="#3730A3" />
        {/* pupil */}
        <circle cx={cx + pupil.x} cy={cy + pupil.y} r="5" fill="#100C3A" />
        {/* main highlight */}
        <circle cx={cx + pupil.x + 3} cy={cy + pupil.y - 3} r="2.5" fill="white" opacity="0.95" />
        {/* secondary reflection */}
        <circle cx={cx + pupil.x - 2} cy={cy + pupil.y + 2.5} r="1.1" fill="white" opacity="0.45" />
      </>
    );
  };

  /* Root animation based on state */
  const rootAnim = loading
    ? { animation: "bob 0.85s ease-in-out infinite" }
    : mood === "success"
    ? { animation: "jiggle 0.45s ease-in-out 3" }
    : mood === "error"
    ? { animation: "wiggle 0.4s ease-in-out" }
    : {};

  return (
    <div style={{ display: "inline-block", ...rootAnim }}>
      <svg
        ref={svgRef}
        width={size}
        height={Math.round(size * 1.22)}
        viewBox="0 0 200 244"
        style={{ display: "block", overflow: "visible" }}
      >
        {/* ── TAIL (behind) ── */}
        <g style={{
          transformOrigin: "100px 218px",
          animation: mood === "success" ? "tailWag 0.5s ease-in-out infinite alternate" : "none",
        }}>
          <path d="M100,218 Q152,228 172,210 Q186,196 174,182"
            fill="none" stroke="#4338CA" strokeWidth="11" strokeLinecap="round" opacity="0.55" />
          <path d="M174,182 Q166,170 172,158"
            fill="none" stroke="#818CF8" strokeWidth="7" strokeLinecap="round" opacity="0.5" />
        </g>

        {/* ── LEFT EAR ── */}
        <g style={{
          transformOrigin: "58px 56px",
          animation: earAnim ? "earTwitch 0.5s ease-in-out" : "none",
        }}>
          <polygon points="26,105 54,16 88,99" fill="#5B5FEF" />
          <polygon points="36,97 54,30 80,92" fill="#818CF8" />
          <polygon points="44,88 54,44 72,84" fill="#A5B4FC" opacity="0.35" />
        </g>

        {/* ── RIGHT EAR ── */}
        <g style={{
          transformOrigin: "146px 56px",
          animation: earAnim ? "earTwitch 0.5s ease-in-out 0.06s" : "none",
        }}>
          <polygon points="112,99 146,16 174,105" fill="#5B5FEF" />
          <polygon points="120,92 146,30 164,97" fill="#818CF8" />
          <polygon points="128,84 146,44 156,88" fill="#A5B4FC" opacity="0.35" />
        </g>

        {/* ── LOADING GLOW RING ── */}
        {loading && (
          <ellipse cx="100" cy="136" rx="80" ry="86"
            fill="none" stroke={C.accent} strokeWidth="2.5"
            style={{ animation: "glow 1s ease-in-out infinite" }} />
        )}

        {/* ── HEAD ── */}
        <ellipse cx="100" cy="136" rx="76" ry="82" fill="#5B5FEF" />

        {/* ── MUZZLE ── */}
        <ellipse cx="100" cy="168" rx="42" ry="36" fill="#4338CA" />
        {/* center crease */}
        <line x1="100" y1="158" x2="100" y2="182" stroke="#3730A3" strokeWidth="1.5" opacity="0.5" />

        {/* ── FOREHEAD DIAMOND ── */}
        <polygon points="100,74 111,87 100,100 89,87"
          fill="#A5B4FC"
          opacity={loading ? 1 : 0.32}
          style={loading ? { animation: "pulse 0.7s ease-in-out infinite" } : {}} />

        {/* ── EYES ── */}
        <Eye cx={68} cy={124} />
        <Eye cx={132} cy={124} />

        {/* ── NOSE ── */}
        <polygon points="94,158 100,151 106,158 100,165" fill="#2E1D9E" />

        {/* ── CHEEK BLUSH ── */}
        <ellipse cx="32" cy="156" rx="13" ry="9" fill="#818CF8" opacity="0.2" />
        <ellipse cx="168" cy="156" rx="13" ry="9" fill="#818CF8" opacity="0.2" />

        {/* ── WHISKERS ── */}
        {!shouldClose && (mood === "idle" || mood === "thinking") && (
          <>
            <line x1="16" y1="162" x2="66" y2="170" stroke="#4F46E5" strokeWidth="1.2" opacity="0.38" strokeLinecap="round" />
            <line x1="16" y1="175" x2="66" y2="176" stroke="#4F46E5" strokeWidth="1.2" opacity="0.27" strokeLinecap="round" />
            <line x1="134" y1="170" x2="184" y2="162" stroke="#4F46E5" strokeWidth="1.2" opacity="0.38" strokeLinecap="round" />
            <line x1="134" y1="176" x2="184" y2="175" stroke="#4F46E5" strokeWidth="1.2" opacity="0.27" strokeLinecap="round" />
          </>
        )}

        {/* ── SUCCESS SPARKLES ── */}
        {mood === "success" && (
          <>
            {[[18, 78, 0], [182, 78, 0.15], [10, 114, 0.08], [190, 114, 0.22]].map(([x, y, d], i) => (
              <circle key={i} cx={x} cy={y} r={i % 2 === 0 ? 5 : 3.5} fill="#A5B4FC"
                style={{ animation: `sparkle 0.6s ease-in-out infinite ${d}s` }} />
            ))}
          </>
        )}

        {/* ── LOADING DOTS ── */}
        {loading && (
          <>
            <circle cx="74" cy="224" r="5.5" fill={C.accent} style={{ animation: "pulse 0.75s ease-in-out infinite 0s" }} />
            <circle cx="100" cy="228" r="5.5" fill={C.accent} style={{ animation: "pulse 0.75s ease-in-out infinite 0.2s" }} />
            <circle cx="126" cy="224" r="5.5" fill={C.accent} style={{ animation: "pulse 0.75s ease-in-out infinite 0.4s" }} />
          </>
        )}
      </svg>
    </div>
  );
}

/* ─── AUTH PAGE ─────────────────────────────────────────────────── */
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({ email: "", pass: "", name: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [seriMood, setSeriMood] = useState("idle");

  const upd = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const eyesClosed = focusedField === "pass" || focusedField === "confirm";
  const getMood = () => loading ? "thinking" : err ? "error" : seriMood;

  const submit = async () => {
    setErr("");
    if (!f.email || !f.pass) return setErr("Compila tutti i campi obbligatori.");
    if (mode === "register") {
      if (!f.name) return setErr("Inserisci il tuo nome completo.");
      if (f.pass !== f.confirm) return setErr("Le password non coincidono.");
      if (f.pass.length < 6) return setErr("La password deve avere almeno 6 caratteri.");
    }
    setLoading(true); setSeriMood("thinking");
    await new Promise((r) => setTimeout(r, 1400));
    setSeriMood("success");
    await new Promise((r) => setTimeout(r, 500));
    onLogin({ name: f.name || f.email.split("@")[0], email: f.email });
  };

  const Field = ({ label, k, type = "text", placeholder }) => {
    const isPass = k === "pass" || k === "confirm";
    return (
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 5 }}>{label}</label>
        <div style={{ position: "relative" }}>
          <input
            style={{ ...inpS(err && !f[k]), paddingRight: isPass ? 44 : 14 }}
            type={isPass ? (showPass ? "text" : "password") : type}
            placeholder={placeholder}
            value={f[k]}
            onChange={upd(k)}
            onFocus={() => { setFocusedField(k); setSeriMood("thinking"); }}
            onBlur={() => { setFocusedField(null); if (!err) setSeriMood("idle"); }}
          />
          {isPass && (
            <button onClick={() => setShowPass((v) => !v)}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.muted, display: "flex", padding: 0 }}>
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg }}>
      {/* Left panel */}
      <div style={{ width: "44%", background: C.card, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ textAlign: "center", animation: "fadeUp 0.5s ease" }}>
          <Serio size={175} mood={getMood()} eyesClosed={eyesClosed} loading={loading} />
          <div style={{ marginTop: 22 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.text, letterSpacing: "-0.6px" }}>SEO Master AI</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 8, lineHeight: 1.8 }}>
              Ottimizza. Analizza.<br />Domina i motori di ricerca.
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 28, justifyContent: "center", flexWrap: "wrap" }}>
            {["AI-powered", "GDPR ready", "99% uptime"].map((t) => (
              <span key={t} style={{ fontSize: 11, color: C.muted, background: C.card2, border: `1px solid ${C.border}`, borderRadius: 20, padding: "3px 10px" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ width: "100%", maxWidth: 380, animation: "fadeUp 0.4s ease" }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: C.text, marginBottom: 6, letterSpacing: "-0.5px" }}>
            {mode === "login" ? "Bentornato" : "Crea account"}
          </h1>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>
            {mode === "login" ? "Accedi al tuo account per continuare" : "Inizia gratis, nessuna carta richiesta"}
          </p>

          {mode === "register" && <Field label="Nome completo" k="name" placeholder="Mario Rossi" />}
          <Field label="Email" k="email" type="email" placeholder="mario@esempio.it" />
          <Field label="Password" k="pass" placeholder="••••••••" />
          {mode === "register" && <Field label="Conferma password" k="confirm" placeholder="••••••••" />}

          {err && (
            <div style={{ background: C.errorBg, border: `1px solid ${C.error}40`, borderRadius: 8, padding: "10px 13px", fontSize: 12, color: C.error, marginBottom: 14, display: "flex", alignItems: "center", gap: 7, animation: "wiggle 0.4s ease" }}>
              <AlertTriangle size={13} style={{ flexShrink: 0 }} /> {err}
            </div>
          )}

          <button onClick={submit} disabled={loading}
            style={{ ...btnS(true), width: "100%", justifyContent: "center", padding: "12px", fontSize: 14, borderRadius: 12, opacity: loading ? 0.85 : 1 }}>
            {loading
              ? <RefreshCw size={15} style={{ animation: "spin 0.8s linear infinite" }} />
              : mode === "login" ? <LogIn size={15} /> : <UserPlus size={15} />}
            {loading ? "Caricamento..." : mode === "login" ? "Accedi" : "Crea account"}
          </button>

          <div style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: C.muted }}>
            {mode === "login" ? "Non hai un account?" : "Hai già un account?"}{" "}
            <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setErr(""); }}
              style={{ background: "none", border: "none", color: C.accentL, cursor: "pointer", fontSize: 13, fontWeight: 700, padding: 0 }}>
              {mode === "login" ? "Registrati" : "Accedi"}
            </button>
          </div>
          {mode === "login" && (
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <button style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", fontSize: 12, padding: 0 }}>
                Password dimenticata?
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── SIDEBAR ───────────────────────────────────────────────────── */
function Sidebar({ page, setPage, user, onLogout, collapsed, setCollapsed }) {
  const nav = [
    { id: "generator", icon: Sparkles, label: "Genera Meta Tags" },
    { id: "scanner", icon: Search, label: "Scansiona Sito" },
    { id: "pricing", icon: CreditCard, label: "Piani & Prezzi" },
    { id: "history", icon: Clock, label: "Cronologia" },
    { id: "profile", icon: User, label: "Profilo" },
  ];
  return (
    <aside style={{ width: collapsed ? 60 : 232, flexShrink: 0, background: C.card, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", transition: "width 0.2s ease", overflow: "hidden" }}>
      <div style={{ padding: "18px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, flexShrink: 0 }}><Serio size={32} mood="idle" /></div>
        {!collapsed && <span style={{ fontSize: 14, fontWeight: 900, color: C.text, whiteSpace: "nowrap", letterSpacing: "-0.3px" }}>SEO Master AI</span>}
      </div>
      <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
        {nav.map(({ id, icon: Icon, label }) => {
          const active = page === id;
          return (
            <button key={id} onClick={() => setPage(id)} title={collapsed ? label : undefined}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 9, border: "none", cursor: "pointer", background: active ? C.accentDim : "transparent", color: active ? C.accentL : C.muted, fontSize: 13, fontWeight: active ? 700 : 400, transition: "all 0.15s", textAlign: "left", width: "100%", borderLeft: active ? `2px solid ${C.accent}` : "2px solid transparent" }}>
              <Icon size={15} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{label}</span>}
            </button>
          );
        })}
      </nav>
      <div style={{ padding: "10px 8px", borderTop: `1px solid ${C.border}` }}>
        {!collapsed && (
          <div style={{ padding: "6px 12px", marginBottom: 4, fontSize: 12, color: C.muted }}>
            <span style={{ color: C.text, fontWeight: 700 }}>{user.name}</span><br />{user.email}
          </div>
        )}
        <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 9, border: "none", cursor: "pointer", background: "transparent", color: C.muted, fontSize: 13, width: "100%", transition: "all 0.15s" }}>
          <LogOut size={15} style={{ flexShrink: 0 }} />{!collapsed && "Esci"}
        </button>
      </div>
      <button onClick={() => setCollapsed((v) => !v)}
        style={{ padding: 14, background: "transparent", border: "none", cursor: "pointer", color: C.muted, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "center" }}>
        <Menu size={15} />
      </button>
    </aside>
  );
}

/* ─── CODE BLOCK (open by default) ─────────────────────────────── */
function CodeBlock({ label, icon: Icon, content }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(true);
  const copy = (e) => {
    e.stopPropagation();
    try { navigator.clipboard.writeText(content); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 11, overflow: "hidden", marginBottom: 8, animation: "fadeUp 0.3s ease" }}>
      <div onClick={() => setOpen((v) => !v)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 15px", background: C.card2, cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, color: C.text }}>
          <Icon size={13} style={{ color: C.accentL }} /> {label}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button onClick={copy} style={{ ...btnS(false, true), borderColor: "transparent", background: copied ? C.successBg : C.card, padding: "4px 10px", gap: 4, borderRadius: 7 }}>
            {copied ? <Check size={11} style={{ color: C.success }} /> : <Copy size={11} />}
            <span style={{ fontSize: 11 }}>{copied ? "Copiato!" : "Copia"}</span>
          </button>
          <ChevronDown size={13} style={{ color: C.muted, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
        </div>
      </div>
      {open && (
        <pre style={{ margin: 0, padding: "14px 16px", fontSize: 12, fontFamily: "monospace", color: "#a5b4fc", background: "#030611", overflowX: "auto", lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {content}
        </pre>
      )}
    </div>
  );
}

/* ─── GENERATOR PAGE ────────────────────────────────────────────── */
function GeneratorPage({ addHistory }) {
  const [f, setF] = useState({ name: "", url: "", desc: "", lang: "IT" });
  const [tags, setTags] = useState([]);
  const [tagIn, setTagIn] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [rawText, setRawText] = useState("");
  const [error, setError] = useState("");
  const [stepIdx, setStepIdx] = useState(0);
  const [mood, setMood] = useState("idle");
  const steps = ["Analisi dati...", "Generazione meta...", "Ottimizzazione SEO...", "Finalizzazione..."];
  const upd = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const addTag = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagIn.trim()) {
      e.preventDefault();
      setTags((t) => [...new Set([...t, tagIn.trim()])]);
      setTagIn("");
    }
  };

  const generate = async () => {
    if (!f.name.trim() || !f.desc.trim()) return setError("Nome azienda e descrizione sono obbligatori.");
    setError(""); setResult(null); setRawText(""); setLoading(true); setStepIdx(0); setMood("thinking");
    const timer = setInterval(() => setStepIdx((s) => Math.min(s + 1, 3)), 900);

    const prompt = `Sei un esperto SEO. Genera meta tag ottimizzati.
Nome azienda: ${f.name}
URL: ${f.url || "https://esempio.it"}
Descrizione: ${f.desc}
Keyword: ${tags.join(", ") || "generali"}
Lingua: ${f.lang}

IMPORTANTE: rispondi SOLO con JSON valido. Nessun testo prima o dopo. Nessun backtick o markdown.

{"html_meta":"<title>TITOLO_OTTIMIZZATO</title>\\n<meta name=\\"description\\" content=\\"DESCRIZIONE_150_CHARS\\" />\\n<meta name=\\"keywords\\" content=\\"keyword1, keyword2, keyword3\\" />\\n<meta name=\\"robots\\" content=\\"index, follow\\" />\\n<meta name=\\"author\\" content=\\"${f.name}\\" />\\n<link rel=\\"canonical\\" href=\\"${f.url || "https://esempio.it"}\\" />","open_graph":"<meta property=\\"og:title\\" content=\\"TITOLO_OG\\" />\\n<meta property=\\"og:description\\" content=\\"DESCRIZIONE_OG\\" />\\n<meta property=\\"og:type\\" content=\\"website\\" />\\n<meta property=\\"og:url\\" content=\\"${f.url || "https://esempio.it"}\\" />\\n<meta property=\\"og:locale\\" content=\\"${f.lang}_${f.lang}\\" />\\n<meta property=\\"og:site_name\\" content=\\"${f.name}\\" />","twitter_card":"<meta name=\\"twitter:card\\" content=\\"summary_large_image\\" />\\n<meta name=\\"twitter:title\\" content=\\"TITOLO_TWITTER\\" />\\n<meta name=\\"twitter:description\\" content=\\"DESCRIZIONE_TWITTER\\" />\\n<meta name=\\"twitter:site\\" content=\\"@${f.name.replace(/\s/g, "").toLowerCase()}\\" />","json_ld":"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Organization\\",\\"name\\":\\"${f.name}\\",\\"url\\":\\"${f.url || "https://esempio.it"}\\",\\"description\\":\\"DESCRIZIONE_SCHEMA\\"}","sitemap_snippet":"<url>\\n  <loc>${f.url || "https://esempio.it"}/</loc>\\n  <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\\n  <changefreq>weekly</changefreq>\\n  <priority>1.0</priority>\\n</url>","robots_txt":"User-agent: *\\nAllow: /\\nDisallow: /admin/\\nDisallow: /private/\\nSitemap: ${f.url || "https://esempio.it"}/sitemap.xml"}

Sostituisci TITOLO_OTTIMIZZATO, DESCRIZIONE_150_CHARS ecc. con testo reale ottimizzato in lingua ${f.lang} basato sulla descrizione.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await res.json();
      clearInterval(timer);

      if (data.error) {
        setMood("error");
        setError(`Errore API: ${data.error.message}`);
        setLoading(false);
        return;
      }

      const text = (data.content?.[0]?.text || "").trim();
      setRawText(text);

      let parsed = null;
      const attempts = [
        text,
        text.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim(),
      ];
      for (const attempt of attempts) {
        try { parsed = JSON.parse(attempt); break; } catch {}
      }
      if (!parsed) {
        const m = text.match(/\{[\s\S]*\}/);
        if (m) try { parsed = JSON.parse(m[0]); } catch {}
      }

      if (parsed) {
        setResult(parsed);
        setMood("success");
        addHistory({ type: "generator", label: f.name, score: null, date: new Date().toLocaleString("it-IT") });
      } else {
        setMood("error");
        setError("La risposta non era in formato JSON. Vedi il testo grezzo.");
      }
    } catch (e) {
      clearInterval(timer);
      setMood("error");
      setError(`Errore connessione: ${e.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1120, margin: "0 auto" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.text, margin: 0, letterSpacing: "-0.5px" }}>Genera Meta Tags</h1>
        <p style={{ fontSize: 13, color: C.muted, marginTop: 5 }}>Inserisci i dati aziendali — l'AI genera tutto il codice SEO pronto da incollare.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 20 }}>
        {/* INPUT */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: C.muted, display: "flex", alignItems: "center", gap: 4, marginBottom: 5 }}><Building2 size={11} /> Nome azienda *</label>
              <input style={inpS()} placeholder="Acme Srl" value={f.name} onChange={upd("name")} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: C.muted, display: "flex", alignItems: "center", gap: 4, marginBottom: 5 }}><Globe size={11} /> URL sito</label>
              <input style={inpS()} placeholder="https://acme.it" value={f.url} onChange={upd("url")} />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: C.muted, display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><FileText size={11} /> Descrizione aziendale *</span>
              <span style={{ color: f.desc.length > 440 ? C.warn : C.dim }}>{f.desc.length}/500</span>
            </label>
            <textarea style={{ ...inpS(), height: 90, resize: "vertical" }}
              placeholder="Descrivi la tua azienda, prodotti/servizi, mercato..."
              value={f.desc} onChange={upd("desc")} maxLength={500} />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: C.muted, display: "flex", alignItems: "center", gap: 4, marginBottom: 5 }}><Tag size={11} /> Tag / Keyword (premi Invio per aggiungere)</label>
            <input style={inpS()} placeholder="es. e-commerce, Milano, moda" value={tagIn}
              onChange={(e) => setTagIn(e.target.value)} onKeyDown={addTag} />
            {tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
                {tags.map((t) => (
                  <span key={t} style={{ display: "flex", alignItems: "center", gap: 4, background: C.accentDim, border: `1px solid ${C.accent}50`, borderRadius: 20, padding: "2px 9px", fontSize: 11, color: C.accentL }}>
                    {t}
                    <button onClick={() => setTags((ts) => ts.filter((x) => x !== t))} style={{ background: "none", border: "none", cursor: "pointer", color: C.accentL, padding: 0, display: "flex" }}><X size={9} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 11, color: C.muted, display: "flex", alignItems: "center", gap: 4, marginBottom: 5 }}><Languages size={11} /> Lingua</label>
            <select style={{ ...inpS(), cursor: "pointer" }} value={f.lang} onChange={upd("lang")}>
              {["IT", "EN", "ES", "FR", "DE"].map((l) => <option key={l} value={l} style={{ background: C.card2 }}>{l}</option>)}
            </select>
          </div>

          {error && (
            <div style={{ background: C.errorBg, border: `1px solid ${C.error}40`, borderRadius: 8, padding: "10px 13px", fontSize: 12, color: C.error, marginBottom: 13, display: "flex", alignItems: "flex-start", gap: 7 }}>
              <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 1 }} /> {error}
            </div>
          )}

          <button onClick={generate} disabled={loading}
            style={{ ...btnS(true), width: "100%", justifyContent: "center", padding: "11px", borderRadius: 11, opacity: loading ? 0.85 : 1, fontSize: 13 }}>
            {loading ? <RefreshCw size={14} style={{ animation: "spin 0.8s linear infinite" }} /> : <Sparkles size={14} />}
            {loading ? steps[stepIdx] : "Genera con AI"}
          </button>
        </div>

        {/* OUTPUT */}
        <div>
          {!result && !loading && !rawText && (
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 36, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
              <Serio size={90} mood={mood} />
              <p style={{ fontSize: 13, color: C.muted, marginTop: 14, textAlign: "center", lineHeight: 1.7 }}>
                Compila il form e premi<br /><strong style={{ color: C.text }}>Genera con AI</strong>
              </p>
            </div>
          )}
          {loading && (
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 36, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
              <Serio size={90} mood="thinking" loading={true} />
              <p style={{ fontSize: 13, color: C.accentL, marginTop: 8 }}>{steps[stepIdx]}</p>
              <div style={{ display: "flex", gap: 5, marginTop: 10 }}>
                {steps.map((_, i) => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i <= stepIdx ? C.accent : C.border, transition: "background 0.3s" }} />)}
              </div>
            </div>
          )}
          {result && (
            <div style={{ animation: "fadeUp 0.4s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                <CheckCircle size={15} style={{ color: C.success }} />
                <span style={{ fontSize: 13, color: C.success, fontWeight: 700 }}>Generazione completata</span>
                <span style={{ fontSize: 11, color: C.dim, marginLeft: 2 }}>— clicca per aprire/chiudere</span>
              </div>
              {result.html_meta && <CodeBlock label="HTML Meta Tags" icon={FileCode} content={result.html_meta} />}
              {result.open_graph && <CodeBlock label="Open Graph" icon={Share2} content={result.open_graph} />}
              {result.twitter_card && <CodeBlock label="Twitter Card" icon={Globe} content={result.twitter_card} />}
              {result.json_ld && <CodeBlock label="JSON-LD Schema" icon={Braces} content={result.json_ld} />}
              {result.sitemap_snippet && <CodeBlock label="Sitemap XML" icon={Map} content={result.sitemap_snippet} />}
              {result.robots_txt && <CodeBlock label="Robots.txt" icon={Shield} content={result.robots_txt} />}
            </div>
          )}
          {!result && rawText && !loading && (
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              <div style={{ background: C.warnBg, border: `1px solid ${C.warn}40`, borderRadius: 10, padding: "10px 13px", fontSize: 12, color: C.warn, marginBottom: 10 }}>
                Risposta ricevuta ma parsing JSON fallito — testo grezzo:
              </div>
              <pre style={{ fontSize: 11, fontFamily: "monospace", color: C.accentL, background: "#030611", padding: 14, borderRadius: 10, border: `1px solid ${C.border}`, whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 350, overflowY: "auto" }}>
                {rawText}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── SCANNER PAGE ──────────────────────────────────────────────── */
function ScannerPage({ addHistory }) {
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [rawText, setRawText] = useState("");
  const [error, setError] = useState("");
  const [stepIdx, setStepIdx] = useState(0);
  const steps = ["Recupero dati...", "Analisi struttura...", "Valutazione SEO...", "Generazione report..."];

  const scan = async () => {
    if (!url.trim() && !html.trim()) return setError("Inserisci un URL o incolla l'HTML.");
    setError(""); setResult(null); setRawText(""); setLoading(true); setStepIdx(0);
    const timer = setInterval(() => setStepIdx((s) => Math.min(s + 1, 3)), 950);

    const prompt = `Sei un esperto SEO. Esegui audit SEO.
URL: ${url || "non fornito"}
${html ? `HTML:\n${html.slice(0, 3500)}` : "HTML: non fornito — analizza in base all'URL e simula risultati realistici."}

Rispondi SOLO con JSON. Nessun testo prima/dopo. Nessun backtick.

{"score":72,"checks":[{"id":"title","label":"Tag title","status":"ok","detail":"...","fix":""},{"id":"description","label":"Meta description","status":"warning","detail":"...","fix":"..."},{"id":"h1","label":"Tag H1","status":"ok","detail":"...","fix":""},{"id":"h2h6","label":"Gerarchia H2-H6","status":"ok","detail":"...","fix":""},{"id":"alt","label":"Alt immagini","status":"error","detail":"...","fix":"..."},{"id":"canonical","label":"Tag canonical","status":"warning","detail":"...","fix":"..."},{"id":"og","label":"Open Graph","status":"error","detail":"...","fix":"..."},{"id":"schema","label":"Schema markup JSON-LD","status":"error","detail":"...","fix":"..."},{"id":"robots","label":"Robots meta","status":"ok","detail":"...","fix":""},{"id":"links","label":"Link interni","status":"ok","detail":"...","fix":""},{"id":"scripts","label":"Script bloccanti","status":"warning","detail":"...","fix":"..."},{"id":"viewport","label":"Viewport mobile","status":"ok","detail":"...","fix":""},{"id":"favicon","label":"Favicon","status":"ok","detail":"...","fix":""},{"id":"lang","label":"Attributo lang HTML","status":"ok","detail":"...","fix":""},{"id":"broken","label":"Link potenzialmente rotti","status":"ok","detail":"...","fix":""}]}

Sostituisci i "..." con testo reale in italiano. Il score deve essere coerente con i problemi trovati. Varia ok/warning/error in modo realistico.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await res.json();
      clearInterval(timer);

      if (data.error) { setError(`Errore API: ${data.error.message}`); setLoading(false); return; }

      const text = (data.content?.[0]?.text || "").trim();
      setRawText(text);

      let parsed = null;
      for (const attempt of [text, text.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim()]) {
        try { parsed = JSON.parse(attempt); break; } catch {}
      }
      if (!parsed) {
        const m = text.match(/\{[\s\S]*\}/);
        if (m) try { parsed = JSON.parse(m[0]); } catch {}
      }

      if (parsed && typeof parsed.score === "number" && Array.isArray(parsed.checks)) {
        setResult(parsed);
        addHistory({ type: "scanner", label: url || "HTML analizzato", score: parsed.score, date: new Date().toLocaleString("it-IT") });
      } else {
        setError("Report non generato correttamente. Vedi testo grezzo.");
      }
    } catch (e) {
      clearInterval(timer);
      setError(`Errore: ${e.message}`);
    }
    setLoading(false);
  };

  const scColor = (s) => s >= 70 ? C.success : s >= 40 ? C.warn : C.error;
  const [openIds, setOpenIds] = useState({});
  const toggle = (id) => setOpenIds((p) => ({ ...p, [id]: !p[id] }));
  const bgOf = { ok: C.successBg, warning: C.warnBg, error: C.errorBg };
  const bdOf = { ok: `${C.success}35`, warning: `${C.warn}35`, error: `${C.error}35` };

  const StatusIcon = ({ s }) =>
    s === "ok" ? <CheckCircle size={14} style={{ color: C.success, flexShrink: 0 }} />
    : s === "warning" ? <AlertTriangle size={14} style={{ color: C.warn, flexShrink: 0 }} />
    : <XCircle size={14} style={{ color: C.error, flexShrink: 0 }} />;

  return (
    <div style={{ padding: "28px 32px", maxWidth: 920, margin: "0 auto" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.text, margin: 0, letterSpacing: "-0.5px" }}>Scansiona Sito</h1>
        <p style={{ fontSize: 13, color: C.muted, marginTop: 5 }}>Audit SEO completo — trova i problemi e ottimizza ogni aspetto della tua pagina.</p>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, color: C.muted, display: "flex", alignItems: "center", gap: 4, marginBottom: 5 }}><Globe size={11} /> URL della pagina</label>
          <input style={inpS()} placeholder="https://il-tuo-sito.it" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>

        <div style={{ background: C.accentDim, border: `1px solid ${C.accent}35`, borderRadius: 8, padding: "8px 12px", fontSize: 11, color: C.muted, marginBottom: 12, lineHeight: 1.7 }}>
          <span style={{ color: C.accentL, fontWeight: 700 }}>Come ottenere l'HTML:</span> apri la pagina nel browser → tasto destro → "Visualizza sorgente pagina" → seleziona tutto → incolla qui sotto. Migliora molto l'accuratezza dell'analisi.
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: C.muted, display: "flex", alignItems: "center", gap: 4, marginBottom: 5 }}><FileCode size={11} /> HTML della pagina (opzionale ma consigliato)</label>
          <textarea
            style={{ ...inpS(), height: 100, resize: "vertical", fontSize: 11, fontFamily: "monospace" }}
            placeholder={`<!DOCTYPE html>\n<html lang="it">\n<head>\n  <title>La Mia Azienda — Home</title>\n  <meta name="description" content="..." />\n  ...\n</head>\n<body>...</body>\n</html>`}
            value={html} onChange={(e) => setHtml(e.target.value)} />
        </div>

        {error && <div style={{ background: C.errorBg, border: `1px solid ${C.error}40`, borderRadius: 8, padding: "10px 13px", fontSize: 12, color: C.error, marginBottom: 12, display: "flex", gap: 7 }}><AlertTriangle size={13} style={{ flexShrink: 0 }} /> {error}</div>}

        <button onClick={scan} disabled={loading}
          style={{ ...btnS(true), padding: "11px 22px", borderRadius: 11, fontSize: 13, opacity: loading ? 0.85 : 1 }}>
          {loading ? <RefreshCw size={14} style={{ animation: "spin 0.8s linear infinite" }} /> : <Search size={14} />}
          {loading ? steps[stepIdx] : "Avvia Scansione"}
        </button>
      </div>

      {loading && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 40, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Serio size={110} mood="thinking" loading={true} />
          <p style={{ fontSize: 13, color: C.accentL, marginTop: 8 }}>{steps[stepIdx]}</p>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            {steps.map((_, i) => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: i <= stepIdx ? C.accent : C.border, transition: "background 0.3s" }} />)}
          </div>
        </div>
      )}

      {result && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, animation: "fadeUp 0.4s ease" }}>
          {/* Score */}
          <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 22, paddingBottom: 18, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontSize: 54, fontWeight: 900, color: scColor(result.score), lineHeight: 1, letterSpacing: "-2px" }}>{result.score}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>Punteggio SEO</div>
            </div>
            <div style={{ flex: 1 }}>
              {url && <div style={{ fontSize: 12, color: C.muted, marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}><Globe size={11} />{url}</div>}
              <div style={{ height: 7, background: C.card2, borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ width: `${result.score}%`, height: "100%", background: scColor(result.score), borderRadius: 4, transition: "width 1.2s ease" }} />
              </div>
              <div style={{ display: "flex", gap: 18 }}>
                {[["ok", C.success, "Ottimali"], ["warning", C.warn, "Attenzione"], ["error", C.error, "Critici"]].map(([s, col, lbl]) => (
                  <div key={s} style={{ fontSize: 12, color: C.muted }}>
                    <span style={{ fontWeight: 900, color: col, fontSize: 17 }}>{result.checks.filter((c) => c.status === s).length}</span> {lbl}
                  </div>
                ))}
              </div>
            </div>
            <Serio size={72} mood={result.score >= 70 ? "success" : result.score >= 40 ? "idle" : "error"} />
          </div>

          {/* Checks */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 8 }}>
            {result.checks.map((c) => (
              <div key={c.id}
                style={{ background: bgOf[c.status] || C.card2, border: `1px solid ${bdOf[c.status] || C.border}`, borderRadius: 10, padding: "11px 13px", cursor: c.fix ? "pointer" : "default" }}
                onClick={() => c.fix && toggle(c.id)}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <StatusIcon s={c.status} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{c.label}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2, lineHeight: 1.55 }}>{c.detail}</div>
                  </div>
                  {c.fix && <ChevronDown size={11} style={{ color: C.muted, flexShrink: 0, marginTop: 3, transform: openIds[c.id] ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />}
                </div>
                {openIds[c.id] && c.fix && (
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${bdOf[c.status]}`, fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
                    <strong style={{ color: C.text }}>Soluzione:</strong> {c.fix}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            <button onClick={() => setResult(null)} style={{ ...btnS(false, true) }}><RefreshCw size={12} /> Nuova scansione</button>
            <button style={{ ...btnS(false, true) }}><Download size={12} /> Scarica report</button>
          </div>
        </div>
      )}

      {!result && rawText && !loading && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <div style={{ background: C.warnBg, border: `1px solid ${C.warn}40`, borderRadius: 10, padding: "10px 13px", fontSize: 12, color: C.warn, marginBottom: 10 }}>
            Risposta grezza (parsing fallito):
          </div>
          <pre style={{ fontSize: 11, fontFamily: "monospace", color: C.accentL, background: "#030611", padding: 14, borderRadius: 10, border: `1px solid ${C.border}`, whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 300, overflowY: "auto" }}>
            {rawText}
          </pre>
        </div>
      )}

      {!result && !loading && !rawText && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 40, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Serio size={100} mood="idle" />
          <p style={{ fontSize: 13, color: C.muted, marginTop: 14, textAlign: "center", lineHeight: 1.7 }}>
            Nessuna scansione ancora.<br />Inserisci un URL e avvia l'analisi.
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── PRICING PAGE ──────────────────────────────────────────────── */
function PricingPage() {
  const [billing, setBilling] = useState("annual");
  const [checkout, setCheckout] = useState(null);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [card, setCard] = useState({ num: "", exp: "", cvc: "" });

  const plans = [
    { name: "Starter", mo: 0, yr: 0, color: C.muted, desc: "Per iniziare con il SEO", features: ["5 generazioni/mese", "10 scansioni/mese", "Meta tag base", "Community support"] },
    { name: "Pro", mo: 29, yr: 19, color: C.accent, popular: true, desc: "Per professionisti & freelancer", features: ["Generazioni illimitate", "Scansioni illimitate", "Tutti i blocchi SEO", "Export PDF report", "Cronologia 90 giorni", "Supporto prioritario"] },
    { name: "Agency", mo: 79, yr: 55, color: C.warn, desc: "Per agenzie & team", features: ["Tutto di Pro", "Fino a 10 utenti", "API access", "White label report", "Integrazione CMS", "Account manager dedicato"] },
  ];

  const pay = async () => {
    setPaying(true);
    await new Promise((r) => setTimeout(r, 2000));
    setPaying(false); setPaid(true);
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 860, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: C.text, margin: 0, letterSpacing: "-0.8px" }}>Scegli il tuo piano</h1>
        <p style={{ fontSize: 13, color: C.muted, marginTop: 7 }}>Prezzi trasparenti. Nessun costo nascosto. Disdici quando vuoi.</p>
        <div style={{ display: "inline-flex", gap: 0, background: C.card2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 4, marginTop: 18 }}>
          {[["monthly", "Mensile"], ["annual", "Annuale"]].map(([b, lbl]) => (
            <button key={b} onClick={() => setBilling(b)}
              style={{ ...btnS(billing === b, true), borderRadius: 8, padding: "7px 16px", border: billing === b ? `1px solid ${C.accent}` : "1px solid transparent" }}>
              {lbl}{b === "annual" && <span style={{ fontSize: 10, background: C.success, color: "#fff", borderRadius: 20, padding: "1px 6px", marginLeft: 5 }}>-35%</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        {plans.map((p) => {
          const price = billing === "annual" ? p.yr : p.mo;
          return (
            <div key={p.name} style={{ background: C.card, border: `1.5px solid ${p.popular ? p.color : C.border}`, borderRadius: 16, padding: 24, position: "relative", boxShadow: p.popular ? `0 0 24px ${C.accent}20` : "none" }}>
              {p.popular && <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: C.accent, color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>Più popolare</div>}
              <div style={{ fontSize: 11, color: p.color, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.8 }}>{p.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3, margin: "10px 0 3px" }}>
                <span style={{ fontSize: 36, fontWeight: 900, color: C.text, letterSpacing: "-1px" }}>€{price}</span>
                <span style={{ fontSize: 12, color: C.muted }}>/mese</span>
              </div>
              {billing === "annual" && p.yr > 0 && <div style={{ fontSize: 10, color: C.dim, marginBottom: 5 }}>Fatturato €{p.yr * 12}/anno</div>}
              <p style={{ fontSize: 12, color: C.muted, margin: "0 0 16px" }}>{p.desc}</p>
              <button onClick={() => price > 0 && setCheckout(p)}
                style={{ ...btnS(p.popular, true), width: "100%", justifyContent: "center", padding: "9px", opacity: price === 0 ? 0.6 : 1 }}>
                {price === 0 ? "Piano attuale" : `Inizia ${p.name}`}
              </button>
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 9 }}>
                {p.features.map((feat) => (
                  <div key={feat} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: C.text }}>
                    <Check size={12} style={{ color: p.color, flexShrink: 0 }} /> {feat}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {checkout && !paid && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 30, width: 400, maxWidth: "92%", animation: "popIn 0.3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 900, color: C.text }}>Piano {checkout.name}</div>
                <div style={{ fontSize: 12, color: C.muted }}>€{billing === "annual" ? checkout.yr : checkout.mo}/mese</div>
              </div>
              <button onClick={() => setCheckout(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted }}><X size={17} /></button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 12px", marginBottom: 16, fontSize: 11, color: C.muted }}>
              <Lock size={11} style={{ color: C.success }} /> Pagamento sicuro — powered by Stripe
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5 }}>Numero carta</label>
              <input style={inpS()} placeholder="1234 5678 9012 3456" value={card.num} onChange={(e) => setCard((c) => ({ ...c, num: e.target.value }))} maxLength={19} />
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5 }}>Scadenza</label>
                <input style={inpS()} placeholder="MM/YY" value={card.exp} onChange={(e) => setCard((c) => ({ ...c, exp: e.target.value }))} maxLength={5} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5 }}>CVC</label>
                <input style={inpS()} placeholder="123" value={card.cvc} onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value }))} maxLength={3} />
              </div>
            </div>
            <button onClick={pay} disabled={paying}
              style={{ ...btnS(true), width: "100%", justifyContent: "center", padding: "12px", borderRadius: 11, fontSize: 13 }}>
              {paying ? <RefreshCw size={14} style={{ animation: "spin 0.8s linear infinite" }} /> : <CreditCard size={14} />}
              {paying ? "Elaborazione..." : `Paga €${billing === "annual" ? checkout.yr : checkout.mo}/mese`}
            </button>
          </div>
        </div>
      )}

      {paid && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 40, width: 360, textAlign: "center", animation: "popIn 0.35s ease" }}>
            <Serio size={110} mood="success" />
            <h2 style={{ color: C.text, margin: "16px 0 8px", fontSize: 18, fontWeight: 900 }}>Pagamento completato!</h2>
            <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>Il piano <strong style={{ color: C.text }}>{checkout?.name}</strong> è attivo. Buona ottimizzazione!</p>
            <button onClick={() => { setPaid(false); setCheckout(null); }}
              style={{ ...btnS(true), margin: "20px auto 0", padding: "10px 22px", borderRadius: 10, display: "inline-flex" }}>
              Vai alla dashboard <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── HISTORY PAGE ──────────────────────────────────────────────── */
function HistoryPage({ history, setHistory }) {
  const sc = (s) => s === null ? C.muted : s >= 70 ? C.success : s >= 40 ? C.warn : C.error;
  if (!history.length) return (
    <div style={{ padding: 32, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 420 }}>
      <Serio size={100} mood="idle" />
      <p style={{ fontSize: 13, color: C.muted, marginTop: 16, textAlign: "center", lineHeight: 1.8 }}>
        Nessuna attività ancora.<br />Inizia da <strong style={{ color: C.text }}>Genera Meta Tags</strong> o <strong style={{ color: C.text }}>Scansiona Sito</strong>.
      </p>
    </div>
  );
  return (
    <div style={{ padding: "28px 32px", maxWidth: 820, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.text, margin: 0, letterSpacing: "-0.5px" }}>Cronologia</h1>
        <button onClick={() => setHistory([])} style={{ ...btnS(false, true), color: C.error, borderColor: `${C.error}35` }}>
          <Trash2 size={12} /> Cancella tutto
        </button>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["Tipo", "Riferimento", "Score", "Data", ""].map((h) => (
                <th key={h} style={{ padding: "11px 16px", fontSize: 11, color: C.muted, fontWeight: 700, textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((item, i) => (
              <tr key={i} style={{ borderBottom: i < history.length - 1 ? `1px solid ${C.border}` : "none", animation: "fadeUp 0.3s ease" }}>
                <td style={{ padding: "11px 16px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, background: item.type === "scanner" ? C.accentDim : C.successBg, color: item.type === "scanner" ? C.accentL : C.success, borderRadius: 6, padding: "3px 8px" }}>
                    {item.type === "scanner" ? <Search size={9} /> : <Sparkles size={9} />}
                    {item.type === "scanner" ? "Scanner" : "Generatore"}
                  </span>
                </td>
                <td style={{ padding: "11px 16px", fontSize: 13, color: C.text }}>{item.label}</td>
                <td style={{ padding: "11px 16px", fontSize: 16, fontWeight: 900, color: sc(item.score) }}>{item.score !== null ? item.score : "—"}</td>
                <td style={{ padding: "11px 16px", fontSize: 11, color: C.muted }}>{item.date}</td>
                <td style={{ padding: "11px 16px" }}>
                  <button onClick={() => setHistory((h) => h.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: C.dim, padding: 4, display: "flex" }}><Trash2 size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── PROFILE ───────────────────────────────────────────────────── */
function ProfilePage({ user }) {
  return (
    <div style={{ padding: "28px 32px", maxWidth: 560, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 900, color: C.text, margin: "0 0 22px", letterSpacing: "-0.5px" }}>Profilo</h1>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, paddingBottom: 18, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.accentDim, border: `2px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: C.accentL }}>
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{user.name}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{user.email}</div>
            <div style={{ fontSize: 11, color: C.success, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><Check size={10} /> Piano Starter attivo</div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
          Per cambiare piano vai a <strong style={{ color: C.text }}>Piani & Prezzi</strong>.
        </p>
      </div>
    </div>
  );
}

/* ─── ROOT APP ──────────────────────────────────────────────────── */
export default function SeoMasterAI() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("generator");
  const [collapsed, setCollapsed] = useState(false);
  const [history, setHistory] = useState([]);
  const addHistory = useCallback((item) => setHistory((h) => [item, ...h].slice(0, 60)), []);

  if (!user) return <><GlobalStyle /><AuthPage onLogin={setUser} /></>;

  const labels = { generator: "Genera Meta Tags", scanner: "Scansiona Sito", pricing: "Piani & Prezzi", history: "Cronologia", profile: "Profilo" };

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, overflow: "hidden" }}>
      <GlobalStyle />
      <Sidebar page={page} setPage={setPage} user={user} onLogout={() => setUser(null)} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <header style={{ height: 52, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", flexShrink: 0, background: C.card }}>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{labels[page]}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, display: "flex" }}><Bell size={15} /></button>
            <div onClick={() => setPage("profile")} style={{ width: 28, height: 28, borderRadius: "50%", background: C.accentDim, border: `1px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: C.accentL, cursor: "pointer" }}>
              {user.name[0].toUpperCase()}
            </div>
          </div>
        </header>
        <main style={{ flex: 1, overflowY: "auto" }}>
          {page === "generator" && <GeneratorPage addHistory={addHistory} />}
          {page === "scanner" && <ScannerPage addHistory={addHistory} />}
          {page === "pricing" && <PricingPage />}
          {page === "history" && <HistoryPage history={history} setHistory={setHistory} />}
          {page === "profile" && <ProfilePage user={user} />}
        </main>
      </div>
    </div>
  );
}
