# 🌐 HairPass - Next.js Web Frontend
네이버 미용실 자동 예약 플랫폼 **HairPass**의 **웹 프론트엔드**입니다. Next.js (App Router)와 TypeScript를 기반으로 구축되어 사용자가 미용실 예약 요청, 단골 미용실 및 선호 디자이너 즐겨찾기 관리, 예약 내역 실시간 확인 등을 편리하게 수행할 수 있는 웹 환경을 제공합니다.

---

## 📂 디렉터리 구조 (Directory Structure)
```text
front_nextjs/
├── api/                    # 백엔드(Django REST API) 통신 모듈
│   ├── auth/               # 인증 관련 API
│   ├── booking/            # 예약 관련 API
│   ├── common/             # 공통 API
│   ├── favorite/           # 즐겨찾기 관련 API
│   ├── user/               # 유저 프로필 관련 API
│   ├── client.ts           # HTTP 클라이언트 설정
│   └── token.ts            # 인증 토큰 관리 유틸리티
├── app/                    # Next.js App Router 페이지 구조
│   ├── (auth)/             # 인증 그룹 (로그인, 회원가입, 네이버 계정 연동)
│   ├── (tabs)/             # 메인 탭 그룹 (예약 내역, 즐겨찾기, 설정)
│   ├── globals.css         # 전역 스타일
│   ├── layout.tsx          # 루트 레이아웃
│   └── providers.tsx       # 전역 상태 및 컨텍스트 프로바이더
├── components/             # 재사용 가능한 UI 컴포넌트
│   ├── BookingStatusBadge.tsx # 예약 상태 표시 배지
│   ├── DateSelectModal.tsx    # 날짜 선택 모달
│   ├── RenderBookingItem.tsx  # 예약 아이템 렌더링 컴포넌트
│   ├── ServiceCautionModal.tsx# 시술 유의사항 모달
│   ├── ServiceGuideModal.tsx  # 시술 가이드 모달
│   └── TimeSelectModal.tsx    # 시간 선택 모달
├── constants/              # 상수 데이터
├── hooks/                  # 커스텀 훅 (auth, booking, favorite)
├── public/                 # 정적 리소스 (이미지, 아이콘 등)
├── types/                  # TypeScript 타입 및 인터페이스 정의
├── utils/                  # 유틸리티 함수
│   ├── getDaysInMonth.ts      # 월별 일수 계산
│   ├── handleDeleteBooking.ts # 예약 삭제 핸들러
│   └── handleOpenNaverBooking.ts # 네이버 예약 링크 오픈
├── .env                    # 환경 변수 설정
├── next.config.ts          # Next.js 설정
├── package.json            # 패키지 의존성 목록
└── tsconfig.json           # TypeScript 설정
```

---

## 🛠️ 기술 스택 (Tech Stack)
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State & Data Fetching**: React Hooks, `@tanstack/react-query`

---

## ⚙️ 핵심 구성요소 (Core Components)
1. **`app/` (App Router)**
   - `(auth)/`: 로그인, 회원가입, 네이버 계정 연동 등 사용자 인증 페이지를 제공합니다.
   - `(tabs)/`: 예약 내역 관리(`bookings`), 단골 및 선호 디자이너 즐겨찾기(`favorites`), 앱 환경 설정(`settings`) 탭 화면을 구성합니다.
2. **`components/`**
   - 직관적인 사용자 경험을 위한 각종 모달 컴포넌트(날짜/시간 선택, 시술 가이드 및 유의사항 등)와 예약 상태 배지를 제공합니다.
3. **`api/` & `hooks/`**
   - Django 백엔드 REST API와 연동하여 인증 토큰 관리 및 예약 데이터를 안전하게 송수신합니다.
4. **`utils/`**
   - 날짜 계산 로직 및 네이버 예약 페이지 직접 연결(`window.open`) 등의 클라이언트 유틸리티 기능을 수행합니다.
