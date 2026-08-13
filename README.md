# 🍩 도넛픽 (DonutPic)

GitHub Pages + GitHub API로 만든 **서버 없는 이미지 호스팅 서비스**입니다.

**👉 https://aisays.github.io**

## 동작 원리

- **업로드**: 브라우저에서 GitHub API로 `img/` 폴더에 이미지를 직접 커밋
- **갤러리**: GitHub API로 `img/` 폴더 목록을 읽어서 표시
- **호스팅 주소**: 업로드된 이미지는 `https://aisays.github.io/img/파일명` 으로 어디서든 사용 가능
- 큰 사진은 업로드 전에 브라우저에서 자동으로 리사이즈 (긴 변 1600px, JPEG 85%)

## 업로드 권한 (관리자 토큰)

업로드는 GitHub Fine-grained 토큰을 등록한 브라우저에서만 가능합니다.

1. GitHub → Settings → **Developer settings** → **Fine-grained personal access tokens** → Generate new token
2. Repository access: **Only select repositories** → `aisays.github.io` 선택
3. Permissions → Repository permissions → **Contents: Read and write**
4. 생성된 `github_pat_...` 토큰 복사
5. 사이트 우측 상단 **🔑 관리자** 버튼 → 토큰 붙여넣기 → 저장

토큰은 브라우저(localStorage)에만 저장되며 저장소 코드에는 포함되지 않습니다.

## 한계

- 파일 하나 최대 100MB, 저장소 전체 1GB 권장
- 방문자가 아주 많으면 GitHub API 목록 조회 제한(시간당 60회/IP)에 걸릴 수 있음
- 업로드 직후 `aisays.github.io` 주소 반영까지 1분 정도 걸림

## 파일 구성

| 파일 | 역할 |
|---|---|
| `index.html` | 페이지 구조 (업로드 존, 갤러리, 모달) |
| `css/style.css` | 카툰 테마 디자인 |
| `js/app.js` | 업로드/갤러리/삭제 로직 (저장소 이름 바꾸면 맨 위 상수 수정) |
| `img/` | 업로드된 이미지가 저장되는 곳 |
