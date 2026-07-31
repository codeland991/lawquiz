"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/supabase/posts";

export default function BoardWritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const post = await createPost(title.trim(), content.trim());
      router.push(`/board/${post.id}`);
    } catch {
      setError("글 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold">글쓰기</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="rounded-lg border border-black/10 dark:border-white/10 px-4 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          rows={12}
          className="rounded-lg border border-black/10 dark:border-white/10 px-4 py-3 bg-transparent resize-y focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/board")}
            className="rounded-full border border-black/10 dark:border-white/10 px-6 py-2.5 font-medium hover:bg-black/5 dark:hover:bg-white/10"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-blue-600 text-white px-6 py-2.5 font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "등록 중..." : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
}
