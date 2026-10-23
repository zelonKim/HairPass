from playwright.async_api import Page
from agent.state import BookingState
from openai import OpenAI
import os
from dotenv import load_dotenv
import json
import re

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# ----------------------------------
# 예약 페이지 접속을 위한 1단계 노드
# ----------------------------------
def make_node_open_salon(page: Page):

    async def node_open_salon(state: BookingState):
        print("💈 미용실 예약 페이지 접속 중...")
        try:
            await page.goto(state["salon_url"], wait_until="domcontentloaded")
            await page.wait_for_timeout(2000)

            await page.evaluate("window.scrollTo(0, 0)")
            await page.wait_for_timeout(500)

            iframe = page.frame_locator("iframe#entryIframe")

            booking_main_btn = iframe.locator("[data-nlog-area='plc_btp.booking']")
            await booking_main_btn.wait_for(state="visible", timeout=5000)
            await booking_main_btn.click()

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


############################################################################


# -------------------------------------------
# 예약 날짜 및 시간 선택을 위한 2단계 노드
# -------------------------------------------
def make_node_select_date_and_time(page: Page):

    async def node_select_date_and_time(state: BookingState):
        print(
            f"📆 날짜({state['target_year_month']}.{state['target_date']}) "
            f"🕰️ 시간({state['target_time']}) 선택 중..."
        )
        try:
            iframe = page.frame_locator("iframe#entryIframe")

            # 목표 연/월과 현재 캘린더 연/월을 비교한 후, 다음 달 버튼 클릭
            target_ym = state.get("target_year_month")

            if target_ym:
                for _ in range(12):
                    current_ym_element = iframe.locator(
                        "div.ZDVM5 > strong.Acj85"
                    ).first
                    await current_ym_element.wait_for(state="visible", timeout=3000)

                    current_ym = await current_ym_element.inner_text()
                    current_ym = current_ym.strip()

                    if current_ym == target_ym:
                        break

                    next_month_btn = iframe.locator(
                        "div.ZDVM5 > a[data-nlog-area='plc_vtc.nextMonth']"
                    ).first

                    await next_month_btn.wait_for(state="visible", timeout=3000)

                    is_disabled = await next_month_btn.get_attribute("aria-disabled")
                    if is_disabled == "true":
                        print("⚠️ 더 이상 이동할 수 있는 다음 달이 없습니다.")
                        break

                    await next_month_btn.evaluate("el => el.click()")

                    for _ in range(15):
                        await page.wait_for_timeout(200)
                        new_ym = await iframe.locator(
                            "div.ZDVM5 > strong.Acj85"
                        ).first.inner_text()
                        if new_ym.strip() != current_ym:
                            print(
                                f"캘린더 월 변경 감지: {new_ym.strip()}",
                                flush=True,
                            )
                            break

                    await page.wait_for_timeout(300)

            # 날짜 선택
            target_day_str = str(state["target_date"])

            await page.wait_for_timeout(1000)

            date_buttons = iframe.locator("a[data-nlog-area='plc_vtc.caldate']")
            count = await date_buttons.count()

            target_btn = None
            total_trs = await iframe.locator("tbody tr").count()

            for i in range(count):
                btn = date_buttons.nth(i)
                day_text_elem = btn.locator("div.rUGve")
                if await day_text_elem.count() == 0:
                    continue
                day_text = (await day_text_elem.inner_text()).strip()

                if day_text == target_day_str:
                    tr_element = btn.locator("xpath=ancestor::tr")
                    tr_index = await tr_element.evaluate(
                        "el => Array.from(el.parentNode.children).indexOf(el)"
                    )

                    if int(target_day_str) >= 20 and tr_index == 0:
                        continue
                    if int(target_day_str) <= 10 and tr_index == total_trs - 1:
                        continue

                    target_btn = btn
                    break

            if target_btn:
                await target_btn.wait_for(state="visible", timeout=3000)
                await target_btn.click()
                print(f"✨ {target_day_str}일 선택 완료!")
            else:
                raise Exception(
                    f"달력에서 이번 달 {target_day_str}일을 찾지 못했습니다."
                )

            await page.wait_for_timeout(1500)

            # 시간 선택
            time_btn = iframe.locator("a", has_text=state["target_time"]).first
            await time_btn.click()
            await page.wait_for_timeout(1000)

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


#############################################################################


# --------------------------------------
# 디자이너 선택을 위한 3단계 노드
# --------------------------------------
def make_node_select_designer(page: Page):

    async def node_select_designer(state: BookingState):
        designer_name = state["designer_name"]

        print(f"👉 '{designer_name}' 디자이너의 [N 예약] 버튼 누르는 중...")
        try:
            iframe = page.frame_locator("iframe#entryIframe")

            designer_card = (
                iframe.locator("li.VLkJM").filter(has_text=designer_name).first
            )
            await designer_card.wait_for(state="visible", timeout=5000)

            direct_reserve_btn = designer_card.locator(
                "a[data-nlog-area='mpl_dgr.booking']"
            )
            await direct_reserve_btn.wait_for(state="visible", timeout=5000)
            await direct_reserve_btn.click()
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


