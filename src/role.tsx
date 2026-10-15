import { createContext, useContext, useState, type ReactNode } from "react";
import type { Role } from "./data";

type Ctx = { role: Role | null; setRole: (r: Role | null) => void };
const RoleCtx = createContext<Ctx>({ role: null, setRole: () => {} });
export const useRole = () => useContext(RoleCtx);
export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  return (
    <RoleCtx.Provider value={{ role, setRole }}>{children}</RoleCtx.Provider>
  );
}
export const homeOf: Record<Role, string> = {
  PENELITI: "/peneliti",
  DONATUR: "/donatur",
  REVIEWER: "/reviewer",
  ADMIN: "/admin",
};
