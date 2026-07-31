import { AVAILABLE_LAWS, SEED_ARTICLES, type LawArticle } from "./lawData/seed";

const LAW_SEARCH_URL = "https://www.law.go.kr/DRF/lawSearch.do";
const LAW_SERVICE_URL = "https://www.law.go.kr/DRF/lawService.do";

function extractTag(xml: string, tag: string): string[] {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "g");
  const matches: string[] = [];
  let m;
  while ((m = re.exec(xml)) !== null) {
    matches.push(m[1].trim());
  }
  return matches;
}

async function fetchLawMst(lawName: string, oc: string): Promise<string | null> {
  const url = `${LAW_SEARCH_URL}?OC=${encodeURIComponent(oc)}&target=law&type=XML&query=${encodeURIComponent(lawName)}&display=1`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const xml = await res.text();
  const mst = extractTag(xml, "법령일련번호")[0];
  return mst ?? null;
}

async function fetchLawArticlesLive(
  lawName: string,
  oc: string
): Promise<LawArticle[]> {
  const mst = await fetchLawMst(lawName, oc);
  if (!mst) throw new Error(`법령 검색 결과 없음: ${lawName}`);

  const url = `${LAW_SERVICE_URL}?OC=${encodeURIComponent(oc)}&target=law&MST=${mst}&type=XML`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`법령 본문 조회 실패: ${lawName}`);
  const xml = await res.text();

  const units = xml.split("<조문단위>").slice(1);
  const articles: LawArticle[] = [];

  for (const unit of units) {
    const [articleNo] = extractTag(unit, "조문번호");
    const [title] = extractTag(unit, "조문제목");
    const [text] = extractTag(unit, "조문내용");
    if (!articleNo || !text) continue;
    articles.push({
      law: lawName,
      articleNo: `제${articleNo}조`,
      title: title ?? "",
      text: text.replace(/^제\d+조(\([^)]*\))?\s*/, "").trim(),
    });
  }

  if (articles.length === 0) {
    throw new Error(`조문 파싱 결과 없음: ${lawName}`);
  }

  return articles;
}

export async function getLawArticles(lawName?: string): Promise<{
  articles: LawArticle[];
  source: "live" | "seed";
}> {
  const oc = process.env.LAW_API_OC;
  const target = lawName ?? "all";

  if (oc) {
    try {
      const laws = lawName ? [lawName] : [...AVAILABLE_LAWS];
      const results = await Promise.all(
        laws.map((law) => fetchLawArticlesLive(law, oc))
      );
      const articles = results.flat();
      if (articles.length > 0) {
        return { articles, source: "live" };
      }
    } catch {
      // 국가법령정보센터 Open API 호출 실패 시 샘플 데이터로 대체합니다.
    }
  }

  const articles =
    !lawName || target === "all"
      ? SEED_ARTICLES
      : SEED_ARTICLES.filter((a) => a.law === lawName);

  return { articles, source: "seed" };
}
