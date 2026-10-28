# 💈 HairPass - Automated Salon Reservation Platform (미용실 자동 예약 플랫폼)

> **"Select your desired salon, designer, procedure, and schedule — our agent handles the booking automatically."**  
> HairPass is an all-in-one beauty service platform that automates Naver Salon reservations using AI agents, providing seamless booking management across mobile apps and web clients.
>
> **"원하는 미용실, 디자이너, 시술, 일정을 선택하면 에이전트가 알아서 예약해 줍니다."**  
> HairPass는 AI 에이전트 기반으로 네이버 미용실 예약을 자동화하고, 모바일 앱과 웹을 통해 손쉬운 예약 관리를 제공하는 올인원 미용 서비스입니다.

---

## 📌 Core Features (주요 기능)

### 🤖 1. AI Agent-Based Automated Booking (AI 에이전트 기반 미용실 자동 예약)

- **LangGraph Reservation Agent (LangGraph 예약 에이전트)**: When a user specifies their preferred **salon name, designer, procedure menu, date, and time**, the AI agent automatically accesses the Naver Booking page to execute the reservation. (사용자가 원하는 **미용실 이름, 담당 디자이너, 시술 메뉴, 예약 날짜 및 시간**을 지정하면, AI 에이전트가 네이버 예약 페이지에 자동으로 접근하여 예약을 진행합니다.)
- **Complex Date Handling (복잡한 날짜 제어)**: Handles multi-month navigation, duplicate calendar dates, and edge-case date selections during the booking process. (다음달 일자 및 달력 중복 일자 등을 고려하며 예약을 수행합니다.)

### 🔔 2. Real-Time Push Notifications & Booking Verification (실시간 푸시 알림 & 예약 확인)

- **Completion Alerts (예약 완료 알림)**: Triggers immediate mobile push notifications upon successful reservation completion by the agent. (에이전트의 예약 작업이 완료되면 바로 모바일 푸시 알림이 발송됩니다.)
- **Booking History (예약 내역 확인)**: Tapping the notification immediately displays detailed information of the completed reservation. (알림을 터치하면 진행된 예약 내역의 상세 정보를 즉시 확인할 수 있습니다.)

### ⭐ 3. Favorites & One-Tap Booking (즐겨찾기 & 간편 예약)

- **Favorite Registration (즐겨찾기 등록)**: Register frequently visited salons, preferred designers, and treatment menus to your favorites. (자주 방문하는 미용실, 선호 디자이너, 시술 메뉴를 즐겨찾기에 등록할 수 있습니다.)
- **Streamlined Requests (간편 예약 요청)**: Once registered as a favorite, future bookings require only entering the desired date and time to submit an automated request. (즐겨찾기로 등록해두면 다음에는 날짜와 시간만 입력하여 바로 예약을 요청할 수 있습니다.)

---

## 🛠 Tech Stack (기술 스택)

### **AI Agent & Automation**

- **Framework**: FastAPI
- **Agent Logic**: LangGraph
- **Browser Automation**: Playwright (Python)
- **LLM API**: OpenAI API (`gpt-4o-mini`)

### **Backend**

- **Framework**: Django & Django REST Framework (DRF)
- **Database & ORM**: PostgreSQL, Django ORM

### **Frontend**

- **Mobile App**: Expo (React Native)
- **Web Client**: Next.js 15 (React 19, TypeScript)

---

## 🏗 System Architecture (시스템 아키텍처)

```text
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
                ├── OpenAI API - Information Normalization (예약 정보 정규화)
                └── Playwright Automation - Naver Booking Automation (네이버 예약 자동화)
```
