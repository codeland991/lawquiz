// 모든 페이지 공통: 현재 페이지에 맞는 네비게이션 링크 강조
(function () {
  const page = document.body.dataset.page;
  document.querySelectorAll(".nav-links a").forEach((link) => {
    if (link.dataset.page === page) {
      link.classList.add("active");
    }
  });
})();
