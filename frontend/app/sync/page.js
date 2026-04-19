"use client";

import { useMemo, useRef, useState,useEffect } from "react";
import api from "@/lib/api";
<<<<<<< HEAD
=======
import AdminLayoutClient from "../../components/AdminLayoutClient";
>>>>>>> c3315e64524d87686976a3eeebfc315510a7d0c5

const VALID_TYPES = [".sql", ".gz", ".zip", ".tar.gz"];

function formatMB(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2);
}

export default function BackupUploadPage() {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  // لودینگ‌ها جدا
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const [message, setMessage] = useState({ type: "", text: "" });

  const [backups, setBackups] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingList, setLoadingList] = useState(false);

  const loading = uploading || syncing;

  const canUpload = useMemo(() => !!file && !loading, [file, loading]);

  const resetForm = () => {
    setFile(null);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const showMsg = (type, text) => setMessage({ type, text });

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const lower = selectedFile.name.toLowerCase();
    const ok = VALID_TYPES.some((t) => lower.endsWith(t));
    if (!ok) {
      showMsg("error", "فقط فایل‌های SQL، GZ، ZIP و TAR.GZ قابل قبول هستند.");
      resetForm();
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setMessage({ type: "", text: "" });
  };

  const handleSync = async () => {
    if (loading) return;

    setSyncing(true);
    showMsg("info", "در حال بروزرسانی...");

    try {
      const res = await api.get("/sync", {
        // GET نیازی به multipart نداره
        headers: { Accept: "application/json" },
      });

      if (res.data?.success) {
        showMsg("success", "بروزرسانی با موفقیت انجام شد!");
      } else {
        showMsg("error", res.data?.message || "خطا در بروزرسانی");
      }
    } catch (err) {
      showMsg(
        "error",
        err?.response?.data?.message || err?.message || "خطا در بروزرسانی",
      );
    } finally {
      setSyncing(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showMsg("error", "لطفاً یک فایل انتخاب کنید.");
      return;
    }
    if (loading) return;

    setUploading(true);
    showMsg("info", "در حال آپلود فایل...");

    const formData = new FormData();
    formData.append("backup_file", file);

    try {
      const res = await api.post("/sync/upload", formData, {
        headers: {
          // axios خودش boundary را ست می‌کند؛ بهتره اینو دستی نذاری
          Accept: "application/json",
        },
        // اگر فایل خیلی بزرگه:
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });

      if (res.data?.success) {
        showMsg("success", "فایل با موفقیت آپلود شد!");
        resetForm();
      } else {
        showMsg("error", res.data?.message || "خطا در آپلود فایل");
      }
    } catch (err) {
      showMsg(
        "error",
        err?.response?.data?.message || err?.message || "خطا در آپلود فایل",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    setUploading(true);
    setMessage({ type: "info", text: "در حال بروزرسانی..." });

    try {
      const response = await api.get("/sync/update", {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        setMessage({
          type: "success",
          text: "بروزرسانی با موفقیت انجام شد!",
        });

        // ریست فرم
        setFile(null);
        setFileName("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "خطا در بروزرسانی",
      });
    } finally {
      setUploading(false);
    }
  };

   const loadBackups = async (p = 1) => {
    setLoadingList(true);

    try {
      const res = await api.get(`/sync/list?page=${p}`);

      setBackups(res.data.data || []);
      setPage(res.data.pagination.current_page);
      setLastPage(res.data.pagination.last_page);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingList(false);
    }
  };
   const handleRestore = async (file) => {
    if (!confirm("آیا از ریستور این بکاپ مطمئن هستید؟")) return;

    try {
      setMessage({ type: "info", text: "در حال ریستور..." });

      const res = await api.get(`/sync/restore/${file}`);

      if (res.data.success) {
        setMessage({ type: "success", text: "بکاپ با موفقیت ریستور شد" });
      } else {
        setMessage({ type: "error", text: res.data.message });
      }
    } catch (e) {
      setMessage({
        type: "error",
        text: e?.response?.data?.message || "خطا در ریستور",
      });
    }
  };
   useEffect(() => {
    loadBackups(1);
  }, []);

  return (
<<<<<<< HEAD
    <div>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full">
          <button
=======
    <AdminLayoutClient>
      <div>
        <div
          className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
          dir="rtl"
        >
          <div className="max-w-md w-full">
            <button
>>>>>>> c3315e64524d87686976a3eeebfc315510a7d0c5
              onClick={handleUpdate}
              disabled={loading}
              className={`w-full mb-3 py-3 px-4 rounded-lg font-medium transition ${
                loading
                  ? "bg-gray-300 mb-3 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  در حال آپلود...
                </span>
              ) : (
                "آپلود فایل"
              )}
            </button>
            {/* دکمه بروزرسانی */}
            {/* <button
            onClick={handleSync}
            disabled={loading}
            className={`w-full mb-3 py-3 px-4 rounded-lg font-medium transition ${
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {syncing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                در حال بروزرسانی...
              </span>
            ) : (
              "بروزرسانی بکاپ‌ها"
            )}
          </button> */}

            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* هدر */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  آپلود فایل بکاپ
                </h1>
                <p className="text-gray-600">
                  فایل بکاپ دیتابیس خود را انتخاب و آپلود کنید
                </p>
              </div>

              {/* پیام‌ها */}
              {message.text && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    message.type === "success"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : message.type === "error"
                        ? "bg-red-100 text-red-700 border border-red-300"
                        : "bg-blue-100 text-blue-700 border border-blue-300"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* فایل اینپوت */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  انتخاب فایل بکاپ
                </label>

                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                    loading
                      ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                      : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                  }`}
                  onClick={() => !loading && fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".sql,.gz,.zip,.tar.gz"
                    disabled={loading}
                  />

                  <div className="text-gray-500">
                    <svg
                      className="w-12 h-12 mx-auto mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>

                    {file ? (
                      <div>
                        <p className="font-medium text-green-600">{fileName}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          حجم: {formatMB(file.size)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">
                          برای انتخاب فایل کلیک کنید
                        </p>
                        <p className="text-sm mt-1">
                          فرمت‌های مجاز: SQL, GZ, ZIP, TAR.GZ
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          حداکثر حجم: ۵۰۰ مگابایت
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* دکمه آپلود */}
              <button
                onClick={handleUpload}
                disabled={!canUpload}
                className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                  canUpload
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    در حال آپلود...
                  </span>
                ) : (
                  "آپلود فایل"
                )}
              </button>

              {/* اطلاعات */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-800 mb-3">اطلاعات:</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <span className="w-4 h-4 bg-green-500 rounded-full ml-2" />
                    فایل از طریق Next Proxy به Laravel ارسال می‌شود (IP لو
                    نمی‌رود)
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 bg-green-500 rounded-full ml-2" />
                    در پوشه storage ذخیره می‌شود
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 bg-yellow-500 rounded-full ml-2" />
                    حداکثر حجم: ۵۰۰ مگابایت
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* لیست بکاپ ها */}
          <div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">بکاپ‌های موجود</h2>

              <button
                onClick={() => loadBackups(page)}
                className="text-sm text-blue-600 hover:underline"
              >
                بروزرسانی لیست
              </button>
            </div>

            <div className="grid gap-3">

              {loadingList && (
                <div className="text-center text-gray-500">
                  در حال دریافت لیست...
                </div>
              )}

              {!loadingList && backups.length === 0 && (
                <div className="text-center text-gray-500">
                  بکاپی وجود ندارد
                </div>
              )}

              {backups.map((b, i) => (
                <div
                  key={i}
                  className="bg-white shadow-sm border rounded-lg p-4 flex items-center justify-between hover:shadow transition"
                >

                  <div>
                    <div className="font-medium text-gray-800">
                      {b.name}
                    </div>

                    <div className="text-xs text-gray-500">
                      {b.last_modified}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRestore(b.name)}
                    className="bg-green-600 text-white px-4 py-1.5 rounded-md hover:bg-green-700 text-sm"
                  >
                    ریستور
                  </button>

                </div>
              ))}

            </div>

            {/* pagination */}

            <div className="flex justify-center gap-3 mt-6">

              <button
                disabled={page <= 1}
                onClick={() => loadBackups(page - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
              >
                قبلی
              </button>

              <span className="px-3 py-1 text-sm">
                صفحه {page} از {lastPage}
              </span>

              <button
                disabled={page >= lastPage}
                onClick={() => loadBackups(page + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
              >
                بعدی
              </button>

            </div>

          </div>
      </div>
<<<<<<< HEAD
    </div>
=======
    </AdminLayoutClient>
>>>>>>> c3315e64524d87686976a3eeebfc315510a7d0c5
  );
}
