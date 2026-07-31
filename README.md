# LawQuiz

국가공인 자격증 수험생을 위한 법 조문 기반 OX 암기 퀴즈 서비스입니다. 자세한 기획 배경은 [PRD.md](./PRD.md)를 참고하세요.

## 주요 기능

- **문제 풀기 (`/quiz`)**: 법령을 선택하면 조문을 바탕으로 OX 문제가 자동 생성됩니다. 제출 즉시 정오답과 원본 조문 해설을 보여줍니다.
- **오답노트 (`/wrong-notes`)**: 틀린 문제가 회차별로 쌓이고, '이해 완료' 체크 시 확인 후 삭제됩니다.
- **자유게시판 (`/board`)**: 글 목록/작성/상세 조회.

## 기술 스택

- Next.js (App Router) / TypeScript / Tailwind CSS
- Supabase (게시판, 오답노트 데이터 저장)
- 국가법령정보센터(law.go.kr) Open API — 인증키(`LAW_API_OC`) 미설정 시 샘플 법령 데이터로 대체 동작

## 시작하기

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

## 환경 변수

`.env.example`을 참고해 `.env.local`을 생성하세요.

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
LAW_API_OC=
```

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 프로젝트의 URL과 anon 키.
- `LAW_API_OC`: [open.law.go.kr](https://open.law.go.kr)에서 발급받는 국가법령정보센터 Open API 인증키. 없으면 `src/lib/lawData/seed.ts`의 샘플 조문 데이터로 동작합니다.

## 배포

Vercel CLI로 배포합니다.

```bash
vercel        # 프리뷰 배포
vercel --prod # 프로덕션 배포
```
