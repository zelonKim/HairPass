from django.urls import path
from .views import (
    SignupView,
    LoginView,
    FavoriteView,
    UserInfoView,
    WithdrawView,
    NaverCookieView,
    NaverAccountView,
    PushTokenView,
)

urlpatterns = [
    path("", UserInfoView.as_view(), name="user-info"),
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("favorite/", FavoriteView.as_view(), name="favorite"),
    path("withdraw/", WithdrawView.as_view(), name="withdraw"),
    path("naver-cookie/", NaverCookieView.as_view(), name="naver-cookie"),
    path("naver-account/", NaverAccountView.as_view(), name="naver-account"),
    path("push-token/", PushTokenView.as_view(), name="push-token"),
]
