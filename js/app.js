/* 🍩 도넛픽 — GitHub 저장소를 이미지 호스팅으로 쓰는 앱 */

const OWNER = "aisays";
const REPO = "aisays.github.io";
const DIR = "img";
const API = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${DIR}`;
const PAGES_BASE = `https://${OWNER}.github.io/${DIR}/`;
const MAX_EDGE = 1600; // 자동 리사이즈 기준 (긴 변)
const IMG_EXT = /\.(jpe?g|png|gif|webp|avif|svg)$/i;

let token = localStorage.getItem("dp_token") || "";
let images = []; // { name, sha, rawUrl }
let current = null;

const $ = id => document.getElementById(id);

// ===== 공통 =====
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.hidden = true; }, 2500);
}

function headers() {
  const h = { Accept: "application/vnd.github+json" };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

// ===== 갤러리 =====
async function loadGallery() {
  const grid = $("gallery");
  try {
    const res = await fetch(API, { headers: headers() });
    if (res.status === 404) { images = []; }
    else if (!res.ok) throw new Error(`API ${res.status}`);
    else {
      const list = await res.json();
      images = list
        .filter(f => f.type === "file" && IMG_EXT.test(f.name))
        .map(f => ({ name: f.name, sha: f.sha, rawUrl: f.download_url }))
        .sort((a, b) => b.name.localeCompare(a.name)); // 파일명 앞에 시각이 붙어서 최신순
    }
  } catch (e) {
    $("gallery-count").textContent = "목록을 불러오지 못했어요 😢 잠시 후 새로고침 해주세요.";
    return;
  }
  grid.innerHTML = "";
  images.forEach(img => {
    const cell = document.createElement("button");
    cell.className = "gallery-cell";
    cell.innerHTML = `<img src="${img.rawUrl}" alt="${img.name}" loading="lazy">`;
    cell.addEventListener("click", () => openLightbox(img));
    grid.appendChild(cell);
  });
  $("gallery-count").textContent = images.length
    ? `지금까지 ${images.length}장의 사진이 있어요 📸`
    : "";
  $("gallery-empty").hidden = images.length > 0;
}

// ===== 크게 보기 =====
function openLightbox(img) {
  current = img;
  $("lightbox-img").src = img.rawUrl;
  $("lightbox-name").textContent = img.name;
  $("delete-img").hidden = !token;
  $("lightbox").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  $("lightbox").hidden = true;
  document.body.style.overflow = "";
}

$("lightbox-close").addEventListener("click", closeLightbox);
$("lightbox").addEventListener("click", e => { if (e.target === $("lightbox")) closeLightbox(); });

async function copyText(text, msg) {
  try {
    await navigator.clipboard.writeText(text);
    toast(msg);
  } catch {
    prompt("아래 주소를 복사하세요:", text);
  }
}

$("copy-url").addEventListener("click", () =>
  copyText(PAGES_BASE + encodeURIComponent(current.name), "이미지 주소를 복사했어요! 🔗"));

$("copy-md").addEventListener("click", () =>
  copyText(`![${current.name}](${PAGES_BASE + encodeURIComponent(current.name)})`, "마크다운을 복사했어요! 📝"));

$("delete-img").addEventListener("click", async () => {
  if (!confirm(`"${current.name}" 사진을 정말 삭제할까요?`)) return;
  const res = await fetch(`${API}/${encodeURIComponent(current.name)}`, {
    method: "DELETE",
    headers: headers(),
    body: JSON.stringify({ message: `사진 삭제: ${current.name}`, sha: current.sha })
  });
  if (res.ok) {
    toast("삭제했어요 🗑️");
    closeLightbox();
    loadGallery();
  } else {
    toast("삭제 실패 😢 토큰 권한을 확인해 주세요.");
  }
});

// ===== 업로드 =====
const dropzone = $("dropzone");
const fileInput = $("file-input");

dropzone.addEventListener("click", e => {
  if (e.target.closest(".resize-toggle")) return; // 체크박스 클릭은 통과
  fileInput.click();
});
fileInput.addEventListener("change", () => handleFiles([...fileInput.files]));

["dragenter", "dragover"].forEach(ev =>
  dropzone.addEventListener(ev, e => { e.preventDefault(); dropzone.classList.add("drag-over"); }));
["dragleave", "drop"].forEach(ev =>
  dropzone.addEventListener(ev, e => { e.preventDefault(); dropzone.classList.remove("drag-over"); }));
dropzone.addEventListener("drop", e =>
  handleFiles([...e.dataTransfer.files].filter(f => f.type.startsWith("image/"))));

async function handleFiles(files) {
  if (!files.length) return;
  if (!token) {
    toast("업로드하려면 먼저 관리자 토큰을 등록해 주세요 🔑");
    openSettings();
    return;
  }
  const status = $("upload-status");
  status.hidden = false;
  let done = 0;
  for (const file of files) {
    status.textContent = `업로드 중... (${done + 1}/${files.length}) ${file.name} ⏳`;
    try {
      await uploadOne(file);
      done++;
    } catch (e) {
      toast(`"${file.name}" 업로드 실패 😢 ${e.message}`);
    }
  }
  status.textContent = done ? `업로드 완료! ${done}장 🎉` : "업로드에 실패했어요 😢";
  setTimeout(() => { status.hidden = true; }, 3000);
  fileInput.value = "";
  if (done) loadGallery();
}

async function uploadOne(file) {
  const keepOriginal = $("keep-original").checked;
  const blob = keepOriginal ? file : await maybeResize(file);
  const base64 = await blobToBase64(blob);

  // 파일명: 시각-원래이름 (최신순 정렬 & 중복 방지)
  const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const clean = file.name.toLowerCase().replace(/[^a-z0-9가-힣._-]/g, "_");
  const ext = blob !== file && !/\.jpe?g$/i.test(clean) ? clean.replace(/\.[^.]+$/, "") + ".jpg" : clean;
  const name = `${stamp}-${ext}`;

  const res = await fetch(`${API}/${encodeURIComponent(name)}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ message: `사진 업로드: ${name}`, content: base64 })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
}

// 긴 변이 MAX_EDGE보다 크면 JPEG로 줄인다 (GIF/SVG는 원본 유지)
async function maybeResize(file) {
  if (/gif|svg/.test(file.type)) return file;
  const bmp = await createImageBitmap(file).catch(() => null);
  if (!bmp) return file;
  const scale = MAX_EDGE / Math.max(bmp.width, bmp.height);
  if (scale >= 1) return file;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d").drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return new Promise(resolve =>
    canvas.toBlob(b => resolve(b || file), "image/jpeg", 0.85));
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result.split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

// ===== 관리자 설정 =====
function openSettings() {
  $("token-input").value = token;
  $("settings-status").textContent = token ? "✅ 토큰이 등록되어 있어요." : "";
  $("settings-modal").hidden = false;
}

$("settings-btn").addEventListener("click", openSettings);
$("settings-close").addEventListener("click", () => { $("settings-modal").hidden = true; });
$("settings-modal").addEventListener("click", e => {
  if (e.target === $("settings-modal")) $("settings-modal").hidden = true;
});

$("token-save").addEventListener("click", async () => {
  const value = $("token-input").value.trim();
  if (!value) { $("settings-status").textContent = "토큰을 입력해 주세요."; return; }
  $("settings-status").textContent = "확인 중... ⏳";
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}`, {
    headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${value}` }
  });
  if (res.ok) {
    token = value;
    localStorage.setItem("dp_token", token);
    $("settings-status").textContent = "✅ 저장 완료! 이제 업로드할 수 있어요.";
    setTimeout(() => { $("settings-modal").hidden = true; }, 900);
  } else {
    $("settings-status").textContent = "❌ 토큰이 올바르지 않아요. 다시 확인해 주세요.";
  }
});

$("token-clear").addEventListener("click", () => {
  token = "";
  localStorage.removeItem("dp_token");
  $("token-input").value = "";
  $("settings-status").textContent = "토큰을 삭제했어요.";
});

// ESC로 모달 닫기
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    if (!$("lightbox").hidden) closeLightbox();
    if (!$("settings-modal").hidden) $("settings-modal").hidden = true;
  }
});

loadGallery();
