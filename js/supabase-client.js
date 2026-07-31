// Supabase 프로젝트 연결
// anon(publishable) key는 RLS 정책으로 접근 범위가 제한되므로 클라이언트에 노출해도 안전하다.
const SUPABASE_URL = "https://sdhqyufmlxmlfkhuawee.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jwAlGmCycUReBkCrPycCUQ_BXMpbVca";

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
