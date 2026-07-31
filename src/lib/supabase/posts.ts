import type { SupabaseClient } from "@supabase/supabase-js";
import type { Post } from "./types";

export async function listPosts(client: SupabaseClient): Promise<Post[]> {
  const { data, error } = await client
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getPost(
  client: SupabaseClient,
  id: string
): Promise<Post | null> {
  const { data, error } = await client
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function incrementPostViews(client: SupabaseClient, id: string) {
  const { error } = await client.rpc("increment_post_views", {
    post_id: id,
  });

  if (error) throw error;
}

export async function createPost(
  client: SupabaseClient,
  title: string,
  content: string,
  userId: string
): Promise<Post> {
  const { data, error } = await client
    .from("posts")
    .insert({ title, content, user_id: userId })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function updatePost(
  client: SupabaseClient,
  id: string,
  title: string,
  content: string
): Promise<void> {
  const { error } = await client
    .from("posts")
    .update({ title, content })
    .eq("id", id);

  if (error) throw error;
}
