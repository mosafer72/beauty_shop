// app/backup/upload/page.js
"use client";

import { useState, useRef } from "react";
import axios from "axios";
import api from "@/lib/api";
import AdminLayout from "../../components/AdminLayout";

export default function SimpleBackupUpload() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);

  // مدیریت انتخاب فایل
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // بررسی نوع فایل
    const validTypes = [".sql", ".gz", ".zip", ".tar.gz"];
    const fileExt = selectedFile.name
      .toLowerCase()
      .slice(((selectedFile.name.lastIndexOf(".") - 1) >>> 0) + 2);

    if (
      !validTypes.some((type) => selectedFile.name.toLowerCase().endsWith(type))
    ) {
      setMessage({
        type: "error",
        text: "فقط فایل‌های SQL، GZ و ZIP قابل قبول هستند.",
      });
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setMessage({ type: "", text: "" });
  };
const handleUpdate = async () => {

    setLoading(true);
    setMessage({ type: "info", text: "در حال بروزرسانی..." });

  try{
      const response = await api.get(
        "/backup/sync",
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
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
      setLoading(false);
    }
}
  // آپلود فایل
  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: "error", text: "لطفا یک فایل انتخاب کنید." });
      return;
    }

    setLoading(true);
    setMessage({ type: "info", text: "در حال آپلود فایل..." });

    const formData = new FormData();
    formData.append("backup_file", file);

    try {
      // ارسال به API Laravel
      const response = await api.post(
        "/backup/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text: "فایل با موفقیت آپلود شد!",
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
        text: error.response?.data?.message || "خطا در آپلود فایل",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
        dir="rtl"
      >
        <div className="max-w-md w-full">
          <button
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
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".sql,.gz,.zip,.tar.gz"
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
                        حجم: {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">
                        فایل را اینجا بکشید و رها کنید
                      </p>
                      <p className="text-sm mt-1">یا برای انتخاب کلیک کنید</p>
                      <p className="text-xs text-gray-400 mt-2">
                        فرمت‌های مجاز: SQL, GZ, ZIP
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* دکمه آپلود */}
            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                loading || !file
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
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

            {/* اطلاعات */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">اطلاعات:</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 ml-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  فایل به سرور Laravel ارسال می‌شود
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 ml-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  در پوشه storage ذخیره می‌شود
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-yellow-500 ml-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  حداکثر حجم: ۵۰۰ مگابایت
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
