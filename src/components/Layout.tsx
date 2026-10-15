import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { homeOf, useRole } from "../role";
import type { Role } from "../data";

const nav: Record<string, [string, string][]> = {
  TAMU: [
    ["/", "Proyek riset"],
    ["/masuk", "Masuk atau daftar"],
  ],
  PENELITI: [
    ["/", "Proyek riset"],
    ["/peneliti", "Dashboard"],
    ["/peneliti/proposal", "Proposal baru"],
    ["/peneliti/milestone", "Milestone"],
  ],
  DONATUR: [
    ["/", "Proyek riset"],
    ["/donatur", "Donasi saya"],
    ["/laporan/1", "Laporan keuangan"],
  ],
  REVIEWER: [
    ["/", "Proyek riset"],
    ["/reviewer", "Evaluasi milestone"],
  ],
  ADMIN: [
    ["/", "Proyek riset"],
    ["/admin", "Administrasi"],
  ],
};

export default function Layout() {
  const { role, setRole } = useRole();
  const go = useNavigate();
  const change = (v: string) => {
    const r = v === "TAMU" ? null : (v as Role);
    setRole(r);
    go(r ? homeOf[r] : "/");
  };
  return (
    <>
      <header className="top">
        <NavLink to="/" className="brand">
          ResFund
        </NavLink>
        <nav aria-label="Navigasi utama">
          {nav[role ?? "TAMU"].map(([to, label]) => (
            <NavLink key={to} to={to} end>
              {label}
            </NavLink>
          ))}
        </nav>
        <label className="roleswitch">
          Lihat sebagai
          <select
            value={role ?? "TAMU"}
            onChange={(e) => change(e.target.value)}
          >
            <option value="TAMU">Tamu</option>
            <option value="PENELITI">Peneliti</option>
            <option value="DONATUR">Donatur</option>
            <option value="REVIEWER">Reviewer</option>
            <option value="ADMIN">Administrator</option>
          </select>
        </label>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="foot">
        Mockup antarmuka ResFund. Semua data di halaman ini adalah contoh.
      </footer>
    </>
  );
}
