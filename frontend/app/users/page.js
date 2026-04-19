import axios from "axios";
<<<<<<< HEAD

=======
>>>>>>> c3315e64524d87686976a3eeebfc315510a7d0c5

import UsersClient from "./UsersClient";
import AdminLayoutClient from "../../components/AdminLayoutClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getUsersSSR() {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  //   const base = "http://localhost:8000";
  const res = await fetch(base + "/api/users?page=1&per_page=50", {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) return { users: [], pagination: null, stats: null };

  const json = await res.json();

  return {
    users: json?.data?.data?.users ?? json?.data?.users ?? [],
    pagination: json?.data?.data?.pagination ?? json?.data?.pagination ?? null,
    stats: json?.data?.data?.stats ?? json?.data?.stats ?? null,
  };
}

export default async function Page() {
  const initial = await getUsersSSR();

  return (
    <AdminLayoutClient>
        <UsersClient
          initialUsers={initial.users}
          initialPagination={initial.pagination}
          initialStats={initial.stats}
        />
    </AdminLayoutClient>
  );
}
