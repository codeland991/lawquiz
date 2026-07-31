"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPost, updatePost } from "@/lib/supabase/posts";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import LoginRequired from "@/components/LoginRequired";
import type { Post } from "@/lib/supabase/types";

export default function BoardEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    getPost(supabase, params.id)
      .then((data) => {
        setPost(data);
        if (data) {
          setTitle(data.title);
          setContent(data.content);
        }
      })
      .finally(() => setLoadingPost(false));
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const supabase = createClient();
      await updatePost(supabase, params.id, title.trim(), content.trim());
      router.push(`/board/${params.id}`);
    } catch {
      setError("글 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
      setSubmitting(false);
    }
  }

  if (authLoading || loadingPost) return null;

  if (!user) {
    return (
      <LoginRequired message="글을 수정하려면 카카오 로그인이 필요합니다." />
    );
  }

  if (!post) {
    return (
      <p className="text-center text-sm text-foreground/60 py-16">
        존재하지 않는 글입니다.
      </p>
    );
  }

  if (post.user_id !== user.id) {
    return (
      <p className="text-center text-sm text-foreground/60 py-16">
        본인이 작성한 글만 수정할 수 있습니다.
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold">글 수정</h1>

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
            onClick={() => router.push(`/board/${params.id}`)}
            className="rounded-full border border-black/10 dark:border-white/10 px-6 py-2.5 font-medium hover:bg-black/5 dark:hover:bg-white/10"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-blue-600 text-white px-6 py-2.5 font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
