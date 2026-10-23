# 💈 헤어패스 (HairPass) - 네이버 미용실 자동 예약 플랫폼

> **"원하는 미용실, 디자이너, 시술, 일정을 선택하면 에이전트가 알아서 예약해 줍니다."**  
> HairPass는 AI 에이전트 기반으로 네이버 미용실 예약을 자동화하고, 모바일 앱과 웹을 통해 손쉬운 예약 관리를 제공하는 올인원 미용 서비스입니다.

---

## 📌 주요 기능 (Features)

### 🤖 1. AI 에이전트 기반 미용실 자동 예약
- **LangGraph 예약 에이전트**: 사용자가 원하는 **미용실 이름, 담당 디자이너, 시술 메뉴, 예약 날짜 및 시간**을 지정하면, AI 에이전트가 네이버 예약 페이지에 자동으로 접근하여 예약을 진행합니다.
- **복잡한 날짜 제어**: 다음달 일자 및 달력 중복 일자 등을 고려하며 예약을 수행합니다.

### 🔔 2. 실시간 푸시 알림 & 예약 확인
- **예약 완료 알림**: 에이전트의 예약 작업이 완료되면 바로 모바일 푸시 알림이 발송됩니다.
- **예약 내역 확인**: 알림을 터치하면 진행된 예약 내역의 상세 정보를 즉시 확인할 수 있습니다.

### ⭐ 3. 즐겨찾기 & 간편 예약
- **즐겨찾기 등록**: 자주 방문하는 미용실, 선호 디자이너, 시술 메뉴를 즐겨찾기에 등록할 수 있습니다.
- **간편 예약 요청**: 즐겨찾기로 등록해두면 다음에는 날짜와 시간만 입력하여 바로 예약을 요청할 수 있습니다.

---

## 🛠 기술 스택 (Tech Stack)

### **AI Agent & Automation**

- **Framework**: FastAPI
- **Agent Logic**: LangGraph
- **Automation**: Playwright (Python)
- **LLM API**: OpenAI API (`gpt-4o-mini`)

### **Backend**

- **Framework**: Django & DRF
- **Database**: Django ORM & PostgreSQL

### **Frontend **

- **Mobile App**: Expo (React Native)
- **Web Client**: Next.js 15 (React 19, TypeScript)

---

## 🏗 시스템 아키텍처 (Architecture)

```
[ Client (Expo App / Next.js Web) ]
                │
                │ (REST API)
                ▼
[ Backend Server (Django REST Framework) ] ── (DB: User / Booking / Favorite)
                │
                │ (Trigger Agent Task)
                ▼
[ AI Agent Server (FastAPI / LangGraph) ]
                │
                ├── OpenAI API (예약 정보 정규화 & 파싱)
                └── Playwright Automation (네이버 예약 페이지 자동화)
```

---

## 📄 License
This project is licensed under a modified MIT License (Non-Commercial Only). You are free to use this code for personal and educational purposes, but **commercial use, paid services, and commercial booking agencies are strictly prohibited.** See the [LICENSE](LICENSE) file for details.
