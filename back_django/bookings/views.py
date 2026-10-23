import requests
from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer
from rest_framework.permissions import IsAuthenticated
import os
from dotenv import load_dotenv
from utils.notification import send_expo_push_notification

load_dotenv()


class BookingListCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).order_by("-created_at")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        salon_name = serializer.validated_data.get("salon_name")
        designer_name = serializer.validated_data.get("designer_name")
        menu_name = serializer.validated_data.get("menu_name")
        booking_date = serializer.validated_data.get("booking_date")
        booking_time = serializer.validated_data.get("booking_time")
        payment_method = serializer.validated_data.get("payment_method")

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
                    "message": f"예약을 완료하기 위해 {', '.join(missing_fields)} 정보를 알려주세요!",
                    "missing_fields": missing_fields,
                },
                status=status.HTTP_200_OK,
            )

        booking = serializer.save(user=self.request.user)

        # ---------------------------------------------------------
        # FastAPI 서버 연동
        # ---------------------------------------------------------
        try:
            fastapi_url = f"{os.getenv('FASTAPI_BASE_URL')}/api/v1/auto-booking"

            payload = {
                "user_id": request.user.id,
                "booking_id": booking.id,
                "salon_name": booking.salon_name,
                "booking_date": str(booking.booking_date),
                "booking_time": str(booking.booking_time),
                "designer_name": booking.designer_name,
                "menu_name": booking.menu_name,
                "payment_method": booking.payment_method,
                "naver_id": request.user.naver_id,
                "naver_pw": request.user.naver_pw,
            }

            res = requests.post(fastapi_url, json=payload, timeout=5)

            if res.status_code == 200:
                booking.status = "PENDING"
                booking.save()
            else:
                booking.status = "FAILED"
                booking.memo = "FastAPI 서버 연동 실패"
                booking.save()

        except requests.exceptions.RequestException as e:
            booking.status = "FAILED"
            booking.memo = f"Automation Trigger Error: {str(e)}"
            booking.save()

        response_serializer = self.get_serializer(booking)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


###############################################################################


class BookingDetailDeleteView(generics.DestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)


###############################################################################


class BookingFinishView(generics.UpdateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def get_object(self):
        booking_id = self.request.data.get("booking_id")
        return generics.get_object_or_404(Booking, id=booking_id)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data.copy()

        if "error_message" in data:
            data["memo"] = data.get("error_message")

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # ---------------------------------------------------------
        # 푸시 알림 발송
        # ---------------------------------------------------------
        user = instance.user
        booking_status = data.get("status")
        salon_name = instance.salon_name or "요청한 미용실"

        if user and user.push_token:
            print("💈 예약 상태:", booking_status)

            if booking_status == "CONFIRMED":
                title = "예약 성공 ✅"
                body = f"[{salon_name}] 예약에 성공했습니다."
            else:
                title = "예약 실패 ⚠️"
                body = f"[{salon_name}] 예약에 실패했습니다."

            send_expo_push_notification(
                push_token=user.push_token,
                title=title,
                body=body,
                data={
                    "bookingId": instance.id,
                    "status": booking_status,
                    "url": "/(tabs)/bookings",
                },
            )

        return Response(
            {
                "message": "예약 정보가 성공적으로 동기화되었습니다.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
