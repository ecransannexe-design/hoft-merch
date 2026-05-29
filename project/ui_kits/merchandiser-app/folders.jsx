/* HOFT — folder contents (info / start / check list / pictures / complete) */
const { useState: useStateF } = React;

const HEAT = ["#6B3A2A", "#B5531F", "#E8731C", "#F2901C", "#F6B41C", "#F7C915"];

/* ---------- shared bits ---------- */
function Row({ label, value, strong }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "7px 0" }}>
      <span style={{ fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".02em", color: "#4a4a4a" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-num)", fontVariantNumeric: "tabular-nums", fontWeight: 700, fontSize: 16, color: strong ? "#141414" : "#1b1b1b" }}>{value}</span>
    </div>
  );
}

function ConditionTile({ idx, photo, onPick }) {
  const c = HEAT[idx % HEAT.length];
  const onChange = e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => onPick(reader.result);
    reader.readAsDataURL(f);
  };
  return (
    <label style={{
      width: "100%", aspectRatio: "1", borderRadius: "50%", cursor: "pointer",
      background: photo ? "#000" : c, position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "rgba(255,255,255,.92)", fontSize: 30, fontWeight: 300, transition: "transform .12s",
    }}
      onMouseDown={e => e.currentTarget.style.transform = "scale(.93)"}
      onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
      {photo
        ? <img src={photo} alt="arrival" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        : "+"}
      {photo && <span style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: "inset 0 0 0 4px rgba(255,255,255,.85)" }} />}
      <input type="file" accept="image/*" capture="environment" onChange={onChange} style={{ display: "none" }} />
    </label>
  );
}

/* ---------- INFO ---------- */
function InfoFolder({ store }) {
  const { fmtMoney, BANNER_LABEL } = window.HOFT_DATA;
  const up = store.ytd >= store.lastYear;
  return (
    <div>
      <div style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 18, letterSpacing: ".01em", color: "#141414", marginBottom: 12 }}>
        {BANNER_LABEL[store.banner]} — {store.name.toUpperCase()}
      </div>
      <Row label="Year to date" value={fmtMoney(store.ytd)} strong />
      <Row label="Last year" value={fmtMoney(store.lastYear)} />
      <button style={{
        width: "100%", border: "none", borderRadius: 999, marginTop: 12, marginBottom: 16,
        padding: "14px 0", cursor: "pointer", fontFamily: "var(--font-ui)",
        fontWeight: 800, fontStyle: "italic", letterSpacing: ".05em", fontSize: 16, color: "#fff",
        background: up ? "var(--success)" : "var(--alert)", boxShadow: "var(--shadow-card)",
      }}>{up ? "CONGRATS!" : "WHY?"}</button>
      <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "#4a4a4a", lineHeight: 1.7 }}>
        <div><b>Last visit:</b> {store.lastVisit}</div>
        <div style={{ marginTop: 6 }}>– Stock Issues</div>
        <div>– Knowledge</div>
        <div style={{ color: "var(--ink-3)" }}>– MORE INFO</div>
      </div>
    </div>
  );
}

/* ---------- START ---------- */
function StartFolder({ captures, setCaptures }) {
  const setPhoto = (i, url) => setCaptures(c => ({ ...c, [i]: url }));
  const done = Object.values(captures).filter(Boolean).length;
  return (
    <div>
      <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, color: "#1b1b1b", lineHeight: 1.45, marginBottom: 4 }}>
        Photos when you arrived: <span style={{ color: "var(--alert)" }}>do not replace any product!</span>
      </p>
      <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "#7d7d7d", marginBottom: 16 }}>(we want the real thing) — tap a circle to open the camera or upload</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <ConditionTile key={i} idx={i} photo={captures[i]} onPick={url => setPhoto(i, url)} />
        ))}
      </div>
      <div style={{ marginTop: 14, fontFamily: "var(--font-ui)", fontSize: 12, color: "#7d7d7d", textAlign: "center" }}>
        {done}/6 arrival photos captured
      </div>
    </div>
  );
}

