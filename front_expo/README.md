# 📱 HairPass - React Native/Expo Mobile App Client (모바일 앱 클라이언트)

> This is the **mobile application client** for **HairPass**, the automated Naver Salon reservation platform. Built on React Native, Expo (Expo Router), and TypeScript, it provides a smartphone environment for users to easily request salon bookings, receive real-time push notifications, and instantly track reservation histories.
>
> 네이버 미용실 자동 예약 플랫폼 **HairPass**의 **모바일 애플리케이션 클라이언트**입니다. React Native, Expo (Expo Router), TypeScript를 기반으로 구축되어 사용자가 스마트폰 환경에서 간편하게 예약을 요청하고, 실시간 푸시알림을 수신하여 예약 내역을 즉시 확인할 수 있는 환경을 제공합니다.

---

## 🛠️ Tech Stack (기술 스택)

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **State Management & Data Fetching**: React Hooks, `@tanstack/react-query`
- **Push Notifications**: Expo Notifications, Firebase Cloud Messaging (FCM)

---

## ⚙️ Core Components (핵심 구성요소)

1. **`app/` - Expo Router (파일 기반 라우팅)**
   - `(auth)/`: Manages user authentication screens such as login, signup, and Naver account integration. (로그인, 회원가입, 네이버 계정 연동 등 인증 관련 화면을 관리합니다.)
   - `(tabs)/`: Provides navigation tab structure for switching between home, reservation history, favorite salons/designers, and app settings. (홈, 예약 내역 관리, 단골 미용실 및 선호 디자이너 즐겨찾기, 앱 설정을 전환할 수 있는 네비게이션 탭 구조를 제공합니다.)

2. **`utils/` - Push Notifications & Handlers (푸시알림 및 핸들러)**
   - `registerForPushNotificationsAsync.ts`: Requests mobile push notification permissions, generates FCM tokens, and registers them to the backend. (모바일 기기의 푸시알림 권한을 요청하고 FCM 토큰을 발급받아 백엔드에 등록합니다.)
   - `handleTogglePush.ts`: Configures and controls user push notification preferences. (사용자의 푸시알림 수신 여부를 설정하고 제어합니다.)
   - `handleOpenNaverBooking.ts`: Handles URL redirection and integration with Naver booking pages. (네이버 예약 페이지와 연동하여 링크를 처리합니다.)

3. **`api/` - API Integration (백엔드 통신 모듈)**
   - Communicates with the Django REST API backend to manage user authentication, booking creation/retrieval, and favorite data. (Django REST API 서버와 통신하여 사용자 인증, 예약 생성 및 조회, 즐겨찾기 데이터를 관리합니다.)

---

## 📂 Directory Structure (디렉터리 구조)

```text
front_expo/
├── api/                    # Backend communication modules (백엔드 통신 모듈)
│   ├── auth/               # Authentication APIs (인증 관련 API)
│   ├── booking/            # Booking management APIs (예약 관련 API)
│   ├── common/             # Common shared APIs (공통 API)
│   ├── favorite/           # Favorites management APIs (즐겨찾기 관련 API)
│   ├── user/               # User profile APIs (유저 프로필 관련 API)
│   ├── api-provider.tsx    # API provider configuration (API 프로바이더 설정)
│   ├── client.ts           # HTTP client configuration (HTTP 클라이언트 설정)
│   └── token.ts            # Auth token management utilities (인증 토큰 관리 유틸리티)
├── app/                    # Expo Router file-based routing (Expo Router 파일 기반 라우팅)
│   ├── (auth)/             # Authentication group: login, signup, Naver link (인증 그룹)
│   ├── (tabs)/             # Main tab group: home, bookings, favorites, settings (메인 탭 그룹)
│   ├── +html.tsx           # Web rendering HTML configuration (웹 렌더링 HTML 설정)
│   ├── +not-found.tsx      # 404 Not Found fallback screen (404 Not Found 화면)
│   └── modal.tsx           # Modal screen (모달 화면)
├── assets/                 # Static assets: images, icons, etc. (정적 리소스)
├── components/             # Reusable UI components (재사용 가능한 UI 컴포넌트)
├── constants/              # Static constants and configurations (상수 데이터)
├── hooks/                  # Custom React hooks: auth, booking, favorite (커스텀 훅)
├── node_modules/
├── types/                  # TypeScript type and interface definitions (타입 및 인터페이스 정의)
├── utils/                  # Mobile utility functions (모바일 유틸리티 함수)
│   ├── getDaysInMonth.ts          # Monthly days calculation (월별 일수 계산)
│   ├── handleDeleteBooking.ts     # Booking deletion handler (예약 삭제 핸들러)
│   ├── handleOpenNaverBooking.ts  # Naver booking link opener (네이버 예약 링크 오픈 핸들러)
│   ├── handleTogglePush.ts        # Push notification toggle handler (푸시알림 토글 핸들러)
│   └── registerForPushNotificationsAsync.ts # Push notification permissions & token registration (푸시알림 권한 및 토큰 등록)
├── .env                    # Environment variables (환경 변수 설정)
├── .gitignore
├── app.json                # Expo project configuration (Expo 프로젝트 설정)
├── eas.json                # EAS build and update configuration (EAS 빌드 및 업데이트 설정)
├── expo-env.d.ts           # Expo TypeScript environment types (Expo TypeScript 환경 타입)
├── google-services.json    # FCM (Firebase) push notification configuration (FCM 푸시알림 연동 설정 파일)
├── package.json            # Package dependencies list (패키지 의존성 목록)
└── tsconfig.json           # TypeScript configuration (TypeScript 설정)
```
