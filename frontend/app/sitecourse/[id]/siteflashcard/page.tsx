"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

// ۱. تعریف تایپ‌ها (Types)
type OptionType = {
  id: string | number;
  text: string;
};

type FlashcardType = {
  id: string | number;
  question: string;
  options: OptionType[];
};

type ResultType = {
  is_correct: boolean;
  correct_option_id: string | number;
};

type HistoryType = {
  option_text: string;
  is_correct: boolean;
};

export default function Flashcard() {
  const params = useParams();
  const api = "http://localhost:3000/api";

  // ۲. اضافه کردن تایپ‌ها به Stateها
  const [card, setCard] = useState<FlashcardType | null>(null);
  const [selected, setSelected] = useState<string | number | null>(null);
  const [result, setResult] = useState<ResultType | null>(null);
  const [history, setHistory] = useState<HistoryType[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [overlayLoading, setOverlayLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  async function loadCard() {
    setLoading(true);
    setSelected(null);
    setResult(null);
    setShowAnswer(false);
    
    try {
      const res = await axios.get(`${api}/sitecourse/${params.id}/siteflashcard`);
      setCard(res.data);

      if (res.data?.id) {
        const historyRes = await axios.get(
          `${api}/siteflashcard/${res.data.id}/answers`
        );
        setHistory(historyRes.data.answers || []);
      }
    } catch (error) {
      console.error("Error loading flashcard:", error);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadCard();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ۳. اضافه کردن تایپ OptionType به ورودی تابع
  async function chooseOption(option: OptionType) {
    if (!card) return; // جلوگیری از خطای تایپ‌اسکریپت در صورت null بودن کارت

    setSelected(option.id);
    setOverlayLoading(true);

    try {
      const res = await axios.post(`${api}/siteflashcard/answer`, {
        flashcard_id: card.id,
        option_id: option.id,
      });

      setResult(res.data);
      setShowAnswer(true);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
    
    setTimeout(() => {
      setOverlayLoading(false);
    }, 1500);
  }

  function handleCheckAnswer() {
    if (selected) {
      setOverlayLoading(true);
      
      setTimeout(() => {
        setOverlayLoading(false);
        setShowAnswer(true);
      }, 1000);
    }
  }

  function handleNextQuestion() {
    loadCard();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-xl text-gray-400">Loading flashcard...</div>
      </div>
    );
  }

  if (!card || !card?.options || card.options.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-xl text-gray-600">
        امروز کارت جدیدی نداری ✨
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* CARD WRAPPER */}
      <div
        className="min-w-[450px] min-h-[450px]
          max-w-[600px] h-full md:h-[600px] 
          bg-ble-600 rounded-2xl 
          md:flex md:flex-col md:justify-center md:items-center
          p-0 md:p-6
        "
      >
        {/* Inner content card */}
        <div className="min-w-[450px] min-h-[450px] h-full bg-ble-600 md:bg-transparent flex items-center justify-center">
          <div className="min-w-[450px] min-h-[450px] h-full max-h-[600px] bg-blue-600 md:bg-blue-600 rounded-xl p-6 space-y-6 overflow-y-auto">
            {/* FLASHCARD CONTAINER */}
            
            <div className="flash_card bg-white rounded-2xl p-6 shadow-md min-h-[300px]">
              <style jsx>{`
              .flash_card{
                min-width:400px;
              }
            `}</style>
              <div className="text-xs text-gray-500 mb-2">FLASHCARD #{card.id}</div>

              <div className="text-[14px] font-bold text-gray-800 mb-6 leading-relaxed">
                {card.question}
              </div>

              <div className="grid gap-3">
                {card.options.map((option) => {
                  let style = "bg-gray-100 hover:bg-gray-200 border border-gray-300";

                  if (selected === option.id) {
                    style = "bg-blue-500 text-white border-blue-600 shadow-md";
                  }

                  if (showAnswer && result) {
                    if (option.id === result.correct_option_id) {
                      style = "bg-green-500 text-white border-green-600 shadow-md";
                    } else if (selected === option.id && !result.is_correct) {
                      style = "bg-red-500 text-white border-red-600 shadow-md";
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => chooseOption(option)}
                      className={
                        style +
                        " text-left p-4 rounded-xl transition-all duration-200 font-medium text-[12px]"
                      }
                      disabled={showAnswer}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>

              {/* دکمه‌های کنترل */}
              <div className="mt-6 flex gap-3">
                {!showAnswer && (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={!selected}
                    className={`px-4 py-2 rounded-xl font-medium text-[12px] ${
                      selected 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    بررسی پاسخ
                  </button>
                )}
                
                {showAnswer && (
                  <button
                    onClick={handleNextQuestion}
                    className="px-4 py-2 rounded-xl font-medium text-[12px] bg-green-600 text-white hover:bg-green-700"
                  >
                    سوال بعدی
                  </button>
                )}
              </div>

              {result && showAnswer && (
                <div className="mt-4 text-center text-lg font-semibold">
                  {result.is_correct ? (
                    <span className="text-green-500">✅ پاسخ درست بود</span>
                  ) : (
                    <span className="text-red-500">❌ پاسخ اشتباه بود</span>
                  )}
                </div>
              )}
            </div>

            {/* HISTORY */}
            <div className="bg-white rounded-xl p-5 shadow">
              <div className="text-gray-500 mb-3 text-sm">تاریخچه پاسخ‌ها</div>

              <div className="space-y-2 max-h-[120px] overflow-y-auto">
                {history.length === 0 && (
                  <div className="text-gray-400 text-sm">هنوز پاسخی ثبت نکردی</div>
                )}

                {history.map((h, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition p-3 rounded-lg text-[12px]"
                  >
                    <span className="text-gray-700">{h.option_text}</span>
                    <span className={h.is_correct ? "text-green-500" : "text-red-500"}>
                      {h.is_correct ? "✅" : "❌"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OVERLAY LOADING */}
      {overlayLoading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="text-white text-xl animate-pulse">در حال بررسی...</div>
        </div>
      )}

    </div>
  );
}
