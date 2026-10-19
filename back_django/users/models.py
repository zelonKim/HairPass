from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class SocialProvider(models.TextChoices):
        LOCAL = "LOCAL", "일반 가입"
        KAKAO = "KAKAO", "카카오"
        NAVER = "NAVER", "네이버"
        GOOGLE = "GOOGLE", "구글"

    # 소셜 제공자 (기본값: 일반 가입)
    social_provider = models.CharField(
        max_length=10,
        choices=SocialProvider.choices,
        default=SocialProvider.LOCAL,
        verbose_name="가입 경로",
    )

    # 소셜 플랫폼에서 넘겨주는 고유 유저 ID
    social_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        unique=True,
        verbose_name="소셜 고유 ID",
    )

    # 소셜 프로필 이미지 URL
    profile_image_url = models.URLField(
        max_length=500, blank=True, null=True, verbose_name="프로필 이미지 URL"
    )

    #  단골 미용실
    favorite_salon = models.CharField(blank=True, null=True, verbose_name="단골 미용실")

    #  선호하는 디자이너 이름
    favorite_designer = models.CharField(
        max_length=50, blank=True, null=True, verbose_name="선호 디자이너"
    )

    # 자주 받는 시술 메뉴
    favorite_menu = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="선호 시술 메뉴"
    )

    # 방문 주기 (주 단위)
    booking_cycle_weeks = models.IntegerField(default=3, verbose_name="방문 주기 (주)")

    # 마지막으로 머리 한 날짜
    last_booking_date = models.DateField(
        blank=True, null=True, verbose_name="최근 방문일"
    )

    push_token = models.CharField(
        max_length=255, blank=True, null=True, verbose_name="푸시 토큰"
    )

    USERNAME_FIELD = "username"

    class Meta:
        verbose_name = "유저"
        verbose_name_plural = "유저 목록"

    def __str__(self):
        return f"[{self.get_social_provider_display()}] {self.username}"
