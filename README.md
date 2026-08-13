# 🍩 나의 스프링필드

심슨 감성의 컬러풀한 카툰 테마 블로그 & 프로젝트 페이지입니다.

## 📝 글/프로젝트 추가하는 법

`js/data.js` 파일 하나만 수정하면 됩니다.

- **블로그 글 추가**: `POSTS` 목록 맨 위에 새 항목을 복사해서 붙여넣고 내용을 바꾸세요.
- **프로젝트 추가**: `PROJECTS` 목록에 새 항목을 추가하세요. `status`는 `"done"`(완성) 또는 `"wip"`(진행 중).

## 🚀 GitHub Pages에 올리는 법

1. [GitHub](https://github.com)에서 새 저장소(repository)를 만듭니다.
   - 저장소 이름을 `아이디.github.io`로 만들면 주소가 `https://아이디.github.io`가 됩니다.
2. 이 폴더의 파일을 전부 올립니다:
   ```
   git init
   git add .
   git commit -m "첫 커밋: 심슨 테마 블로그"
   git branch -M main
   git remote add origin https://github.com/아이디/저장소이름.git
   git push -u origin main
   ```
3. 저장소의 **Settings → Pages**에서 Branch를 `main`으로 선택하고 Save.
4. 1~2분 뒤 `https://아이디.github.io/저장소이름` 으로 접속하면 완성! 🎉

## 📁 파일 구성

| 파일 | 역할 |
|---|---|
| `index.html` | 페이지 구조 (이름/소개 수정은 여기 ABOUT 부분) |
| `css/style.css` | 디자인 (색을 바꾸려면 맨 위 `:root` 부분) |
| `js/data.js` | ✏️ **글과 프로젝트 데이터 — 주로 여기를 수정!** |
| `js/main.js` | 카드를 화면에 그려주는 코드 (수정 불필요) |
