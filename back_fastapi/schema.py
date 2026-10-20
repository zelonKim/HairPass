from pydantic import BaseModel


class BookingRequest(BaseModel):
    user_id: int
    booking_id: int
    salon_name: str
    booking_date: str
    booking_time: str
    designer_name: str
    menu_name: str
    payment_method: str
    naver_id: str
    naver_pw: str


# LLM을 통해 정규화된 최종 에이전트 상태 스키마 (Playwright 입력용)
class NormalizedBookingState(BaseModel):
    target_date: str  # 예: "30" (1~31 숫자 형태)
    target_time: str  # 예: "17:00" 혹은 시(0):분(00) 규격
    designer_name: str  # 예: "하영 실장" (직함 포함)
    service_category: str  # 예: "컷", "컬러" 등 대분류
    service_detail: str  # 예: "여성컷", "일반염색" 등 소분류
    payment_method: str  # 예: "npay" 혹은 "onsite"
