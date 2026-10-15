import type { ReactNode } from "react";
import type { Milestone } from "../data";

const label: Record<string, string> = {
  LOCKED: "Terkunci",
  ACTIVE: "Aktif",
  SUBMITTED: "Diajukan",
  UNDER_REVIEW: "Ditinjau",
  APPROVED: "Disetujui",
  DISBURSED: "Dicairkan",
  DRAFT: "Draf",
  FUNDED: "Terdanai",
  FAILED: "Gagal",
  COMPLETED: "Selesai",
  PAID: "Lunas",
  PENDING: "Menunggu",
  REFUNDED: "Dikembalikan",
  OPEN: "Terbuka",
  ANSWERED: "Dijawab",
  CLOSED: "Ditutup",
  FINAL: "Final",
};
const tone: Record<string, string> = {
  LOCKED: "ink",
  DRAFT: "ink",
  CLOSED: "ink",
  ACTIVE: "blue",
  SUBMITTED: "blue",
  OPEN: "amber",
  PENDING: "amber",
  UNDER_REVIEW: "amber",
  ANSWERED: "green",
  APPROVED: "green",
  DISBURSED: "green",
  FUNDED: "green",
  COMPLETED: "green",
  PAID: "green",
  FINAL: "green",
  FAILED: "red",
  REFUNDED: "red",
};
export const Badge = ({ s }: { s: string }) => (
  <span className={`badge t-${tone[s] ?? "ink"}`}>{label[s] ?? s}</span>
);

/* Elemen utama: rencana pencairan escrow. Lebar segmen = persentase milestone, warna = status. */
export function MilestoneBar({
  items,
  big,
}: {
  items: Milestone[];
  big?: boolean;
}) {
  return (
    <ol
      className={`mbar${big ? " big" : ""}`}
      aria-label="Rencana pencairan per milestone"
    >
      {items.map((m) => (
        <li key={m.id} style={{ flexBasis: `${m.persen}%` }}>
          <span
            className={`seg t-${tone[m.status]}`}
            title={`${m.nama}: ${label[m.status]}`}
          />
          <span className="cap">
            <b>{m.persen}%</b> {m.nama}
          </span>
        </li>
      ))}
    </ol>
  );
}

export const Field = ({
  id,
  label: l,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) => (
  <div className="field">
    <label htmlFor={id}>{l}</label>
    {children}
    {hint && !error && <small>{hint}</small>}
    {error && (
      <small className="err" role="alert">
        {error}
      </small>
    )}
  </div>
);

export const PageHead = ({
  title,
  sub,
  aside,
}: {
  title: string;
  sub?: string;
  aside?: ReactNode;
}) => (
  <div className="pagehead">
    <div>
      <h1>{title}</h1>
      {sub && <p>{sub}</p>}
    </div>
    {aside}
  </div>
);

export const Hash = ({ v }: { v: string }) => (
  <code className="hash" title="Hash SHA-256 bukti transaksi">
    {v}
  </code>
);
