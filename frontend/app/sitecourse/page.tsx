"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const api = "http://localhost:3000/api";

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const res = await axios.get(`${api}/sitecourse`);
      setCourses(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filtered = courses.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-blue-600 text-xl animate-pulse">
          در حال بارگذاری...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              دوره‌های آموزشی
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {courses.length} دوره در سیستم وجود دارد
            </p>
          </div>

          <button
            onClick={fetchCourses}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            بروزرسانی
          </button>
        </div>

        {/* SEARCH */}
        <div className="mb-8">
          <input
            placeholder="جستجوی دوره..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-96 bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* EMPTY */}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center border">
            <div className="text-5xl mb-3">📚</div>
            <div className="text-lg font-semibold text-gray-700">
              دوره‌ای پیدا نشد
            </div>
          </div>
        )}

        {/* COURSES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <div
              key={course.id}
              className="w-full md:w-[30%] mx-auto md:mx-0 bg-blue-50 rounded-2xl p-6 border border-blue-100"
            >
              {/* TITLE */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                {course.name}
              </h3>

              {/* SEPARATOR LINE */}
              <div className="w-full h-px bg-gray-300 mb-4"></div>

              {/* LESSONS COUNT */}
              <div className="text-center mb-4">
                <div className="text-lg font-semibold text-gray-700">
                  تعداد درس‌ها: {course.lessons_count ?? 0}
                </div>
              </div>

              {/* SEPARATOR LINE */}
              <div className="w-full h-px bg-gray-300 mb-4"></div>

              {/* FLASHCARDS COUNT */}
              <div className="text-center mb-6">
                <div className="text-lg font-semibold text-gray-700">
                  تعداد لغات: {course.flashcards_count ?? 0}
                </div>
              </div>

              {/* VIEW MORE BUTTON */}
              <Link href={`/sitecourse/${course.id}`}>
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium">
                  مشاهده بیشتر
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
