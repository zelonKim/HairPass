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
            f"✨ [Node] 날짜({state['target_year_month']}.{state['target_date']})"
            f" 시간({state['target_time']}) 선택 중..."
        )
        try:
            iframe = page.frame_locator("iframe#entryIframe")

            # -------------------------------------------------------------
            # 💡 1. 목표 연/월과 현재 캘린더 연/월을 비교하여 다음 달 버튼 조절
            # -------------------------------------------------------------
            target_ym = state.get("target_year_month")

            if target_ym:
                for _ in range(12):  # 최대 12달 탐색
                    print("📅 12달 탐색 시작!!")

                    current_ym_element = iframe.locator(
                        "div.ZDVM5 > strong.Acj85"
                    ).first

                    # 요소가 나타날 때까지 대기
                    await current_ym_element.wait_for(state="visible", timeout=3000)

                    current_ym = await current_ym_element.inner_text()
                    current_ym = current_ym.strip()

                    if current_ym == target_ym:
                        print("✨ 목표 월에 도달했습니다!")
                        break

                    # 아직 목표 달이 아니라면 '다음 달' 버튼 클릭
                    next_month_btn = iframe.locator(
                        "div.ZDVM5 > a[data-nlog-area='plc_vtc.nextMonth']"
                    ).first

                    # 버튼이 화면에 보일 때까지 대기
                    await next_month_btn.wait_for(state="visible", timeout=3000)

                    is_disabled = await next_month_btn.get_attribute("aria-disabled")
                    if is_disabled == "true":
                        print("⚠️ 더 이상 이동할 수 있는 다음 달이 없습니다.")
                        break

                    # 💡 핵심: Playwright 기본 클릭 대신 자바스크립트 강제 클릭 실행
                    print("▶️ 다음 달 버튼 JS 클릭 실행 중...", flush=True)
                    await next_month_btn.evaluate("el => el.click()")

                    # 캘린더가 갱신될 때까지 대기
                    for _ in range(15):
                        await page.wait_for_timeout(200)
                        new_ym = await iframe.locator(
                            "div.ZDVM5 > strong.Acj85"
                        ).first.inner_text()
                        if new_ym.strip() != current_ym:
                            print(
                                f"✨ 캘린더 월 변경 감지 성공: {new_ym.strip()}",
                                flush=True,
                            )
                            break

                    await page.wait_for_timeout(300)  # 안정화 대기

            # -------------------------------------------------------------
            # 2. 날짜 선택
            # -------------------------------------------------------------

            exact_date_pattern = re.compile(rf"^{state['target_date']}$")

            await page.wait_for_timeout(3000)

            date_btn = (
                iframe.locator(
                    "a[data-nlog-area='plc_vtc.caldate']:not([aria-disabled='true'])"
                )
                .filter(has_text=exact_date_pattern)
                .first
            )

            # 버튼이 화면에 완전히 나타날 때까지 대기 후 클릭
            await date_btn.wait_for(state="visible", timeout=3000)
            await date_btn.click()
            await page.wait_for_timeout(1500)

            # 3. 시간 선택
            time_btn = iframe.locator("a", has_text=state["target_time"]).first
            await time_btn.click()
            await page.wait_for_timeout(1000)

            # 4. 스타일리스트 검색 버튼 클릭
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

            # 2. 상세 시술 메뉴 선택 (정확히 일치하는 항목)
            menu_item = (
                iframe.locator("li.option_item").filter(has_text=detail_menu).first
            )
            await menu_item.wait_for(state="visible", timeout=5000)

            # 💡 [핵심] 실제 input 체크박스의 DOM 상태를 직접 확인하여 중복 클릭(토글 해제) 원천 차단
            checkbox_input = menu_item.locator("input[type='checkbox']")
            is_already_checked = False
            try:
                if await checkbox_input.count() > 0:
                    is_already_checked = await checkbox_input.is_checked()
            except Exception:
                pass

            if is_already_checked:
                print(
                    f"✨ [중복 클릭 방지] '{detail_menu}' 시술이 이미 체크되어 있어"
                    " 클릭을 스킵합니다.",
                    flush=True,
                )
            else:
                # 체크박스를 감싸고 있는 라벨 영역 클릭
                click_target = menu_item.locator("label.option_checkbox")
                if await click_target.count() == 0:
                    click_target = menu_item

                await click_target.click()
                print(f"✨ 시술 메뉴 [{detail_menu}] 선택 완료!", flush=True)
                await page.wait_for_timeout(1000)

            # 3. 하단 '다음 단계' 버튼 클릭
            next_btn = iframe.locator(
                "button[data-nlog-area='bok_floating.proceedtobook'],"
                " button.NextButton__btn_next__4hAoO",
                has_text="다음",
            ).first

            if await next_btn.count() > 0 and await next_btn.is_visible():
                await next_btn.click()
                print("🚀 ['다음 단계' 버튼 클릭 성공]", flush=True)

            await page.wait_for_timeout(1500)

            # 로그인 감지 및 자동화 로직
            try:
                await page.wait_for_timeout(3000)
                if "nid.naver.com" in page.url or "login" in page.url:
                    print("\n" + "=" * 50)
                    print("⚠️ [보안 감지] 네이버 로그인 페이지로 이동되었습니다!")
                    print("👉 브라우저 창에서 직접 네이버 로그인을 완료해 주세요.")
                    print("👉 로그인이 완료되면 자동으로 다음 단계가 진행됩니다.")
                    print("=" * 50 + "\n", flush=True)

                    naver_id = state.get("naver_id")
                    naver_pw = state.get("naver_pw")

                    if naver_id and naver_pw:
                        await page.wait_for_selector("#id", state="visible")
                        await page.click("#id")
                        await page.type("#id", naver_id, delay=100)

                        await page.wait_for_selector("#pw", state="visible")
                        await page.click("#pw")
                        await page.type("#pw", naver_pw, delay=100)

                        await page.wait_for_selector("#loginBtn_row", state="visible")
                        await page.click("#loginBtn_row")
                        print(
                            "✨ [자동 로그인] 계정 정보 입력 및 로그인 버튼 클릭 완료!",
                            flush=True,
                        )
                    else:
                        print(
                            "❌ [오류] 에이전트 상태에 네이버 계정 정보(naver_id/naver_pw)가"
                            " 없습니다.",
                            flush=True,
                        )

                    while "nid.naver.com" in page.url or "login" in page.url:
                        await page.wait_for_timeout(2000)

                    print(
                        "🔄 [리디렉션 완료] 네이버가 디자이너 선택 화면으로 복귀시켰습니다.",
                        flush=True,
                    )
                    print(
                        "🚀 Playwright가 'select_designer' 노드로 돌아가 로직을 처음부터"
                        " 재실행합니다!",
                        flush=True,
                    )

                    await select_designer_node(state)
                    return await node_select_service(state)

            except Exception as e:
                print(f"로그인 자동화 처리 중 예외 발생: {e}", flush=True)

            return {"current_step": "payment"}

        except Exception as e:
            print(f"❌ [시술 메뉴 선택 실패]: {e}", flush=True)
            print(
                "🤖 [Self-Healing] 화면 내 시술 목록을 긁어와 AI로 올바른 명칭을"
                " 매칭합니다.",
                flush=True,
            )

            try:
                iframe = page.frame_locator("iframe#entryIframe")

                option_elements = await iframe.locator(
                    "li.option_item"
                ).all_inner_texts()

                available_options = [
                    opt.replace("\n", " ").strip()
                    for opt in option_elements
                    if opt.strip()
                ]

                print(available_options, flush=True)

                if not available_options:
                    raise Exception("화면에서 선택 가능한 시술 옵션을 찾지 못했습니다.")

                prompt = f"""
                    사용자가 원래 원한 메뉴: "{detail_menu}"
                    현재 화면의 실제 전체 메뉴 목록:
                    {available_options}

                    [지침]
                    - 위 목록 중에서 사용자가 원하는 메뉴와 가장 잘 일치하는 항목을 찾으세요.
                    - 단, 가격이나 긴 설명글을 제외하고, 검색에 사용할 수 있는 **대표 메뉴 이름 핵심 단어(예: "힐링스파 컷", "수분촉촉 찰랑컷")** 만 짧게 추출하세요.

                    응답 포맷 (JSON):
                    {{"matched_keyword": "힐링스파 컷"}}
                """

                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[{"role": "user", "content": prompt}],
                    response_format={"type": "json_object"},
                )

                result = json.loads(response.choices[0].message.content or "{}")
                corrected_keyword = result.get("matched_keyword")

                print(
                    f"✨ [AI 매칭 결과]: '{detail_menu}' ➔ '{corrected_keyword}'",
                    flush=True,
                )

                if corrected_keyword:
                    escaped_keyword = re.escape(corrected_keyword.strip())
                    flexible_pattern = re.compile(r"\s*".join(escaped_keyword.split()))

                    retry_item = (
                        iframe.locator("li.option_item")
                        .filter(has_text=flexible_pattern)
                        .first
                    )
                    await retry_item.wait_for(state="visible", timeout=4000)

                    # Self-Healing에서도 체크박스 상태 확인 후 클릭
                    retry_checkbox = retry_item.locator("input[type='checkbox']")
                    if (
                        await retry_checkbox.count() > 0
                        and await retry_checkbox.is_checked()
                    ):
                        print("✨ 이미 체크되어 있어 Self-Healing 클릭을 스킵합니다.")
                    else:
                        retry_target = retry_item.locator("label.option_checkbox")
                        if await retry_target.count() == 0:
                            retry_target = retry_item
                        await retry_target.click()

                    await page.wait_for_timeout(1000)

                    next_btn = iframe.locator(
                        "button[data-nlog-area='bok_floating.proceedtobook'],"
                        " button.NextButton__btn_next__4hAoO",
                        has_text="다음",
                    ).first
                    if await next_btn.count() > 0:
                        await next_btn.click()

                    return {
                        "service_detail": corrected_keyword,
                        "current_step": "payment",
                    }

            except Exception as healing_error:
                print(f"❌ [Self-Healing 복구 실패]: {healing_error}", flush=True)

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
