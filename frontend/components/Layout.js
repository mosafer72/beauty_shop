// app/(admin)/layout.js

import { cookies } from "next/headers";
import { redirect } from "next/navigation";


import AdminLayoutClient from "@/components/AdminLayoutClient";

export default function AdminLayout({ children }) {

const cookieStore = cookies();

const session = cookieStore.get("laravel_session");

if (!session) {

redirect("/login");

}

return <AdminLayoutClient>{children}</AdminLayoutClient>;

}