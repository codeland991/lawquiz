import { supabase } from "./client";
import type { WrongNote } from "./types";

export async function listWrongNotes(): Promise<WrongNote[]> {
  const { data, error } = await supabase
    .from("wrong_notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function addWrongNote(
  note: Omit<WrongNote, "id" | "created_at">
): Promise<void> {
  const { error } = await supabase.from("wrong_notes").insert(note);
  if (error) throw error;
}

export async function deleteWrongNote(id: string): Promise<void> {
  const { error } = await supabase.from("wrong_notes").delete().eq("id", id);
  if (error) throw error;
}
