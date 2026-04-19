"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import PersianDateDisplay from "@/components/PersianDateDisplay";
import AdminLayoutClient from "../../components/AdminLayoutClient";

export default function StatsReportPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    title: "",
    url: "",
    referer: "",
    uid: "",
    ip: "",
    userID: "",
    name: "",
    isBot: "",
    os: "",
    deviceType: "",
    browser: "",
    tag: "",
    source: "",
    registrationSource: "",
    az: "",
    ta: "",
    topAz: "",
    topTa: "",
    groupBy: "",
    per_page: 100,
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 100,
    total: 0,
    from: 1,
    to: 10,
  });
  const [showColumns, setShowColumns] = useState({
    showName: true,
    showTitle: true,
    showUrl: true,
    showReferer: true,
    showIp: true,
    showIsBot: true,
    showDate: true,
    showTimeOnPage: true,
    showVisits: true,
    showUid: false,
    showUseragent: false,
    showDeviceType: false,
    showOs: false,
    showBrowser: false,
    showSource: false,
    showRegistrationSource: false,
    showTag: false,
  });
  const [filterOptions, setFilterOptions] = useState({
    bots: [],
    os: [],
    deviceTypes: [],
    browsers: [],
    tags: [],
    sources: [],
    registrationSources: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Set default date if not provided
  const getDefaultDate = () => {
    const today = new Date();
    const jalaliDate = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(today);
    
    return `${jalaliDate} - 00:00:00`;
  };

  const loadData = async (page = 1) => {
    setLoading(true);
    
    // Prepare params
    const params = {
      page,
      per_page: filters.per_page,
      ...filters
    };
    
    // Add show columns
    Object.keys(showColumns).forEach(key => {
      if (showColumns[key]) {
        params[key] = 1;
      }
    });
    
    await api
      .get("stats/stats-report", {
        params: params
      })
      .then((res) => {
        console.log(res.data.data.pagination);
        setItems(res.data.data.stats || []);
        setPagination(res.data.data.pagination || {});
        setFilterOptions(res.data.data.filterOptions || {});
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading stats:", err);
        setLoading(false);
      });
  };

  const handleExport = () => {
    setExporting(true);
    
    const params = {
      ...filters
    };
    
    // Add show columns
    Object.keys(showColumns).forEach(key => {
      if (showColumns[key]) {
        params[key] = 1;
      }
    });
    
    api
      .get("/stats-report/export", {
        params: params,
        responseType: 'blob'
      })
      .then((res) => {
        // Create download link
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `stats-report-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        setExporting(false);
      })
      .catch((err) => {
        console.error("Error exporting:", err);
        setExporting(false);
      });
  };

  useEffect(() => {
    // Set default date if not set
    if (!filters.az) {
      const today = new Date();
      const jalaliDate = new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(today);
      
      setFilters(prev => ({
        ...prev,
        az: `${jalaliDate} - 00:00:00`,
        ta: `${jalaliDate} - 23:59:59`
      }));
    }
    
    loadData(1);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleColumnToggle = (key) => {
    setShowColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSearch = () => {
    loadData(1);
  };

  const handleResetFilters = () => {
    const today = new Date();
    const jalaliDate = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(today);
    
    setFilters({
      title: "",
      url: "",
      referer: "",
      uid: "",
      ip: "",
      userID: "",
      name: "",
      isBot: "",
      os: "",
      deviceType: "",
      browser: "",
      tag: "",
      source: "",
      registrationSource: "",
      az: `${jalaliDate} - 00:00:00`,
      ta: `${jalaliDate} - 23:59:59`,
      topAz: "",
      topTa: "",
      groupBy: "",
      per_page: 100,
    });
    
    loadData(1);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("fa-IR").format(num || 0);
  };

  const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return "Bounced";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else if (minutes > 0) {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${secs} ثانیه`;
    }
  };

  const getTimeOnPageBadge = (seconds) => {
    if (!seconds || seconds === 0) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Bounced</span>;
    } else if (seconds < 30) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">{formatDuration(seconds)}</span>;
    } else {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">{formatDuration(seconds)}</span>;
    }
  };

  const getDeviceTypeBadge = (deviceType) => {
    const colors = {
      'desktop': 'bg-blue-100 text-blue-800',
      'mobile': 'bg-green-100 text-green-800',
      'tablet': 'bg-purple-100 text-purple-800',
      'bot': 'bg-red-100 text-red-800',
    };
    
    return (
      <span
        className={`px-2 py-1 text-xs rounded-full ${colors[deviceType?.toLowerCase()] || "bg-gray-100 text-gray-800"}`}
      >
        {deviceType || 'نامشخص'}
      </span>
    );
  };

  const getBotBadge = (isBot) => {
    if (isBot === '1') {
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">ربات</span>;
    } else {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">کاربر</span>;
    }
  };

  return (
<<<<<<< HEAD
    <div>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">گزارشات بازدید سایت</h1>
            <p className="text-gray-600 mt-1">مشاهده و تحلیل آمار بازدیدکنندگان سایت</p>
          </div>

          <div className="flex gap-2">
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
            
            <button
              onClick={handleExport}
              disabled={exporting}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {exporting ? "در حال خروجی..." : "خروجی اکسل"}
            </button>
          </div>
        </div>

        {/* Stats Summary Cards */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">کل بازدیدها</p>
                  <p className="text-2xl font-bold">{formatNumber(pagination.total)}</p>
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                صفحه: {pagination.current_page} از {pagination.last_page}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">کاربران فعال</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatNumber(new Set(items.filter(item => item.userID).map(item => item.userID)).size)}
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-2.646a9 9 0 00-9 0"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                شامل {formatNumber(items.filter(item => !item.userID).length)} بازدید مهمان
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">صفحات پربازدید</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatNumber(new Set(items.map(item => item.url)).size)}
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
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {formatNumber(new Set(items.map(item => item.title)).size)} عنوان منحصر به فرد
              </div>
            </div>
          </div>
        )}

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">فیلترهای جستجو</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* ستون اول */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عنوان صفحه
                  </label>
                  <input
                    type="text"
                    value={filters.title}
                    onChange={(e) => handleFilterChange("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="جستجو در عنوان صفحه"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    آدرس صفحه
                  </label>
                  <input
                    type="text"
                    value={filters.url}
                    onChange={(e) => handleFilterChange("url", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ltr text-left"
                    placeholder="example.com/page"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    صفحه ارجاع دهنده
                  </label>
                  <input
                    type="text"
                    value={filters.referer}
                    onChange={(e) => handleFilterChange("referer", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ltr text-left"
                    placeholder="https://referrer.com"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    آی‌پی
                  </label>
                  <input
                    type="text"
                    value={filters.ip}
                    onChange={(e) => handleFilterChange("ip", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ltr text-left"
                    placeholder="192.168.1.1"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* ستون دوم */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    شناسه کاربر
                  </label>
                  <input
                    type="text"
                    value={filters.userID}
                    onChange={(e) => handleFilterChange("userID", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="شناسه کاربری"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نام کاربر
                  </label>
                  <input
                    type="text"
                    value={filters.name}
                    onChange={(e) => handleFilterChange("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="نام و نام خانوادگی"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ربات‌ها
                  </label>
                  <select
                    value={filters.isBot}
                    onChange={(e) => handleFilterChange("isBot", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">همه</option>
                    <option value="1">ربات</option>
                    <option value="0">کاربر</option>
                    {filterOptions.bots && filterOptions.bots.map((bot, index) => (
                      <option key={index} value={bot}>{bot || 'بدون عنوان'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    سیستم عامل
                  </label>
                  <select
                    value={filters.os}
                    onChange={(e) => handleFilterChange("os", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">همه</option>
                    {filterOptions.os && filterOptions.os.map((os, index) => (
                      <option key={index} value={os}>{os || 'بدون عنوان'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ستون سوم */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نوع دستگاه
                  </label>
                  <select
                    value={filters.deviceType}
                    onChange={(e) => handleFilterChange("deviceType", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">همه</option>
                    {filterOptions.deviceTypes && filterOptions.deviceTypes.map((device, index) => (
                      <option key={index} value={device}>{device || 'بدون عنوان'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    مرورگر
                  </label>
                  <select
                    value={filters.browser}
                    onChange={(e) => handleFilterChange("browser", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">همه</option>
                    {filterOptions.browsers && filterOptions.browsers.map((browser, index) => (
                      <option key={index} value={browser}>{browser || 'بدون عنوان'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تاریخ بازدید
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="text"
                        value={filters.az}
                        onChange={(e) => handleFilterChange("az", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="از تاریخ"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={filters.ta}
                        onChange={(e) => handleFilterChange("ta", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="تا تاریخ"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تعداد در صفحه
                  </label>
                  <select
                    value={filters.per_page}
                    onChange={(e) => handleFilterChange("per_page", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="500">500</option>
                  </select>
                </div>
              </div>
            </div>

            {/* تنظیمات ستون‌ها */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">نمایش ستون‌ها</h4>
              <div className="flex flex-wrap gap-2">
                {Object.keys(showColumns).map((key) => (
                  <label key={key} className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-full cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={showColumns[key]}
                      onChange={() => handleColumnToggle(key)}
                      className="ml-2"
                    />
                    <span className="text-sm">
                      {key === 'showName' && 'نام کاربر'}
                      {key === 'showTitle' && 'عنوان صفحه'}
                      {key === 'showUrl' && 'آدرس صفحه'}
                      {key === 'showReferer' && 'صفحه ارجاع'}
                      {key === 'showIp' && 'آی‌پی'}
                      {key === 'showIsBot' && 'ربات'}
                      {key === 'showDate' && 'تاریخ'}
                      {key === 'showVisits' && 'بازدید'}
                      {key === 'showTimeOnPage' && 'ماندگاری'}
                      {key === 'showUid' && 'شناسه یکتا'}
                      {key === 'showUseragent' && 'User Agent'}
                      {key === 'showDeviceType' && 'نوع دستگاه'}
                      {key === 'showOs' && 'سیستم عامل'}
                      {key === 'showBrowser' && 'مرورگر'}
                      {key === 'showSource' && 'منبع'}
                      {key === 'showRegistrationSource' && 'منبع ثبت‌نام'}
                      {key === 'showTag' && 'تگ'}
                    </span>
                  </label>
                ))}
              </div>
=======
    <AdminLayoutClient>
        <div>
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">گزارشات بازدید سایت</h1>
              <p className="text-gray-600 mt-1">مشاهده و تحلیل آمار بازدیدکنندگان سایت</p>
>>>>>>> c3315e64524d87686976a3eeebfc315510a7d0c5
            </div>

            <div className="flex gap-2">
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
              
              <button
                onClick={handleExport}
                disabled={exporting}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {exporting ? "در حال خروجی..." : "خروجی اکسل"}
              </button>
            </div>
          </div>

          {/* Stats Summary Cards */}
          {items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">کل بازدیدها</p>
                    <p className="text-2xl font-bold">{formatNumber(pagination.total)}</p>
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  صفحه: {pagination.current_page} از {pagination.last_page}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">کاربران فعال</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatNumber(new Set(items.filter(item => item.userID).map(item => item.userID)).size)}
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-2.646a9 9 0 00-9 0"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  شامل {formatNumber(items.filter(item => !item.userID).length)} بازدید مهمان
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">صفحات پربازدید</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatNumber(new Set(items.map(item => item.url)).size)}
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
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {formatNumber(new Set(items.map(item => item.title)).size)} عنوان منحصر به فرد
                </div>
              </div>
            </div>
          )}

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">فیلترهای جستجو</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* ستون اول */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      عنوان صفحه
                    </label>
                    <input
                      type="text"
                      value={filters.title}
                      onChange={(e) => handleFilterChange("title", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="جستجو در عنوان صفحه"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      آدرس صفحه
                    </label>
                    <input
                      type="text"
                      value={filters.url}
                      onChange={(e) => handleFilterChange("url", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ltr text-left"
                      placeholder="example.com/page"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      صفحه ارجاع دهنده
                    </label>
                    <input
                      type="text"
                      value={filters.referer}
                      onChange={(e) => handleFilterChange("referer", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ltr text-left"
                      placeholder="https://referrer.com"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      آی‌پی
                    </label>
                    <input
                      type="text"
                      value={filters.ip}
                      onChange={(e) => handleFilterChange("ip", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ltr text-left"
                      placeholder="192.168.1.1"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* ستون دوم */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      شناسه کاربر
                    </label>
                    <input
                      type="text"
                      value={filters.userID}
                      onChange={(e) => handleFilterChange("userID", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="شناسه کاربری"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نام کاربر
                    </label>
                    <input
                      type="text"
                      value={filters.name}
                      onChange={(e) => handleFilterChange("name", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="نام و نام خانوادگی"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ربات‌ها
                    </label>
                    <select
                      value={filters.isBot}
                      onChange={(e) => handleFilterChange("isBot", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">همه</option>
                      <option value="1">ربات</option>
                      <option value="0">کاربر</option>
                      {filterOptions.bots && filterOptions.bots.map((bot, index) => (
                        <option key={index} value={bot}>{bot || 'بدون عنوان'}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      سیستم عامل
                    </label>
                    <select
                      value={filters.os}
                      onChange={(e) => handleFilterChange("os", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">همه</option>
                      {filterOptions.os && filterOptions.os.map((os, index) => (
                        <option key={index} value={os}>{os || 'بدون عنوان'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ستون سوم */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نوع دستگاه
                    </label>
                    <select
                      value={filters.deviceType}
                      onChange={(e) => handleFilterChange("deviceType", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">همه</option>
                      {filterOptions.deviceTypes && filterOptions.deviceTypes.map((device, index) => (
                        <option key={index} value={device}>{device || 'بدون عنوان'}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      مرورگر
                    </label>
                    <select
                      value={filters.browser}
                      onChange={(e) => handleFilterChange("browser", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">همه</option>
                      {filterOptions.browsers && filterOptions.browsers.map((browser, index) => (
                        <option key={index} value={browser}>{browser || 'بدون عنوان'}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تاریخ بازدید
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <input
                          type="text"
                          value={filters.az}
                          onChange={(e) => handleFilterChange("az", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="از تاریخ"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={filters.ta}
                          onChange={(e) => handleFilterChange("ta", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="تا تاریخ"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تعداد در صفحه
                    </label>
                    <select
                      value={filters.per_page}
                      onChange={(e) => handleFilterChange("per_page", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="200">200</option>
                      <option value="500">500</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* تنظیمات ستون‌ها */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">نمایش ستون‌ها</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(showColumns).map((key) => (
                    <label key={key} className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-full cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={showColumns[key]}
                        onChange={() => handleColumnToggle(key)}
                        className="ml-2"
                      />
                      <span className="text-sm">
                        {key === 'showName' && 'نام کاربر'}
                        {key === 'showTitle' && 'عنوان صفحه'}
                        {key === 'showUrl' && 'آدرس صفحه'}
                        {key === 'showReferer' && 'صفحه ارجاع'}
                        {key === 'showIp' && 'آی‌پی'}
                        {key === 'showIsBot' && 'ربات'}
                        {key === 'showDate' && 'تاریخ'}
                        {key === 'showVisits' && 'بازدید'}
                        {key === 'showTimeOnPage' && 'ماندگاری'}
                        {key === 'showUid' && 'شناسه یکتا'}
                        {key === 'showUseragent' && 'User Agent'}
                        {key === 'showDeviceType' && 'نوع دستگاه'}
                        {key === 'showOs' && 'سیستم عامل'}
                        {key === 'showBrowser' && 'مرورگر'}
                        {key === 'showSource' && 'منبع'}
                        {key === 'showRegistrationSource' && 'منبع ثبت‌نام'}
                        {key === 'showTag' && 'تگ'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2"
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
                  className="px-6 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 flex items-center gap-2"
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
              <p className="mt-4 text-gray-600">در حال بارگذاری آمار بازدید...</p>
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
                          className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          ردیف
                        </th>
                        
                        {showColumns.showName && (
                          <th
                            scope="col"
                            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            کاربر
                          </th>
                        )}
                        
                        {showColumns.showTitle && (
                          <th
                            scope="col"
                            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            عنوان صفحه
                          </th>
                        )}
                        
                        {showColumns.showUrl && (
                          <th
                            scope="col"
                            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            آدرس صفحه
                          </th>
                        )}
                        
                        {showColumns.showIp && (
                          <th
                            scope="col"
                            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            آی‌پی
                          </th>
                        )}
                        
                        {showColumns.showIsBot && (
                          <th
                            scope="col"
                            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            وضعیت
                          </th>
                        )}
                        
                        {showColumns.showDeviceType && (
                          <th
                            scope="col"
                            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            دستگاه
                          </th>
                        )}
                        
                        {showColumns.showOs && (
                          <th
                            scope="col"
                            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            سیستم عامل
                          </th>
                        )}
                        
                        {showColumns.showBrowser && (
                          <th
                            scope="col"
                            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            مرورگر
                          </th>
                        )}
                        {showColumns.showSource && (
                          <th
                            scope="col"
                            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            منبع
                          </th>
                        )}
                        
                        {showColumns.showDate && (
                          <th
                            scope="col"
                            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            تاریخ
                          </th>
                        )}
                        
                        {showColumns.showTimeOnPage && (
                          <th
                            scope="col"
                            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            ماندگاری
                          </th>
                        )}
                        
                        {showColumns.showVisits && (
                          <th
                            scope="col"
                            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            بازدید
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {items.map((stat, index) => (
                        <tr key={stat.id} className="hover:bg-gray-50">
                          {/* شماره ردیف */}
                          <td className="px-4 py-3 text-center">
                            <span className="text-sm font-medium text-red-600">
                              {pagination.current_page}{index}
                            </span>
                          </td>
                          
                          {/* نام کاربر */}
                          {showColumns.showName && (
                            <td className="px-4 py-3">
                              {stat.userID ? (
                                <div className="space-y-1">
                                  <a
                                    href={`/admin/users/${stat.userID}`}
                                    target="_blank"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                  >
                                    {stat.name || `کاربر ${stat.userID}`}
                                  </a>
                                  <div>
                                    <a
                                      href={`/admin/stats-report?userID=${stat.userID}`}
                                      className="text-xs text-red-600 hover:text-red-800"
                                    >
                                      (گزارش کاربر)
                                    </a>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-500">---</span>
                              )}
                            </td>
                          )}
                          
                          {/* عنوان صفحه */}
                          {showColumns.showTitle && (
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={stat.title.value || ''}
                                readOnly
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-transparent cursor-text hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onClick={(e) => e.target.select()}
                              />
                            </td>
                          )}
                          
                          {/* آدرس صفحه */}
                          {showColumns.showUrl && (
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={stat.url.value || ''}
                                readOnly
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-transparent cursor-text hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ltr text-left"
                                dir="ltr"
                                onClick={(e) => e.target.select()}
                              />
                            </td>
                          )}
                          {/* آی‌پی */}
                          {showColumns.showIp && (
                            <td className="px-4 py-3">
                              <a
                                href={`https://ip.city/?ip=${stat.ip.value}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 ltr text-left block"
                                dir="ltr"
                              >
                                {stat.ip.value}
                              </a>
                            </td>
                          )}
                          
                          {/* وضعیت ربات */}
                          {showColumns.showIsBot && (
                            <td className="px-4 py-3">
                              {getBotBadge(stat.isBot)}
                            </td>
                          )}
                          
                          {/* نوع دستگاه */}
                          {showColumns.showDeviceType && (
                            <td className="px-4 py-3">
                              {getDeviceTypeBadge(stat.deviceType)}
                            </td>
                          )}
                          
                          {/* سیستم عامل */}
                          {showColumns.showOs && (
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-700">{stat.os.value || '---'}</span>
                            </td>
                          )}
                          
                          {/* مرورگر */}
                          {showColumns.showBrowser && (
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-700">{stat.browser.value || '---'}</span>
                            </td>
                          )}


                          {/* منبع */}
                          {showColumns.showSource && (
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-700">{stat.source.value || '---'}</span>
                            </td>
                          )}
                          {/* تاریخ */}
                          {showColumns.showDate && (
                            <td className="px-4 py-3">
                              <div className="space-y-1">
                                <div className="text-sm text-gray-900">
                                  <PersianDateDisplay
                                    timestamp={stat.date}
                                    showTime={true}
                                    variant="short"
                                  />
                                </div>
                              </div>
                            </td>
                          )}
                          
                          {/* ماندگاری */}
                          {showColumns.showTimeOnPage && (
                            <td className="px-4 py-3">
                              {getTimeOnPageBadge(stat.timeOnPage)}
                            </td>
                          )}
                          
                          {/* تعداد بازدید */}
                          {showColumns.showVisits && (
                            <td className="px-4 py-3 text-center">
                              <span className="text-lg font-bold text-gray-900">
                                {formatNumber(stat.visits || 1)}
                              </span>
                            </td>
                          )}
                        
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
                        اطلاعاتی یافت نشد
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        هیچ اطلاعاتی با فیلترهای اعمال شده مطابقت ندارد.
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
                      onClick={() => loadData(pagination.current_page - 1)}
                      disabled={pagination.current_page <= 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      قبلی
                    </button>
                    <button
                      onClick={() => loadData(pagination.current_page + 1)}
                      disabled={pagination.current_page >= pagination.last_page}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      بعدی
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        نمایش <span className="font-medium">{pagination.from}</span> تا{" "}
                        <span className="font-medium">{pagination.to}</span> از{" "}
                        <span className="font-medium">{pagination.total}</span> نتیجه
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() => loadData(pagination.current_page - 1)}
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
                                onClick={() => loadData(pageNum)}
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
                          onClick={() => loadData(pagination.current_page + 1)}
                          disabled={pagination.current_page >= pagination.last_page}
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
      </div>
<<<<<<< HEAD
    </div>
=======
    </AdminLayoutClient>
    
>>>>>>> c3315e64524d87686976a3eeebfc315510a7d0c5
  );
}