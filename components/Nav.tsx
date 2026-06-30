"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type User = { name: string } | null;

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("av_user");
      setUser(stored ? JSON.parse(stored) : null);
    } catch {}
  }, []);

  useEffect(() => {
    const onStorage = () => {
      try {
        const stored = localStorage.getItem("av_user");
        setUser(stored ? JSON.parse(stored) : null);
      } catch {}
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("av_user_change", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("av_user_change", onStorage);
    };
  }, []);

  const signOut = () => {
    localStorage.removeItem("av_user");
    setUser(null);
    window.dispatchEvent(new Event("av_user_change"));
    router.push("/");
  };

  const isLib = pathname === "/" || pathname.startsWith("/juegos");
  const isSalon = pathname === "/salon";
  const isAuth = pathname === "/auth";

  return (
    <>
      <nav className="av-nav">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
          <div className="logo-mark" />
          <div className="logo-text neon-cyan">
            ARCADE <span className="neon-magenta">VAULT</span>
          </div>
        </Link>

        <div className="links">
          <Link href="/" className={isLib ? "active" : ""}>Biblioteca</Link>
          <Link href="/salon" className={isSalon ? "active" : ""}>Salón de la Fama</Link>
        </div>

        <div className="spacer" />

        <div className="coin-counter">
          <span className="coin" />
          <span>CRÉDITOS · 03</span>
        </div>

        {user ? (
          <button className="btn ghost auth-btn" onClick={signOut}>
            {user.name} ▾
          </button>
        ) : (
          <Link href="/auth" className="btn auth-btn">
            Iniciar Sesión
          </Link>
        )}

        <button
          className="btn ghost hamburger"
          onClick={() => setOpen(true)}
          aria-label="Menú"
        >
          ≡
        </button>
      </nav>

      <div
        className={"av-mobile-backdrop" + (open ? " open" : "")}
        onClick={() => setOpen(false)}
      />
      <aside className={"av-mobile-panel" + (open ? " open" : "")}>
        <div className="pixel neon-cyan" style={{ fontSize: 11, marginBottom: 16 }}>
          MENÚ
        </div>
        <Link href="/" className={isLib ? "active" : ""} onClick={() => setOpen(false)}>
          Biblioteca
        </Link>
        <Link href="/salon" className={isSalon ? "active" : ""} onClick={() => setOpen(false)}>
          Salón de la Fama
        </Link>
        <Link href="/auth" className={isAuth ? "active" : ""} onClick={() => setOpen(false)}>
          {user ? "Cuenta" : "Iniciar Sesión"}
        </Link>
        <div style={{ flex: 1 }} />
        <div className="pixel" style={{ fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.16em" }}>
          CRÉDITOS · 03
        </div>
      </aside>
    </>
  );
}
