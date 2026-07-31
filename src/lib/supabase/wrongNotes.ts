import type { SupabaseClient } from "@supabase/supabase-js";
import type { WrongNote } from "./types";

export async function listWrongNotes(
  client: SupabaseClient
): Promise<WrongNote[]> {
  const { data, error } = await client
    .from("wrong_notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function addWrongNote(
  client: SupabaseClient,
  note: Omit<WrongNote, "id" | "created_at" | "user_id">,
  userId: string
): Promise<void> {
  const { error } = await client
    .from("wrong_notes")
    .insert({ ...note, user_id: userId });
  if (error) throw error;
}

export async function deleteWrongNote(
  client: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await client.from("wrong_notes").delete().eq("id", id);
  if (error) throw error;
}
