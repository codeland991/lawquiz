import { supabase } from "./client";
import type { Post } from "./types";

export async function listPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getPost(id: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function incrementPostViews(id: string, currentViews: number) {
  const { error } = await supabase
    .from("posts")
    .update({ views: currentViews + 1 })
    .eq("id", id);

  if (error) throw error;
}

export async function createPost(title: string, content: string): Promise<Post> {
  const { data, error } = await supabase
    .from("posts")
    .insert({ title, content })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
