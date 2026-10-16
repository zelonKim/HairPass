from django.db import models
from django.conf import settings


class Booking(models.Model):
    class BookingStatus(models.TextChoices):
        PENDING = "PENDING", "예약 대기"
        CONFIRMED = "CONFIRMED", "예약 확정"
        COMPLETED = "COMPLETED", "방문 완료"
        CANCELLED = "CANCELLED", "예약 취소"
        FAILED = "FAILED", "예약 실패"

    class PaymentMethod(models.TextChoices):
        NPAY = "NPAY", "네이버 페이로 결제"
        ONSITE = "ONSITE", "현장에서 결제"

    # 예약자 (User)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bookings",
        verbose_name="유저",
    )

    # 예약 정보
    salon_name = models.CharField(
        blank=True, null=True, max_length=100, verbose_name="미용실 이름"
    )
    booking_date = models.DateField(blank=True, null=True, verbose_name="예약 날짜")

    booking_time = models.TimeField(blank=True, null=True, verbose_name="예약 시간")



    designer_name = models.CharField(
        blank=True, null=True, max_length=50, verbose_name="담당 디자이너"
    )
    menu_name = models.CharField(
        blank=True, null=True, max_length=100, verbose_name="시술 메뉴"
    )

    payment_method = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        choices=PaymentMethod.choices,
        verbose_name="결제 방법",
    )

    status = models.CharField(
        max_length=20,
        choices=BookingStatus.choices,
        default=BookingStatus.PENDING,
        verbose_name="예약 상태",
    )

    # 네이버 예약 시스템 연동 키/상태
    naver_booking_id = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="네이버 예약번호"
    )
    
    # 에이전트 자동화 실행 로그
    memo = models.TextField(blank=True, null=True, verbose_name="메모/로그")

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="신청일시")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="수정일시")

    class Meta:
        verbose_name = "예약 내역"
        verbose_name_plural = "예약 내역 목록"
        ordering = ["-booking_date", "-booking_time"]

    def __str__(self):
        return f"[{self.get_status_display()}] {self.user.username} - {self.salon_name} ({self.booking_date} {self.booking_time})"
