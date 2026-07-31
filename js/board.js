(function () {
  const titleInput = document.getElementById("post-title");
  const contentInput = document.getElementById("post-content");
  const submitBtn = document.getElementById("btn-submit");
  const listEl = document.getElementById("post-list");

  async function getPosts() {
    const { data, error } = await sb
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      return [];
    }
    return data;
  }

  function formatDate(ts) {
    const d = new Date(ts);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  }

  async function render() {
    const posts = await getPosts();

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
          <span class="col-date">${formatDate(post.created_at)}</span>
          <span class="col-views">${post.views}</span>
        </div>
        <div class="post-row-body">${escapeHtml(post.content)}</div>
      `;
      row.querySelector(".post-row-head").addEventListener("click", async () => {
        const isOpen = row.classList.contains("open");
        if (!isOpen) {
          post.views += 1;
          row.querySelector(".col-views").textContent = post.views;
          const { error } = await sb
            .from("posts")
            .update({ views: post.views })
            .eq("id", post.id);
          if (error) console.error(error);
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

  submitBtn.addEventListener("click", async () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    if (!title || !content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    const { error } = await sb.from("posts").insert({ title, content });
    if (error) {
      console.error(error);
      alert("게시글 등록에 실패했습니다.");
      return;
    }
    titleInput.value = "";
    contentInput.value = "";
    render();
  });

  render();
})();
