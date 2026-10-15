import { useState } from "react";
import { Link } from "react-router-dom";
import { projects, rupiah, type Milestone } from "../data";
import { Badge, Field, MilestoneBar, PageHead } from "../components/ui";

const mine = projects[0];

/* UI-03 Dashboard peneliti */
export function ResearcherDash() {
  const disbursed = mine.milestones
    .filter((m) => m.status === "DISBURSED")
    .reduce((a, m) => a + (mine.target * m.persen) / 100, 0);
  return (
    <>
      <PageHead
        title="Dashboard peneliti"
        sub="Dr. Ayu Pratiwi, M.Si."
        aside={
          <Link className="btn" to="/peneliti/proposal">
            Buat proposal baru
          </Link>
        }
      />
      <dl className="stats">
        <div>
          <dt>Saldo escrow</dt>
          <dd>{rupiah(mine.terkumpul - disbursed)}</dd>
        </div>
        <div>
          <dt>Sudah dicairkan</dt>
          <dd>{rupiah(disbursed)}</dd>
        </div>
        <div>
          <dt>Menunggu review</dt>
          <dd>1 milestone</dd>
        </div>
      </dl>
      <h2>{mine.judul}</h2>
      <MilestoneBar items={mine.milestones} big />
      <table>
        <thead>
          <tr>
            <th>Milestone</th>
            <th>Target</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {mine.milestones.map((m) => (
            <tr key={m.id}>
              <td>{m.nama}</td>
              <td>{m.target}</td>
              <td>
                <Badge s={m.status} />
              </td>
              <td className="r">
                {m.status === "ACTIVE" ? (
                  <Link to="/peneliti/milestone">Ajukan pencairan</Link>
                ) : m.status === "UNDER_REVIEW" ? (
                  "Menunggu 2 reviewer"
                ) : (
                  ""
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

/* UI-04 Form proposal */
export function Proposal() {
  const [target, setTarget] = useState("");
  const [file, setFile] = useState("");
  const [msg, setMsg] = useState("");
  const bad = target !== "" && Number(target) <= 0;
  const save = (publish: boolean) => {
    if (bad || !target) return;
    setMsg(
      publish
        ? "Proposal dipublikasikan. Status berubah dari Draf menjadi Aktif dan proposal tidak bisa diubah lagi."
        : "Draf tersimpan. Anda masih bisa mengubah proposal sebelum dipublikasikan.",
    );
  };
  return (
    <div className="narrow wide">
      <PageHead
        title="Proposal baru"
        sub="Proposal bisa diubah selama masih berstatus draf."
      />
      <form onSubmit={(e) => e.preventDefault()}>
        <Field id="judul" label="Judul riset">
          <input id="judul" />
        </Field>
        <Field id="bidang" label="Bidang">
          <select id="bidang">
            <option>Kesehatan lingkungan</option>
            <option>Pertanian</option>
            <option>Ilmu kelautan</option>
            <option>Material</option>
          </select>
        </Field>
        <div className="two">
          <Field
            id="target"
            label="Target dana (Rp)"
            error={bad ? "Target dana harus lebih besar dari 0." : undefined}
          >
            <input
              id="target"
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
          </Field>
          <Field id="dl" label="Batas waktu kampanye">
            <input id="dl" type="date" />
          </Field>
        </div>
        <Field
          id="ring"
          label="Ringkasan riset"
          hint="Jelaskan masalah, metode, dan manfaatnya dalam bahasa yang dimengerti donatur awam."
        >
          <textarea id="ring" rows={5} />
        </Field>
        <Field
          id="pdf"
          label="Berkas proposal (PDF)"
          hint={file || "Belum ada berkas dipilih."}
        >
          <input
            id="pdf"
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0]?.name ?? "")}
          />
        </Field>
        {msg && (
          <p className="notice" role="status">
            {msg}
          </p>
        )}
        <div className="inline">
          <button
            type="button"
            className="btn ghost"
            onClick={() => save(false)}
          >
            Simpan draf
          </button>
          <button type="button" className="btn" onClick={() => save(true)}>
            Publikasikan
          </button>
        </div>
      </form>
    </div>
  );
}

/* UI-05 Form milestone dan pencairan */
export function MilestoneForm() {
  const [rows, setRows] = useState<Pick<Milestone, "id" | "nama" | "persen">[]>(
    mine.milestones.map(({ id, nama, persen }) => ({ id, nama, persen })),
  );
  const [sent, setSent] = useState(false);
  const total = rows.reduce((a, r) => a + r.persen, 0);
  const upd = (id: number, k: "nama" | "persen", v: string) =>
    setRows(
      rows.map((r) =>
        r.id === id ? { ...r, [k]: k === "persen" ? Number(v) : v } : r,
      ),
    );
  return (
    <div className="narrow wide">
      <PageHead title="Milestone dan pencairan" sub={mine.judul} />
      <h2>Rencana milestone</h2>
      <table className="edit">
        <thead>
          <tr>
            <th>Nama tahapan</th>
            <th>Porsi dana (%)</th>
            <th className="r">Nominal</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>
                <input
                  aria-label="Nama tahapan"
                  value={r.nama}
                  onChange={(e) => upd(r.id, "nama", e.target.value)}
                />
              </td>
              <td>
                <input
                  aria-label="Persentase"
                  type="number"
                  value={r.persen}
                  onChange={(e) => upd(r.id, "persen", e.target.value)}
                />
              </td>
              <td className="r">{rupiah((mine.target * r.persen) / 100)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td className={total === 100 ? "ok" : "err"}>{total}%</td>
            <td>{total === 100 ? "" : "Total harus tepat 100%."}</td>
          </tr>
        </tfoot>
      </table>
      <h2>Ajukan pencairan: Uji lapangan 40 sumur</h2>
      <Field
        id="del"
        label="Berkas hasil kerja"
        hint="Laporan, data mentah, dan foto lokasi. Maksimal 50 MB per berkas."
      >
        <input id="del" type="file" multiple />
      </Field>
      <Field id="cat" label="Catatan untuk reviewer">
        <textarea id="cat" rows={3} />
      </Field>
      {sent && (
        <p className="notice" role="status">
          Pengajuan terkirim. Dua reviewer akan memeriksa, dan dana dicairkan
          setelah keduanya setuju.
        </p>
      )}
      <button
        className="btn"
        disabled={total !== 100 || sent}
        onClick={() => setSent(true)}
      >
        Ajukan pencairan
      </button>
    </div>
  );
}
