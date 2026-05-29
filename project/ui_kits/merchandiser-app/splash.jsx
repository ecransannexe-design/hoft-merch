/* HOFT — splash entry (logo + WHO? / WHERE? pickers) */
const { useState } = React;

function Pill({ label, value, onClick, tone = "light" }) {
  const filled = !!value;
  return (
    <button onClick={onClick} style={{
      width: "100%", borderRadius: 999, cursor: "pointer",
      background: filled ? "#ffffff" : "#f4f4f4", border: "1px solid #e3e3e3",
      color: "#1b1b1b", padding: "15px 22px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      fontFamily: "var(--font-ui)", transition: "transform .12s, background .15s",
    }}
      onMouseDown={e => e.currentTarget.style.transform = "scale(.975)"}
      onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
      <span style={{ fontWeight: 800, letterSpacing: ".06em", fontSize: 14, color: filled ? "#7d7d7d" : "#1b1b1b" }}>
        {label}
      </span>
      {filled && <span style={{ fontWeight: 700, fontSize: 15, textAlign: "right", marginLeft: 12 }}>{value}</span>}
    </button>
  );
}

function PickerSheet({ open, title, children, onClose }) {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 80,
      pointerEvents: open ? "auto" : "none",
    }}>
      <div onClick={onClose} style={{
        position: "absolute", inset: 0, background: "rgba(0,0,0,.45)",
        opacity: open ? 1 : 0, transition: "opacity .26s",
      }} />
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        background: "#fff", borderRadius: "20px 20px 0 0",
        maxHeight: "76%", display: "flex", flexDirection: "column",
        transform: open ? "translateY(0)" : "translateY(105%)",
        transition: "transform .34s cubic-bezier(.22,.61,.36,1)",
        boxShadow: "0 -8px 28px rgba(0,0,0,.22)", paddingBottom: 28,
      }}>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10 }}>
          <div style={{ width: 40, height: 5, borderRadius: 99, background: "#d2d2d2" }} />
        </div>
        <div style={{
          fontFamily: "var(--font-label)", fontWeight: 800, fontStyle: "italic",
          fontSize: 22, padding: "12px 22px 8px", color: "#1b1b1b",
        }}>{title}</div>
        <div style={{ overflowY: "auto", padding: "4px 14px 8px" }}>{children}</div>
      </div>
    </div>
  );
}

function SplashScreen({ rep, store, onPickRep, onPickStore, onEnter }) {
  const { STORES, REPS, BANNER_LABEL } = window.HOFT_DATA;
  const [sheet, setSheet] = useState(null); // 'who' | 'where' | null

  // No explicit enter button — advance automatically once both are chosen.
  const handleRep = r => { onPickRep(r); setSheet(null); if (store) onEnter(); };
  const handleStore = s => { onPickStore(s); setSheet(null); if (rep) onEnter(); };

  const rowStyle = active => ({
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 16px", borderRadius: 12, cursor: "pointer",
    background: active ? "#141414" : "#f4f4f4", color: active ? "#fff" : "#1b1b1b",
    marginBottom: 8, fontFamily: "var(--font-ui)",
  });

  return (
    <div style={{
      position: "absolute", inset: 0, background: "#4a4a4a", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "space-between",
      padding: "120px 30px 56px",
    }}>
      {/* logo */}
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
        <img src="assets/hoft-logo.png" alt="HOFT merchandising"
          style={{ width: 220 }} />
      </div>

      {/* pickers */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
        <Pill label="WHO?" value={rep} onClick={() => setSheet("who")} />
        <Pill label="WHERE?" value={store ? `${BANNER_LABEL[store.banner]} · ${store.name}` : ""} tone="dark" onClick={() => setSheet("where")} />
      </div>

      <PickerSheet open={sheet === "who"} title="who is visiting?" onClose={() => setSheet(null)}>
        {REPS.map(r => (
          <div key={r} style={rowStyle(r === rep)} onClick={() => handleRep(r)}>
            <span style={{ fontWeight: 600, fontSize: 15 }}>{r}</span>
            {r === rep && <span style={{ fontSize: 13 }}>✓</span>}
          </div>
        ))}
      </PickerSheet>

      <PickerSheet open={sheet === "where"} title="which store?" onClose={() => setSheet(null)}>
        {STORES.map(s => (
          <div key={s.id} style={rowStyle(store && s.id === store.id)} onClick={() => handleStore(s)}>
            <span>
              <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: ".02em" }}>{BANNER_LABEL[s.banner]}</span>
              <span style={{ fontWeight: 500, fontSize: 14, opacity: .85 }}> · {s.name}</span>
              <span style={{ display: "block", fontSize: 11, opacity: .55, marginTop: 2 }}>{s.prov} · #{s.id}</span>
            </span>
            {store && s.id === store.id && <span style={{ fontSize: 13 }}>✓</span>}
          </div>
        ))}
      </PickerSheet>
    </div>
  );
}

window.SplashScreen = SplashScreen;
