import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { hasAdminRole } from "@/lib/auth/roles";

export default async function AdminLayout({ children }) {
  const session = await getSession();

  if (!hasAdminRole(session?.usuario)) {
    redirect("/");
  }

  return children;
}
