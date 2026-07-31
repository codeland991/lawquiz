// 오답노트 Supabase 연동 공용 유틸 (quiz.js, wrong-notes.js 에서 공통 사용)

const ROUND_ID_KEY = "lawquiz_round_id";
const ROUND_LABEL_KEY = "lawquiz_round_label";

async function getWrongNotes() {
  const { data, error } = await sb
    .from("wrong_notes")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) {
    console.error(error);
    return [];
  }
  return data.map((row) => ({
    id: row.id,
    roundId: row.round_id,
    roundLabel: row.round_label,
    law: row.law,
    articleNo: row.article_no,
    articleTitle: row.article_title,
    statement: row.statement,
    userAnswer: row.user_answer,
    correctAnswer: row.correct_answer,
    correctText: row.correct_text,
  }));
}

async function addWrongNote(item) {
  const { error } = await sb.from("wrong_notes").insert({
    round_id: item.roundId,
    round_label: item.roundLabel,
    law: item.law,
    article_no: item.articleNo,
    article_title: item.articleTitle,
    statement: item.statement,
    user_answer: item.userAnswer,
    correct_answer: item.correctAnswer,
    correct_text: item.correctText,
  });
  if (error) console.error(error);
}

async function removeWrongNote(id) {
  const { error } = await sb.from("wrong_notes").delete().eq("id", id);
  if (error) console.error(error);
}

// 현재 학습 회차(round)를 가져오거나, 없으면 새로 시작한다.
// sessionStorage 기반이라 브라우저 탭을 새로 열거나 종료 후 다시 열면 새 회차로 취급된다.
function getCurrentRound() {
  let id = sessionStorage.getItem(ROUND_ID_KEY);
  let label = sessionStorage.getItem(ROUND_LABEL_KEY);
  if (!id) {
    const now = new Date();
    id = String(now.getTime());
    label = formatRoundLabel(now);
    sessionStorage.setItem(ROUND_ID_KEY, id);
    sessionStorage.setItem(ROUND_LABEL_KEY, label);
  }
  return { id, label };
}

function formatRoundLabel(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())} 회차`;
}
