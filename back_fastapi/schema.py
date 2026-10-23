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


class NormalizedBookingState(BaseModel):
    target_year_month: str
    target_date: str
    target_time: str
    designer_name: str
    service_category: str
    service_detail: str
    payment_method: str