/* ---------- CHECK LIST ---------- */
function ChecklistFolder({ answers, setAnswers, missing, setMissing }) {
  const { CHECKLIST, PRODUCTS } = window.HOFT_DATA;
  const [showProducts, setShowProducts] = useStateF(false);
  const toggleAns = id => setAnswers(a => ({ ...a, [id]: !a[id] }));
  const toggleProd = p => setMissing(m => m.includes(p) ? m.filter(x => x !== p) : [...m, p]);

  return (
    <div>
      {CHECKLIST.map(item => {
        const on = !!answers[item.id];
        return (
          <div key={item.id} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14,
            padding: "12px 14px", borderRadius: 12, background: "#f4f4f4", marginBottom: 10,
          }}>
            <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12.5, textTransform: "uppercase", letterSpacing: ".01em", color: "#1b1b1b", lineHeight: 1.3 }}>{item.q}</span>
            <button onClick={() => toggleAns(item.id)} style={{
              flex: "none", border: "none", borderRadius: 999, padding: "9px 22px", cursor: "pointer",
              fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 13, letterSpacing: ".05em",
              background: on ? "#141414" : "#d2d2d2", color: on ? "#fff" : "#3a3a3a",
              transition: "background .15s",
            }}>YES</button>
          </div>
        );
      })}

      <button onClick={() => setShowProducts(s => !s)} style={{
        width: "100%", border: "none", borderRadius: 12, padding: "13px 16px", marginTop: 2, cursor: "pointer",
        background: "#8f8f8f", color: "#fff", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span>select missing products ({PRODUCTS.length} options)</span>
        <span style={{ fontWeight: 800 }}>{missing.length ? missing.length : showProducts ? "▲" : "▼"}</span>
      </button>

      <div style={{ maxHeight: showProducts ? 320 : 0, overflow: "hidden", transition: "max-height .34s cubic-bezier(.22,.61,.36,1)" }}>
        <div style={{ overflowY: "auto", maxHeight: 320, marginTop: 10, paddingRight: 2 }}>
          {PRODUCTS.map(p => {
            const sel = missing.includes(p);
            return (
              <div key={p} onClick={() => toggleProd(p)} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 8px", cursor: "pointer",
                borderBottom: "1px solid #ededed",
              }}>
                <span style={{
                  width: 20, height: 20, borderRadius: 5, flex: "none",
                  border: sel ? "none" : "2px solid #c4c4c4", background: sel ? "var(--alert)" : "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700,
                }}>{sel ? "✓" : ""}</span>
                <span style={{ fontFamily: "var(--font-ui)", fontSize: 12.5, color: "#1b1b1b" }}>{p}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- PICTURES ---------- */
function PicturesFolder({ pics, setPics }) {
  const onChange = e => {
    const files = Array.from(e.target.files || []);
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = () => setPics(p => [...p, reader.result]);
      reader.readAsDataURL(f);
    });
    e.target.value = "";
  };
  return (
    <div>
      <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, color: "#1b1b1b", marginBottom: 14 }}>
        After photos — show the finished display.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {pics.map((url, i) => (
          <div key={i} style={{ width: "100%", aspectRatio: "1", borderRadius: 8, overflow: "hidden", background: "#000" }}>
            <img src={url} alt="after" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ))}
        <label style={{
          width: "100%", aspectRatio: "1", borderRadius: 8, cursor: "pointer",
          background: "#f4f4f4", border: "1.5px dashed #bcbcbc", color: "#7d7d7d", fontSize: 30, fontWeight: 300,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          +
          <input type="file" accept="image/*" capture="environment" multiple onChange={onChange} style={{ display: "none" }} />
        </label>
      </div>
      <div style={{ marginTop: 12, fontFamily: "var(--font-ui)", fontSize: 12, color: "#7d7d7d", textAlign: "center" }}>{pics.length} photo{pics.length === 1 ? "" : "s"} added</div>
    </div>
  );
}

/* ---------- COMPLETE ---------- */
function CompleteFolder({ rep, store, summary, onComplete, completed }) {
  const { BANNER_LABEL } = window.HOFT_DATA;
  if (completed) {
    return (
      <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--success)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, margin: "0 auto 14px" }}>✓</div>
        <div style={{ fontFamily: "var(--font-label)", fontWeight: 800, fontStyle: "italic", fontSize: 24, color: "#141414" }}>Visit logged</div>
        <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "#7d7d7d", marginTop: 6 }}>
          {BANNER_LABEL[store.banner]} · {store.name} — {rep}
        </p>
      </div>
    );
  }
  return (
    <div>
      <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, color: "#1b1b1b", marginBottom: 12 }}>Review &amp; submit this visit.</p>
      <div style={{ background: "#f4f4f4", borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
        <Row label="Arrival photos" value={`${summary.captures}/6`} />
        <Row label="Checklist" value={`${summary.answered}/3`} />
        <Row label="Missing SKUs" value={summary.missing} />
        <Row label="After photos" value={summary.pics} />
      </div>
      <button onClick={onComplete} style={{
        width: "100%", border: "none", borderRadius: 999, padding: "15px 0", cursor: "pointer",
        background: "#141414", color: "#fff", fontFamily: "var(--font-ui)", fontWeight: 800,
        fontStyle: "italic", letterSpacing: ".05em", fontSize: 16,
      }}>COMPLETE VISIT</button>
    </div>
  );
}

Object.assign(window, { InfoFolder, StartFolder, ChecklistFolder, PicturesFolder, CompleteFolder });