# -------------------------------------
# 시술 메뉴 선택을 위한 4단계 노드
# --------------------------------------
def make_node_select_service(page: Page):
    select_designer_node = make_node_select_designer(page)

    async def node_select_service(state: BookingState):
        category = state["service_category"]
        detail_menu = state["service_detail"]

        try:
            iframe = page.frame_locator("iframe#entryIframe")

            # 대분류 메뉴 탭 클릭
            category_btn = iframe.locator(
                "div.category_list button.category_item", has_text=category
            )
            await category_btn.wait_for(state="visible", timeout=5000)
            await category_btn.click()
            await page.wait_for_timeout(1000)

            # 상세 메뉴 탭 클릭
            menu_item = (
                iframe.locator("li.option_item").filter(has_text=detail_menu).first
            )
            await menu_item.wait_for(state="visible", timeout=5000)

            # 실제 input 체크박스의 DOM 상태를 직접 확인하여 중복 클릭 방지
            checkbox_input = menu_item.locator("input[type='checkbox']")
            is_already_checked = False

            try:
                if await checkbox_input.count() > 0:
                    is_already_checked = await checkbox_input.is_checked()
            except Exception:
                pass

            if is_already_checked:
                print(
                    f"✨ [중복 클릭 방지] '{detail_menu}' 시술이 이미 체크되어 있어 클릭을 건너뜁니다.",
                    flush=True,
                )
            else:
                click_target = menu_item.locator("label.option_checkbox")
                if await click_target.count() == 0:
                    click_target = menu_item

                await click_target.click()
                await page.wait_for_timeout(1000)

            next_btn = iframe.locator(
                "button[data-nlog-area='bok_floating.proceedtobook'],"
                " button.NextButton__btn_next__4hAoO",
                has_text="다음",
            ).first

            if await next_btn.count() > 0 and await next_btn.is_visible():
                await next_btn.click()

            await page.wait_for_timeout(1500)

            # 로그인 창 감지 및 자동화 로직
            try:
                await page.wait_for_timeout(3000)
                if "nid.naver.com" in page.url or "login" in page.url:
                    print("\n" + "=" * 50)
                    print("⚠️ 네이버 로그인 페이지로 이동되었습니다!")
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
                            "✨ 자동 로그인 완료",
                            flush=True,
                        )
                    else:
                        print(
                            "❌ [오류] 에이전트 상태에 네이버 계정 정보가 존재하지 않습니다.",
                            flush=True,
                        )

                    while "nid.naver.com" in page.url or "login" in page.url:
                        await page.wait_for_timeout(2000)

                    print(
                        "🔄 디자이너 선택 화면으로 리다이렉트 되었습니다.",
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
                "[Self-Healing] 화면 내 시술 목록을 긁어와 올바른 명칭을 매칭합니다.",
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
                    raise Exception("화면에서 선택 가능한 메뉴를 찾지 못했습니다.")

                prompt = f"""
                    사용자가 원래 원한 메뉴: "{detail_menu}"
                    현재 화면의 실제 전체 메뉴 목록:
                    {available_options}

                    [지침]
                    - 위 목록 중에서 사용자가 원하는 메뉴와 가장 잘 일치하는 항목을 찾으세요.
                    - 단, 가격이나 긴 설명글을 제외하고, 검색에 사용할 수 있는 **대표 메뉴 이름 핵심 단어(예: "남성컷, 여성컷, 힐링스파 컷", "수분촉촉 찰랑컷")** 만 짧게 추출하세요.

                    응답 포맷 (JSON):
                    {{"matched_keyword": "대표 메뉴 이름"}}
                """

                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[{"role": "user", "content": prompt}],
                    response_format={"type": "json_object"},
                )

                result = json.loads(response.choices[0].message.content or "{}")
                corrected_keyword = result.get("matched_keyword")

                print(
                    f"🤖 [AI 매칭 결과]: '{detail_menu}' ➔ '{corrected_keyword}'",
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

                    retry_checkbox = retry_item.locator("input[type='checkbox']")
                    if (
                        await retry_checkbox.count() > 0
                        and await retry_checkbox.is_checked()
                    ):
                        print("✨ 이미 체크되어 있어 Self-Healing을 건너뜁니다.")
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


####################################################################################


# -------------------------------------------------
# 결제수단 선택 및 예약 확정을 위한 5단계 노드
# -------------------------------------------------
def make_node_select_payment_and_confirm(page: Page):

    async def node_select_payment_and_confirm(state: BookingState):
        payment_method = state.get("payment_method", "npay")
        print(f"👉 결제 수단 선택 중: '{payment_method}'...")

        try:
            iframe = page.frame_locator("iframe#entryIframe")

            if payment_method == "onsite":
                # 현금 및 카드 결제
                pay_label = iframe.locator("label.label").filter(
                    has_text="현금, 카드로 사장님께 결제하기"
                )
            else:
                # 네이버페이 결제
                pay_label = iframe.locator("label.label").filter(has_text="로 결제하기")

            await pay_label.wait_for(state="visible", timeout=5000)
            await pay_label.click()
            await page.wait_for_timeout(1000)

            # '동의하고 예약하기' 버튼 클릭
            submit_btn = iframe.locator(
                "button[data-nlog-area='bok_submitbutton.submit']"
            )
            await submit_btn.wait_for(state="visible", timeout=5000)
            await submit_btn.click()
            await page.wait_for_timeout(1500)

            try:
                continue_btn = iframe.locator(
                    "button.MembershipNudgeModal__btn_continue__xOZJE, button",
                    has_text="계속 예약하기",
                )
                if await continue_btn.is_visible(timeout=3000):
                    await continue_btn.click()
                    print("✨ '계속 예약하기' 팝업 버튼 클릭 완료")
                    await page.wait_for_timeout(1500)
            except Exception:
                pass

            print("🎉 [예약 성공] 미용실 예약이 성공적으로 완료되었습니다!")
            return {"current_step": "completed", "is_success": True}

        except Exception as e:
            print(f"❌ [결제/예약 실패]: {e}")
            return {
                "is_success": False,
                "error_message": str(e),
                "current_step": "error",
            }

    return node_select_payment_and_confirm
