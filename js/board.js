(function () {
  const POSTS_KEY = "lawquiz_board_posts";

  const titleInput = document.getElementById("post-title");
  const contentInput = document.getElementById("post-content");
  const submitBtn = document.getElementById("btn-submit");
  const listEl = document.getElementById("post-list");

  function getPosts() {
    try {
      return JSON.parse(localStorage.getItem(POSTS_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function savePosts(posts) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }

  function formatDate(ts) {
    const d = new Date(ts);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  }

  function render() {
    const posts = getPosts().sort((a, b) => b.createdAt - a.createdAt);

    if (posts.length === 0) {
      listEl.innerHTML = `<div class="empty-state">등록된 게시글이 없습니다. 첫 글을 작성해보세요!</div>`;
      return;
    }

    listEl.innerHTML = "";
    posts.forEach((post) => {
      const row = document.createElement("div");
      row.className = "post-row";
      row.innerHTML = `
        <div class="post-row-head">
          <span class="col-title">${escapeHtml(post.title)}</span>
          <span class="col-date">${formatDate(post.createdAt)}</span>
          <span class="col-views">${post.views}</span>
        </div>
        <div class="post-row-body">${escapeHtml(post.content)}</div>
      `;
      row.querySelector(".post-row-head").addEventListener("click", () => {
        const isOpen = row.classList.contains("open");
        if (!isOpen) {
          post.views += 1;
          savePosts(getPosts().map((p) => (p.id === post.id ? post : p)));
          row.querySelector(".col-views").textContent = post.views;
        }
        row.classList.toggle("open");
      });
      listEl.appendChild(row);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  submitBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    if (!title || !content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    const posts = getPosts();
    posts.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title,
      content,
      createdAt: Date.now(),
      views: 0,
    });
    savePosts(posts);
    titleInput.value = "";
    contentInput.value = "";
    render();
  });

  render();
})();
