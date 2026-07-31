import { listWrongNotes } from "@/lib/supabase/wrongNotes";
import { createClient } from "@/lib/supabase/server";
import WrongNotesClient from "@/components/WrongNotesClient";
import LoginRequired from "@/components/LoginRequired";

export const dynamic = "force-dynamic";

export default async function WrongNotesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">오답노트</h1>
        <p className="text-sm text-foreground/60 mt-1">
          회차별로 틀린 문제를 모아봅니다. 이해가 끝난 문제는 체크해서
          정리하세요.
        </p>
      </div>

      {user ? (
        <WrongNotesClient initialNotes={await listWrongNotes(supabase)} />
      ) : (
        <LoginRequired message="오답노트는 로그인 후 나만의 기록으로 관리됩니다." />
      )}
    </div>
  );
}
