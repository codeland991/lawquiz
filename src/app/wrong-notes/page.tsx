import { listWrongNotes } from "@/lib/supabase/wrongNotes";
import WrongNotesClient from "@/components/WrongNotesClient";

export const dynamic = "force-dynamic";

export default async function WrongNotesPage() {
  const notes = await listWrongNotes();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">오답노트</h1>
        <p className="text-sm text-foreground/60 mt-1">
          회차별로 틀린 문제를 모아봅니다. 이해가 끝난 문제는 체크해서
          정리하세요.
        </p>
      </div>

      <WrongNotesClient initialNotes={notes} />
    </div>
  );
}
