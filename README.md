# Sayno's Shop - AI Gaming Agent Demo

세이노의 가르침을 기반으로 한 인터랙티브 상점 시뮬레이션 게임

## 🎮 프로젝트 소개

"세이노의 상점"은 AI 기반 NPC와의 협상을 통해 아이템을 거래하는 웹 기반 게임입니다. 
플레이어는 세이노의 가르침을 활용하여 더 나은 가격으로 협상하고, 목표를 달성해 나갑니다.

## ⚖️ 저작권 및 출처

**중요:** 본 프로젝트는 **비상업적 포트폴리오 목적**으로 제작되었습니다.

### 원본 자료
- **서적:** "세이노의 가르침"
- **저자:** 세이노
- **출처:** 세이노 정식 카페
- **사용 범위:** NPC 캐릭터 페르소나 형성, 키워드 데이터베이스 구축

### 사용 목적
- ✅ 개인 포트폴리오 전시
- ✅ 기술 역량 시연
- ✅ 교육 및 학습 목적
- ❌ 상업적 이용 금지

**상세 내용:** [COPYRIGHT_ATTRIBUTION.md](COPYRIGHT_ATTRIBUTION.md) 참조

## 🚀 주요 기능

### 1. 키워드 기반 협상 시스템
- 자유 텍스트 입력으로 세이노 설득
- 퍼지 매칭 (오타 허용)
- 한글 조사 자동 제거
- 동의어 지원

### 2. 엔터프라이즈급 텔레메트리
- JSONL 포맷 로깅 (LLM 학습 준비)
- 세션 추적
- 다운로드 가능한 학습 데이터
- 전략 패턴 기반 저장소 추상화

### 3. 증강 시스템
- 레벨업 시 능력 선택
- 협상 성공률 증가
- 특수 효과 및 보너스

### 4. 동적 UI
- 캐릭터 초상화 항상 표시
- 독립 스크롤 채팅 영역
- 반응형 그리드 레이아웃

## 🛠️ 기술 스택

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Architecture:** Strategy Pattern, Facade Pattern
- **AI/ML:** Keyword Matching, Fuzzy Logic, Levenshtein Distance
- **Data:** JSONL (JSON Lines) for LLM training
- **Deployment:** GitHub Pages

## 📦 프로젝트 구조

```
demo/
├── index.html                      # 메인 페이지
├── style.css                       # 스타일시트
├── script.js                       # 메인 로직
├── telemetry/                      # 텔레메트리 시스템
│   ├── loggers/
│   │   ├── IDataLogger.js
│   │   ├── LocalStorageLogger.js
│   │   └── APILogger.js
│   ├── SessionManager.js
│   └── TelemetryManager.js
├── negotiation/                    # 협상 엔진
│   ├── KeywordMatcher.js
│   └── NegotiationEngine.js
├── config/
│   └── keywords-config.js          # 키워드 데이터베이스
└── augmentations.js                # 증강 시스템
```

## 🎯 게임 플레이

1. **협상:** 세이노를 설득하여 가격 할인 받기
2. **거래:** 아이템 구매 및 판매
3. **레벨업:** 목표 달성 시 증강 선택
4. **전략:** 세이노의 가르침을 활용한 협상

## 🔑 키워드 시스템

### 긍정 키워드
- **지혜 (30%):** 푼돈, 투자, 가르침, 큰돈
- **논리 (20%):** 비싸, 다른곳, 시세
- **진정성 (15%):** 정말, 진심, 꼭
- **예의 (10%):** 부탁, 제발, 감사

### 부정 키워드
- **아부 (-20%):** 멋지, 훌륭, 최고
- **위협 (-30%):** 안사, 쓰레기, 최악

## 📊 텔레메트리 기능

### 데이터 수집
```javascript
// 텔레메트리 통계 확인
console.log(telemetry.getStats());

// 학습 데이터 다운로드
telemetry.downloadLogs('training_data.jsonl');
```

### JSONL 포맷
```json
{
  "session_id": "sess_...",
  "timestamp": 1703404800000,
  "prompt": "사용자 입력",
  "completion": "NPC 응답",
  "metadata": {
    "persuasion_score": 0.75,
    "matched_keywords": ["푼돈", "투자"],
    "success": true
  }
}
```

## 🚀 시작하기

### 로컬 실행
```bash
# 저장소 클론
git clone https://github.com/chlsuun/test.git

# 디렉토리 이동
cd test/demo

# 로컬 서버 실행 (Python)
python -m http.server 8000

# 브라우저에서 열기
# http://localhost:8000
```

### 온라인 데모
https://chlsuun.github.io/test/demo/

## 📚 문서

- [COPYRIGHT_ATTRIBUTION.md](COPYRIGHT_ATTRIBUTION.md) - 저작권 및 출처
- [INTEGRATION_GUIDE.js](demo/INTEGRATION_GUIDE.js) - 통합 가이드
- [Walkthrough](https://github.com/chlsuun/test/wiki) - 구현 상세

## 🎓 교육적 목적

본 프로젝트는 다음 기술을 시연합니다:

- **디자인 패턴:** Strategy, Facade
- **AI/ML:** Fuzzy Matching, Keyword Analysis
- **데이터 엔지니어링:** JSONL, ETL Pipeline
- **아키텍처:** Modular, Scalable Design
- **UX/UI:** Responsive, Interactive Design

## 🤝 기여

본 프로젝트는 포트폴리오 목적으로 제작되었으나, 
교육적 목적의 기여는 환영합니다.

## 📄 라이선스

본 프로젝트의 코드는 MIT 라이선스 하에 공개됩니다.

**단, "세이노의 가르침" 관련 콘텐츠는:**
- 원저작자 세이노의 저작권 보호를 받습니다
- 비상업적 교육 목적으로만 사용됩니다
- 상업적 이용이 금지됩니다

## 📧 연락처

- **GitHub:** https://github.com/chlsuun
- **프로젝트:** https://github.com/chlsuun/test

## 🙏 감사의 말

- **세이노:** "세이노의 가르침" 원저작자
- **세이노 정식 카페:** 자료 제공

---

**면책 조항:**  
본 프로젝트는 교육 및 포트폴리오 목적의 비상업적 프로젝트입니다.  
"세이노의 가르침"의 모든 권리는 원저작자에게 있습니다.
