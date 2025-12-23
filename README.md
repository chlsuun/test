# AI Gaming Agent Portfolio

Unity 엔진과 최신 LLM(Large Language Model) 기술을 결합하여, 플레이어와 고도로 상호작용하는 "Intelligent Gaming Agent"를 구현한 테크 데모 프로젝트입니다.

## 📌 프로젝트 개요
단순히 정해진 대사를 읊는 NPC가 아닌, **페르소나**, **외부 데이터**, **논리적 추론** 능력을 갖춘 에이전트를 통해 게임의 몰입도를 극대화하는 것을 목표로 합니다.

## 🚀 핵심 기능 (Key Features)

### 1. "세이노의 가르침" 페르소나 NPC
- **기능**: 독설적이고 확고한 가치관을 지닌 상점 주인 NPC와 협상 및 대화.
- **기술**: OpenAI API 연동, System Prompt Engineering을 통한 페르소나 주입.
- **UX**: 플레이어의 가격 흥정에 대해 NPC가 자신의 철학("협상을 구걸로 착각하지 마라")에 따라 반응.

### 2. LLM 기반 실시간 경제 시뮬레이션
- **기능**: 실제 경제 뉴스를 분석하여 게임 내 가상 자산의 시세를 변동시킴.
- **기술**: Python 크롤러, 감성 분석(Sentiment Analysis), Unity-Python 데이터 연동.
- **UX**: 현실 세계의 경제 호재/악재가 게임 내 시장에 즉각적으로 반영되는 경험.

### 3. "추리 게임" 거짓말 탐지기 (Detective Agent)
- **기능**: 범인의 알리바이와 증거를 토대로 진실을 밝혀내는 추리 게임.
- **기술**: RAG(검색 증강 생성)를 활용한 지식 제한, Deception Prompting(거짓말 유도).
- **UX**: 논리적 허점을 파고드는 고난도 두뇌 플레이.

## 🛠 기술 스택 (Tech Stack)
- **Game Engine**: Unity 6 (C#)
- **AI Model**: OpenAI GPT-4 / GPT-3.5 Turbo
- **Backend & Data**: Python 3.13 (Flask, Pandas, BeautifulSoup, Scikit-learn)
- **Version Control**: Git / GitHub

## 📂 폴더 구조
```
/
├── UnityProject/      # Unity 게임 클라이언트 프로젝트
├── PythonTools/       # 데이터 크롤링, 분석 및 백엔드 서버
│   ├── venv/          # Python 가상환경
│   └── requirements.txt
├── README.md          # 프로젝트 설명서
└── .gitignore         # Git 설정
```

## 🏁 시작하기 (Getting Started)
1. **Repository Clone**
    ```bash
    git clone https://github.com/chlsuun/test.git
    ```
2. **Python 환경 설정**
    ```bash
    cd PythonTools
    python -m venv venv
    ./venv/Scripts/activate
    pip install -r requirements.txt
    ```
3. **Unity 프로젝트 실행**
    - Unity Hub에서 `UnityProject` 폴더를 열어주세요.
