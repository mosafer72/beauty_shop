"use client";

import { useEffect, useRef, useState } from "react";
import api from "../../lib/api";
// import PersianDateDisplay from "../../components/PersianDateDisplay";

export default function UsersClient({
  initialUsers = [],
  initialPagination = null,
  initialStats = null,
}) {
  const [users, setUsers] = useState(initialUsers);
  const [pagination, setPagination] = useState(
    initialPagination ?? {
      current_page: 1,
      last_page: 1,
      per_page: 50,
      total: 0,
      from: 1,
      to: 10,
    }
  );
  const [stats, setStats] = useState(initialStats);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    type: "",
    VIP: "",
    status: "",
    source: "",
    per_page: 50,
  });

  const didInit = useRef(false);

  // ✅ دیگر بار اول API نمی‌زنیم
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    // فقط اگر SSR چیزی نداد (مثلاً خطا شد) اینجا بگیر
    if (!initialUsers || initialUsers.length === 0) {
      loadUsers(1);
    }
  }, []);

  const loadUsers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/users", {
        params: { search, page, ...filters },
      });
      setUsers(res.data.data.users);
      setPagination(res.data.data.pagination);
      setStats(res.data.data.stats);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    loadUsers(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setFilters({
      type: "",
      VIP: "",
      status: "",
      source: "",
      per_page: 50,
    });
    loadUsers(1);
  };

  const getStatusBadge = (status) => {
    return status ? (
      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
        فعال
      </span>
    ) : (
      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
        غیرفعال
      </span>
    );
  };

  const getVIPBadge = (vip) => {
    return vip ? (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
        ویژه
      </span>
    ) : (
      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
        عادی
      </span>
    );
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("fa-IR").format(num || 0);
  };

  const getTypeLabel = (type) => {
    const types = {
      0: "مدیر",
      1: "کاربر",
      3: "صاحب سایت",
      4: "فروشگاه",
      5: "مشتری حسابداری",
    };
    return types[type] || type;
  };

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">مدیریت کاربران</h1>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            {showFilters ? "بستن فیلترها" : "نمایش فیلترها"}
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <p className="text-sm text-gray-500">کل کاربران</p>
              <p className="text-2xl font-bold">{formatNumber(stats.total_users)}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <p className="text-sm text-gray-500">کاربران فعال</p>
              <p className="text-2xl font-bold text-green-600">
                {formatNumber(stats.active_users)}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <p className="text-sm text-gray-500">کاربران ویژه</p>
              <p className="text-2xl font-bold text-yellow-600">
                {formatNumber(stats.vip_users)}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <p className="text-sm text-gray-500">جمع تراکنش‌ها</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatNumber(stats.total_transactions_amount)} تومان
              </p>
            </div>
          </div>
        )}

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">جستجو</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="نام، ایمیل، موبایل، نام کاربری"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع کاربر</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">همه</option>
                  <option value="0">مدیر</option>
                  <option value="1">کاربر</option>
                  <option value="4">فروشگاه</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">همه</option>
                  <option value="1">فعال</option>
                  <option value="0">غیرفعال</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عضویت ویژه</label>
                <select
                  value={filters.VIP}
                  onChange={(e) => handleFilterChange("VIP", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">همه</option>
                  <option value="1">ویژه</option>
                  <option value="0">عادی</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تعداد در صفحه</label>
                <select
                  value={filters.per_page}
                  onChange={(e) => handleFilterChange("per_page", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">منبع</label>
                <input
                  type="text"
                  value={filters.source}
                  onChange={(e) => handleFilterChange("source", e.target.value)}
                  placeholder="منبع کاربر"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                اعمال فیلترها
              </button>

              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 flex items-center gap-2"
              >
{/* //                 پاک کردن فیلترها */}
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">در حال بارگذاری کاربران...</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                        کاربر
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                        اطلاعات تماس
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                        آمار تراکنش‌ها
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                        آمار طلا
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                        وضعیت
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                        تاریخ عضویت
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
                                {user.firstname?.charAt(0) ||
                                  user.username?.charAt(0) ||
                                  "?"}
                              </span>
                            </div>
                            <div className="mr-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstname} {user.lastname}
                              </div>
                              <div className="text-sm text-gray-500">@{user.username}</div>
                              <div className="text-xs text-gray-400 mt-1">
                                {getTypeLabel(user.type)}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-900 ltr text-left">
                              {user.email || "---"}
                            </div>
                            <div className="text-sm text-gray-500 ltr text-left">
                              {user.mobile || "---"}
                            </div>
                            {user.nationalCode && (
                              <div className="text-xs text-gray-400">کد ملی: {user.nationalCode}</div>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">تعداد:</span>
                              <span className="text-sm font-medium">
                                {formatNumber(user.transactions_count)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">جمع مبلغ:</span>
                              <span className="text-sm font-medium text-green-600">
                                {formatNumber(user.transactions_total)} تومان
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">سفارشات:</span>
                              <span className="text-sm font-medium">
                                {formatNumber(user.orders_count)}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">خرید:</span>
                              <span className="text-xs font-medium">
                                {formatNumber(user.gold_bought_amount_formatted)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">فروش:</span>
                              <span className="text-xs font-medium">
                                {formatNumber(user.gold_sold_amount_formatted)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">مانده طلایی:</span>
                              <span className="text-xs font-medium text-blue-600">
                                {user.gold_balance_formatted} گرم
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">طلای مسدود شده:</span>
                              <span className="text-xs font-medium text-green-600">
                                {formatNumber(user.blocked_gold_weight_numeric)} گرم
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">ریال مسدود شده:</span>
                              <span className="text-xs font-medium text-green-600">
                                {formatNumber(user.blocked_cash_numeric)} ریال
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div>{getStatusBadge(user.status)}</div>
                            <div>{getVIPBadge(user.VIP)}</div>
                            <div className="text-xs space-y-1">
                              <div
                                className={`inline-block px-2 py-1 rounded ${
                                  user.emailConfirmed
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                ایمیل: {user.email_confirmed_label}
                              </div>
                              <div
                                className={`inline-block px-2 py-1 rounded ${
                                  user.mobileConfirmed
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                موبایل: {user.mobile_confirmed_label}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {/*<PersianDateDisplay timestamp={user.date_formatted} showTime={false} />*/}
                          </div>
                          {user.source && (
                            <div className="text-xs text-gray-500 mt-1">منبع: {user.source}</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {users.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="mt-2 text-sm font-medium text-gray-900">کاربری یافت نشد</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      هیچ کاربری با فیلترهای اعمال شده مطابقت ندارد.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      پاک کردن فیلترها
                    </button>
                  </div>
                )}
              </div>
            </div>

       {/* Pagination */}
          {users.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-lg shadow">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => loadUsers(pagination.current_page - 1)}
                    disabled={pagination.current_page <= 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    قبلی
                  </button>
                  <button
                    onClick={() => loadUsers(pagination.current_page + 1)}
                    disabled={pagination.current_page >= pagination.last_page}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    بعدی
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      نمایش{" "}
                      <span className="font-medium">{pagination.from}</span> تا{" "}
                      <span className="font-medium">{pagination.to}</span> از{" "}
                      <span className="font-medium">{pagination.total}</span>{" "}
                      نتیجه
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() => loadUsers(pagination.current_page - 1)}
                        disabled={pagination.current_page <= 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">قبلی</span>
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {/* Page numbers */}
                      {Array.from(
                        { length: Math.min(5, pagination.last_page) },
                        (_, i) => {
                          let pageNum;
                          if (pagination.last_page <= 5) {
                            pageNum = i + 1;
                          } else if (pagination.current_page <= 3) {
                            pageNum = i + 1;
                          } else if (
                            pagination.current_page >=
                            pagination.last_page - 2
                          ) {
                            pageNum = pagination.last_page - 4 + i;
                          } else {
                            pageNum = pagination.current_page - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => loadUsers(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                pagination.current_page === pageNum
                                  ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}

                      <button
                        onClick={() => loadUsers(pagination.current_page + 1)}
                        disabled={
                          pagination.current_page >= pagination.last_page
                        }
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">بعدی</span>
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
  );
}