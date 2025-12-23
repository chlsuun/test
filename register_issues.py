import subprocess
import time
import sys

# Set IO encoding to UTF-8
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

issues = [
    {
        "title": "[Init] Unity 프로젝트 생성 및 설정",
        "body": "## 배경 (Background)\n프로젝트 시작을 위한 기반 마련. (PRD 5. 개발 로드맵)\n\n## 작업 내용 (Content)\n- Unity 프로젝트 생성\n- 기본 폴더 구조 세팅\n\n## 인수 조건 (Acceptance Criteria)\n- Unity Hub에서 프로젝트가 정상적으로 열려야 함\n- 초기 씬 실행 시 에러가 없어야 함"
    },
    {
        "title": "[Init] .gitignore 및 레포지토리 설정",
        "body": "## 배경 (Background)\n소스 코드 버전 관리 및 협업 환경 구축.\n\n## 작업 내용 (Content)\n- .gitignore 설정 (Unity, Python, IDE 등)\n- 리모트 레포지토리 연결\n\n## 인수 조건 (Acceptance Criteria)\n- 불필요한 파일이 커밋되지 않아야 함\n- main 브랜치 푸시 성공"
    },
    {
        "title": "[Init] 필수 Unity 패키지 설치",
        "body": "## 배경 (Background)\n개발에 필요한 유니티 패키지 사전 설치.\n\n## 작업 내용 (Content)\n- TextMeshPro\n- Newtonsoft.Json\n- 기타 필수 패키지\n\n## 인수 조건 (Acceptance Criteria)\n- 패키지 컴파일 에러 없음"
    },
    {
        "title": "[Init] 데이터 처리를 위한 Python 환경 설정",
        "body": "## 배경 (Background)\n데이터 전처리 및 크롤링을 위한 Python 환경 구축 (PRD 4. 기술 스택)\n\n## 작업 내용 (Content)\n- venv 생성\n- requirements.txt 작성\n\n## 인수 조건 (Acceptance Criteria)\n- 가상환경 활성화 및 라이브러리 설치 성공"
    },
    {
        "title": "[Phase 1] OpenAI API / Local LLM 유니티 연동",
        "body": "## 배경 (Background)\n실시간 대화 처리를 위한 LLM 연동 (PRD 3.1)\n\n## 작업 내용 (Content)\n- API 통신 모듈 구현\n- API Key 관리 보안 처리\n\n## 인수 조건 (Acceptance Criteria)\n- Unity에서 텍스트 전송 시 LLM 응답 수신 확인"
    },
    {
        "title": "[Phase 1] 유니티 내 기본 채팅 인터페이스 구현",
        "body": "## 배경 (Background)\n플레이어와 NPC 간의 대화 UI (PRD 3.1)\n\n## 작업 내용 (Content)\n- 채팅창 UI (UGUI/UIToolkit)\n- 스크롤 뷰 및 입력 필드\n\n## 작업 내용 (Content)\n- 텍스트 입력 및 화면 표시 정상 작동"
    },
    {
        "title": "[Phase 1] '세이노의 가르침' 데이터 수집 및 가공",
        "body": "## 배경 (Background)\n페르소나 구축을 위한 원천 데이터 확보 (PRD 3.1)\n\n## 작업 내용 (Content)\n- 텍스트 데이터 정제\n- RAG 또는 프롬프트 주입용 포맷 변환\n\n## 인수 조건 (Acceptance Criteria)\n- 가공된 데이터 파일(.json or .txt) 생성"
    },
    {
        "title": "[Phase 1] 페르소나 시스템 프롬프트 작성",
        "body": "## 배경 (Background)\n독설적이고 단호한 캐릭터성 부여 (PRD 3.1)\n\n## 작업 내용 (Content)\n- System Prompt 엔지니어링\n- 어조 및 가치관 설정\n\n## 인수 조건 (Acceptance Criteria)\n- LLM이 설정된 페르소나대로 답변하는지 테스트"
    },
    {
        "title": "[Phase 1] 상점 주인 상호작용 로직 구현",
        "body": "## 배경 (Background)\n가격 흥정 및 거래 시나리오 구현 (PRD 3.1)\n\n## 작업 내용 (Content)\n- 상점 UI 연결\n- 흥정 성공/실패 로직\n\n## 인수 조건 (Acceptance Criteria)\n- 대화 맥락에 따른 상호작용 동작"
    },
    {
        "title": "[Phase 2] 경제 뉴스 크롤러 (Python) 개발",
        "body": "## 배경 (Background)\n시장 예측을 위한 실시간 데이터 수집 (PRD 3.2)\n\n## 작업 내용 (Content)\n- 뉴스 사이트 크롤링 스크립트\n- 최신 뉴스 헤드라인 추출\n\n## 인수 조건 (Acceptance Criteria)\n- 뉴스 제목 및 본문 정상 수집"
    },
    {
        "title": "[Phase 2] 감성 분석 모듈 (Sentiment Analysis) 구현",
        "body": "## 배경 (Background)\n호재/악재 판단을 위한 분석 (PRD 3.2)\n\n## 작업 내용 (Content)\n- LLM 또는 NLP 모델 활용 감성 분석\n- 점수화 로직\n\n## 인수 조건 (Acceptance Criteria)\n- 뉴스 텍스트 입력 시 긍정/부정 점수 출력"
    },
    {
        "title": "[Phase 2] 유니티 경제 매니저 (Economy Manager) 생성",
        "body": "## 배경 (Background)\n게임 내 경제 수치 관리 (PRD 3.2)\n\n## 작업 내용 (Content)\n- 자산 가격 변동 시스템\n- 싱글톤 매니저 클래스\n\n## 인수 조건 (Acceptance Criteria)\n- 변수 값 변경 시 UI 업데이트 확인"
    },
    {
        "title": "[Phase 2] Python 백엔드/데이터와 유니티 연동",
        "body": "## 배경 (Background)\n분석된 데이터를 게임에 반영 (PRD 3.2)\n\n## 작업 내용 (Content)\n- 소켓 통신 또는 파일 I/O\n- 데이터 동기화\n\n## 인수 조건 (Acceptance Criteria)\n- Python 분석 결과가 Unity 로그에 출력됨"
    },
    {
        "title": "[Phase 2] 감성 점수 기반 시세 변동 로직 구현",
        "body": "## 배경 (Background)\n현실 데이터 기반 게임 플레이 (PRD 3.2)\n\n## 작업 내용 (Content)\n- 점수 매핑 공식 적용\n- 랜덤 요소 믹스\n\n## 인수 조건 (Acceptance Criteria)\n- 뉴스 감성 결과에 따라 그래프/가격 변동"
    },
    {
        "title": "[Phase 3] 사건 시나리오 및 증거 데이터(JSON) 설계",
        "body": "## 배경 (Background)\n추리 게임을 위한 데이터 구조화 (PRD 3.3)\n\n## 작업 내용 (Content)\n- 범인/용의자 프로필\n- 증거 목록 JSON 스키마\n\n## 인수 조건 (Acceptance Criteria)\n- Valid한 JSON 파일 생성"
    },
    {
        "title": "[Phase 3] RAG 파이프라인 구축",
        "body": "## 배경 (Background)\n제한된 정보 내 답변 생성 (PRD 3.3)\n\n## 작업 내용 (Content)\n- 벡터 DB 또는 키워드 검색 구현\n- 관련 증거 Retrieval\n\n## 인수 조건 (Acceptance Criteria)\n- 질문 관련 증거 데이터가 프롬프트에 포함됨"
    },
    {
        "title": "[Phase 3] 거짓말 유도(Deception) 프롬프트 로직 구현",
        "body": "## 배경 (Background)\n플레이어를 속이는 범인 AI 구현 (PRD 3.3)\n\n## 작업 내용 (Content)\n- 거짓말 시나리오 주입\n- 방어적 프롬프트 작성\n\n## 인수 조건 (Acceptance Criteria)\n- 범인이 알리바이를 조작하여 답변함"
    },
    {
        "title": "[Phase 3] 용의자 NPC 상호작용 UI 제작",
        "body": "## 배경 (Background)\n탐정 모드 전용 인터페이스 (PRD 3.3)\n\n## 작업 내용 (Content)\n- 증거 제시 UI\n- 심문 대화창\n\n## 인수 조건 (Acceptance Criteria)\n- 증거 선택 및 질의 기능 작동"
    },
    {
        "title": "[Etc] 성능 지표 리포트 작성 및 시연 영상",
        "body": "## 배경 (Background)\n프로젝트 결과물 정리 (PRD 6. 기대 효과)\n\n## 작업 내용 (Content)\n- 프롬프트 성능 측정 결과 정리\n- 플레이 영상 녹화 및 편집\n\n## 인수 조건 (Acceptance Criteria)\n- PDF 리포트 및 영상 파일 확보"
    }
]

for issue in issues:
    print(f"Creating issue: {issue['title']}")
    # Using shell=True for windows to handle environment better, but list args is safer. 
    # gh handles utf-8 args well.
    cmd = ["gh", "issue", "create", "--title", issue["title"], "--body", issue["body"]]
    
    # Needs explicit encoding for subprocess on Windows sometimes, but python 3.7+ is usually good.
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
        if result.returncode != 0:
            print(f"Error creating issue {issue['title']}: {result.stderr}")
        else:
            print(f"Success: {result.stdout.strip()}")
    except Exception as e:
        print(f"Exception: {e}")
    
    time.sleep(0.5)
