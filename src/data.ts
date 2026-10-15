export type Role = "PENELITI" | "DONATUR" | "REVIEWER" | "ADMIN";
export type MsStatus =
  | "LOCKED"
  | "ACTIVE"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "DISBURSED";
export type ProjStatus = "DRAFT" | "ACTIVE" | "FUNDED" | "FAILED" | "COMPLETED";
export interface Milestone {
  id: number;
  nama: string;
  persen: number;
  status: MsStatus;
  target: string;
}
export interface Project {
  id: number;
  judul: string;
  peneliti: string;
  institusi: string;
  bidang: string;
  ringkasan: string;
  target: number;
  terkumpul: number;
  donatur: number;
  deadline: string;
  sisaHari: number;
  status: ProjStatus;
  milestones: Milestone[];
}

export const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
export const pct = (p: Project) =>
  Math.min(100, Math.round((p.terkumpul / p.target) * 100));

export const projects: Project[] = [
  {
    id: 1,
    judul: "Biosensor kertas untuk mendeteksi E. coli di air sumur",
    peneliti: "Dr. Ayu Pratiwi, M.Si.",
    institusi: "Universitas Lampung",
    bidang: "Kesehatan lingkungan",
    ringkasan:
      "Strip kertas berbiaya di bawah Rp2.000 yang berubah warna bila air sumur tercemar E. coli. Ditujukan untuk puskesmas dan desa tanpa akses laboratorium.",
    target: 85_000_000,
    terkumpul: 61_200_000,
    donatur: 143,
    deadline: "30 Nov 2026",
    sisaHari: 46,
    status: "ACTIVE",
    milestones: [
      {
        id: 11,
        nama: "Kalibrasi sensor",
        persen: 30,
        status: "DISBURSED",
        target: "15 Sep 2026",
      },
      {
        id: 12,
        nama: "Uji lapangan 40 sumur",
        persen: 40,
        status: "UNDER_REVIEW",
        target: "20 Okt 2026",
      },
      {
        id: 13,
        nama: "Prototipe dan publikasi",
        persen: 30,
        status: "LOCKED",
        target: "15 Des 2026",
      },
    ],
  },
  {
    id: 2,
    judul: "Peta sebaran mikroplastik di perairan Teluk Lampung",
    peneliti: "Ir. Bagas Wicaksono, Ph.D.",
    institusi: "Institut Teknologi Sumatera",
    bidang: "Ilmu kelautan",
    ringkasan:
      "Pengambilan sampel air dan sedimen di 24 titik, dianalisis dengan spektroskopi FTIR, lalu dipetakan terbuka untuk pemerintah daerah.",
    target: 60_000_000,
    terkumpul: 60_000_000,
    donatur: 212,
    deadline: "12 Okt 2026",
    sisaHari: 0,
    status: "FUNDED",
    milestones: [
      {
        id: 21,
        nama: "Pengambilan sampel",
        persen: 40,
        status: "ACTIVE",
        target: "30 Nov 2026",
      },
      {
        id: 22,
        nama: "Analisis FTIR",
        persen: 40,
        status: "LOCKED",
        target: "28 Feb 2027",
      },
      {
        id: 23,
        nama: "Peta dan laporan",
        persen: 20,
        status: "LOCKED",
        target: "30 Apr 2027",
      },
    ],
  },
  {
    id: 3,
    judul: "Padi tahan genangan untuk lahan rawa Lampung Timur",
    peneliti: "Prof. Rini Handayani",
    institusi: "Universitas Lampung",
    bidang: "Pertanian",
    ringkasan:
      "Persilangan varietas lokal dengan gen SUB1 dan uji tanam di dua musim pada lahan rawa milik kelompok tani.",
    target: 120_000_000,
    terkumpul: 38_400_000,
    donatur: 67,
    deadline: "20 Des 2026",
    sisaHari: 66,
    status: "ACTIVE",
    milestones: [
      {
        id: 31,
        nama: "Persilangan",
        persen: 35,
        status: "LOCKED",
        target: "15 Mar 2027",
      },
      {
        id: 32,
        nama: "Uji tanam musim 1",
        persen: 35,
        status: "LOCKED",
        target: "30 Jun 2027",
      },
      {
        id: 33,
        nama: "Uji tanam musim 2",
        persen: 30,
        status: "LOCKED",
        target: "30 Okt 2027",
      },
    ],
  },
  {
    id: 4,
    judul: "Bioplastik dari limbah kulit singkong",
    peneliti: "Dewi Kartika, M.T.",
    institusi: "Politeknik Negeri Lampung",
    bidang: "Material",
    ringkasan:
      "Mengubah pati kulit singkong dari pabrik tapioka menjadi film bioplastik untuk kemasan makanan kering.",
    target: 45_000_000,
    terkumpul: 12_500_000,
    donatur: 31,
    deadline: "25 Okt 2026",
    sisaHari: 10,
    status: "ACTIVE",
    milestones: [
      {
        id: 41,
        nama: "Formulasi pati",
        persen: 50,
        status: "LOCKED",
        target: "20 Jan 2027",
      },
      {
        id: 42,
        nama: "Uji kekuatan film",
        persen: 50,
        status: "LOCKED",
        target: "30 Apr 2027",
      },
    ],
  },
];
export const getProject = (id?: string) =>
  projects.find((p) => String(p.id) === id) ?? projects[0];

