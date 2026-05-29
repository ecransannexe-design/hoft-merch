/* HOFT merchandiser app — main shell + mount */
const { useState: useStateM } = React;

function AppHeader() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "10px 0 12px", borderBottom: "1px solid #ededed", background: "#fff",
    }}>
      <img src="assets/hoft-wordmark.png" alt="HOFT" style={{ height: 26 }} />
    </div>
  );
}

function HoftApp() {
  const [screen, setScreen] = useStateM("splash"); // splash | app
  const [rep, setRep] = useStateM(null);
  const [store, setStore] = useStateM(null);

  // visit state
  const [active, setActive] = useStateM(0);
  const [captures, setCaptures] = useStateM({});
  const [answers, setAnswers] = useStateM({});
  const [missing, setMissing] = useStateM([]);
  const [pics, setPics] = useStateM([]);
  const [completed, setCompleted] = useStateM(false);

  const capturesDone = Object.values(captures).filter(Boolean).length;
  const answered = Object.values(answers).filter(Boolean).length;

  if (screen === "splash") {
    return (
      <window.IOSDevice dark>
        <window.SplashScreen
          rep={rep} store={store}
          onPickRep={setRep} onPickStore={setStore}
          onEnter={() => setScreen("app")} />
      </window.IOSDevice>
    );
  }

  const folders = [
    { key: "info", label: "info", content: <window.InfoFolder store={store} /> },
    { key: "start", label: "start", badge: capturesDone || null,
      content: <window.StartFolder captures={captures} setCaptures={setCaptures} /> },
    { key: "check", label: "check list", badge: (answered + (missing.length ? 1 : 0)) || null,
      content: <window.ChecklistFolder answers={answers} setAnswers={setAnswers} missing={missing} setMissing={setMissing} /> },
    { key: "pics", label: "pictures", badge: pics.length || null,
      content: <window.PicturesFolder pics={pics} setPics={setPics} /> },
    { key: "done", label: "complete",
      content: <window.CompleteFolder rep={rep} store={store} completed={completed}
        summary={{ captures: capturesDone, answered, missing: missing.length, pics: pics.length }}
        onComplete={() => setCompleted(true)} /> },
  ];

  return (
    <window.IOSDevice>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#fff" }}>
        <AppHeader />
        {/* store strip + change */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 18px", background: "#fafafa", borderBottom: "1px solid #ededed" }}>
          <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "#7d7d7d" }}>
            {rep} · {window.HOFT_DATA.BANNER_LABEL[store.banner]} {store.name}
          </span>
          <button onClick={() => setScreen("splash")} style={{ border: "none", background: "transparent", color: "#141414", fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>change</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <window.FolderAccordion active={active} setActive={setActive} folders={folders} />
        </div>
      </div>
    </window.IOSDevice>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<HoftApp />);
