import json
from openai import OpenAI
from schema import BookingRequest, NormalizedBookingState
import os
from dotenv import load_dotenv


load_dotenv()

# OpenAI 클라이언트 초기화
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def normalize_booking_data_with_llm(req: BookingRequest) -> NormalizedBookingState:
    prompt = f"""
        당신은 네이버 미용실 예약 자동화 시스템의 데이터 정규화 전문 AI입니다.
        사용자가 입력한 아래의 예약 요청 원본 데이터를 분석하여, Playwright 자동화 에이전트가 네이버 예약 화면을 정확히 조작할 수 있도록 규격화해 주세요.

        [사용자 입력 원본 데이터]
        - 예약 날짜: {req.booking_date}
        - 예약 시간: {req.booking_time}
        - 담당 디자이너: {req.designer_name}
        - 시술 메뉴: {req.menu_name}
        - 결제 수단: {req.payment_method}

        [필수 변환 및 매칭 규칙]
        1. target_date: 날짜 문자열에서 일(Day)에 해당하는 1부터 31 사이의 **숫자 문자열**만 추출해 주세요. (예: "30일" -> "30")
        2. target_time (매우 중요): 네이버 예약 시간 버튼에 표시되는 텍스트와 일치하도록 **12시간제 형태("시:분" 또는 "오후/오전 시:분")**로 변환해 주세요. 
        - 예시: 오후 3시 -> "3:00" (절대 "15:00"으로 변환하지 말 것! 네이버 UI는 "3:00" 형태로 표출됩니다.)
        - 예시: 오후 5시 -> "5:00"
        3. designer_name: 디자이너의 **순수 성함(이름)만** 추출해 주세요. (예: "소희 실장" -> "소희", "민지 디자이너" -> "민지", "소현쌤" -> "소현" 등 직함이나 호칭은 절대 포함하지 마세요.)
        4. service_category 및 service_detail (매우 중요): 
        - service_category는 네이버 예약의 상단 카테고리 탭 이름 중 하나여야 합니다. (예: "컷", "컬러", "펌", "클리닉", "세트", "드라이" 중 택 1)
        - service_detail은 해당 카테고리 내의 실제 시술 메뉴 이름과 정확히 일치하거나 유사해야 합니다. (예: "남성커트", "여성커트", "일반펌", "일반염색" 등)
        5. payment_method: "네이버페이" 관련 표현이면 "npay", "현장 결제" 관련 표현이면 "onsite"로 매핑해 주세요.

        반드시 아래의 JSON 포맷으로만 응답해 주세요. 다른 설명 텍스트는 포함하지 마세요.
        {{
            "target_date": "숫자만_추출된_일",
            "target_time": "3:00 또는 5:00 같은 12시간제 형식",
            "designer_name": "직함을 제외한 순수 이름",
            "service_category": "컷, 컬러, 펌 등 카테고리 탭 이름",
            "service_detail": "구체적인 시술 메뉴 이름",
            "payment_method": "npay 또는 onsite"
        }}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
    )

    raw_content = response.choices[0].message.content or "{}"
    result_dict = json.loads(raw_content)
    return NormalizedBookingState(**result_dict)
