# Google Gemini API 사용 가이드

## 🔑 API Key 발급 방법

### 1. Google AI Studio 방문
https://makersuite.google.com/app/apikey

### 2. API Key 생성
1. "Create API Key" 클릭
2. 프로젝트 선택 (또는 새로 생성)
3. API Key 복사

### 3. `.env` 파일 생성
`PythonTools` 폴더에 `.env` 파일 생성 후:

```
GOOGLE_API_KEY=your-api-key-here
```

---

## 🎮 사용법

데모 실행 시 자동으로 다음 순서로 AI를 선택:

1. **Gemini** (GOOGLE_API_KEY가 있으면)
2. **OpenAI** (OPENAI_API_KEY가 있으면)
3. **Mock** (API Key가 없으면)

---

## 💡 Gemini vs OpenAI 비교

| 항목 | Gemini | OpenAI GPT |
|------|--------|------------|
| **무료 할당량** | 60 요청/분 | 매우 제한적 |
| **가격** | 저렴 | 비쌈 |
| **한국어** | 우수 | 우수 |
| **응답 속도** | 빠름 | 중간 |

---

## ✅ 설치 완료

`google-generativeai` 패키지가 설치되었습니다.
이제 `.env` 파일에 API Key만 추가하면 바로 사용 가능합니다!

---

## 🚀 실행

```bash
cd PythonTools
python console_demo.py
```

메뉴 상단에 현재 사용 중인 AI Backend가 표시됩니다:
- `🤖 AI Backend: Gemini` ✅
- `🤖 AI Backend: OpenAI`
- `🤖 AI Backend: Mock`
