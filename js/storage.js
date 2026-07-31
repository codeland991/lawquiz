// 오답노트 localStorage 공용 유틸 (quiz.js, wrong-notes.js 에서 공통 사용)

const WRONG_NOTES_KEY = "lawquiz_wrong_notes";
const ROUND_ID_KEY = "lawquiz_round_id";
const ROUND_LABEL_KEY = "lawquiz_round_label";

function getWrongNotes() {
  try {
    return JSON.parse(localStorage.getItem(WRONG_NOTES_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveWrongNotes(list) {
  localStorage.setItem(WRONG_NOTES_KEY, JSON.stringify(list));
}

function addWrongNote(item) {
  const list = getWrongNotes();
  list.push(item);
  saveWrongNotes(list);
}

function removeWrongNote(id) {
  const list = getWrongNotes().filter((item) => item.id !== id);
  saveWrongNotes(list);
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

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
