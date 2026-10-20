from playwright.async_api import Page
from agent.state import BookingState
from openai import OpenAI
import os
from dotenv import load_dotenv
import json
import re

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def make_node_open_salon(page: Page):
    """page를 포획하는 1단계 노드 팩토리"""

    async def node_open_salon(state: BookingState):
        print("👉 [Node] 미용실 예약 페이지 접속 및 일정 선택 중...")
        try:
            await page.goto(state["salon_url"], wait_until="domcontentloaded")
            await page.wait_for_timeout(2000)

            await page.evaluate("window.scrollTo(0, 0)")
            await page.wait_for_timeout(500)

            iframe = page.frame_locator("iframe#entryIframe")

            booking_main_btn = iframe.locator("[data-nlog-area='plc_btp.booking']")

            # 버튼이 보일 때까지 대기 후 클릭
            await booking_main_btn.wait_for(state="visible", timeout=5000)
            await booking_main_btn.click()

            # 예약 탭 로딩 대기 (필요시 iframe 내부 전환 대기)
            await page.wait_for_timeout(2000)

            search_btn = iframe.locator("[data-nlog-area='mpl_dgr.btime']")
            await search_btn.wait_for(state="visible", timeout=5000)
            await search_btn.click()

            return {"current_step": "select_date"}
        except Exception as e:
            return {
                "is_success": False,
                "error_message": str(e),
                "current_step": "error",
            }

    return node_open_salon


#######################################################################


def make_node_select_date_and_time(page: Page):
    """page를 포획하는 2~3단계 노드 팩토리"""

    async def node_select_date_and_time(state: BookingState):
        print(
            f"👉 [Node] 날짜({state['target_date']}) 및 시간({state['target_time']}) 선택 중..."
        )
        try:
            iframe = page.frame_locator("iframe#entryIframe")

            # 날짜 선택 (.last로 이번 달 날짜 정확히 타겟팅)
            date_btn = (
                iframe.locator("a[data-nlog-area='plc_vtc.caldate']")
                .filter(has_text=state["target_date"])
                .last
            )
            await date_btn.click()
            await page.wait_for_timeout(1500)

            # 시간 선택
            time_btn = iframe.locator("a", has_text=state["target_time"]).first
            await time_btn.click()
            await page.wait_for_timeout(1000)

            # 스타일리스트 검색 버튼 클릭
            search_designer_btn = iframe.locator(
                "a, button", has_text="스타일리스트 검색"
            ).first
            await search_designer_btn.click()

            return {"current_step": "select_designer"}
        except Exception as e:
            return {
                "is_success": False,
                "error_message": str(e),
                "current_step": "error",
            }

    return node_select_date_and_time


#######################################################################


def make_node_select_designer(page: Page):
    """4단계: 디자이너 카드 밑의 [N 예약] 버튼을 직접 클릭하는 노드 팩토리"""

    async def node_select_designer(state: BookingState):
        designer_name = state["designer_name"]
        print(f"👉 '{designer_name}' 디자이너의 [N 예약] 버튼 누르는 중...")

        try:
            iframe = page.frame_locator("iframe#entryIframe")

            # 순수 성함만으로 디자이너 카드 찾기 (어떤 직함이 붙어 있든 성함이 포함되어 있으므로 100% 매칭)
            designer_card = (
                iframe.locator("li.VLkJM").filter(has_text=designer_name).first
            )
            await designer_card.wait_for(state="visible", timeout=5000)

            # 예약 버튼 클릭
            direct_reserve_btn = designer_card.locator(
                "a[data-nlog-area='mpl_dgr.booking']"
            )
            await direct_reserve_btn.wait_for(state="visible", timeout=5000)
            await direct_reserve_btn.click()

            print(
                f"✨ [+ 디자이너 선택 완료] '{designer_name}' [N 예약] 버튼 직접 클릭 성공!"
            )
            await page.wait_for_timeout(1500)
            return {"current_step": "select_service"}

        except Exception as e:
            print(f"❌ [디자이너 선택 실패]: {e}")
            return {
                "is_success": False,
                "error_message": str(e),
                "current_step": "error",
            }

    return node_select_designer


#######################################################################


