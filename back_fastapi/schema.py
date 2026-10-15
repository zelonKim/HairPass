from pydantic import BaseModel

class BookingRequest(BaseModel):
    salon_url: str
    target_date: str
    target_time: str
    designer_name: str
    service_category: str
    service_detail: str
    payment_method: str