export const ledger = [
  {
    id: "L-0412",
    tgl: "02 Sep 2026",
    ket: "Reagen dan strip nitroselulosa",
    ms: "Kalibrasi sensor",
    jumlah: 9_400_000,
    hash: "9f2c…a71e",
    status: "FINAL",
  },
  {
    id: "L-0413",
    tgl: "06 Sep 2026",
    ket: "Sewa spektrofotometer 3 hari",
    ms: "Kalibrasi sensor",
    jumlah: 4_200_000,
    hash: "c4d8…03bb",
    status: "FINAL",
  },
  {
    id: "L-0414",
    tgl: "11 Sep 2026",
    ket: "Honor asisten laboratorium",
    ms: "Kalibrasi sensor",
    jumlah: 6_000_000,
    hash: "51ae…e9d2",
    status: "FINAL",
  },
  {
    id: "L-0420",
    tgl: "08 Okt 2026",
    ket: "Transportasi dan botol sampel",
    ms: "Uji lapangan 40 sumur",
    jumlah: 3_750_000,
    hash: "b07f…44c0",
    status: "DRAFT",
  },
];
export const donations = [
  {
    id: 55701,
    pid: 1,
    jumlah: 250_000,
    status: "PAID",
    tgl: "12 Okt 2026",
    ref: "PG-2026-00055701",
  },
  {
    id: 55120,
    pid: 2,
    jumlah: 100_000,
    status: "PAID",
    tgl: "28 Sep 2026",
    ref: "PG-2026-00055120",
  },
  {
    id: 54988,
    pid: 4,
    jumlah: 500_000,
    status: "PENDING",
    tgl: "14 Okt 2026",
    ref: "PG-2026-00054988",
  },
  {
    id: 51302,
    pid: 9,
    jumlah: 150_000,
    status: "REFUNDED",
    tgl: "03 Agu 2026",
    ref: "PG-2026-00051302",
  },
];
export const tickets = [
  {
    id: 8,
    pid: 1,
    deskripsi:
      "Mohon rincian biaya sewa spektrofotometer, apakah termasuk operator?",
    status: "ANSWERED",
    tanggapan:
      "Sudah termasuk operator selama tiga hari. Kuitansi terlampir pada entri L-0413.",
  },
  {
    id: 9,
    pid: 2,
    deskripsi: "Titik sampel di sisi timur teluk belum tercantum di proposal.",
    status: "OPEN",
    tanggapan: "",
  },
];
export const reviewQueue = [
  {
    id: 12,
    pid: 1,
    ms: "Uji lapangan 40 sumur",
    peneliti: "Dr. Ayu Pratiwi, M.Si.",
    masuk: "09 Okt 2026",
    setuju: 1,
    konflik: false,
    berkas: [
      "laporan-uji-lapangan.pdf",
      "data-40-sumur.csv",
      "foto-lokasi.zip",
    ],
  },
  {
    id: 21,
    pid: 2,
    ms: "Pengambilan sampel",
    peneliti: "Ir. Bagas Wicaksono, Ph.D.",
    masuk: "13 Okt 2026",
    setuju: 0,
    konflik: true,
    berkas: ["berita-acara-sampling.pdf", "koordinat-24-titik.csv"],
  },
];
export const users = [
  {
    nama: "Dr. Ayu Pratiwi, M.Si.",
    email: "ayu.pratiwi@kampus.ac.id",
    role: "PENELITI",
    nidn: "0021058801",
    verif: true,
  },
  {
    nama: "Rafi Zakwan",
    email: "rafi@mail.com",
    role: "DONATUR",
    nidn: "-",
    verif: true,
  },
  {
    nama: "Dewi Kartika, M.T.",
    email: "dewi.k@polinela.ac.id",
    role: "PENELITI",
    nidn: "0014119002",
    verif: false,
  },
  {
    nama: "Prof. Hendra Saputra",
    email: "hendra.s@itera.ac.id",
    role: "REVIEWER",
    nidn: "0003096504",
    verif: true,
  },
];
