// app/login/page.js
"use client";

<<<<<<< HEAD
import { useState } from "react";
=======
import { useState ,FormEvent} from "react";
>>>>>>> c3315e64524d87686976a3eeebfc315510a7d0c5
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  const [username, setUsername] = useState(""); // می‌تونه موبایل/ایمیل/یوزرنیم باشه
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

<<<<<<< HEAD
  const onSubmit = async (e) => {
=======
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {

>>>>>>> c3315e64524d87686976a3eeebfc315510a7d0c5
    e.preventDefault();

    if (!username.trim() || !password) {
      setMessage({ type: "error", text: "لطفاً نام کاربری و رمز عبور را وارد کنید." });
      return;
    }

    setLoading(true);
    setMessage({ type: "info", text: "در حال ورود..." });

    try {
      // ✅ اگر لاراولت Sanctum داره (SPA)، این خط لازمه:
      await api.get("/auth/sanctum/csrf-cookie");

      // ✅ لاگین از طریق پروکسی Next (API Route)
      const res = await api.post(
        "/auth/login",
        { username: username.trim(), password },
        { headers: { "Content-Type": "application/json", Accept: "application/json" } }
      );

      if (res.data?.success) {
        setMessage({ type: "success", text: "ورود با موفقیت انجام شد ✅" });
        router.replace(next);
        return;
      }

      setMessage({ type: "error", text: res.data?.message || "نامعتبر" });
<<<<<<< HEAD
    } catch (err) {
=======
    } catch (err: any) { 
>>>>>>> c3315e64524d87686976a3eeebfc315510a7d0c5
      const status = err?.response?.status;
      const txt =
        err?.response?.data?.message ||
        (status === 401 ? "نام کاربری یا رمز عبور اشتباه است." : "خطا در ورود، دوباره تلاش کنید.");
<<<<<<< HEAD
      setMessage({ type: "error", text: txt });
    } finally {
      setLoading(false);
=======
        
      setMessage({ type: "error", text: txt });
>>>>>>> c3315e64524d87686976a3eeebfc315510a7d0c5
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">ورود به پنل</h1>
            <p className="text-gray-500 mt-2 text-sm">نام کاربری/موبایل/ایمیل و رمز عبور را وارد کنید</p>
          </div>

          {message.text && (
            <div
              className={`mb-5 p-3 rounded-lg text-sm border ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : message.type === "error"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نام کاربری</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="مثلاً موبایل یا ایمیل یا یوزرنیم"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور</label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="********"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xs px-2 py-1"
                >
                  {showPass ? "مخفی" : "نمایش"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium transition ${
                loading ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  در حال ورود...
                </span>
              ) : (
                "ورود"
              )}
            </button>

            <div className="flex justify-between items-center pt-2 text-sm">
              <a className="text-blue-600 hover:text-blue-700" href="/forgot-password">
                فراموشی رمز عبور؟
              </a>
              <a className="text-gray-600 hover:text-gray-700" href="/">
                بازگشت به سایت
              </a>
            </div>
          </form>
        </div>

        <div className="text-center text-xs text-gray-400 mt-4">
          اگر مشکل ورود دارید، دسترسی API/کوکی را بررسی کنید.
        </div>
      </div>
    </div>
  );
}