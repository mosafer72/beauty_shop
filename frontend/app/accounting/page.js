
"use client";

import React, { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import AdminLayoutClient from "../../components/AdminLayoutClient";

export default function AccountingPage() {
  const [data, setData] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const prev_sipese = useRef(0);
  const prev_alli = useRef(0);

  const inputRef = useRef(null);

  // ✅ ستون‌های محاسباتی که ادیت نباید بشن
  const computedCols = new Set(["alli", "sock", "aisle", "sipese", "diro", "sosese"]);

  // ✅ ستون‌ها (value_1 هم اضافه شد)
  const columns = [
    { key: "id", label: "شناسه", width: "80px", type: "text" },
    { key: "date", label: "تاریخ", width: "120px", type: "text" },
    { key: "ee", label: "قیمت طلا", width: "130px", type: "number" },

    { key: "value_1", label: "موجودی ۱", width: "110px", type: "number" }, // ✅ اضافه شد
    { key: "value_2", label: "موجودی آب ‌شده", width: "110px", type: "number" },

    { key: "change_amount", label: "موجودی متفرقه", width: "130px", type: "number" },
    { key: "past_data", label: "موجودی ساخته", width: "130px", type: "number" },
    { key: "colo", label: "بابت درصد", width: "100px", type: "number" },

    { key: "eaile", label: "طلب طلایی از بازار", width: "130px", type: "number" },
    { key: "alesse", label: "بدهی طلایی بازار", width: "114px", type: "number" },

    { key: "lab", label: "طلب نقدی از بازار", width: "120px", type: "number" },
    { key: "sisrse", label: "بدهی نقدی بازار", width: "114px", type: "number" },

    { key: "bho", label: "موجودی بانک ها", width: "100px", type: "number" },
    { key: "cadisen", label: "مانده طلایی سایت", width: "130px", type: "number" },

    { key: "vax", label: "مانده نقدی سایت", width: "100px", type: "number" }, // ✅ تایپ درست شد

    { key: "alli", label: "اضافه یا کسر طلا", width: "114px", type: "text" },
    { key: "sock", label: "معادل ریال", width: "100px", type: "text" },
    { key: "aisle", label: "اضافه یا کسر نقدی", width: "114px", type: "text" },
    { key: "sipese", label: "معادل طلا", width: "100px", type: "text" },
    { key: "diro", label: "سود / زیان", width: "114px", type: "text" },
    { key: "sosese", label: "معادل ریالی", width: "120px", type: "text" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // ✅ به جای /accounting-data از proxy داخلی استفاده می‌کنیم
      const res = await api.get("/accounting");
      setData(res.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (rowIndex, columnKey) => {
    // ✅ ستون محاسباتی ادیت نشه
    if (computedCols.has(columnKey)) return;

    setEditingCell({ rowIndex, column: columnKey });
    setEditValue(String(data[rowIndex]?.[columnKey] ?? 0));
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const saveEdit = async () => {
    if (!editingCell) return;

    const { rowIndex, column } = editingCell;

    // ✅ ستون محاسباتی ادیت نشه
    if (computedCols.has(column)) {
      setEditingCell(null);
      return;
    }

    let newValue;
    if (columns.find((c) => c.key === column)?.type === "number") {
      newValue = parseFloat(editValue) || 0;
    } else {
      newValue = editValue;
    }

    const updatedRow = { ...data[rowIndex], [column]: newValue };
    const updatedData = [...data];
    updatedData[rowIndex] = updatedRow;

    setLoading(true);
    try {
      // ✅ PUT به proxy
      const response = await api.put("/accounting", updatedRow, {
        headers: { "Content-Type": "application/json", Accept: "application/json" },
      });

      if (response.data?.success) {
        setData(updatedData);
        setMessage("✅ تغییرات با موفقیت ذخیره شد");
        setEditingCell(null);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ پاسخ نامعتبر از سرور");
      }
    } catch (error) {
      setMessage("❌ خطا در ذخیره تغییرات");
      console.error("Error saving data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") saveEdit();
    else if (e.key === "Escape") cancelEdit();
  };

  const formatNumber = (num) => {
    if (num === 0 || num === "0") return "۰";
    const formatted = new Intl.NumberFormat("En-Us", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);

    return formatted.replace(/\./g, "/").replace(/,/g, "،").replace(/\//g, ".");
  };

  const toNum = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };

  const renderCell = (row, rowIndex, column) => {
    const isEditing =
      editingCell?.rowIndex === rowIndex && editingCell?.column === column.key;

    if (isEditing) {
      return (
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={saveEdit}
            className="w-full px-0 py-1 border-2 border-blue-500 rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-blue-300"
            autoFocus
            dir="ltr"
            style={{ fontSize: "7px" }}
          />
        </div>
      );
    }

    let cellContent = "";

    // ستون‌های عددی مستقیم
    if (column.type === "number") {
      cellContent = formatNumber(Number(row[column.key] || 0));
      return (
        <div
          className="px-0 py-1 rounded cursor-pointer hover:bg-blue-50 transition text-center"
          onClick={() => startEdit(rowIndex, column.key)}
          dir="ltr"
          style={{ fontSize: "14px" }}
        >
          {cellContent}
        </div>
      );
    }

    // ✅ محاسبات دقیق مطابق کد خودت
    const alli_new = Number(
      toNum(row["lab"]) - toNum(row["sisrse"]) + toNum(row["bho"]) - toNum(row["vax"])
    );

    const sipese_new = Number(
      toNum(row["lab"]) - toNum(row["sisrse"]) + toNum(row["bho"]) - toNum(row["vax"])
    );

    if (column.key === "alli") {
      cellContent =
        toNum(row["value_1"]) +
        toNum(row["value_2"]) +
        toNum(row["change_amount"]) +
        toNum(row["past_data"]) +
        toNum(row["colo"]) +
        toNum(row["eaile"]) -
        toNum(row["alesse"]) -
        toNum(row["cadisen"]);
    } else if (column.key === "sock") {
      const alliCalc =
        toNum(row["value_1"]) +
        toNum(row["value_2"]) +
        toNum(row["change_amount"]) +
        toNum(row["past_data"]) +
        toNum(row["colo"]) +
        toNum(row["eaile"]) -
        toNum(row["alesse"]) -
        toNum(row["cadisen"]);
      cellContent = formatNumber(Number(alliCalc) * toNum(row["ee"]));
    } else if (column.key === "aisle") {
      cellContent = formatNumber(
        Number(toNum(row["lab"]) - toNum(row["sisrse"]) + toNum(row["bho"]) - toNum(row["vax"]))
      );
    } else if (column.key === "sipese") {
      cellContent = formatNumber(
        Number(toNum(row["lab"]) - toNum(row["sisrse"]) + toNum(row["bho"]) - toNum(row["vax"])) /
          (toNum(row["ee"]) || 1)
      );
    } else if (column.key === "diro") {
      cellContent = formatNumber(
        toNum(alli_new) +
          toNum(sipese_new) -
          toNum(prev_alli.current) -
          toNum(prev_sipese.current)
      );
    } else if (column.key === "sosese") {
      cellContent = formatNumber(
        toNum(alli_new) +
          toNum(sipese_new) -
          toNum(prev_alli.current) -
          toNum(prev_sipese.current) / (toNum(row["ee"]) || 1)
      );
      prev_alli.current = alli_new;
      prev_sipese.current = sipese_new;
    } else {
      cellContent = row[column.key];
    }

    return (
      <div
        className={`px-0 py-1 rounded text-center ${
          computedCols.has(column.key)
            ? "cursor-default bg-gray-50"
            : "cursor-pointer hover:bg-blue-50 transition"
        }`}
        onClick={() => startEdit(rowIndex, column.key)}
        dir="rtl"
        style={{ fontSize: "14px" }}
        title={computedCols.has(column.key) ? "محاسباتی (غیر قابل ویرایش)" : ""}
      >
        {cellContent}
      </div>
    );
  };

  const addNewRow = () => {
    const newRow = {
      id: data.length + 1,
      date: 0,
      status: 0,
      ee: 0,
      value_1: 0,
      value_2: 0,
      change_amount: 0,
      past_data: 0,
      colo: 0,
      eaile: 0,
      alesse: 0,
      lab: 0,
      sisrse: 0,
      bho: 0,
      cadisen: 0,
      vax: 0,
      alli: 0,
      sock: 0,
      aisle: 0,
      sipese: 0,
      diro: 0,
      sosese: 0,
    };
    setData([...data, newRow]);
  };

  const deleteRow = (rowIndex) => {
    if (!confirm("آیا از حذف این سطر اطمینان دارید؟")) return;
    const newData = data.filter((_, index) => index !== rowIndex);
    setData(newData);
    setMessage("✅ سطر با موفقیت حذف شد");
    setTimeout(() => setMessage(""), 3000);
  };

  const renderActions = (row, rowIndex) => {
    return (
      <div className="flex gap-1 justify-center">
        <button
          onClick={() => deleteRow(rowIndex)}
          className="px-0 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded text-xs"
          style={{ fontSize: "7px" }}
          title="حذف"
        >
          حذف
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(JSON.stringify(row))}
          className="px-0 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded text-xs"
          style={{ fontSize: "7px" }}
          title="کپی"
        >
          کپی
        </button>
      </div>
    );
  };

  return (
<<<<<<< HEAD
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">جدول حسابداری</h1>
            <p className="text-gray-600 text-sm mt-1">
              مدیریت ستون‌های داده‌های مالی با قابلیت ویرایش آنی
            </p>
=======
    <AdminLayoutClient>
      <div>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">جدول حسابداری</h1>
              <p className="text-gray-600 text-sm mt-1">
                مدیریت ستون‌های داده‌های مالی با قابلیت ویرایش آنی
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={addNewRow}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
              >
                <span>+</span>
                سطر جدید
              </button>
            </div>
>>>>>>> c3315e64524d87686976a3eeebfc315510a7d0c5
          </div>

          {message && (
            <div
              className={`mb-4 p-3 rounded-lg ${
                message.includes("✅")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-300">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      className="px-0 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-100 z-10"
                      style={{ width: "100px", fontSize: "14px" }}
                    >
                      عملیات
                    </th>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className="px-0 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        style={{ width: col.width, fontSize: "14px" }}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={`hover:bg-gray-50 transition-colors ${
                        rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td
                        className="px-0 py-3 whitespace-nowrap sticky right-0 bg-white z-10 border-l"
                        style={{ fontSize: "14px" }}
                      >
                        {renderActions(row, rowIndex)}
                      </td>

                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className="px-0 py-3 whitespace-nowrap border border-gray-200 text-center"
                          style={{ width: col.width, fontSize: "14px" }}
                        >
                          {renderCell(row, rowIndex, col)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* آمار */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow border">
              <div className="text-sm text-gray-600" style={{ fontSize: "17px" }}>
                تعداد ردیف‌ها
              </div>
              <div className="text-xl font-bold text-blue-600 mt-1">
                {data.length}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow border">
              <div className="text-sm text-gray-600" style={{ fontSize: "17px" }}>
                مجموع ستون ۱
              </div>
              <div
                className="text-xl font-bold text-green-600 mt-1"
                dir="ltr"
                style={{ fontSize: "17px" }}
              >
                {formatNumber(
                  data.reduce((sum, row) => sum + (Number(row.sisrse) || 0), 0)
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow border">
              <div className="text-sm text-gray-600" style={{ fontSize: "17px" }}>
                آخرین ویرایش
              </div>
              <div
                className="text-lg font-medium text-gray-800 mt-1"
                style={{ fontSize: "17px" }}
              >
                {new Date().toLocaleDateString("fa-IR")}
              </div>
            </div>
          </div>
        </div>

        {/* راهنما */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3
            className="font-bold text-blue-800 mb-3 flex items-center gap-2"
            style={{ fontSize: "14px" }}
          >
            <span>💡</span>
            راهنمای ویرایش
          </h3>
          <div className="text-blue-700" style={{ fontSize: "17px" }}>
            <ul className="space-y-1 pr-4">
              <li>• روی هر سلول کلیک کنید تا ویرایش شود</li>
              <li>• برای ذخیره: Enter را بزنید</li>
              <li>• برای لغو: Escape را بزنید</li>
              <li>• ستون‌های محاسباتی قابل ویرایش نیستند</li>
            </ul>
          </div>
        </div>

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-gray-700">در حال ذخیره/بارگذاری...</span>
              </div>
            </div>
          </div>
        )}
      </div>
<<<<<<< HEAD

      {/* راهنما */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3
          className="font-bold text-blue-800 mb-3 flex items-center gap-2"
          style={{ fontSize: "14px" }}
        >
          <span>💡</span>
          راهنمای ویرایش
        </h3>
        <div className="text-blue-700" style={{ fontSize: "17px" }}>
          <ul className="space-y-1 pr-4">
            <li>• روی هر سلول کلیک کنید تا ویرایش شود</li>
            <li>• برای ذخیره: Enter را بزنید</li>
            <li>• برای لغو: Escape را بزنید</li>
            <li>• ستون‌های محاسباتی قابل ویرایش نیستند</li>
          </ul>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">در حال ذخیره/بارگذاری...</span>
            </div>
          </div>
        </div>
      )}
    </div>
=======
    </AdminLayoutClient>
>>>>>>> c3315e64524d87686976a3eeebfc315510a7d0c5
  );
}