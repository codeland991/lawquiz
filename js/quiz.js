(function () {
  const lawSelect = document.getElementById("law-select");
  const progressLine = document.getElementById("progress-line");
  const quizMeta = document.getElementById("quiz-meta");
  const quizStatement = document.getElementById("quiz-statement");
  const btnO = document.getElementById("btn-o");
  const btnX = document.getElementById("btn-x");
  const resultArea = document.getElementById("result-area");
  const btnNext = document.getElementById("btn-next");
  const btnWrongList = document.getElementById("btn-wrong-list");

  let pool = [];
  let queue = [];
  let queueIndex = 0;
  let current = null; // { article, statementText, isStatementTrue }
  let answered = false;
  let questionCount = 0;

  LAW_NAMES.forEach((name) => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    lawSelect.appendChild(opt);
  });

  function rebuildQueue() {
    pool = getArticlePool(lawSelect.value);
    queue = shuffleArray(pool);
    queueIndex = 0;
  }

  function nextArticle() {
    if (queueIndex >= queue.length) {
      queue = shuffleArray(pool);
      queueIndex = 0;
    }
    return queue[queueIndex++];
  }

  function loadNextQuestion() {
    answered = false;
    resultArea.innerHTML = "";
    btnNext.disabled = true;
    btnO.disabled = false;
    btnX.disabled = false;
    btnO.classList.remove("selected");
    btnX.classList.remove("selected");

    const article = nextArticle();
    const isStatementTrue = Math.random() < 0.5;
    current = {
      article,
      statementText: isStatementTrue ? article.correctText : article.wrongText,
      isStatementTrue,
    };
    questionCount += 1;

    quizMeta.textContent = `${article.law} ${article.no} (${article.title})`;
    quizStatement.textContent = current.statementText;
    progressLine.textContent = `${questionCount}번째 문제 · 문제은행 ${pool.length}개 중 무작위 출제`;
  }

  function handleAnswer(selected) {
    if (answered || !current) return;
    answered = true;
    btnO.disabled = true;
    btnX.disabled = true;

    const correctAnswer = current.isStatementTrue ? "O" : "X";
    const isCorrect = selected === correctAnswer;

    (selected === "O" ? btnO : btnX).classList.add("selected");

    const banner = document.createElement("div");
    banner.className = `result-banner ${isCorrect ? "correct" : "wrong"}`;
    banner.textContent = isCorrect
      ? "정답입니다! 👍"
      : `오답입니다. 정답은 ${correctAnswer} 입니다.`;
    resultArea.appendChild(banner);

    const accordion = document.createElement("div");
    accordion.className = "explain-accordion";
    accordion.innerHTML = `
      <div class="explain-head">해설 (원본 조문) <span>▾</span></div>
      <div class="explain-body">
        <div>${current.article.law} ${current.article.no} (${current.article.title})</div>
        <div class="law-original">${current.article.correctText}</div>
      </div>
    `;
    resultArea.appendChild(accordion);
    accordion.querySelector(".explain-head").addEventListener("click", () => {
      const body = accordion.querySelector(".explain-body");
      body.style.display = body.style.display === "none" ? "block" : "none";
    });

    if (!isCorrect) {
      const round = getCurrentRound();
      addWrongNote({
        roundId: round.id,
        roundLabel: round.label,
        law: current.article.law,
        articleNo: current.article.no,
        articleTitle: current.article.title,
        statement: current.statementText,
        userAnswer: selected,
        correctAnswer,
        correctText: current.article.correctText,
      });
    }

    btnNext.disabled = false;
  }

  btnO.addEventListener("click", () => handleAnswer("O"));
  btnX.addEventListener("click", () => handleAnswer("X"));
  btnNext.addEventListener("click", loadNextQuestion);
  btnWrongList.addEventListener("click", () => {
    window.location.href = "wrong-notes.html";
  });
  lawSelect.addEventListener("change", () => {
    questionCount = 0;
    rebuildQueue();
    loadNextQuestion();
  });

  rebuildQueue();
  loadNextQuestion();
})();
