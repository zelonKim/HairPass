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
import shutil


async def run_booking_agent(initial_state: BookingState):
    user_id = initial_state.get("user_id", "default_user")
    user_data_dir = os.path.expanduser(f"~/.playwright_profiles/user_{user_id}")

    if os.path.exists(user_data_dir):
        try:
            shutil.rmtree(user_data_dir)
            print(f"🧹 유저 {user_id}의 이전 프로필 세션 정리 완료")
        except Exception as e:
            print(f"⚠️ 프로필 세션 정리 실패: {e}")

    async with async_playwright() as p:
        context = await p.chromium.launch_persistent_context(
            user_data_dir=user_data_dir,
            headless=True,
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
            args=[
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-blink-features=AutomationControlled",
            ],
        )

        page = context.pages[0] if context.pages else await context.new_page()

        await page.wait_for_timeout(1000)

        # 1. 그래프 생성
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

        # 4. 엣지 연결
        workflow.set_entry_point("open_salon")
        workflow.add_edge("open_salon", "select_date_time")
        workflow.add_edge("select_date_time", "select_designer")
        workflow.add_edge("select_designer", "select_service")
        workflow.add_edge("select_service", "select_payment")
        workflow.add_edge("select_payment", END)

        # 5. 컴파일 및 실행
        app = workflow.compile()

        print("👉 [LangGraph 자동화 에이전트 구동 시작]")
        result = await app.ainvoke(initial_state)  # type: ignore

        await page.wait_for_timeout(3000)
        await context.close()
        return result
