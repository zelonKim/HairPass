from agent.state import BookingState
from agent.workflow import run_booking_agent
from fastapi import BackgroundTasks, FastAPI
from pydantic import BaseModel
from openai import OpenAI
from schema import BookingRequest, NormalizedBookingState
from utils.normalizer import normalize_booking_data_with_llm
from playwright.async_api import async_playwright


app = FastAPI(title="HairPass AI Agent Server")


@app.get("/")
def read_root():
    return {"message": "Agent Server is running!"}


@app.post("/api/v1/auto-booking")
async def trigger_auto_booking(req: BookingRequest, background_tasks: BackgroundTasks):
    # 1. LLM을 통한 예약 데이터 지능형 규격화 수행
    normalized_data: NormalizedBookingState = normalize_booking_data_with_llm(req)

    print("\n" + "=" * 50)
    print("🤖 [AI 예약 정규화 결과]")
    print(f" - 예약 URL: {normalized_data.salon_url}")
    print(
        f" - 예약 날짜 & 시간: {normalized_data.target_date} & {normalized_data.target_time}"
    )
    print(f" - 담당 디자이너: {normalized_data.designer_name}")
    print(
        f" - 시술 메뉴: [{normalized_data.service_category}] - {normalized_data.service_detail}"
    )
    print(f" - 결제 수단:  {normalized_data.payment_method}")
    print("=" * 50 + "\n")

    # 2. Playwright 에이전트에 주입할 초기 상태(State) 구성
    initial_state: BookingState = {
        "salon_url": normalized_data.salon_url,
        "target_date": normalized_data.target_date,
        "target_time": normalized_data.target_time,
        "designer_name": normalized_data.designer_name,
        "service_category": normalized_data.service_category,
        "service_detail": normalized_data.service_detail,
        "payment_method": normalized_data.payment_method,
        "current_step": "start",
        "error_message": None,
        "is_success": False,
    }

    # 3. FastAPI BackgroundTasks를 통해 비동기로 Playwright 에이전트 실행
    background_tasks.add_task(run_booking_agent, initial_state)

    return {
        "status": "accepted",
        "message": "AI가 예약 데이터를 성공적으로 규격화하였고, 백그라운드에서 자동화 예약을 수행합니다.",
        "raw_payload": req.dict(),
        "normalized_payload": initial_state,
    }
