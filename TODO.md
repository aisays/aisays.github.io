# ✅ 해야 할 일 — 도넛픽 시작하기

## 1. 업로드용 토큰 만들기 (필수)

- [ ] [GitHub](https://github.com) 로그인 → 우측 상단 프로필 → **Settings**
- [ ] 왼쪽 맨 아래 **Developer settings** 클릭
- [ ] **Personal access tokens → Fine-grained tokens** → **Generate new token**
- [ ] 아래처럼 설정:
  - **Token name**: `donutpic-upload` (아무거나)
  - **Expiration**: 90 days 이상 원하는 만큼 (만료되면 새로 만들어 다시 등록)
  - **Repository access**: **Only select repositories** → `aisays.github.io` 선택
  - **Permissions → Repository permissions → Contents**: **Read and write**
- [ ] **Generate token** → 나오는 `github_pat_...` 복사 (이 화면을 벗어나면 다시 못 보니 바로 복사!)

## 2. 사이트에 토큰 등록 (필수)

- [ ] https://aisays.github.io 접속
- [ ] 우측 상단 **🔑 관리자** 버튼 클릭
- [ ] 복사한 토큰 붙여넣기 → **저장** → "✅ 저장 완료" 확인
- [ ] 사진 하나 드래그해서 업로드 테스트 🎉

## 3. 폰에서도 쓰기 (선택)

- [ ] 폰 브라우저로 https://aisays.github.io 접속
- [ ] 같은 방법으로 🔑 관리자 → 토큰 등록
- [ ] 폰 사진을 바로 업로드 가능!

## ⚠️ 주의사항

- 토큰은 **비밀번호처럼** 취급하세요. 다른 사람에게 보내거나 코드에 붙여넣지 않기.
- 토큰이 만료되거나 유출됐다면: GitHub → Developer settings에서 삭제(Revoke) 후 새로 발급.
- 저장소 용량은 1GB 이내 권장 — 자동 리사이즈를 켜두면(기본값) 걱정 없어요.

## 📸 공유 갤러리 운영법 (제보 승인하기)

방문자가 사진을 제보하면 GitHub 알림이 와요. 처리 방법:

- [ ] 저장소 → **Issues** 탭에서 제보 확인 (`photo-submission` 라벨이 붙어 있음)
- [ ] 사진이 마음에 들면 → 오른쪽 **Labels**에서 **`approved`** 클릭
- [ ] 끝! 로봇이 알아서 갤러리에 추가하고, 감사 댓글 달고, 이슈를 닫아요 (1~2분)
- [ ] 거절하고 싶으면 → 라벨 없이 그냥 **Close issue** (아무 일도 일어나지 않음)

## 💡 나중에 해볼 만한 것 (선택)

- [ ] 갤러리에 태그/앨범 분류 기능 추가
- [ ] 이미지 검색 기능
- [ ] PWA로 만들어서 폰 홈 화면에 앱처럼 설치
