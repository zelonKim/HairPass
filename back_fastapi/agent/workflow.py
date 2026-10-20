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
    # 사용자별 고유 폴더로 세션 분리
    user_id = initial_state.get("user_id", "default_user")
    user_data_dir = os.path.expanduser(f"~/.playwright_profiles/user_{user_id}")

    naver_id = initial_state.get("naver_id")
    naver_pw = initial_state.get("naver_pw")

    print("🧾 네이버 계정:", naver_id, naver_pw)

    if os.path.exists(user_data_dir):
        try:
            shutil.rmtree(user_data_dir)
            print(f"🧹 [Playwright] 유저 {user_id}의 이전 프로필 세션 정리 완료")
        except Exception as e:
            print(f"⚠️ 프로필 정리 실패: {e}")

    async with async_playwright() as p:
        context = await p.chromium.launch_persistent_context(
            user_data_dir=user_data_dir,
            headless=False,  # 개발 중에는 False, 배포 시 True
            # 💡 PC 전용 데스크톱 User-Agent 설정
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},  # PC용 넉넉한 뷰포트 크기
            args=[
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-blink-features=AutomationControlled",  # 봇 탐지 방지
            ],
        )

        page = context.pages[0] if context.pages else await context.new_page()

        await page.wait_for_timeout(1000)

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
