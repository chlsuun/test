# AI Gaming Agent Portfolio

**Live Presentation**: [https://chlsuun.github.io/test/](https://chlsuun.github.io/test/)

Unity 엔진과 최신 LLM(Large Language Model) 기술을 결합하여, 플레이어와 고도로 상호작용하는 "Intelligent Gaming Agent"를 구현한 테크 데모 프로젝트입니다.

## 📌 프로젝트 개요
단순히 정해진 대사를 읊는 NPC가 아닌, **페르소나**, **외부 데이터**, **논리적 추론** 능력을 갖춘 에이전트를 통해 게임의 몰입도를 극대화하는 것을 목표로 합니다.

## 🚀 핵심 기능 (Key Features)

### 1. "세이노의 가르침" 페르소나 NPC
- **기능**: 독설적이고 확고한 가치관을 지닌 상점 주인 NPC와 협상 및 대화
- **기술**: OpenAI / Google Gemini API 연동, System Prompt Engineering을 통한 페르소나 주입
- **UX**: 플레이어의 가격 흥정에 대해 NPC가 자신의 철학("협상을 구걸로 착각하지 마라")에 따라 반응
- **Demo**: Mock AI로 API 없이도 작동, 구매/판매/인벤토리 시스템 완비

### 2. LLM 기반 실시간 경제 시뮬레이션
- **기능**: 실제 경제 뉴스를 분석하여 게임 내 가상 자산의 시세를 변동시킴
- **기술**: Python 크롤러, 감성 분석(Sentiment Analysis), Unity-Python 데이터 연동
- **UX**: "지금 나스닥이 하락세라 포션 가격이 올랐네?" - 현실 데이터 기반의 살아있는 경제 시스템

### 3. "거짓말 탐지기" 추리 에이전트
- **기능**: 범인의 알리바이와 증거를 토대로 진실을 밝혀내는 추리 게임
- **기술**: RAG(검색 증강 생성)를 활용한 지식 제한, Deception Prompting(거짓말 유도)
- **UX**: 교묘하게 거짓말하는 AI를 논리로 제압하는 추리 경험

## 🛠 기술 스택 (Tech Stack)
- **Game Engine**: Unity 6 (C#)
- **AI Model**: OpenAI GPT-4 / Google Gemini 1.5 / Mock AI
- **Backend**: Python (Flask)
- **Data Processing**: BeautifulSoup, Pandas, Scikit-learn
- **Version Control**: Git / GitHub

## 📂 폴더 구조
```
/
├── UnityProject/      # Unity 게임 클라이언트 프로젝트 (예정)
├── PythonTools/       # 데이터 크롤링, 분석 및 백엔드 서버
│   ├── venv/          # Python 가상환경
│   ├── console_demo.py # 통합 콘솔 데모
│   ├── prompts/       # AI 시스템 프롬프트
│   ├── data/          # NPC 데이터
│   ├── economy/       # 경제 시뮬레이션 모듈
│   ├── detective/     # 추리 게임 모듈
│   └── requirements.txt
├── index.html         # 프로젝트 프레젠테이션
├── presentation.md    # Marp 프레젠테이션 원본
├── README.md          # 프로젝트 설명서
└── .gitignore         # Git 설정
```

## 🏁 시작하기 (Getting Started)

### 1. Repository Clone
```bash
git clone https://github.com/chlsuun/test.git
cd test
```

### 2. Python 환경 설정
```bash
cd PythonTools
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### 3. Console Demo 실행
```bash
.\venv\Scripts\python console_demo.py
```

**메뉴:**
1. Talk to Sayno (세이노 NPC와 대화)
2. Market Simulation (경제 시뮬레이션)
3. Solve the Crime (추리 게임)

## 🎯 특징

### Mock AI 우선 설계
- API 키 없이도 모든 기능 체험 가능
- 개발/테스트 환경에서 비용 zero
- 프로토타이핑에 최적화

### 멀티 백엔드 지원
```python
if HAS_GEMINI:
    use_gemini()      # Google Gemini API
elif HAS_OPENAI:
    use_openai()      # OpenAI GPT
else:
    use_mock()        # Mock AI (항상 작동!)
```

### 보안
- `.env` 파일로 API 키 관리
- `.gitignore`로 민감 정보 보호
- API 키 없이도 완전한 기능 제공

## 📖 문서
- [Demo Guide](PythonTools/DEMO_GUIDE.md) - 상세 사용 가이드
- [Gemini Setup](PythonTools/GEMINI_SETUP.md) - Gemini API 설정
- [Presentation](https://chlsuun.github.io/test/) - 프로젝트 소개

## 📝 개발 현황

### ✅ 완료
- [x] Python 백엔드 (3개 Phase 모두)
- [x] Mock/Gemini/OpenAI 멀티 AI 백엔드
- [x] 세이노 상점 시스템 (구매/판매/인벤토리)
- [x] 경제 뉴스 감성 분석 (Mock)
- [x] 추리 게임 증거 시스템 (Mock)
- [x] 통합 Console Demo
- [x] 프로젝트 문서화
- [x] GitHub Pages 배포

### 🚧 진행 예정
- [ ] Unity 프로젝트 구현
- [ ] Unity-Python 통신
- [ ] 3D UI 구현
- [ ] 실제 뉴스 크롤링
- [ ] Vector DB RAG 구현

## 🎓 학습 포인트
1. **LLM API 통합**: OpenAI, Gemini API 활용
2. **Prompt Engineering**: System Prompt로 페르소나 주입
3. **RAG**: 검색 증강 생성 구현
4. **Sentiment Analysis**: 감성 분석 활용
5. **Mock-First Design**: API 의존성 제거

## 📫 Contact
- GitHub: [@chlsuun](https://github.com/chlsuun)
- Repository: [https://github.com/chlsuun/test](https://github.com/chlsuun/test)

## 📄 License
MIT License

---

Made with ❤️ by chlsuun
