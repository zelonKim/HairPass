import requests
from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer
from rest_framework.permissions import AllowAny


class BookingListCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # 로그인한 사용자의 예약 내역만 조회
        return Booking.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        # 1. 요청 데이터 시리얼라이저 검증
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # 2. 필수 슬롯 누락 여부 검사
        salon_name = serializer.validated_data.get("salon_name")
        booking_date = serializer.validated_data.get("booking_date")
        booking_time = serializer.validated_data.get("booking_time")
        designer_name = serializer.validated_data.get("designer_name")
        menu_name = serializer.validated_data.get("menu_name")
        payment_method = serializer.validated_data.get("payment_method")

        # 핵심 정보 중 하나라도 비어있다면 슬롯 필링(대화형 되묻기) 응답 반환
        if (
            not salon_name
            or not booking_date
            or not booking_time
            or not designer_name
            or not menu_name
            or not payment_method
        ):
            missing_fields = []

            if not salon_name:
                missing_fields.append("미용실 이름")
            if not booking_date:
                missing_fields.append("예약 날짜")
            if not booking_time:
                missing_fields.append("예약 시간대")
            if not designer_name:
                missing_fields.append("담당 디자이너")
            if not menu_name:
                missing_fields.append("시술 메뉴")
            if not payment_method:
                missing_fields.append("결제 수단")

            return Response(
                {
                    "status": "need_more_info",
                    "message": f"예약을 완료하기 위해 다음 정보가 필요해요: {', '.join(missing_fields)}를(을) 알려주세요!",
                    "missing_fields": missing_fields,
                },
                status=status.HTTP_200_OK,  # 프론트엔드 채팅 UI에서 대화를 이어갈 수 있도록 200 OK 응답
            )

        # 4. Django DB에 'PENDING(대기중)' 상태로 먼저 안전하게 저장
        booking = serializer.save(user=self.request.user)

        # 5. FastAPI 자동화 서버 규격(BookingRequest)에 맞춰 페이로드 구성 후 트리거 전송
        try:
            fastapi_url = getattr(
                settings,
                "FASTAPI_AUTO_BOOKING_URL",
                "http://127.0.0.1:8001/api/v1/auto-booking",
            )

            payload = {
                "booking_id": booking.id,
                "salon_name": booking.salon_name,
                "booking_date": str(booking.booking_date),
                "booking_time": str(booking.booking_time),
                "designer_name": booking.designer_name,
                "menu_name": booking.menu_name,
                "payment_method": booking.payment_method,
            }

            # FastAPI 서버 백그라운드 태스크 트리거 발송
            res = requests.post(fastapi_url, json=payload, timeout=5)

            if res.status_code == 200:
                booking.status = "PENDING"  # 오토메이션 진행 중 상태 유지
                booking.save()
            else:
                booking.status = "FAILED"
                booking.memo = "FastAPI 서버 연동 실패"
                booking.save()

        except requests.exceptions.RequestException as e:
            booking.status = "FAILED"
            booking.memo = f"Automation Trigger Error: {str(e)}"
            booking.save()

        # 6. 최종 처리된 예약 객체 정보를 클라이언트에 반환
        response_serializer = self.get_serializer(booking)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


###############################################################################


class BookingDetailDeleteView(generics.DestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # 본인이 생성한 예약만 삭제 가능하도록 제한
        return Booking.objects.filter(user=self.request.user)


###############################################################################


class BookingConfirmedView(generics.UpdateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        # Body로 전달받은 booking_id로 DB 객체 조회
        booking_id = self.request.data.get("booking_id")
        return generics.get_object_or_404(Booking, id=booking_id)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # FastAPI에서 넘어온 데이터 매핑
        data = request.data.copy()

        if "error_message" in data:
            data["memo"] = data.get("error_message")

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(
            {
                "message": "예약 정보가 성공적으로 동기화되었습니다.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
