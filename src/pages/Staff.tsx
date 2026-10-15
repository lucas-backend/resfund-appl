import { useState } from "react";
import { getProject, projects, rupiah, reviewQueue, users } from "../data";
import { Badge, Field, PageHead } from "../components/ui";

/* UI-08 Dashboard reviewer dan evaluasi */
export function Reviewer() {
  const [sel, setSel] = useState(reviewQueue[0].id);
  const [dec, setDec] = useState("");
  const [done, setDone] = useState<number[]>([]);
  const it = reviewQueue.find((r) => r.id === sel)!;
  const p = getProject(String(it.pid));
  const finished = done.includes(sel);
  return (
    <>
      <PageHead title="Evaluasi milestone" sub="Prof. Hendra Saputra" />
      <div className="split rev">
        <ul className="queue" aria-label="Milestone yang ditugaskan">
          {reviewQueue.map((r) => (
            <li key={r.id}>
              <button
                aria-pressed={sel === r.id}
                onClick={() => {
                  setSel(r.id);
                  setDec("");
                }}
              >
                <b>{r.ms}</b>
                <span>{getProject(String(r.pid)).judul}</span>
                <small>Masuk {r.masuk}</small>
              </button>
            </li>
          ))}
        </ul>
        <section>
          <h2>{it.ms}</h2>
          <p className="meta">
            {p.judul}, oleh {it.peneliti}. Dana tahap ini{" "}
            {rupiah(
              (p.target *
                (p.milestones.find((m) => m.id === it.id)?.persen ?? 0)) /
                100,
            )}
            .
          </p>
          <p className={it.konflik ? "notice warn" : "notice"}>
            {it.konflik
              ? "Potensi konflik kepentingan: Anda dan peneliti berada di institusi yang sama. Ajukan penggantian reviewer ke administrator."
              : "Tidak ada konflik kepentingan terdeteksi."}
          </p>
          <h3>Berkas hasil kerja</h3>
          <ul className="plain files">
            {it.berkas.map((b) => (
              <li key={b}>
                <a href="#unduh">{b}</a>
              </li>
            ))}
          </ul>
          <p className="approvals">
            Persetujuan:{" "}
            <b>
              {it.setuju + (finished && dec === "DISETUJUI" ? 1 : 0)} dari 2
            </b>
            . Dana dicairkan otomatis setelah dua reviewer setuju.
          </p>
          {finished ? (
            <p className="notice" role="status">
              Keputusan Anda tersimpan.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setDone([...done, sel]);
              }}
            >
              <fieldset disabled={it.konflik}>
                <legend>Keputusan</legend>
                <label className="radio">
                  <input
                    type="radio"
                    name="k"
                    checked={dec === "DISETUJUI"}
                    onChange={() => setDec("DISETUJUI")}
                  />{" "}
                  Setujui pencairan
                </label>
                <label className="radio">
                  <input
                    type="radio"
                    name="k"
                    checked={dec === "DITOLAK"}
                    onChange={() => setDec("DITOLAK")}
                  />{" "}
                  Tolak dan minta perbaikan
                </label>
              </fieldset>
              <Field id="cat" label="Catatan" hint="Wajib diisi bila menolak.">
                <textarea id="cat" rows={3} />
              </Field>
              <button className="btn" disabled={!dec || it.konflik}>
                Simpan keputusan
              </button>
            </form>
          )}
        </section>
      </div>
    </>
  );
}

/* UI-09 Dashboard administrator */
export function Admin() {
  return (
    <>
      <PageHead title="Administrasi" />
      <dl className="stats">
        <div>
          <dt>Total dana di escrow</dt>
          <dd>{rupiah(projects.reduce((a, p) => a + p.terkumpul, 0))}</dd>
        </div>
        <div>
          <dt>Refund terjadwal terakhir</dt>
          <dd>Hari ini, 02.00</dd>
        </div>
        <div>
          <dt>Antrean worker</dt>
          <dd>0 tertunda</dd>
        </div>
      </dl>
      <h2>Pengguna</h2>
      <table>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>Peran</th>
            <th>NIDN</th>
            <th>Identitas</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.email}>
              <td>{u.nama}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.nidn}</td>
              <td>
                {u.verif ? (
                  <span className="badge t-green">Terverifikasi</span>
                ) : (
                  <span className="badge t-amber">Belum</span>
                )}
              </td>
              <td className="r">
                {!u.verif && <button className="link">Periksa ulang</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Penugasan reviewer</h2>
      <table>
        <thead>
          <tr>
            <th>Milestone</th>
            <th>Status</th>
            <th>Reviewer 1</th>
            <th>Reviewer 2</th>
          </tr>
        </thead>
        <tbody>
          {reviewQueue.map((r) => (
            <tr key={r.id}>
              <td>
                {r.ms}
                <br />
                <small>{r.peneliti}</small>
              </td>
              <td>
                <Badge s="UNDER_REVIEW" />
              </td>
              {[0, 1].map((i) => (
                <td key={i}>
                  <select
                    aria-label={`Reviewer ${i + 1} untuk ${r.ms}`}
                    defaultValue={i === 0 ? "hendra" : ""}
                  >
                    <option value="">Pilih reviewer</option>
                    <option value="hendra">Prof. Hendra Saputra</option>
                    <option value="sari">Dr. Sari Mulyani</option>
                    <option value="yoga">Dr. Yoga Pratama</option>
                  </select>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
