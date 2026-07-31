"use client";

import { useMemo, useState } from "react";
import { deleteWrongNote } from "@/lib/supabase/wrongNotes";
import { createClient } from "@/lib/supabase/client";
import type { WrongNote } from "@/lib/supabase/types";

export default function WrongNotesClient({
  initialNotes,
}: {
  initialNotes: WrongNote[];
}) {
  const [notes, setNotes] = useState<WrongNote[]>(initialNotes);
  const [error, setError] = useState<string | null>(null);

  async function handleComplete(note: WrongNote) {
    const confirmed = window.confirm(
      "이해 완료 처리하면 오답노트에서 삭제됩니다. 삭제하시겠습니까?"
    );
    if (!confirmed) return;

    const prevNotes = notes;
    setNotes((prev) => prev.filter((n) => n.id !== note.id));
    setError(null);
    try {
      const supabase = createClient();
      await deleteWrongNote(supabase, note.id);
    } catch {
      setError("삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
      setNotes(prevNotes);
    }
  }

  const rounds = useMemo(() => {
    const groups = new Map<string, { label: string; notes: WrongNote[] }>();
    for (const note of notes) {
      const key = note.round_id;
      if (!groups.has(key)) {
        groups.set(key, { label: note.round_label, notes: [] });
      }
      groups.get(key)!.notes.push(note);
    }
    return Array.from(groups.entries()).map(([roundId, value]) => ({
      roundId,
      ...value,
    }));
  }, [notes]);

  return (
    <div className="flex flex-col gap-8">
      {error && <p className="text-sm text-red-600">{error}</p>}

      {rounds.length === 0 && (
        <p className="text-sm text-foreground/60">
          아직 오답이 없습니다. 문제를 풀고 틀린 문제가 생기면 여기에
          쌓입니다.
        </p>
      )}

      {rounds.map((round) => (
        <section key={round.roundId} className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-blue-600">
            {round.label} ({round.notes.length}문제)
          </h2>
          <ul className="flex flex-col gap-3">
            {round.notes.map((note) => (
              <li
                key={note.id}
                className="rounded-xl border border-black/10 dark:border-white/10 p-4 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-foreground/50">
                      {note.law} {note.article_no}
                      {note.article_title ? ` (${note.article_title})` : ""}
                    </span>
                    <p className="text-sm leading-relaxed">
                      {note.statement}
                    </p>
                  </div>
                  <label className="flex items-center gap-1.5 text-xs shrink-0 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      onChange={() => handleComplete(note)}
                      className="size-4 accent-blue-600"
                    />
                    이해 완료
                  </label>
                </div>
                <div className="text-xs flex gap-3 text-foreground/60">
                  <span>내 답: {note.user_answer}</span>
                  <span>정답: {note.correct_answer}</span>
                </div>
                <p className="text-xs text-foreground/70 bg-black/[.03] dark:bg-white/[.06] rounded-lg p-2">
                  원본 조문: {note.correct_text}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
