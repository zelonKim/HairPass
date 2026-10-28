# 💻 HairPass - DRF Main Backend Server (Django REST Framework 메인 백엔드 서버)

> This is the **main backend server** for **HairPass**, the automated Naver Salon reservation platform. Built on Django and Django REST Framework (DRF), it handles user management, booking business logic, database integration (Django ORM), communication with the FastAPI agent server, and push notification delivery.
>
> 네이버 미용실 자동 예약 플랫폼 **HairPass**의 **메인 백엔드 서버**입니다. Django 및 Django REST Framework(DRF)를 기반으로 구축되었으며, 사용자 관리, 예약 비즈니스 로직, 데이터베이스(Django ORM) 연동, 그리고 FastAPI 에이전트 서버와의 통신 및 푸시알림 처리를 담당합니다.

---

## 🛠️ Tech Stack (기술 스택)

- **Framework**: Django, Django REST Framework (DRF)
- **Database & ORM**: PostgreSQL, Django ORM
- **Language**: Python 3.13+

---

## ⚙️ Core Components (핵심 구성요소)

1. **`config/` - Project Configuration (프로젝트 전역 설정)**
   - `settings.py`: Manages global settings including database configurations, security keys, and installed applications. (데이터베이스 설정, 보안 키, 인스톨된 앱 목록 등 프로젝트 전역 환경을 관리합니다.)
   - `urls.py`: Acts as the primary router integrating API endpoints from `users` and `bookings` apps. (`users` 및 `bookings` 앱의 API 엔드포인트를 통합 연결하는 전역 라우터 역할을 합니다.)

2. **`users/` - User Management App (사용자 관리 앱)**
   - Manages user profiles, social authentication, and token verification for client sessions across Next.js and Expo apps. (사용자 계정 정보, 소셜 로그인 및 토큰 인증 시스템을 구축하여 클라이언트(Next.js/Expo)와의 세션을 관리합니다.)

3. **`bookings/` - Booking & Favorite App (예약 및 즐겨찾기 앱)**
   - `models.py`: Leverages Django ORM to structure data for users, salons, designers, treatment menus, booking schedules, and favorite settings. (Django ORM을 활용해 사용자, 미용실, 담당 디자이너, 시술 메뉴, 예약 날짜/시간, 즐겨찾기 데이터 모델을 구조화합니다.)
   - `serializers.py` & `views.py`: Validates client payload requests and triggers automated booking agent tasks on the FastAPI server. (클라이언트의 요청을 받아 데이터를 검증하고, FastAPI 에이전트 서버로 자동 예약 작업을 트리거합니다.)

4. **`utils/` - Utility Functions (유틸리티 함수)**
   - `notification.py`: Handles push notification delivery to users upon receiving completion callbacks from the AI agent server. (에이전트가 예약을 완료한 후 발생하는 콜백을 받아 사용자에게 푸시알림을 전송하는 로직을 담당합니다.)

---

## 📂 Directory Structure (디렉터리 구조)

```text
back_django/
├── bookings/               # Salon booking and favorites management app (미용실 예약 및 즐겨찾기 관리 앱)
│   ├── migrations/         # DB migration files (DB 마이그레이션 파일)
│   ├── admin.py            # Django admin configuration (Django 어드민 설정)
│   ├── apps.py
│   ├── models.py           # Data models for bookings and favorites (예약 및 즐겨찾기 데이터 모델)
│   ├── serializers.py      # DRF serializers for request/response payloads (DRF 데이터 직렬화/역직렬화)
│   ├── urls.py             # Booking API route endpoints (예약 관련 API 라우팅)
│   └── views.py            # Booking request and processing view logic (예약 요청 및 처리 뷰 로직)
├── config/                 # Global project settings (프로젝트 전역 설정)
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py         # Global settings: DB, apps, middleware (환경 설정: DB, 앱 등록, 미들웨어 등)
│   ├── urls.py             # Root URL router (전역 URL 라우팅)
│   └── wsgi.py
├── users/                  # User management and authentication app (사용자 관리 및 인증 앱)
│   ├── migrations/         # DB migration files (DB 마이그레이션 파일)
│   ├── admin.py
│   ├── apps.py
│   ├── models.py           # Custom user model (커스텀 유저 모델)
│   ├── serializers.py      # User authentication and profile serializers (유저 인증 및 프로필 직렬화)
│   ├── urls.py             # User API route endpoints (유저 관련 API 라우팅)
│   └── views.py            # Registration, authentication, and profile views (회원가입, 로그인, 프로필 뷰)
├── utils/                  # Shared utility functions (공통 유틸리티)
│   └── notification.py     # Push notification handler for booking updates (예약 완료 푸시알림 처리 로직)
├── venv/                   # Python virtual environment (파이썬 가상 환경)
├── .env                    # Environment variable file (환경 변수 설정)
├── .gitignore
├── manage.py               # Django management utility (Django 관리 명령어 유틸리티)
├── README.md               # Directory documentation (디렉터리 문서)
└── requirements.txt        # Python dependencies list (파이썬 패키지 의존성 목록)
```
