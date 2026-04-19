"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayoutClient({ children }) {
  const menuItems = [
    { href: "/dashboard", label: "داشبورد", icon: "📊" },
    // { href: "/users", label: "کاربران", icon: "👥" },
    // { href: "/transactions", label: "تراکنش‌ها", icon: "💰" },
    // { href: "/accounting", label: "حسابداری", icon: "📈" },
    // { href: "/sync", label: "اپلود بکاپ", icon: "💾" }, // یا "🗂️" یا "📥"
    // { href: "/stats", label: "گزارشات", icon: "💾" }, // یا "🗂️" یا "📥"
  ];

  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-gray-900 text-gray-200 flex flex-col">
        <div className="px-6 py-4 text-lg font-semibold border-b border-gray-800 text-right">
          پنل مدیریت
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 text-right">
          {menuItems.map((item,index) => (
            <a
              key={index}
              href={item.href}
              className={`
                          block px-3 py-2 rounded hover:bg-gray-800 transition
                          ${pathname === item.href ? 'bg-blue-600': ''}
                        `}
            >
              {item.icon} {item.label}
            </a>
            // <button
            //                   key={index}
            //                   onClick={() => handleHref(pageNum)}
            //                   className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
            //                     pagination.current_page === pageNum
            //                       ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
            //                       : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
            //                   }`}
            //                 >
            //                   {pageNum}
            //                 </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <span className="text-sm text-gray-600">خوش آمدید</span>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              location.href = "/login";
            }}
            className="text-sm text-red-600 hover:underline"
          >
            خروج
          </button>
        </header>

        {/* Content */}
        <main className="p-6 text-right">{children}</main>
      </div>
    </div>
  );
}
