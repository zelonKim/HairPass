from typing import Optional, TypedDict


class BookingState(TypedDict):
    user_id: int
    salon_url: str  # 네이버 예약 URL
    target_year_month: str
    target_date: str  # 목표 날짜 (예: "17")
    target_time: str  # 목표 시간 (예: "12:30")
    designer_name: str  # 선택할 디자이너 이름
    service_category: str  # 시술 대분류 (예: "컷", "펌")
    service_detail: str  # 상세 시술 메뉴 (예: "[남성] 디톡스컷")
    payment_method: str  # 결제 방식 ("naver_pay" 혹은 "onsite")
    naver_id: str
    naver_pw: str
    current_step: str  # 현재 진행 중인 단계
    error_message: str | None  # 에러 발생 시 메시지
    is_success: bool  # 예약 성공 여부
