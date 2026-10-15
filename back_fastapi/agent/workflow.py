from langgraph.graph import StateGraph, END
from agent.state import BookingState
from agent.nodes import (
    make_node_open_salon,
    make_node_select_date_and_time,
    make_node_select_designer,
    make_node_select_service,
    make_node_select_payment_and_confirm,
)
from playwright.async_api import async_playwright
import os


async def run_booking_agent(initial_state: BookingState):
    user_data_dir = os.path.expanduser("~/.playwright_naver_profile")

    async with async_playwright() as p:
        context = await p.chromium.launch_persistent_context(
            user_data_dir=user_data_dir, headless=False, args=["--start-maximized"]
        )
        page = context.pages[0] if context.pages else await context.new_page()

        # 1. Graph 생성
        workflow = StateGraph(BookingState)

        # 2. page 객체를 주입하여 각 노드 함수 생성
        open_salon_node = make_node_open_salon(page)
        select_date_node = make_node_select_date_and_time(page)
        select_designer_node = make_node_select_designer(page)
        select_service_node = make_node_select_service(page)
        select_payment_node = make_node_select_payment_and_confirm(page)

        # 3. 그래프 노드 등록
        workflow.add_node("open_salon", open_salon_node)
        workflow.add_node("select_date_time", select_date_node)
        workflow.add_node("select_designer", select_designer_node)
        workflow.add_node("select_service", select_service_node)
        workflow.add_node("select_payment", select_payment_node)

        # 4. 엣지 연결 (완전한 흐름)
        workflow.set_entry_point("open_salon")
        workflow.add_edge("open_salon", "select_date_time")
        workflow.add_edge("select_date_time", "select_designer")
        workflow.add_edge("select_designer", "select_service")
        workflow.add_edge("select_service", "select_payment")
        workflow.add_edge("select_payment", END)

        # 5. 컴파일 및 실행
        app = workflow.compile()

        print("👉 [LangGraph 미용실 예약 자동화 에이전트 구동 시작]")
        result = await app.ainvoke(initial_state)  # type: ignore

        await page.wait_for_timeout(3000)  # 완료 확인을 위해 잠시 대기
        await context.close()
        return result
