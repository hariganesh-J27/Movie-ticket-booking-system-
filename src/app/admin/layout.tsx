import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin";

export const metadata = {
  title: "Admin Dashboard - BookMySeat",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  if (!isAdminEmail(session.user.email)) {
    redirect("/");
  }

  return <>{children}</>;
}
