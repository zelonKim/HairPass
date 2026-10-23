# 🤖 HairPass - AI Agent Server

네이버 미용실 자동 예약 플랫폼 **HairPass**의 핵심인 **AI 에이전트 및 브라우저 자동화 백엔드 서버**입니다. FastAPI 기반으로 동작하며, LangGraph, Playwright, OpenAI API를 연동하여 사용자의 예약 요청을 자동으로 수행합니다.

---

## 📂 디렉터리 구조 (Directory Structure)

```text
back_fastapi/
├── agent/                  # LangGraph 에이전트 워크플로우 관련 로직
│   ├── __init__.py
│   ├── nodes.py            # 예약 단계별 노드 함수 정의 
│   ├── state.py            # 에이전트 실행 상태(BookingState) 스키마 정의
│   └── workflow.py         # LangGraph 상태 전이 그래프 및 워크플로우 조립
├── utils/                  # 부가 기능 및 유틸리티
│   ├── normalizer.py       # OpenAI API를 활용한 사용자 자연어 예약 정보 정규화
│   └── run_and_callback.py # 에이전트 실행 및 완료 콜백 처리
├── venv/                   # Python 가상 환경
├── .env                    # 환경 변수 설정 
├── main.py                 # FastAPI 애플리케이션 진입점 및 엔드포인트 정의
├── README.md               # 디렉터리 문서
├── requirements.txt        # 파이썬 패키지 의존성 목록
└── schema.py               # Pydantic 기반 요청/응답 데이터 검증 모델
```

---

## 🛠️ 기술 스택 (Tech Stack)
* **Framework**: FastAPI (Python)
* **AI & Agent Orchestration**: LangGraph, OpenAI API (`gpt-4o-mini`)
* **Browser Automation**: Playwright 
* **Data Validation**: Pydantic

---

## ⚙️ 핵심 구성요소 (Core Components)
1. **`main.py` & `schema.py`**
   * Django 백엔드 서버로부터 예약 요청을 수신하는 FastAPI 엔드포인트를 제공합니다.
   * Pydantic을 이용해 요청 데이터(미용실 정보, 디자이너, 시술 메뉴, 날짜/시간 등)의 무결성을 검증합니다.

2. **`agent/` (LangGraph Workflow)**
   * `state.py`: 에이전트가 탐색하고 실행하는 동안 유지할 상태(`BookingState`)를 정의합니다.
   * `nodes.py`: 네이버 예약 페이지 접속, 월 변경, 날짜/시간 선택, 디자이너 검색 및 예약 완료까지의 단계를 개별 노드로 분리하여 관리합니다.
   * `workflow.py`: 노드들을 연결하여 유연하고 안정적인 상태 전이 그래프를 구성합니다.

3. **`utils/`**
   * `normalizer.py`: 사용자가 입력한 자연어 요청을 AI가 분석하여 정형화된 예약 요청 데이터로 변환합니다.
   * `run_and_callback.py`: 에이전트 구동 상태를 관리하고, 예약 성공 시 콜백 및 푸시 알림 연동 처리를 담당합니다.

