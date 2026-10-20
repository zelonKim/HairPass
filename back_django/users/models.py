from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class SocialProvider(models.TextChoices):
        LOCAL = "LOCAL", "일반 로그인"
        NAVER = "NAVER", "네이버 로그인"
        APPLE = "APPLE", "애플 로그인"

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

    push_token = models.CharField(
        max_length=255, blank=True, null=True, verbose_name="푸시 토큰"
    )

    naver_account_cookie = models.JSONField(
        blank=True,
        null=True,
        help_text="Playwright 세션용 네이버계정 쿠키정보 (JSON)",
    )

    naver_id = models.CharField(max_length=255, blank=True, null=True)
    naver_pw = models.CharField(max_length=255, blank=True, null=True)

    USERNAME_FIELD = "username"

    class Meta:
        verbose_name = "유저"
        verbose_name_plural = "유저 목록"

    def __str__(self):
        return f"[{self.get_social_provider_display()}] {self.username}"
