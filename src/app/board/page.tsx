import Link from "next/link";
import { listPosts } from "@/lib/supabase/posts";

export const dynamic = "force-dynamic";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default async function BoardPage() {
  const posts = await listPosts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">자유게시판</h1>
        <Link
          href="/board/write"
          className="rounded-full bg-blue-600 text-white text-sm font-semibold px-5 py-2 hover:bg-blue-700"
        >
          글쓰기
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-foreground/60">
          아직 작성된 글이 없습니다. 첫 글을 작성해보세요.
        </p>
      ) : (
        <div className="rounded-xl border border-black/10 dark:border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-black/[.03] dark:bg-white/[.06] text-foreground/60">
              <tr>
                <th className="text-left font-medium px-4 py-2.5">제목</th>
                <th className="text-left font-medium px-4 py-2.5 w-40">
                  작성일시
                </th>
                <th className="text-right font-medium px-4 py-2.5 w-20">
                  조회수
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-t border-black/5 dark:border-white/10"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/board/${post.id}`}
                      className="hover:text-blue-600 hover:underline"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-foreground/60">
                    {formatDate(post.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground/60">
                    {post.views}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
