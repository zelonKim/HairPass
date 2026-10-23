# 📱 HairPass - React Native (Expo) Mobile App Client

네이버 미용실 자동 예약 플랫폼 **HairPass**의 **모바일 애플리케이션 클라이언트**입니다. React Native, Expo (Expo Router), TypeScript를 기반으로 구축되어 사용자가 스마트폰 환경에서 간편하게 예약을 요청하고, 실시간 푸시알림을 수신하여 예약 내역을 즉시 확인할 수 있는 환경을 제공합니다.

---

## 📂 디렉터리 구조 (Directory Structure)

```text
front_expo/
├── api/                    # 백엔드(Django REST API) 통신 모듈
│   ├── auth/               # 인증 관련 API
│   ├── booking/            # 예약 관련 API
│   ├── common/             # 공통 API
│   ├── favorite/           # 즐겨찾기 관련 API
│   ├── user/               # 유저 프로필 관련 API
│   ├── api-provider.tsx    # API 프로바이더 설정
│   ├── client.ts           # HTTP 클라이언트 설정
│   └── token.ts            # 인증 토큰 관리 유틸리티
├── app/                    # Expo Router 파일 기반 라우팅
│   ├── (auth)/             # 인증 그룹 (로그인, 회원가입, 네이버 계정 연동)
│   ├── (tabs)/             # 메인 탭 그룹 (홈, 예약 내역, 즐겨찾기, 설정)
│   ├── +html.tsx           # 웹 렌더링 HTML 설정
│   ├── +not-found.tsx      # 404 Not Found 화면
│   └── modal.tsx           # 모달 화면
├── assets/                 # 이미지, 아이콘 등 정적 리소스
├── components/             # 재사용 가능한 UI 컴포넌트
├── constants/              # 상수 데이터
├── hooks/                  # 커스텀 훅 (auth, booking, favorite)
├── node_modules/
├── types/                  # TypeScript 타입 및 인터페이스 정의
├── utils/                  # 모바일 유틸리티 함수
│   ├── getDaysInMonth.ts          # 월별 일수 계산
│   ├── handleDeleteBooking.ts     # 예약 삭제 핸들러
│   ├── handleOpenNaverBooking.ts  # 네이버 예약 링크 오픈 핸들러
│   ├── handleTogglePush.ts        # 푸시알림 토글 핸들러
│   └── registerForPushNotificationsAsync.ts # 푸시알림 권한 및 토큰 등록
├── .env                    # 환경 변수 설정
├── .gitignore
├── app.json                # Expo 프로젝트 설정
├── eas.json                # EAS 빌드 및 업데이트 설정
├── expo-env.d.ts           # Expo TypeScript 환경 타입
├── google-services.json    # FCM(Firebase) 푸시알림 연동 설정 파일
├── package.json            # 패키지 의존성 목록
└── tsconfig.json           # TypeScript 설정
```

---

## 🛠️ 기술 스택 (Tech Stack)
* **Framework**: React Native (Expo)
* **Language**: TypeScript
* **State & Data Fetching**: React Hooks, `@tanstack/react-query`
* **Push Notifications**: Expo Notifications, Firebase Cloud Messaging (FCM)

---

## ⚙️ 핵심 구성요소 (Core Components)
1. **`app/` (Expo Router)**
   * `(auth)/`: 로그인, 회원가입, 네이버 계정 연동 등 인증 관련 화면을 관리합니다.
   * `(tabs)/`: 홈, 예약 내역 관리, 단골 미용실 및 선호 디자이너 즐겨찾기, 앱 설정을 전환할 수 있는 네비게이션 탭 구조를 제공합니다.

2. **`utils/` (Push Notifications & Handlers)**
   * `registerForPushNotificationsAsync.ts`: 모바일 기기의 푸시알림 권한을 요청하고 FCM 토큰을 발급받아 백엔드에 등록합니다.
   * `handleTogglePush.ts`: 사용자의 푸시알림 수신 여부를 설정하고 제어합니다.
   * `handleOpenNaverBooking.ts`: 네이버 예약 페이지와 연동하여 링크를 처리합니다.
   
3. **`api/`**
   * Django REST API 서버와 통신하여 사용자 인증, 예약 생성 및 조회, 즐겨찾기 데이터를 관리합니다.
