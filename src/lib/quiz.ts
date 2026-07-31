import type { LawArticle } from "./lawData/seed";

export type Quiz = {
  law: string;
  articleNo: string;
  articleTitle: string;
  statement: string;
  isTrue: boolean;
  originalText: string;
};

const NUMBER_ALTS: Record<string, string> = {
  "19세": "20세",
  "14세": "16세",
  "10년": "5년",
  "20년": "10년",
  "40시간": "44시간",
  "8시간": "10시간",
  "4시간": "6시간",
  "30분": "1시간",
  "1시간": "30분",
  "1주": "2주",
  "15일": "10일",
  "80퍼센트": "60퍼센트",
  "5년": "3년",
  "30년": "20년",
  "1개월": "3개월",
  "5분": "10분",
  "9가지": "7가지",
};

const PHRASE_PAIRS: [string, string][] = [
  ["하여야 한다", "하지 아니하여도 된다"],
  ["할 수 없다", "할 수 있다"],
  ["벌하지 아니한다", "벌한다"],
  ["취소할 수 있다", "취소할 수 없다"],
  ["보장하여야 한다", "보장하지 아니하여도 된다"],
  ["초과할 수 없다", "초과할 수 있다"],
  ["주어야 한다", "주지 아니하여도 된다"],
  ["처한다", "처하지 아니한다"],
];

function mutateByNumber(text: string): string | null {
  for (const [from, to] of Object.entries(NUMBER_ALTS)) {
    if (text.includes(from)) {
      return text.replace(from, to);
    }
  }
  return null;
}

function mutateByPhrase(text: string): string | null {
  for (const [a, b] of PHRASE_PAIRS) {
    if (text.includes(a)) return text.replace(a, b);
    if (text.includes(b)) return text.replace(b, a);
  }
  return null;
}

function mutateByArticleSwap(article: LawArticle, pool: LawArticle[]): string {
  const others = pool.filter(
    (a) => a.law === article.law && a.articleNo !== article.articleNo
  );
  if (others.length === 0) {
    return `${article.text} (제○조가 아닌 다른 조문의 내용입니다)`;
  }
  const other = others[Math.floor(Math.random() * others.length)];
  return other.text;
}

function buildFalseStatement(article: LawArticle, pool: LawArticle[]): string {
  return (
    mutateByNumber(article.text) ??
    mutateByPhrase(article.text) ??
    mutateByArticleSwap(article, pool)
  );
}

export function generateQuiz(pool: LawArticle[]): Quiz | null {
  if (pool.length === 0) return null;
  const article = pool[Math.floor(Math.random() * pool.length)];
  const isTrue = Math.random() < 0.5;
  const statement = isTrue ? article.text : buildFalseStatement(article, pool);

  return {
    law: article.law,
    articleNo: article.articleNo,
    articleTitle: article.title,
    statement,
    isTrue,
    originalText: article.text,
  };
}

export function generateQuizSet(pool: LawArticle[], count: number): Quiz[] {
  const quizzes: Quiz[] = [];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  for (let i = 0; i < count; i++) {
    const article = shuffled[i % shuffled.length];
    const isTrue = Math.random() < 0.5;
    const statement = isTrue
      ? article.text
      : buildFalseStatement(article, pool);
    quizzes.push({
      law: article.law,
      articleNo: article.articleNo,
      articleTitle: article.title,
      statement,
      isTrue,
      originalText: article.text,
    });
  }
  return quizzes;
}