def make_node_select_service(page: Page):

    select_designer_node = make_node_select_designer(page)

    async def node_select_service(state: BookingState):
        category = state["service_category"]
        detail_menu = state["service_detail"]

        try:
            iframe = page.frame_locator("iframe#entryIframe")

            # 1. 대분류 탭 클릭
            category_btn = iframe.locator(
                "div.category_list button.category_item", has_text=category
            )
            await category_btn.wait_for(state="visible", timeout=5000)
            await category_btn.click()
            await page.wait_for_timeout(1000)

            # 2. 상세 시술 메뉴 선택
            menu_item = iframe.locator("li.option_item").filter(has_text=detail_menu)

            await menu_item.wait_for(state="visible", timeout=5000)
            await menu_item.click()
            await page.wait_for_timeout(1000)

            # 3. 하단 '다음 단계' 버튼 클릭
            next_btn = iframe.locator(
                "button[data-nlog-area='bok_floating.proceedtobook'], button.NextButton__btn_next__4hAoO",
                has_text="다음",
            ).first

            if await next_btn.count() > 0:
                await next_btn.click()
                print("🚀 ['다음 단계' 버튼 클릭 성공]")

            await page.wait_for_timeout(1500)

            # 💡 [여기!] 다음 단계로 넘어간 직후 로그인 창이 뜨는지 감지하는 안전장치 배치
            try:
                ######## 로그인 자동화 로직 추가
                await page.wait_for_timeout(1500)
                if "nid.naver.com" in page.url or "login" in page.url:
                    print("\n" + "=" * 50)
                    print("⚠️ [보안 감지] 네이버 로그인 페이지로 이동되었습니다!")
                    print("👉 브라우저 창에서 직접 네이버 로그인을 완료해 주세요.")
                    print("👉 로그인이 완료되면 자동으로 다음 단계가 진행됩니다.")
                    print("=" * 50 + "\n")

                    # BookingState 등에서 전달받은 naver_id, naver_pw 가져오기
                    # (예: state 딕셔너리 객체 혹은 변수명에 맞게 조정해 주세요)
                    naver_id = state.get("naver_id")
                    naver_pw = state.get("naver_pw")

                    if naver_id and naver_pw:
                        # 1. 아이디 입력 (id="id" 또는 input[name="id"])
                        await page.wait_for_selector("#id", state="visible")
                        await page.click("#id")
                        # 네이버는 한 번에 꽂아넣는 것보다 type이 안전합니다.
                        await page.type("#id", naver_id, delay=100)

                        # 2. 비밀번호 입력 (id="pw" 또는 input[name="pw"])
                        await page.wait_for_selector("#pw", state="visible")
                        await page.click("#pw")
                        await page.type("#pw", naver_pw, delay=100)

                        # 3. 로그인 버튼 클릭
                        await page.wait_for_selector("#loginBtn_row", state="visible")
                        await page.click("#loginBtn_row")
                        print(
                            "✨ [자동 로그인] 계정 정보 입력 및 로그인 버튼 클릭 완료!"
                        )
                    else:
                        print(
                            "❌ [오류] 에이전트 상태에 네이버 계정 정보(naver_id/naver_pw)가 없습니다."
                        )

                    # 사용자가 로그인을 완료하여 로그인 창이 사라질 때까지 대기
                    while "nid.naver.com" in page.url or "login" in page.url:
                        await page.wait_for_timeout(2000)

                    print(
                        "🔄 [리디렉션 완료] 네이버가 디자이너 선택 화면으로 복귀시켰습니다."
                    )
                    print(
                        "🚀 Playwright가 'select_designer' 노드로 돌아가 로직을 처음부터 재구행합니다!"
                    )

                    await select_designer_node(state)
                    return await node_select_service(state)

            except Exception as e:
                print(f"로그인 자동화 처리 중 예외 발생: {e}")

            return {"current_step": "payment"}  # 다음 6단계(결제)로 전이

        except Exception as e:
            print(f"❌ [시술 메뉴 선택 실패]: {e}")
            print(
                "🤖 [Self-Healing] 화면 내 시술 목록을 긁어와 AI로 올바른 명칭을 매칭합니다."
            )

            try:
                iframe = page.frame_locator("iframe#entryIframe")

                # 1. 현재 화면(iframe)의 모든 시술 항목 텍스트 긁어오기
                option_elements = await iframe.locator(
                    "li.option_item"
                ).all_inner_texts()

                # 텍스트 정제 (줄바꿈 제거 및 빈 값 제외)
                available_options = [
                    opt.replace("\n", " ").strip()
                    for opt in option_elements
                    if opt.strip()
                ]

                print(available_options)

                if not available_options:
                    raise Exception("화면에서 선택 가능한 시술 옵션을 찾지 못했습니다.")

                # 2. LLM에게 원래 요구사항과 실제 화면 목록을 주고 정확한 메뉴명 재추출
                prompt = f"""
                    사용자가 원래 원한 메뉴: "{detail_menu}"
                    현재 화면의 실제 전체 메뉴 목록:
                    {available_options}

                    [지침]
                    - 위 목록 중에서 사용자가 원하는 메뉴와 가장 잘 일치하는 항목을 찾으세요.
                    - 단, 가격이나 긴 설명글을 제외하고, 검색에 사용할 수 있는 **대표 메뉴 이름 핵심 단어(예: "남성커트", "여성커트", "컷+다운펌")** 만 짧게 추출하세요.

                    응답 포맷 (JSON):
                    {{"matched_keyword": "남성커트"}}
                """

                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[{"role": "user", "content": prompt}],
                    response_format={"type": "json_object"},
                )

                result = json.loads(response.choices[0].message.content or "{}")
                corrected_keyword = result.get("matched_keyword")

                print(f"✨ [AI 매칭 결과]: '{detail_menu}' ➔ '{corrected_keyword}'")

                if corrected_keyword:
                    escaped_keyword = re.escape(corrected_keyword.strip())
                    flexible_pattern = re.compile(r"\s*".join(escaped_keyword.split()))

                    # 정규식 패턴(re.compile)을 사용하여 텍스트 필터링
                    retry_item = (
                        iframe.locator("li.option_item")
                        .filter(has_text=flexible_pattern)
                        .first
                    )
                    await retry_item.wait_for(state="visible", timeout=4000)
                    await retry_item.click()
                    await page.wait_for_timeout(1000)

                    # 하단 '다음' 버튼 클릭
                    next_btn = iframe.locator(
                        "button[data-nlog-area='bok_floating.proceedtobook'], button.NextButton__btn_next__4hAoO",
                        has_text="다음",
                    ).first
                    if await next_btn.count() > 0:
                        await next_btn.click()

                    return {
                        "service_detail": corrected_keyword,  # state 갱신
                        "current_step": "payment",
                    }

            except Exception as healing_error:
                print(f"❌ [Self-Healing 복구 실패]: {healing_error}")

            # 최종 실패 시 에러 상태 반환
            return {
                "is_success": False,
                "error_message": str(e),
                "current_step": "error",
            }

    return node_select_service


