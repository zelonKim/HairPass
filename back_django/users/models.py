from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    favorite_salon = models.CharField(blank=True, null=True, verbose_name="단골 미용실")

    favorite_designer = models.CharField(
        max_length=50, blank=True, null=True, verbose_name="선호 디자이너"
    )

    favorite_menu = models.CharField(
        max_length=100, blank=True, null=True, verbose_name="선호 시술 메뉴"
    )

    push_token = models.CharField(
        max_length=255, blank=True, null=True, verbose_name="푸시 토큰"
    )

    naver_id = models.CharField(max_length=255, blank=True, null=True)
    naver_pw = models.CharField(max_length=255, blank=True, null=True)

    USERNAME_FIELD = "username"

    class Meta:
        verbose_name = "유저"
        verbose_name_plural = "유저 목록"

    def __str__(self):
        return f"[{self.get_social_provider_display()}] {self.username}"
