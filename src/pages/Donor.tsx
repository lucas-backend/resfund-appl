import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  donations,
  getProject,
  ledger,
  pct,
  projects,
  rupiah,
  tickets,
} from "../data";
import { Badge, Field, Hash, PageHead } from "../components/ui";

/* UI-06 Form donasi */
export function Donate() {
  const p = getProject(useParams().id);
  const [amt, setAmt] = useState("250000");
  const [method, setMethod] = useState("VIRTUAL_ACCOUNT");
  const [done, setDone] = useState(false);
  const n = Number(amt);
  const bad = !(n > 0);
  return (
    <div className="narrow">
      <PageHead title="Donasi" sub={p.judul} />
      {!done ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!bad) setDone(true);
          }}
        >
          <fieldset>
            <legend>Nominal</legend>
            <div className="chips">
              {[50000, 100000, 250000, 500000].map((v) => (
                <button
                  type="button"
                  key={v}
                  aria-pressed={n === v}
                  onClick={() => setAmt(String(v))}
                >
                  {rupiah(v)}
                </button>
              ))}
            </div>
          </fieldset>
          <Field
            id="amt"
            label="Nominal lain (Rp)"
            error={bad ? "Nominal donasi harus lebih besar dari 0." : undefined}
          >
            <input
              id="amt"
              type="number"
              value={amt}
              onChange={(e) => setAmt(e.target.value)}
            />
          </Field>
          <Field id="met" label="Metode pembayaran">
            <select
              id="met"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="VIRTUAL_ACCOUNT">Virtual account</option>
              <option value="QRIS">QRIS</option>
              <option value="EWALLET">Dompet digital</option>
            </select>
          </Field>
          <p className="notice">
            Dana masuk ke escrow dan dicairkan ke peneliti per milestone. Jika
            target {rupiah(p.target)} tidak tercapai pada {p.deadline}, donasi
            Anda dikembalikan penuh.
          </p>
          <button className="btn" disabled={bad}>
            Lanjut ke pembayaran
          </button>
        </form>
      ) : (
        <div className="receipt" role="status">
          <h2>Menunggu pembayaran</h2>
          <dl>
            <div>
              <dt>Nominal</dt>
              <dd>{rupiah(n)}</dd>
            </div>
            <div>
              <dt>Referensi</dt>
              <dd>
                <code>PG-2026-00055701</code>
              </dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <Badge s="PENDING" />
              </dd>
            </div>
          </dl>
          <a className="btn" href="#bayar">
            Buka halaman pembayaran
          </a>
          <Link className="btn ghost" to="/donatur">
            Lihat donasi saya
          </Link>
        </div>
      )}
    </div>
  );
}

/* UI-07 Dashboard donatur */
export function DonorDash() {
  const paid = donations
    .filter((d) => d.status === "PAID")
    .reduce((a, d) => a + d.jumlah, 0);
  return (
    <>
      <PageHead title="Donasi saya" sub="Rafi Zakwan" />
      <dl className="stats">
        <div>
          <dt>Total donasi lunas</dt>
          <dd>{rupiah(paid)}</dd>
        </div>
        <div>
          <dt>Proyek diikuti</dt>
          <dd>2</dd>
        </div>
        <div>
          <dt>Tiket audit terbuka</dt>
          <dd>{tickets.filter((t) => t.status === "OPEN").length}</dd>
        </div>
      </dl>
      <h2>Riwayat donasi</h2>
      <table>
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Proyek</th>
            <th>Referensi</th>
            <th className="r">Nominal</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((d) => (
            <tr key={d.id}>
              <td>{d.tgl}</td>
              <td>
                {projects.find((p) => p.id === d.pid)?.judul ??
                  "Proyek tidak mencapai target"}
              </td>
              <td>
                <code>{d.ref}</code>
              </td>
              <td className="r">{rupiah(d.jumlah)}</td>
              <td>
                <Badge s={d.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Tiket audit</h2>
      <ul className="plain">
        {tickets.map((t) => (
          <li key={t.id}>
            <Badge s={t.status} /> {t.deskripsi}
            {t.tanggapan && (
              <p className="reply">Jawaban peneliti: {t.tanggapan}</p>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

/* UI-10 Laporan keuangan dan portal audit */
export function Ledger() {
  const p = getProject(useParams().id);
  const [list, setList] = useState(tickets);
  const [txt, setTxt] = useState("");
  const total = ledger
    .filter((l) => l.status === "FINAL")
    .reduce((a, l) => a + l.jumlah, 0);
  return (
    <>
      <PageHead
        title="Laporan keuangan"
        sub={p.judul}
        aside={<button className="btn ghost">Ekspor laporan</button>}
      />
      <dl className="stats">
        <div>
          <dt>Dana terkumpul</dt>
          <dd>{rupiah(p.terkumpul)}</dd>
        </div>
        <div>
          <dt>Pengeluaran final</dt>
          <dd>{rupiah(total)}</dd>
        </div>
        <div>
          <dt>Terkumpul dari target</dt>
          <dd>{pct(p)}%</dd>
        </div>
      </dl>
      <div className="scroll">
        <table>
          <thead>
            <tr>
              <th>Entri</th>
              <th>Tanggal</th>
              <th>Keterangan</th>
              <th>Milestone</th>
              <th className="r">Jumlah</th>
              <th>Hash bukti</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {ledger.map((l) => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>{l.tgl}</td>
                <td>{l.ket}</td>
                <td>{l.ms}</td>
                <td className="r">{rupiah(l.jumlah)}</td>
                <td>
                  <Hash v={l.hash} />
                </td>
                <td>
                  <Badge s={l.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="meta">
        Entri berstatus Final terkunci dan tidak bisa diubah. Entri draf masih
        bisa direvisi peneliti.
      </p>
      <h2>Ajukan pertanyaan audit</h2>
      <div className="inline grow">
        <textarea
          aria-label="Pertanyaan audit"
          rows={2}
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
          placeholder="Tulis entri atau pengeluaran yang ingin Anda tanyakan"
        />
        <button
          className="btn"
          disabled={!txt}
          onClick={() => {
            setList([
              {
                id: 99,
                pid: p.id,
                deskripsi: txt,
                status: "OPEN",
                tanggapan: "",
              },
              ...list,
            ]);
            setTxt("");
          }}
        >
          Kirim tiket
        </button>
      </div>
      <ul className="plain">
        {list
          .filter((t) => t.pid === p.id)
          .map((t) => (
            <li key={t.id}>
              <Badge s={t.status} /> {t.deskripsi}
              {t.tanggapan && (
                <p className="reply">Jawaban peneliti: {t.tanggapan}</p>
              )}
            </li>
          ))}
      </ul>
    </>
  );
}
