/* HOFT — folder accordion (the collapse-down motion) */
const { useState: useStateA } = React;

function FolderAccordion({ active, setActive, folders }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "4px 16px 24px" }}>
      {folders.map((f, i) => {
        const isActive = i === active;
        const grayMap = ["#e4e4e4", "#d2d2d2", "#bcbcbc", "#a6a6a6", "#8f8f8f"];
        const collapsedBg = grayMap[i];
        const labelColor = isActive ? "#141414" : (i >= 3 ? "#fff" : "#1b1b1b");
        return (
          <div key={f.key} style={{
            borderRadius: 14, overflow: "hidden",
            background: isActive ? "#fff" : collapsedBg,
            border: isActive ? "1px solid #e3e3e3" : "none",
            boxShadow: isActive ? "0 4px 16px rgba(0,0,0,.12)" : "0 1px 0 rgba(255,255,255,.4) inset",
            transition: "background .26s, box-shadow .26s",
          }}>
            <button onClick={() => setActive(isActive ? -1 : i)} style={{
              width: "100%", border: "none", background: "transparent", cursor: "pointer",
              padding: "13px 18px", display: "flex", alignItems: "center", justifyContent: "space-between",
              fontFamily: "var(--font-label)", fontWeight: 800, fontStyle: "italic",
              fontSize: 23, letterSpacing: "-.01em", color: labelColor, textAlign: "left",
            }}>
              <span>{f.label}</span>
              {f.badge != null && (
                <span style={{
                  fontFamily: "var(--font-ui)", fontStyle: "normal", fontWeight: 800, fontSize: 11,
                  minWidth: 20, height: 20, padding: "0 6px", borderRadius: 999,
                  background: isActive ? "#141414" : "rgba(0,0,0,.18)", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{f.badge}</span>
              )}
            </button>
            <div style={{
              maxHeight: isActive ? 1400 : 0, overflow: "hidden",
              transition: "max-height .42s cubic-bezier(.22,.61,.36,1)",
            }}>
              <div style={{ padding: "0 18px 18px" }}>{f.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

window.FolderAccordion = FolderAccordion;
