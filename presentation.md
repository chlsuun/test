---
marp: true
theme: gaia
class: lead
backgroundColor: #fff
backgroundImage: url('https://marp.app/assets/hero-background.svg')
paginate: true
_paginate: false
---

# **AI Gaming Agent Portfolio**
### Unity + LLM Intelligent NPC Project

---

## **1. 프로젝트 개요**
**"게임 속 NPC가 살아있는 지능을 갖는다면?"**

- **Unity Engine** + **Latest LLM** (GPT-4)
- **목표**: 정해진 대사가 아닌, **페르소나**, **외부 데이터**, **논리적 추론**을 갖춘 Intelligent Gaming Agent 구현
- **핵심 가치**: 몰입감 있는 상호작용 경험 제공

---

## **2. 기획 의도**

1. **Gaming Agent 역량 입증**
   - 단순 스크립트 탈피 → 능동적 상호작용 NPC
2. **데이터 처리 기술 접목**
   - 텍스트 마이닝, 감성 분석, RAG 활용
3. **정량적 검증 (Engineering Approach)**
   - 프롬프트 튜닝 전후 성능 비교 및 데이터화

---

## **3. 핵심 기능 (Key Features)**

### **Phase 1: "세이노의 가르침" 페르소나 NPC**
- **Concept**: 독설적이고 냉철한 상점 주인
- **Tech**: System Prompting ("협상을 구걸로 착각하지 마라")
- **UX**: 플레이어의 흥정에 철학적인 독설로 응수하여 몰입감 극대화

---

### **Phase 2: 경제 뉴스 감성 분석 & 시장 예측**
- **Concept**: 현실 경제가 반영되는 게임 내 시장
- **Tech**: Python Crawler + Sentiment Analysis (LLM)
- **UX**: "지금 나스닥이 하락세라 포션 가격이 올랐네?"
   - 현실 데이터 기반의 살아있는 경제 시스템

---

### **Phase 3: "거짓말 탐지기" 추리 에이전트**
- **Concept**: 범인의 알리바이를 깨뜨리는 두뇌 싸움
- **Tech**: **RAG** (제한된 증거 데이터) + **Deception Prompting**
- **UX**: 교묘하게 거짓말하는 AI를 논리로 제압하는 추리 경험

---

---

## **4. 주요 용어 설명 (Terminology)**

- **LLM (Large Language Model)**
  - 대규모 텍스트 데이터를 학습하여 인간과 유사한 텍스트를 생성하는 AI 모델 (예: GPT-4).
- **RAG (Retrieval-Augmented Generation)**
  - '검색 증강 생성'. AI가 답변을 생성할 때 외부 데이터(증거 자료 등)를 검색하여 참조하도록 하는 기술. 환각(Hallucination) 방지에 효과적.
- **Sentiment Analysis (감성 분석)**
  - 텍스트에 담긴 감정(긍정/부정/중립)을 분석하는 기술. 본 프로젝트에서는 경제 뉴스의 호재/악재 판단에 사용.
- **System Prompting**
  - AI에게 특정한 역할(Role)이나 규칙을 부여하는 초기 명령어. (예: "너는 냉철한 상점 주인이다.")

---

## **5. 기술 스택 (Tech Stack)**

| 분야 | 기술 |
| :--- | :--- |
| **Game Engine** | Unity 6 (C#) |
| **AI Model** | OpenAI GPT-4 / 3.5 Turbo |
| **Backend** | Python (Flask) |
| **Data Processing** | BeautifulSoup, Pandas, Scikit-learn |

---

## **6. 개발 로드맵**

- **Phase 1**: 세이노 NPC (대화 시스템 & 페르소나)
- **Phase 2**: 경제 시스템 (크롤러 & 유니티 연동)
- **Phase 3**: 탐정 에이전트 (RAG & 거짓말 로직)
- **Final**: 성능 지표 리포트 & 데모 영상

---

## **7. 기대 효과**

- 🎮 **실행 가능한 Unity AI 프로젝트** 포트폴리오
- 📊 **프롬프트 엔지니어링 실험 데이터** 확보
- 🎬 **기술 시연 영상**

---

# **Thank You**

