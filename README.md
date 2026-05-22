# 우리 아이 구충제 체크

박람회 부스 QR 접속용 모바일 설문 웹앱입니다. 사용자는 한 문항씩 답변하고, 제출 시 Next.js Route Handler가 Google Form `formResponse`로 서버 사이드 POST를 수행합니다. 별도 DB는 사용하지 않습니다.

## 설치 및 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## 환경변수 설정

`.env.local.example`을 참고해 `.env.local`을 만듭니다.

```bash
GOOGLE_FORM_ACTION_URL=https://docs.google.com/forms/d/e/FORM_ID/formResponse
GOOGLE_FORM_ENTRY_NAME=entry.xxxxxxxxxx
GOOGLE_FORM_ENTRY_PHONE=entry.xxxxxxxxxx
GOOGLE_FORM_ENTRY_CURRENT_USE=entry.xxxxxxxxxx
GOOGLE_FORM_ENTRY_REASON=entry.xxxxxxxxxx
GOOGLE_FORM_ENTRY_INCONVENIENCE=entry.xxxxxxxxxx
GOOGLE_FORM_ENTRY_WILLINGNESS=entry.xxxxxxxxxx
```

`FORM_ID` 또는 `entry.xxxxxxxxxx`가 그대로 남아 있으면 제출 API가 명확한 설정 오류를 반환합니다. 클라이언트 화면에는 내부 오류 대신 일반 실패 안내만 표시됩니다.

## Google Form entry ID 찾기

1. Google Form 공개 응답 페이지를 엽니다.
2. 브라우저에서 페이지 소스 보기 또는 개발자 도구를 엽니다.
3. `entry.`로 검색합니다.
4. 각 문항에 해당하는 `entry.xxxxxxxxxx` 값을 찾습니다.
5. `.env.local`에 앱 문항과 Google Form 문항을 정확히 매핑합니다.

또는 Google Form의 “미리 채워진 링크 가져오기” 기능을 사용해 샘플 값을 입력한 뒤 생성된 URL에서 `entry.xxxxxxxxxx` 값을 확인할 수 있습니다.

## 선택지 값 주의

Google Form 문항의 선택지 텍스트와 앱에서 전송하는 값은 정확히 일치해야 합니다.

- O/X 문항은 화면에 `O 사용 중이에요`처럼 보여도 Google Form에는 `O`만 전송합니다.
- Step 4 체크박스는 `유명해서`, `바르는 제품이 없어서`, `동물병원장님의 추천`, `잘 먹어서`를 그대로 전송합니다.
- Google Form의 실제 선택지 값도 위 텍스트와 동일해야 합니다.

## 검증

```bash
npm run lint
npm run build
```

## Vercel 배포

1. GitHub 저장소를 Vercel에 연결합니다.
2. Project Settings > Environment Variables에 `.env.local`과 동일한 값을 등록합니다.
3. 배포 후 모바일 QR 코드의 대상 URL을 Vercel Production URL로 설정합니다.
4. 실제 Google Form URL과 entry ID를 넣은 뒤 테스트 응답이 Google Form에 저장되는지 확인합니다.
