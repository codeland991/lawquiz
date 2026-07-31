import Link from "next/link";

const FEATURES = [
  {
    title: "실제 법 조문 기반 OX 문제",
    desc: "국가법령정보센터 법령 데이터를 바탕으로 정답/오답 조문을 자동 생성합니다.",
  },
  {
    title: "즉시 채점 및 해설",
    desc: "O/X 제출 즉시 정답 여부와 원본 조문 해설을 확인할 수 있습니다.",
  },
  {
    title: "오답노트로 반복 학습",
    desc: "틀린 문제는 회차별로 오답노트에 쌓이고, 이해 완료 시 체크로 정리합니다.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16">
      <section className="text-center flex flex-col items-center gap-6 py-10">
        <span className="text-sm font-semibold text-blue-600">LawQuiz</span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl">
          법 조문 암기, OX 퀴즈로 빠르고 정확하게
        </h1>
        <p className="text-foreground/70 max-w-xl leading-relaxed">
          국가공인 자격증 수험생을 위해 현행 법령 조문을 기반으로 한 OX 암기
          문제를 자동으로 생성·출제합니다. 반복 학습과 오답노트로 조문 암기
          효율을 극대화하세요.
        </p>
        <Link
          href="/quiz"
          className="mt-2 inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          문제 풀러 가기
        </Link>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-black/10 dark:border-white/10 p-5 flex flex-col gap-2"
          >
            <h2 className="font-semibold">{f.title}</h2>
            <p className="text-sm text-foreground/70 leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
