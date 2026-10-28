# 🌐 HairPass - Next.js Web Frontend (웹 프론트엔드)

> This is the **web frontend** for **HairPass**, the automated Naver Salon reservation platform. Built on Next.js (App Router) and TypeScript, it provides a user-friendly web environment for booking salon appointments, managing favorite salons and preferred designers, and tracking real-time reservation history.
>
> 네이버 미용실 자동 예약 플랫폼 **HairPass**의 **웹 프론트엔드**입니다. Next.js (App Router)와 TypeScript를 기반으로 구축되어 사용자가 미용실 예약 요청, 단골 미용실 및 선호 디자이너 즐겨찾기 관리, 예약 내역 실시간 확인 등을 편리하게 수행할 수 있는 웹 환경을 제공합니다.

---

## 🛠️ Tech Stack (기술 스택)

- **Framework**: Next.js (App Router, React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management & Data Fetching**: React Hooks, `@tanstack/react-query`

---

## ⚙️ Core Components (핵심 구성요소)

1. **`app/` - App Router (페이지 구조)**
   - `(auth)/`: Provides user authentication pages including login, signup, and Naver account integration. (로그인, 회원가입, 네이버 계정 연동 등 사용자 인증 페이지를 제공합니다.)
   - `(tabs)/`: Comprises main tab screens for reservation history (`bookings`), favorite management (`favorites`), and settings (`settings`). (예약 내역 관리, 단골 및 선호 디자이너 즐겨찾기, 앱 환경 설정 탭 화면을 구성합니다.)

2. **`components/` - UI Components (공통 UI 컴포넌트)**
   - Offers intuitive UI components such as interactive modal dialogs (date/time selection, service guides, and cautions) and reservation status badges. (직관적인 사용자 경험을 위한 각종 모달 컴포넌트 및 예약 상태 배지를 제공합니다.)

3. **`api/` & `hooks/` - API Integration & Hooks (API 연동 및 훅)**
   - Integrates with the Django backend REST API to securely manage authentication tokens and transmit booking payloads. (Django 백엔드 REST API와 연동하여 인증 토큰 관리 및 예약 데이터를 안전하게 송수신합니다.)

4. **`utils/` - Client Utilities (클라이언트 유틸리티)**
   - Executes client-side utility functions such as calendar date calculation logic and direct Naver booking link redirection (`window.open`). (날짜 계산 로직 및 네이버 예약 페이지 직접 연결 등의 클라이언트 유틸리티 기능을 수행합니다.)

---

## 📂 Directory Structure (디렉터리 구조)

```text
front_nextjs/
├── api/                    # Backend communication modules (백엔드 통신 모듈)
│   ├── auth/               # Authentication APIs (인증 관련 API)
│   ├── booking/            # Booking management APIs (예약 관련 API)
│   ├── common/             # Common shared APIs (공통 API)
│   ├── favorite/           # Favorites management APIs (즐겨찾기 관련 API)
│   ├── user/               # User profile APIs (유저 프로필 관련 API)
│   ├── client.ts           # HTTP client configuration (HTTP 클라이언트 설정)
│   └── token.ts            # Auth token management utilities (인증 토큰 관리 유틸리티)
├── app/                    # Next.js App Router page structure (App Router 페이지 구조)
│   ├── (auth)/             # Authentication group: login, signup, Naver link (인증 그룹)
│   ├── (tabs)/             # Main tab group: bookings, favorites, settings (메인 탭 그룹)
│   ├── globals.css         # Global stylesheets (전역 스타일)
│   ├── layout.tsx          # Root layout component (루트 레이아웃)
│   └── providers.tsx       # Global state and context providers (전역 상태 및 컨텍스트 프로바이더)
├── components/             # Reusable UI components (재사용 가능한 UI 컴포넌트)
│   ├── BookingStatusBadge.tsx # Reservation status indicator badge (예약 상태 표시 배지)
│   ├── DateSelectModal.tsx    # Date selection modal (날짜 선택 모달)
│   ├── RenderBookingItem.tsx  # Booking item rendering component (예약 아이템 렌더링 컴포넌트)
│   ├── ServiceCautionModal.tsx# Service precautions modal (시술 유의사항 모달)
│   ├── ServiceGuideModal.tsx  # Service guide modal (시술 가이드 모달)
│   └── TimeSelectModal.tsx    # Time selection modal (시간 선택 모달)
├── constants/              # Static constants and configurations (상수 데이터)
├── hooks/                  # Custom React hooks: auth, booking, favorite (커스텀 훅)
├── public/                 # Static assets: images and icons (정적 리소스)
├── types/                  # TypeScript types and interface definitions (타입 및 인터페이스 정의)
├── utils/                  # Client utility functions (유틸리티 함수)
│   ├── getDaysInMonth.ts      # Monthly days calculation (월별 일수 계산)
│   ├── handleDeleteBooking.ts # Booking deletion handler (예약 삭제 핸들러)
│   └── handleOpenNaverBooking.ts # Naver booking link opener (네이버 예약 링크 오픈)
├── .env                    # Environment variables (환경 변수 설정)
├── next.config.ts          # Next.js configuration (Next.js 설정)
├── package.json            # Package dependencies list (패키지 의존성 목록)
└── tsconfig.json           # TypeScript configuration (TypeScript 설정)
```
