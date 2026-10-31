# LCYG Friday Gathering

금요예배에서 쓰는 화면 모음입니다. 코딩을 몰라도 관리자 화면에서 기도제목을 바꿀 수 있습니다.

주소: https://lcyg-friday.vercel.app

## 화면

| 주소 | 화면 |
| --- | --- |
| `/` | 홈. 기도와 게임을 고릅니다. |
| `/bubbles` | 기도 버블. 기도제목이 3–4개씩 떠올랐다 사라지고, 하나가 약 25초 머뭅니다. |
| `/one` | 하나씩 크게. 기도제목 하나를 크게 약 25초씩 보여 줍니다. |
| `/admin` | 관리자. 기도제목 목록을 바꿉니다(비밀번호 필요). |

Case Room과 Jeopardy는 홈에서 각자의 사이트로 연결만 합니다.

## 진행할 때

- **전체 화면**: 기도 화면에서 F 키(한글 자판이어도 됩니다). 저녁 내내 전체 화면을 유지하려면 브라우저 자체 전체 화면을 쓰세요(맥 크롬은 Control+Command+F). 이 방법은 다른 화면으로 옮겨도 풀리지 않습니다.
- **홈으로 돌아가기**: 기도 화면에서 마우스를 움직이면 왼쪽 위에 'LCYG Friday Gathering'이 나타납니다.
- **인터넷이 끊기면**: 기도 화면은 마지막으로 받은 목록으로 계속 돌아갑니다.

## 기도제목 바꾸기

1. `/admin`에서 비밀번호로 들어갑니다.
2. 큰 칸에 기도제목을 한 줄에 하나씩 붙여 넣고, 목록 이름을 적은 뒤 **Save and show**를 누릅니다.
3. 1분 안에 기도 화면이 새 목록으로 바뀝니다. 이전 목록은 **Saved lists**에 날짜별로 남고, **Show this**로 다시 걸 수 있습니다.

## 관리자 비밀번호

- Vercel 프로젝트의 Settings → Environment Variables에 있는 `ADMIN_PASSWORD`입니다.
- 바꾸려면 값을 고친 뒤 Deployments에서 맨 위 배포의 메뉴(…) → Redeploy를 누릅니다.

## 기도제목이 저장되는 곳

- 기도제목은 이 깃허브 저장소에 들어가지 않습니다. 이 Vercel 프로젝트에 연결된 비공개 Blob 저장 공간에 `index.json`(목록 이름과 날짜)과 `lists/`(목록 내용)로 저장됩니다.
- 기도 화면은 공개 주소라서, 주소를 아는 사람은 지금 걸린 목록을 볼 수 있습니다.

## 새 활동 넣기

- 새 화면은 HTML 파일 하나로 맨 위 폴더에 넣습니다. 예: `worship.html` → `/worship`
- 홈(`index.html`)의 `.tiles` 안에 버튼(타일)을 하나 추가합니다. 다른 사이트에 있는 것은 링크만 겁니다.
- 깃허브에 올리면 Vercel이 자동으로 다시 배포합니다.

## 파일

| 파일 | 하는 일 |
| --- | --- |
| `index.html` | 홈 |
| `bubbles.html` | 기도 버블 |
| `one.html` | 하나씩 크게 |
| `admin.html` | 관리자 화면 |
| `api/prayers.js` | 지금 걸린 목록을 기도 화면에 줍니다. |
| `api/admin.js` | 비밀번호를 확인하고, 목록을 저장하거나 걸 목록을 바꿉니다. |
| `lib/store.js` | 저장 공간을 읽고 씁니다. |
| `assets/site.css` | 공통 색과 밤하늘 배경 |
| `assets/sky.js` | 별 |
| `assets/screen.js` | F 키 전체 화면, 홈으로 가는 링크 |
| `assets/prayers.js` | 기도 화면이 목록을 불러오고 1분마다 새 목록을 확인 |
| `assets/img/` | 로고와 버튼 그림 |

## 계정

- 깃허브: youth-LCYG
- Vercel: youth@lcaustin.org (팀 lcyg1)
