import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLayoutClient from "@/components/AdminLayoutClient";

export default async function AdminLayout({ children }) {

  const cookieStore = await cookies();
  const session = cookieStore.get('laravel_session');

if (!session) {

redirect("/");

}

return <AdminLayoutClient>{children}</AdminLayoutClient>;

}