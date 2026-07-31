"use client";

import { useState } from "react";
import Link from "next/link";
import type { LawArticle } from "@/lib/lawData/seed";
import { generateQuizSet, type Quiz } from "@/lib/quiz";
import { addWrongNote } from "@/lib/supabase/wrongNotes";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/AuthProvider";

const LAW_OPTIONS = ["전체", "민법", "형법", "근로기준법"];
const QUESTION_COUNT = 8;

type Stage = "select" | "playing" | "done";

function formatRoundLabel(law: string) {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  return `${dateStr} · ${law}`;
}

export default function QuizPage() {
  const { user } = useAuth();
  const [stage, setStage] = useState<Stage>("select");
  const [selectedLaw, setSelectedLaw] = useState("전체");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<"live" | "seed" | null>(null);

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<"O" | "X" | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const [roundId, setRoundId] = useState("");
  const [roundLabel, setRoundLabel] = useState("");

  async function startQuiz() {
    setLoading(true);
    setError(null);
    try {
      const lawParam = selectedLaw === "전체" ? "" : selectedLaw;
      const res = await fetch(
        `/api/law-articles${lawParam ? `?law=${encodeURIComponent(lawParam)}` : ""}`
      );
      if (!res.ok) throw new Error("법령 데이터를 불러오지 못했습니다.");
      const data: { articles: LawArticle[]; source: "live" | "seed" } =
        await res.json();

      const set = generateQuizSet(data.articles, QUESTION_COUNT);
      if (set.length === 0) throw new Error("문제를 생성할 조문이 없습니다.");

      setQuizzes(set);
      setDataSource(data.source);
      setIndex(0);
      setScore(0);
      setAnswer(null);
      setShowExplanation(false);
      setRoundId(
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `round-${Date.now()}`
      );
      setRoundLabel(formatRoundLabel(selectedLaw));
      setStage("playing");
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  const current = quizzes[index];

  async function submitAnswer(choice: "O" | "X") {
    if (!current || answer) return;
    setAnswer(choice);
    setShowExplanation(true);

    const correctAnswer: "O" | "X" = current.isTrue ? "O" : "X";
    const isCorrect = choice === correctAnswer;

    if (isCorrect) {
      setScore((s) => s + 1);
    } else if (user) {
      try {
        const supabase = createClient();
        await addWrongNote(
          supabase,
          {
            round_id: roundId,
            round_label: roundLabel,
            law: current.law,
            article_no: current.articleNo,
            article_title: current.articleTitle,
            statement: current.statement,
            user_answer: choice,
            correct_answer: correctAnswer,
            correct_text: current.originalText,
          },
          user.id
        );
      } catch {
        // 오답 저장 실패는 학습 흐름을 막지 않도록 무시합니다.
      }
    }
  }

  function nextQuestion() {
    if (index + 1 >= quizzes.length) {
      setStage("done");
      return;
    }
    setIndex((i) => i + 1);
    setAnswer(null);
    setShowExplanation(false);
  }

  function restart() {
    setStage("select");
    setQuizzes([]);
  }

  if (stage === "select") {
    return (
      <div className="max-w-md mx-auto flex flex-col gap-8">
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-2xl font-bold">법령 선택</h1>
          <p className="text-sm text-foreground/60">
            풀고 싶은 법령을 선택하고 문제를 시작하세요.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {LAW_OPTIONS.map((law) => (
            <button
              key={law}
              onClick={() => setSelectedLaw(law)}
              className={`rounded-xl border px-4 py-4 font-medium transition-colors ${
                selectedLaw === law
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              {law}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <button
          onClick={startQuiz}
          disabled={loading}
          className="rounded-full bg-blue-600 text-white font-semibold py-3 hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {loading ? "문제 준비 중..." : "시작하기"}
        </button>
      </div>
    );
  }

  if (stage === "done") {
    return (
      <div className="max-w-md mx-auto flex flex-col items-center gap-6 text-center py-10">
        <h1 className="text-2xl font-bold">회차 완료!</h1>
        <p className="text-foreground/70">
          {quizzes.length}문제 중{" "}
          <span className="font-bold text-blue-600">{score}</span>문제를
          맞혔습니다.
        </p>
        <div className="flex gap-3">
          <button
            onClick={restart}
            className="rounded-full border border-black/10 dark:border-white/10 px-6 py-2.5 font-medium hover:bg-black/5 dark:hover:bg-white/10"
          >
            다시 풀기
          </button>
          <Link
            href="/wrong-notes"
            className="rounded-full bg-blue-600 text-white px-6 py-2.5 font-medium hover:bg-blue-700"
          >
            오답노트 보기
          </Link>
        </div>
      </div>
    );
  }

  if (!current) return null;

  const correctAnswer: "O" | "X" = current.isTrue ? "O" : "X";
  const isCorrect = answer === correctAnswer;

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between text-sm text-foreground/60">
        <span>
          {index + 1} / {quizzes.length}
        </span>
        <span>맞은 개수 {score}</span>
      </div>

      {dataSource === "seed" && (
        <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/40 rounded-md px-3 py-2">
          국가법령정보센터 API 키(LAW_API_OC)가 설정되지 않아 샘플 조문
          데이터로 출제 중입니다.
        </p>
      )}

      {!user && (
        <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/40 rounded-md px-3 py-2">
          로그인하지 않으면 틀린 문제가 오답노트에 저장되지 않습니다.
        </p>
      )}

      <div className="rounded-2xl border border-black/10 dark:border-white/10 p-6 flex flex-col gap-4 shadow-sm">
        <span className="text-xs font-semibold text-blue-600">
          {current.law} {current.articleNo}
          {current.articleTitle ? ` (${current.articleTitle})` : ""}
        </span>
        <p className="text-lg leading-relaxed font-medium">
          {current.statement}
        </p>

        {!answer && (
          <div className="grid grid-cols-2 gap-4 mt-2">
            <button
              onClick={() => submitAnswer("O")}
              className="rounded-xl border-2 border-blue-600 text-blue-600 text-2xl font-bold py-6 hover:bg-blue-600 hover:text-white transition-colors"
            >
              O
            </button>
            <button
              onClick={() => submitAnswer("X")}
              className="rounded-xl border-2 border-red-500 text-red-500 text-2xl font-bold py-6 hover:bg-red-500 hover:text-white transition-colors"
            >
              X
            </button>
          </div>
        )}

        {answer && (
          <div
            className={`rounded-xl px-4 py-3 font-semibold ${
              isCorrect
                ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
            }`}
          >
            {isCorrect ? "정답입니다!" : "오답입니다."} (정답: {correctAnswer})
          </div>
        )}

        {showExplanation && (
          <details open className="text-sm">
            <summary className="cursor-pointer font-medium text-foreground/70">
              원본 조문 해설
            </summary>
            <p className="mt-2 leading-relaxed text-foreground/80 bg-black/[.03] dark:bg-white/[.06] rounded-lg p-3">
              {current.law} {current.articleNo}: {current.originalText}
            </p>
          </details>
        )}
      </div>

      {answer && (
        <button
          onClick={nextQuestion}
          className="rounded-full bg-blue-600 text-white font-semibold py-3 hover:bg-blue-700 transition-colors"
        >
          {index + 1 >= quizzes.length ? "결과 보기" : "다음 문제"}
        </button>
      )}
    </div>
  );
}
