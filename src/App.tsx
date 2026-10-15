import { Route, Routes } from "react-router-dom";
import { RoleProvider } from "./role";
import Layout from "./components/Layout";
import { Projects, ProjectDetail, Auth } from "./pages/Public";
import { ResearcherDash, Proposal, MilestoneForm } from "./pages/Researcher";
import { Donate, DonorDash, Ledger } from "./pages/Donor";
import { Reviewer, Admin } from "./pages/Staff";

export default function App() {
  return (
    <RoleProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Projects />} />
          <Route path="proyek/:id" element={<ProjectDetail />} />
          <Route path="masuk" element={<Auth />} />
          <Route path="peneliti" element={<ResearcherDash />} />
          <Route path="peneliti/proposal" element={<Proposal />} />
          <Route path="peneliti/milestone" element={<MilestoneForm />} />
          <Route path="donasi/:id" element={<Donate />} />
          <Route path="donatur" element={<DonorDash />} />
          <Route path="laporan/:id" element={<Ledger />} />
          <Route path="reviewer" element={<Reviewer />} />
          <Route path="admin" element={<Admin />} />
          <Route
            path="*"
            element={
              <p className="empty">
                Halaman tidak ditemukan.{" "}
                <a href="/">Kembali ke daftar proyek</a>.
              </p>
            }
          />
        </Route>
      </Routes>
    </RoleProvider>
  );
}
