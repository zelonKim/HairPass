from typing import TypedDict


class BookingState(TypedDict):
    user_id: int
    salon_url: str
    target_year_month: str
    target_date: str
    target_time: str
    designer_name: str
    service_category: str
    service_detail: str
    payment_method: str
    naver_id: str
    naver_pw: str
    current_step: str
    error_message: str | None
    is_success: bool