#######################################################################


def make_node_select_payment_and_confirm(page: Page):
    """6단계: 결제 수단 선택, '동의하고 예약하기' 및 '계속 예약하기' 모달 처리 노드 팩토리"""

    async def node_select_payment_and_confirm(state: BookingState):
        payment_method = state.get("payment_method", "npay")
        print(f"👉 [Node] 결제 수단 선택 중: '{payment_method}'...")

        try:
            iframe = page.frame_locator("iframe#entryIframe")

            # 1. 결제 방식 선택
            if payment_method == "onsite":
                # 현장 결제 ("현금, 카드로 사장님께 결제하기")
                pay_label = iframe.locator("label.label").filter(
                    has_text="현금, 카드로 사장님께 결제하기"
                )
            else:
                # 네이버페이 결제 ("로 결제하기")
                pay_label = iframe.locator("label.label").filter(has_text="로 결제하기")

            await pay_label.wait_for(state="visible", timeout=5000)
            await pay_label.click()
            print(f"💳 [{payment_method} 결제 선택 완료]")
            await page.wait_for_timeout(1000)

            # 2. '동의하고 예약하기' 버튼 클릭
            submit_btn = iframe.locator(
                "button[data-nlog-area='bok_submitbutton.submit']"
            )
            await submit_btn.wait_for(state="visible", timeout=5000)
            await submit_btn.click()
            print("🚀 ['동의하고 예약하기' 버튼 클릭 완료]")
            await page.wait_for_timeout(1500)

            # 3. 네이버페이 멤버십 등 추가 안내 모달('계속 예약하기')이 뜨는 경우 처리
            try:
                continue_btn = iframe.locator(
                    "button.MembershipNudgeModal__btn_continue__xOZJE, button",
                    has_text="계속 예약하기",
                )
                if await continue_btn.is_visible(timeout=3000):
                    await continue_btn.click()
                    print("✨ ['계속 예약하기' 팝업 버튼 클릭 완료]")
                    await page.wait_for_timeout(1500)
            except Exception:
                # 팝업이 안 뜨는 결제 방식이거나 바로 완료 페이지로 넘어간 경우 통과
                pass

            print("🎉 [예약 성공] 모든 예약 절차가 정상적으로 완료되었습니다!")
            return {"current_step": "completed", "is_success": True}

        except Exception as e:
            print(f"❌ [결제/예약 확정 실패]: {e}")
            return {
                "is_success": False,
                "error_message": str(e),
                "current_step": "error",
            }

    return node_select_payment_and_confirm
