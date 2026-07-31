import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, incrementPostViews } from "@/lib/supabase/posts";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default async function BoardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const post = await getPost(supabase, id);

  if (!post) notFound();

  incrementPostViews(supabase, id).catch(() => {});

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = !!user && user.id === post.user_id;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col gap-2 border-b border-black/10 dark:border-white/10 pb-4">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <div className="flex gap-3 text-xs text-foreground/60">
          <span>{formatDate(post.created_at)}</span>
          <span>조회수 {post.views}</span>
        </div>
      </div>

      <p className="leading-relaxed whitespace-pre-wrap">{post.content}</p>

      <div className="flex gap-3">
        <Link
          href="/board"
          className="rounded-full border border-black/10 dark:border-white/10 px-6 py-2.5 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 inline-block"
        >
          목록으로
        </Link>
        {isOwner && (
          <Link
            href={`/board/${post.id}/edit`}
            className="rounded-full bg-blue-600 text-white px-6 py-2.5 text-sm font-medium hover:bg-blue-700 inline-block"
          >
            수정
          </Link>
        )}
      </div>
    </div>
  );
}
