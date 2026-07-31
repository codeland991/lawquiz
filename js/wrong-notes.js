(function () {
  const container = document.getElementById("rounds-container");

  function groupByRound(notes) {
    const map = new Map();
    notes.forEach((note) => {
      if (!map.has(note.roundId)) {
        map.set(note.roundId, {
          roundId: note.roundId,
          roundLabel: note.roundLabel,
          items: [],
        });
      }
      map.get(note.roundId).items.push(note);
    });
    // 최근 회차가 위로 오도록 정렬
    return Array.from(map.values()).sort((a, b) => b.roundId - a.roundId);
  }

  async function render() {
    const notes = await getWrongNotes();

    if (notes.length === 0) {
      container.innerHTML = `<div class="card empty-state">아직 저장된 오답이 없습니다.<br />문제를 풀고 틀리면 이곳에 자동으로 쌓입니다.</div>`;
      return;
    }

    const rounds = groupByRound(notes);
    container.innerHTML = "";

    rounds.forEach((round) => {
      const card = document.createElement("div");
      card.className = "card round-card";

      const header = document.createElement("div");
      header.className = "round-header";
      header.innerHTML = `<h3>${round.roundLabel}</h3><span class="round-count">${round.items.length}문제</span>`;
      card.appendChild(header);

      round.items.forEach((item) => {
        const row = document.createElement("div");
        row.className = "wrong-item";
        row.innerHTML = `
          <input type="checkbox" data-id="${item.id}" />
          <div class="wrong-item-body">
            <div class="wrong-item-meta">${item.law} ${item.articleNo} (${item.articleTitle})</div>
            <div class="wrong-item-statement">${item.statement}</div>
            <div class="wrong-item-answer">내가 고른 답: ${item.userAnswer} · 정답: ${item.correctAnswer}</div>
            <div class="wrong-item-correct">원본 조문: ${item.correctText}</div>
          </div>
          <span class="check-label">이해<br/>완료</span>
        `;
        card.appendChild(row);
      });

      container.appendChild(card);
    });

    container.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener("change", async () => {
        if (cb.checked) {
          await removeWrongNote(cb.dataset.id);
          render();
        }
      });
    });
  }

  render();
})();
