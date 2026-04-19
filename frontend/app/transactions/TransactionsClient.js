"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/api";
import PersianDateDisplay from "../../components/PersianDateDisplay";

export default function TransactionsClient({
  initialitems = [],
  initialPagination = null,
  initialStats = null,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    gateway: "",
    per_page: 50,
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 50,
    total: 0,
    from: 1,
    to: 10,
  });
  const [stats, setStats] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const didInit = useRef(false);

  const loadItems = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/transactions", {
        params: { search, page, ...filters },
      });
      setItems(res.data.data.transactions);
      setPagination(res.data.data.pagination);
      setStats(res.data.data.stats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    // فقط اگر SSR چیزی نداد (مثلاً خطا شد) اینجا بگیر
    if (!initialitems || initialitems.length === 0) {
      loadItems(1);
    }
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    loadItems(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setFilters({
      type: "",
      status: "",
      gateway: "",
      per_page: 50,
    });
    loadItems(1);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("fa-IR").format(num || 0);
  };

  const getStatusBadge = (status) => {
    return status === 1 ? (
      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
        موفق
      </span>
    ) : (
      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
        ناموفق
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const colors = {
      0: "bg-blue-100 text-blue-800",
      2: "bg-purple-100 text-purple-800",
      17: "bg-yellow-100 text-yellow-800",
      18: "bg-green-100 text-green-800",
      9: "bg-indigo-100 text-indigo-800",
      19: "bg-orange-100 text-orange-800",
      "-1": "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs rounded-full ${colors[type] || "bg-gray-100 text-gray-800"}`}
      >
        {mapType(type)}
      </span>
    );
  };
  return (
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">مدیریت تراکنش‌ها</h1>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">کل تراکنش‌ها</p>
                  <p className="text-2xl font-bold">
                    {formatNumber(stats.transactions.total)}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                موفق: {formatNumber(stats.successful_transactions)}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">جمع مبلغ تراکنش‌ها</p>
                  <p className="text-2xl font-bold text-green-600">
                    {/* {formatNumber(stats.transactions.total_amount)} */}
                    تومان
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                میانگین: {formatNumber(stats.avg_amount)} تومان
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">تراکنش‌های طلا</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {formatNumber(stats.transactions.total)}
                  </p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                مبلغ: {formatNumber(stats.gold_transactions_amount)} تومان
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">درگاه‌های پرداخت</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.gateways_count || 0}
                  </p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                امروز: {formatNumber(stats.today_transactions)}
              </div>
            </div>
          </div>
        )}

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* جستجوی اصلی */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  جستجو
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="شناسه تراکنش، کاربر، کد رهگیری"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* نوع تراکنش */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نوع تراکنش
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">همه</option>
                  <option value="0">سفارشات</option>
                  <option value="2">شارژ کیف پول</option>
                  <option value="-1">شارژ کیف پول + سفارشات</option>
                  <option value="17">خرید طلا</option>
                  <option value="18">فروش طلا</option>
                  <option value="9">واریز وجه</option>
                  <option value="19">تحویل طلا</option>
                </select>
              </div>

              {/* وضعیت */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  وضعیت
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">همه</option>
                  <option value="1">موفق</option>
                  <option value="0">ناموفق</option>
                </select>
              </div>

              {/* تعداد در صفحه */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تعداد در صفحه
                </label>
                <select
                  value={filters.per_page}
                  onChange={(e) =>
                    handleFilterChange("per_page", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                </select>
              </div>

              {/* درگاه پرداخت */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  درگاه پرداخت
                </label>
                <input
                  type="text"
                  value={filters.gateway}
                  onChange={(e) =>
                    handleFilterChange("gateway", e.target.value)
                  }
                  placeholder="نام درگاه"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                اعمال فیلترها
              </button>

              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                پاک کردن فیلترها
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">در حال بارگذاری تراکنش‌ها...</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        اطلاعات تراکنش
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        کاربر
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        اطلاعات مالی
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        اطلاعات طلا
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        وضعیت
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        تاریخ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50">
                        {/* اطلاعات تراکنش */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                شناسه:
                              </span>
                              <span className="text-sm font-medium">
                                {t.id}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                نوع:
                              </span>
                              {getTypeBadge(t.type)}
                            </div>
                            {t.refID && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  کد رهگیری:
                                </span>
                                <span className="text-xs font-medium ltr">
                                  {t.refID}
                                </span>
                              </div>
                            )}
                            {t.gateway && (
                              <div className="text-xs text-gray-500">
                                درگاه: {t.gateway}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* اطلاعات کاربر */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-900">
                              {t.user?.firstname} {t.user?.lastname}
                            </div>
                            <div className="text-sm text-gray-500 ltr text-left">
                              {t.user?.mobile || "---"}
                            </div>
                            <div className="text-xs text-gray-400 ltr text-left">
                              {t.user?.nationalCode || "---"}
                            </div>
                            {t.user?.email && (
                              <div className="text-xs text-gray-400 ltr text-left">
                                {t.user.email}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* اطلاعات مالی */}
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">
                                مبلغ:
                              </span>
                              <span className="text-lg font-bold text-green-600">
                                {formatNumber(t.price)} تومان
                              </span>
                            </div>
                            {t.discount > 0 && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                  تخفیف:
                                </span>
                                <span className="text-xs text-red-500">
                                  {formatNumber(t.discount)} تومان
                                </span>
                              </div>
                            )}
                            {t.walletDiscount > 0 && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                  کیف پول:
                                </span>
                                <span className="text-xs text-blue-500">
                                  {formatNumber(t.walletDiscount)} تومان
                                </span>
                              </div>
                            )}
                            {t.commission > 0 && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                  کارمزد:
                                </span>
                                <span className="text-xs text-orange-500">
                                  {formatNumber(t.commission)} تومان
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* اطلاعات طلا (اگر تراکنش طلا باشد) */}
                        <td className="px-6 py-4">
                          {[17, 18, 19].includes(t.type) && t.typeOption ? (
                            <div className="space-y-1">
                              {t.typeOption.weight && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">
                                    وزن:
                                  </span>
                                  <span className="text-xs font-medium">
                                    {formatNumber(t.typeOption.weight, 3)} گرم
                                  </span>
                                </div>
                              )}
                              {t.typeOption.goldPrice && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">
                                    قیمت گرم:
                                  </span>
                                  <span className="text-xs font-medium">
                                    {formatNumber(t.typeOption.goldPrice)} تومان
                                  </span>
                                </div>
                              )}
                              {t.typeOption.deliveryFee && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">
                                    هزینه ارسال:
                                  </span>
                                  <span className="text-xs font-medium">
                                    {formatNumber(t.typeOption.deliveryFee)}{" "}
                                    تومان
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400 text-center">
                              ---
                            </div>
                          )}
                        </td>

                        {/* وضعیت */}
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div>{getStatusBadge(t.status)}</div>
                            {t.comment && (
                              <div
                                className="text-xs text-gray-500 max-w-[150px] truncate"
                                title={t.comment}
                              >
                                {t.comment}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* تاریخ */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-900">
                              <PersianDateDisplay
                                timestamp={t.date}
                                showTime={true}
                                variant="short"
                              />
                            </div>
                            {t.statusDate && t.statusDate !== t.date && (
                              <div className="text-xs text-gray-500">
                                بروزرسانی:{" "}
                                <PersianDateDisplay
                                  timestamp={t.statusDate}
                                  showTime={true}
                                  variant="short"
                                />
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Empty State */}
                {items.length === 0 && (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      تراکنشی یافت نشد
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      هیچ تراکنشی با فیلترهای اعمال شده مطابقت ندارد.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      پاک کردن فیلترها
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Pagination */}
            {items.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-lg shadow">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => loadItems(pagination.current_page - 1)}
                    disabled={pagination.current_page <= 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    قبلی
                  </button>
                  <button
                    onClick={() => loadItems(pagination.current_page + 1)}
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
                        onClick={() => loadItems(pagination.current_page - 1)}
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
                              onClick={() => loadItems(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                pagination.current_page === pageNum
                                  ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        },
                      )}

                      <button
                        onClick={() => loadItems(pagination.current_page + 1)}
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

// Helper function for number formatting with decimals
function formatNumberWithDecimals(num, decimals = 0) {
  if (!num && num !== 0) return "0";
  return new Intl.NumberFormat("fa-IR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

function mapType(type) {
  const map = {
    0: "سفارشات",
    2: "شارژ کیف پول",
    "-1": "شارژ کیف پول + سفارشات",
    17: "خرید طلا",
    18: "فروش طلا",
    9: "واریز وجه",
    19: "تحویل طلا",
  };
  return map[type] ?? "سایر";
}
