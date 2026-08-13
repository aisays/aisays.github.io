/* 카드 렌더링 & 모달 — 보통은 수정할 필요 없는 파일입니다 */

// 블로그 카드
const blogGrid = document.getElementById("blog-grid");

POSTS.forEach((post, i) => {
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <div class="card-emoji">${post.emoji}</div>
    <h3>${post.title}</h3>
    <p class="card-date">📅 ${post.date}</p>
    <p class="card-desc">${post.desc}</p>
    <div class="card-tags">${post.tags.map(t => `<span class="tag">#${t}</span>`).join("")}</div>
  `;
  card.addEventListener("click", () => openPost(i));
  blogGrid.appendChild(card);
});

// 프로젝트 카드
const projectGrid = document.getElementById("project-grid");

PROJECTS.forEach(p => {
  const statusLabel = p.status === "done"
    ? `<span class="status status-done">✅ 완성</span>`
    : `<span class="status status-wip">🔧 진행 중</span>`;

  const links = [
    p.link ? `<a href="${p.link}" target="_blank" rel="noopener">🔗 보러가기</a>` : "",
    p.repo ? `<a href="${p.repo}" target="_blank" rel="noopener">📁 코드</a>` : ""
  ].join("");

  const card = document.createElement("article");
  card.className = "card project";
  card.innerHTML = `
    <div class="card-emoji">${p.emoji}</div>
    <h3>${p.title} ${statusLabel}</h3>
    <p class="card-desc">${p.desc}</p>
    <div class="card-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
    ${links ? `<div class="card-links">${links}</div>` : ""}
  `;
  projectGrid.appendChild(card);
});

// 글 읽기 모달
const modal = document.getElementById("post-modal");

function openPost(i) {
  const post = POSTS[i];
  document.getElementById("modal-date").textContent = `📅 ${post.date}`;
  document.getElementById("modal-title").textContent = `${post.emoji} ${post.title}`;
  document.getElementById("modal-body").textContent = post.content;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closePost() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

document.getElementById("modal-close").addEventListener("click", closePost);
modal.addEventListener("click", e => { if (e.target === modal) closePost(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closePost(); });
