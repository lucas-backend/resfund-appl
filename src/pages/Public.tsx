import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getProject,
  pct,
  projects,
  rupiah,
  type ProjStatus,
  type Role,
} from "../data";
import { Badge, Field, MilestoneBar } from "../components/ui";
import { homeOf, useRole } from "../role";

/* UI-01 Halaman publik proyek */
export function Projects() {
  const [f, setF] = useState<"ALL" | ProjStatus>("ACTIVE");
  const [q, setQ] = useState("");
  const list = projects.filter(
    (p) =>
      (f === "ALL" || p.status === f) &&
      `${p.judul} ${p.bidang}`.toLowerCase().includes(q.toLowerCase()),
  );
  const hero = projects[0];
  return (
    <>
      <section className="hero">
        <div>
          <h1>
            Danai riset kampus. Dana dicairkan per tahap, setelah hasilnya
            diperiksa.
          </h1>
          <p>
            Donasi disimpan di escrow. Tiap tahap baru dicairkan setelah dua
            reviewer independen menyetujui hasilnya.
          </p>
        </div>
        <Link to={`/proyek/${hero.id}`} className="featured">
          <h2>{hero.judul}</h2>
          <MilestoneBar items={hero.milestones} big />
          <span className="fund">
            {rupiah(hero.terkumpul)} terkumpul dari {rupiah(hero.target)}
          </span>
        </Link>
      </section>
      <div className="toolbar">
        <div className="seg-ctl" role="group" aria-label="Filter status">
          {(
            [
              ["ACTIVE", "Sedang dibuka"],
              ["FUNDED", "Sudah terdanai"],
              ["ALL", "Semua"],
            ] as const
          ).map(([k, l]) => (
            <button key={k} aria-pressed={f === k} onClick={() => setF(k)}>
              {l}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Cari judul atau bidang"
          aria-label="Cari proyek"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {list.length === 0 && (
        <p className="empty">
          Tidak ada proyek yang cocok. Ubah filter atau kata kunci pencarian.
        </p>
      )}
      <ul className="rows">
        {list.map((p) => (
          <li key={p.id}>
            <div>
              <Link to={`/proyek/${p.id}`} className="title">
                {p.judul}
              </Link>
              <p className="meta">
                {p.peneliti}, {p.institusi} &middot; {p.bidang}
              </p>
            </div>
            <MilestoneBar items={p.milestones} />
            <div className="num">
              <b>{pct(p)}%</b>
              <span>{rupiah(p.terkumpul)}</span>
              <span>
                {p.sisaHari > 0
                  ? `${p.sisaHari} hari lagi`
                  : "Kampanye ditutup"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export function ProjectDetail() {
  const p = getProject(useParams().id);
  return (
    <div className="split">
      <article>
        <div className="crumbs">
          <Link to="/">Proyek riset</Link> / {p.bidang}
        </div>
        <h1>{p.judul}</h1>
        <p className="meta">
          {p.peneliti}, {p.institusi} <Badge s={p.status} />
        </p>
        <p className="lead">{p.ringkasan}</p>
        <h2>Rencana pencairan dana</h2>
        <MilestoneBar items={p.milestones} big />
        <table>
          <thead>
            <tr>
              <th>Milestone</th>
              <th>Target selesai</th>
              <th className="r">Dana</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {p.milestones.map((m, i) => (
              <tr key={m.id}>
                <td>
                  {i + 1}. {m.nama}
                </td>
                <td>{m.target}</td>
                <td className="r">{rupiah((p.target * m.persen) / 100)}</td>
                <td>
                  <Badge s={m.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
      <aside className="panel">
        <b className="big-num">{rupiah(p.terkumpul)}</b>
        <span>terkumpul dari {rupiah(p.target)}</span>
        <div
          className="meter"
          role="img"
          aria-label={`${pct(p)} persen dari target`}
        >
          <i style={{ width: `${pct(p)}%` }} />
        </div>
        <dl>
          <div>
            <dt>Donatur</dt>
            <dd>{p.donatur}</dd>
          </div>
          <div>
            <dt>Batas waktu</dt>
            <dd>{p.deadline}</dd>
          </div>
        </dl>
        <Link className="btn" to={`/donasi/${p.id}`}>
          Donasi untuk proyek ini
        </Link>
        <Link className="btn ghost" to={`/laporan/${p.id}`}>
          Lihat laporan keuangan
        </Link>
        <small>
          Jika target tidak tercapai sebelum batas waktu, semua donasi
          dikembalikan otomatis.
        </small>
      </aside>
    </div>
  );
}

/* UI-02 Registrasi dan login */
export function Auth() {
  const [mode, setMode] = useState<"masuk" | "daftar">("masuk");
  const [r, setR] = useState<Role>("DONATUR");
  const [nid, setNid] = useState("");
  const [ver, setVer] = useState<"idle" | "busy" | "ok">("idle");
  const { setRole } = useRole();
  const go = useNavigate();
  const verify = () => {
    setVer("busy");
    setTimeout(() => setVer("ok"), 800);
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setRole(r);
    go(homeOf[r]);
  };
  return (
    <div className="narrow">
      <div className="tabs" role="tablist">
        {(["masuk", "daftar"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
          >
            {m === "masuk" ? "Masuk" : "Daftar"}
          </button>
        ))}
      </div>
      <form onSubmit={submit}>
        {mode === "daftar" && (
          <Field id="nama" label="Nama lengkap">
            <input id="nama" required />
          </Field>
        )}
        <Field id="email" label="Email">
          <input id="email" type="email" required />
        </Field>
        <Field id="pw" label="Kata sandi" hint="Minimal 12 karakter.">
          <input id="pw" type="password" minLength={12} required />
        </Field>
        <Field
          id="role"
          label={mode === "masuk" ? "Masuk sebagai (khusus mockup)" : "Peran"}
        >
          <select
            id="role"
            value={r}
            onChange={(e) => setR(e.target.value as Role)}
          >
            <option value="DONATUR">Donatur</option>
            <option value="PENELITI">Peneliti</option>
            <option value="REVIEWER">Reviewer</option>
            <option value="ADMIN">Administrator</option>
          </select>
        </Field>
        {mode === "daftar" && r !== "DONATUR" && (
          <Field
            id="nid"
            label="NIDN atau NIM"
            hint="Identitas akademik diperiksa melalui PDDikti."
          >
            <div className="inline">
              <input
                id="nid"
                value={nid}
                onChange={(e) => {
                  setNid(e.target.value);
                  setVer("idle");
                }}
              />
              <button
                type="button"
                className="btn ghost"
                disabled={!nid || ver === "busy"}
                onClick={verify}
              >
                {ver === "busy" ? "Memeriksa…" : "Periksa identitas"}
              </button>
            </div>
            {ver === "ok" && (
              <small className="ok">
                Identitas terverifikasi. Terdaftar di Universitas Lampung.
              </small>
            )}
          </Field>
        )}
        <button
          className="btn"
          disabled={mode === "daftar" && r !== "DONATUR" && ver !== "ok"}
        >
          {mode === "masuk" ? "Masuk" : "Buat akun"}
        </button>
      </form>
    </div>
  );
}
