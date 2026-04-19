"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

// ۱. تعریف ساختار (Type) برای دوره
type CourseType = {
  id?: string | number;
  name: string;
};

// ۲. تعریف ساختار (Type) برای درس‌ها
type LessonType = {
  id: string | number;
  title: string;
  flashcards_count: number;
};

export default function LessonsPage() {
  const params = useParams();
  
  // ۳. اختصاص دادن تایپ‌ها به useState تا خطای never برطرف شود
  const [course, setCourse] = useState<CourseType | null>(null);
  const [lessons, setLessons] = useState<LessonType[]>([]);
  const [loading, setLoading] = useState(true);

  const api = "http://localhost:3000/api";

  async function loadCourseAndLessons() {
    setLoading(true);
    
    try {
      // دریافت اطلاعات دوره
      const courseRes = await axios.get(`${api}/sitecourse/${params.id}`);
      setCourse(courseRes.data);
      
      // ⚠️ توجه: آدرس دریافت درس‌ها دقیقاً مشابه آدرس دریافت دوره است!
      // اگر آدرس جداگانه‌ای دارد (مثلا /lessons در انتها) آن را اصلاح کنید.
      // مثال: const lessonsRes = await axios.get(`${api}/sitecourse/${params.id}/lessons`);
      const lessonsRes = await axios.get(`${api}/sitecourse/${params.id}`);
      
      // اگر درس‌ها داخل آبجکت دوره هستند باید بنویسید: lessonsRes.data.lessons
      // اما من بر اساس کد خودتان همان data را قرار دادم:
      setLessons(lessonsRes.data);
    } catch (error) {
      console.error("Error loading course and lessons:", error);
    }
    
    setLoading(false);
  }

  useEffect(() => {
    if (params.id) {
      loadCourseAndLessons();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-blue-600 text-xl animate-pulse">
          در حال بارگذاری...
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <div className="text-4xl mb-4">❌</div>
        <div className="text-2xl font-bold text-gray-700 mb-2">
          دوره یافت نشد
        </div>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          دوره مورد نظر وجود ندارد یا حذف شده است.
        </p>
        <Link
          href="/courses"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          بازگشت به دوره‌ها
        </Link>
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
              {course.name}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {lessons.length} درس در این دوره وجود دارد
            </p>
          </div>

          <Link
            href="/courses"
            className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            بازگشت به دوره‌ها
          </Link>
        </div>

        {/* COURSES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl p-10 text-center border">
              <div className="text-5xl mb-3">📚</div>
              <div className="text-lg font-semibold text-gray-700">
                درسی در این دوره وجود ندارد
              </div>
            </div>
          ) : (
            lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="w-full md:w-[30%] mx-auto md:mx-0 bg-blue-50 rounded-2xl p-6 border border-blue-100"
              >
                {/* TITLE */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  درس {index + 1}: {lesson.title}
                </h3>

                {/* SEPARATOR LINE */}
                <div className="w-full h-px bg-gray-300 mb-4"></div>

                {/* FLASHCARDS COUNT */}
                <div className="text-center mb-4">
                  <div className="text-lg font-semibold text-gray-700">
                    تعداد فلش‌کارت‌ها: {lesson.flashcards_count || 0}
                  </div>
                </div>

                {/* SEPARATOR LINE */}
                <div className="w-full h-px bg-gray-300 mb-6"></div>

                {/* VIEW MORE BUTTON */}
                <Link href={`/sitecourse/${lesson.id}/siteflashcard`}>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium">
                    مشاهده بیشتر
                  </button>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
