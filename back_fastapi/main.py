from agent.state import BookingState
from agent.workflow import run_booking_agent
from fastapi import BackgroundTasks, FastAPI
from pydantic import BaseModel
from schema import BookingRequest


app = FastAPI(title="HairPass AI Agent Server")


@app.get("/")
def read_root():
    return {"message": "Agent Server is running!"}


@app.post("/api/v1/auto-booking")
async def trigger_auto_booking(req: BookingRequest, background_tasks: BackgroundTasks):
    """미용실 자동 예약 에이전트를 트리거하는 API 엔드포인트"""

    # 2. 에이전트 초기 상태(State) 구성
    initial_state: BookingState = {
        "salon_url": req.salon_url,
        "target_date": req.target_date,
        "target_time": req.target_time,
        "designer_name": req.designer_name,
        "service_category": req.service_category,
        "service_detail": req.service_detail,
        "payment_method": req.payment_method,
        "current_step": "start",
        "error_message": None,
        "is_success": False,
    }

    # 3. Playwright 브라우저 제어는 시간이 다소 소요되므로 FastAPI BackgroundTasks를 활용해 비동기 백그라운드 작업으로 실행
    # (즉시 응답을 돌려주고 서버 백그라운드에서 브라우저가 자동 예약 수행)
    background_tasks.add_task(run_booking_agent, initial_state)

    return {
        "status": "accepted",
        "message": "HairPass AI 에이전트가 백그라운드에서 예약을 했습니다.",
        "payload": req.dict(),
    }
