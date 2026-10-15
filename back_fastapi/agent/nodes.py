from playwright.async_api import Page
from agent.state import BookingState


def make_node_open_salon(page: Page):
    """page를 포획하는 1단계 노드 팩토리"""

    async def node_open_salon(state: BookingState):
        print("👉 [Node] 미용실 예약 페이지 접속 및 일정 선택 중...")
        try:
            # 💡 빠져있던 페이지 접속 로직 추가!
            await page.goto(state["salon_url"], wait_until="domcontentloaded")
            await page.wait_for_timeout(2000)
            await page.evaluate("window.scrollTo(0, 0)")
            await page.wait_for_timeout(500)

            iframe = page.frame_locator("iframe#entryIframe")
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
        print(f"👉 [Node] '{designer_name}' 디자이너의 [N 예약] 버튼 누르는 중...")
        try:
            iframe = page.frame_locator("iframe#entryIframe")

            # 1. 해당 디자이너 이름(예: "희정 실장", "지영 실장")이 들어있는 카드(li) 찾기
            designer_card = iframe.locator("li.VLkJM").filter(has_text=designer_name)

            # 2. 카드 안의 [N 예약] 버튼(data-nlog-area='mpl_dgr.booking') 타겟팅
            direct_reserve_btn = designer_card.locator(
                "a[data-nlog-area='mpl_dgr.booking']"
            )

            # 3. 버튼이 보일 때까지 대기 후 바로 클릭!
            await direct_reserve_btn.wait_for(state="visible", timeout=5000)
            await direct_reserve_btn.click()

            print(
                f"✨ [디자이너 선택 완료] '{designer_name}' [N 예약] 버튼 직접 클릭 성공!"
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
    """5단계: 시술 대분류 탭 클릭 후 상세 메뉴 선택 및 '다음 단계' 클릭 노드 팩토리"""

    async def node_select_service(state: BookingState):
        category = state["service_category"]
        detail_menu = state["service_detail"]
        print(
            f"👉 [Node] 시술 메뉴 선택 중: 대분류('{category}') -> 상세('{detail_menu}')"
        )

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
                print(f"🚀 ['다음 단계' 버튼 클릭 성공]")

            await page.wait_for_timeout(1500)

            # 💡 [여기!] 다음 단계로 넘어간 직후 로그인 창이 뜨는지 감지하는 안전장치 배치
            try:
                await page.wait_for_timeout(1500)

                # 짧은 시간 내에 로그인 요소가 나타나는지 확인
                if "nid.naver.com" in page.url or "login" in page.url:
                    print("\n" + "=" * 50)
                    print("⚠️ [보안 감지] 네이버 로그인 페이지로 이동되었습니다!")
                    print("👉 브라우저 창에서 직접 네이버 로그인을 완료해 주세요.")
                    print("👉 로그인이 완료되면 자동으로 다음 단계가 진행됩니다.")
                    print("=" * 50 + "\n")

                    # 사용자가 로그인을 완료하여 로그인 창이 사라질 때까지 대기
                    while "nid.naver.com" in page.url or "login" in page.url:
                        await page.wait_for_timeout(2000)
                    print("✨ [로그인 완료 확인] 자동화를 재개합니다!")

                    await page.wait_for_timeout(2000)
            except Exception:
                # 로그인 창이 뜨지 않았거나 이미 로그인된 상태라면 에러 없이 통과
                pass

            return {"current_step": "payment"}  # 다음 6단계(결제)로 전이

        except Exception as e:
            print(f"❌ [시술 메뉴 선택 실패]: {e}")
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
