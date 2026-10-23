# 💻 HairPass - DRF Backend Server

네이버 미용실 자동 예약 플랫폼 **HairPass**의 **메인 백엔드 서버**입니다. Django 및 Django REST Framework(DRF)를 기반으로 구축되었으며, 사용자 관리, 예약 비즈니스 로직, 데이터베이스(Django ORM) 연동, 그리고 FastAPI 에이전트 서버와의 통신 및 푸시알림 처리를 담당합니다.

---

## 📂 디렉터리 구조 (Directory Structure)

```text
back_django/
├── bookings/               # 미용실 예약 및 즐겨찾기 관리 앱
│   ├── migrations/         # DB 마이그레이션 파일
│   ├── admin.py            # Django 어드민 설정
│   ├── apps.py
│   ├── models.py           # 예약 및 즐겨찾기 데이터 모델
│   ├── serializers.py      # DRF 데이터 직렬화/역직렬화
│   ├── urls.py             # 예약 관련 API 라우팅
│   └── views.py            # 예약 요청 및 처리 뷰 로직
├── config/                 # 프로젝트 전역 설정
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py         # 환경 설정 (DB, 앱 등록, 미들웨어 등)
│   ├── urls.py             # 전역 URL 라우팅
│   └── wsgi.py
├── users/                  # 사용자 관리 및 인증 앱
│   ├── migrations/         # DB 마이그레이션 파일
│   ├── admin.py
│   ├── apps.py
│   ├── models.py           # 커스텀 유저 모델
│   ├── serializers.py      # 유저 인증 및 프로필 직렬화
│   ├── urls.py             # 유저 관련 API 라우팅
│   └── views.py            # 회원가입, 로그인, 프로필 뷰
├── utils/                  # 공통 유틸리티
│   └── notification.py     # 예약 완료 푸시알림 처리 로직
├── venv/                   # Python 가상 환경
├── .env                    # 환경 변수 설정
├── .gitignore
├── manage.py               # Django 관리 명령어 유틸리티
├── README.md               # 디렉터리 문서
└── requirements.txt        # 파이썬 패키지 의존성 목록
```

---

## 🛠️ 기술 스택 (Tech Stack)

- **Framework**: Django, Django REST Framework (DRF)
- **Database**: Django ORM / PostgreSQL
- **Language**: Python 3.13

---

## ⚙️ 핵심 구성요소 (Core Components)

1. **`config/` (Project Configuration)**
   - `settings.py`: 데이터베이스 설정, 보안 키, 인스톨된 앱 목록 등 프로젝트 전역 환경을 관리합니다.
   - `urls.py`: `users` 및 `bookings` 앱의 API 엔드포인트를 통합 연결하는 전역 라우터 역할을 합니다.
2. **`users/` (User Management App)**
   - 사용자 계정 정보, 소셜 로그인 및 토큰 인증 시스템을 구축하여 클라이언트(Next.js/Expo)와의 세션을 관리합니다.
3. **`bookings/` (Booking & Favorite App)**
   - `models.py`: Django ORM을 활용해 사용자, 미용실, 담당 디자이너, 시술 메뉴, 예약 날짜/시간, 즐겨찾기(단골 미용실/선호 디자이너) 데이터를 구조화합니다.
   - `serializers.py` & `views.py`: 클라이언트의 요청을 받아 데이터를 검증하고, FastAPI 에이전트 서버로 자동 예약 작업을 트리거합니다.
4. **`utils/`**
   - `notification.py`: 에이전트가 예약을 완료한 후 발생하는 콜백을 받아 사용자에게 푸시알림을 전송하는 로직을 담당합니다.
