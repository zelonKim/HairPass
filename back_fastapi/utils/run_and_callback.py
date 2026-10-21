from agent.state import BookingState
from agent.workflow import run_booking_agent
import os
import httpx
from dotenv import load_dotenv

load_dotenv()


# 백그라운드에서 실행될 에이전트 구동 및 상태 콜백 함수
async def run_and_callback(initial_state: BookingState, booking_id: int):
    # 1. Playwright 에이전트 실행 (LangGraph)
    result = await run_booking_agent(initial_state)

    # 2. 결과 판정
    # result에 최종적으로 확정된 데이터(메뉴, 날짜, 상태 등)가 들어있음
    is_success = result.get("is_success")

    django_callback_url = f"{os.getenv('DJANGO_BASE_URL')}/api/bookings/finish/"

    callback_data = {
        "booking_id": booking_id,
        "status": "CONFIRMED" if is_success else "FAILED",
        "designer_name": result.get("designer_name"),
        "menu_name": result.get("service_detail"),
        "error_message": result.get("error_message", ""),
    }

    async with httpx.AsyncClient() as client:
        try:
            await client.patch(django_callback_url, json=callback_data, timeout=5.0)
            print("✨ [Django Callback 성공] 예약 상태 및 실제 검색 데이터 동기화 완료")
        except Exception as e:
            print(f"❌ [Django Callback 실패]: {e}")
