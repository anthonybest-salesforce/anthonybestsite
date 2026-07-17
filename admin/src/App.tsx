import { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { getMe, type Me } from "./api";
import { RESOURCES } from "./resources";
import ResourceTable from "./components/ResourceTable";

function Sidebar() {
  const location = useLocation();
  return (
    <div className="sidebar">
      <div className="brand">Chief of Staff</div>
      {RESOURCES.map((r) => (
        <Link
          key={r.key}
          to={`/admin/${r.key}`}
          className={`nav-item ${location.pathname.startsWith(`/admin/${r.key}`) ? "active" : ""}`}
        >
          <span className="nav-icon">{r.icon}</span>
          {r.plural}
        </Link>
      ))}
      <div style={{ flex: 1 }} />
      <a className="nav-item" href="/cdn-cgi/access/logout">
        <span className="nav-icon">⎋</span>
        Sign out
      </a>
    </div>
  );
}

export default function App() {
  const [guard, setGuard] = useState<"loading" | "ok" | "denied">("loading");
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    let active = true;
    getMe()
      .then((m) => {
        if (!active) return;
        setMe(m);
        setGuard(m.admin ? "ok" : "denied");
      })
      .catch(() => {
        if (active) setGuard("denied");
      });
    return () => {
      active = false;
    };
  }, []);

  if (guard === "loading") {
    return <div className="center-screen">Verifying access…</div>;
  }

  if (guard === "denied") {
    return (
      <div className="center-screen">
        <div>
          <h2>Access restricted</h2>
          <p>
            {me?.email
              ? `Signed in as ${me.email}, but this account isn't on the admin list.`
              : "You're signed in, but this account isn't on the admin list."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <Routes>
          <Route path="/admin" element={<Navigate to={`/admin/${RESOURCES[0].key}`} replace />} />
          {RESOURCES.map((r) => (
            <Route key={r.key} path={`/admin/${r.key}`} element={<ResourceTable resource={r} />} />
          ))}
          <Route path="*" element={<Navigate to={`/admin/${RESOURCES[0].key}`} replace />} />
        </Routes>
      </div>
    </div>
  );
}
