import AdminLayoutClient from "../../components/AdminLayoutClient";
import TransactionsClient from "./TransactionsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getUsersSSR() {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  //   const base = "http://localhost:8000";
  const res = await fetch(base + "/api/transactions?page=1&per_page=50", {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) return { users: [], pagination: null, stats: null };

  const json = await res.json();

  return {
    transactions:
      json?.transactions?.transactions?.transactions ??
      json?.data?.transactions ??
      [],
    pagination: json?.data?.data?.pagination ?? json?.data?.pagination ?? null,
    stats: json?.data?.data?.stats ?? json?.data?.stats ?? null,
  };
}

export default async function Page() {
  const initial = await getUsersSSR();

  return (
    <AdminLayoutClient>
      <TransactionsClient
        initialTransactions={initial.transactions}
        initialPagination={initial.pagination}
        initialStats={initial.stats}
      />
    </AdminLayoutClient>
  );
}
