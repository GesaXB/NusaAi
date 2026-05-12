"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { AI_MODELS } from "@/types";
import {
  Brain,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
}

const SAMPLE_QUESTIONS: QuizQuestion[] = [
  {
    question: "Proklamasi Kemerdekaan Indonesia dibacakan pada tanggal?",
    options: ["15 Agustus 1945", "16 Agustus 1945", "17 Agustus 1945", "18 Agustus 1945"],
    answer: 2,
  },
  {
    question: "Siapa yang membacakan teks Proklamasi Kemerdekaan Indonesia?",
    options: ["Soeharto", "Mohammad Hatta", "Soekarno", "Soekarno dan Hatta"],
    answer: 3,
  },
  {
    question: "Apa rumus luas lingkaran?",
    options: ["2πr", "πr²", "πd", "2πd"],
    answer: 1,
  },
  {
    question: "Proses tumbuhan membuat makanan sendiri menggunakan cahaya matahari disebut?",
    options: ["Respirasi", "Fermentasi", "Fotosintesis", "Transpirasi"],
    answer: 2,
  },
  {
    question: "Hukum Newton II menyatakan F = ?",
    options: ["m/a", "m + a", "m × a", "a/m"],
    answer: 2,
  },
];

type Step = "input" | "loading" | "quiz" | "result";

export default function QuizPage() {
  const [modelId, setModelId] = useState(AI_MODELS[0].id);
  const [step, setStep] = useState<Step>("input");
  const [topic, setTopic] = useState("");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);

  const questions = SAMPLE_QUESTIONS;
  const q = questions[current];
  const score = answers.filter((a, i) => a === questions[i].answer).length;

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setStep("loading");
    setTimeout(() => {
      setCurrent(0);
      setAnswers([]);
      setSelected(null);
      setShowAnswer(false);
      setStep("quiz");
    }, 2000);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    if (current + 1 >= questions.length) {
      setStep("result");
    } else {
      setCurrent(current + 1);
      setSelected(null);
      setShowAnswer(false);
    }
  };

  const handleRestart = () => {
    setStep("input");
    setTopic("");
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
    setShowAnswer(false);
  };

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar modelId={modelId} onModelChange={setModelId} userName="Pengguna" />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">

            {/* Input step */}
            {step === "input" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-zinc-100 mb-1">Quiz Generator</h1>
                  <p className="text-zinc-400">Buat soal latihan otomatis dari topik apapun.</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                  <label className="text-sm font-medium text-zinc-300 block">
                    Topik atau tempel materi kamu
                  </label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Contoh: Sejarah Kerajaan Majapahit, Persamaan Kuadrat, Sistem Periodik Unsur..."
                    rows={5}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-xs text-zinc-500">Jumlah soal: 5 · Tipe: Pilihan ganda</p>
                    </div>
                    <Button onClick={handleGenerate} disabled={!topic.trim()} className="gap-2">
                      <Brain className="w-4 h-4" />
                      Buat Quiz
                    </Button>
                  </div>
                </div>

                {/* Quick topics */}
                <div>
                  <p className="text-xs text-zinc-500 mb-3 uppercase tracking-widest">Topik populer</p>
                  <div className="flex flex-wrap gap-2">
                    {["Matematika SMA", "Sejarah Indonesia", "Fisika Dasar", "Biologi Sel", "Bahasa Inggris"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTopic(t)}
                        className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition-all"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Loading step */}
            {step === "loading" && (
              <div className="flex flex-col items-center justify-center min-h-80 gap-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                  <Loader2 className="w-7 h-7 text-blue-400 animate-spin" />
                </div>
                <div>
                  <p className="font-semibold text-zinc-100 mb-1">Membuat soal quiz...</p>
                  <p className="text-sm text-zinc-500">AI sedang menyiapkan 5 soal untuk kamu</p>
                </div>
              </div>
            )}

            {/* Quiz step */}
            {step === "quiz" && (
              <div className="space-y-6">
                {/* Progress */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-400">Soal {current + 1} dari {questions.length}</span>
                  <span className="text-xs text-zinc-600">{Math.round(((current) / questions.length) * 100)}% selesai</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${(current / questions.length) * 100}%` }}
                  />
                </div>

                {/* Question */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <div className="flex gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    </div>
                    <p className="text-zinc-100 font-medium leading-relaxed pt-1">{q.question}</p>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {q.options.map((opt, i) => {
                      const isSelected = selected === i;
                      const isCorrect = i === q.answer;
                      const showResult = showAnswer;

                      return (
                        <button
                          key={i}
                          onClick={() => { if (!showAnswer) setSelected(i); }}
                          className={cn(
                            "flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl border text-sm transition-all",
                            showResult && isCorrect
                              ? "border-green-500/50 bg-green-600/10 text-green-300"
                              : showResult && isSelected && !isCorrect
                              ? "border-red-500/50 bg-red-600/10 text-red-300"
                              : isSelected
                              ? "border-blue-500/50 bg-blue-600/10 text-blue-200"
                              : "border-zinc-800 bg-zinc-800/50 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800"
                          )}
                        >
                          <span className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border",
                            isSelected ? "border-blue-500 text-blue-400" : "border-zinc-700 text-zinc-500"
                          )}>
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {showResult && isCorrect && <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />}
                          {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  {!showAnswer && selected !== null && (
                    <Button variant="outline" onClick={() => setShowAnswer(true)}>
                      Cek Jawaban
                    </Button>
                  )}
                  {(showAnswer || selected !== null) && (
                    <Button onClick={handleNext} className="gap-2">
                      {current + 1 >= questions.length ? "Lihat Hasil" : "Soal Berikutnya"}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Result step */}
            {step === "result" && (
              <div className="text-center py-8 space-y-6">
                <div className={cn(
                  "w-20 h-20 rounded-3xl flex items-center justify-center mx-auto",
                  score >= 4 ? "bg-green-600/10 border border-green-600/20" : "bg-yellow-600/10 border border-yellow-600/20"
                )}>
                  <span className="text-4xl">{score >= 4 ? "🎉" : score >= 2 ? "💪" : "📚"}</span>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-zinc-100 mb-1">
                    {score}/{questions.length} Benar
                  </h2>
                  <p className="text-zinc-400">
                    {score >= 4 ? "Luar biasa! Kamu kuasai materi ini." : score >= 2 ? "Bagus! Terus berlatih ya." : "Jangan menyerah! Pelajari lagi materinya."}
                  </p>
                </div>

                <div className="flex flex-col gap-2 max-w-xs mx-auto">
                  {questions.map((q, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-left px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800">
                      {answers[i] === q.answer
                        ? <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                        : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                      <span className="text-zinc-400 truncate">Soal {i + 1}</span>
                    </div>
                  ))}
                </div>

                <Button onClick={handleRestart} variant="outline" className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Buat Quiz Baru
                </Button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
