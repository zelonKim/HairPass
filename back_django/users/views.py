from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .serializers import SignupSerializer, LoginSerializer
from rest_framework.permissions import IsAuthenticated
from .serializers import FavoriteSerializer, UserInfoSerializer
from rest_framework.permissions import AllowAny


class SignupView(APIView):
    authentication_classes = ()
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = SignupSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response(
                {
                    "message": "회원가입이 완료되었습니다.",
                    "username": user.username,
                    "token": token.key,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


###############################################################################


class LoginView(APIView):
    authentication_classes = ()
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data["username"]
            password = serializer.validated_data["password"]
            user = authenticate(username=username, password=password)

            if user is not None:
                token, _ = Token.objects.get_or_create(user=user)
                return Response(
                    {
                        "message": "로그인 성공",
                        "token": token.key,
                        "username": user.username,
                    },
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"error": "아이디 또는 비밀번호가 올바르지 않습니다."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


###############################################################################


class FavoriteView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        serializer = FavoriteSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        serializer = FavoriteSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "선호 정보가 성공적으로 수정되었습니다.",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


##############################################################################


class UserInfoView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        serializer = UserInfoSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        serializer = UserInfoSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


##############################################################################


class WithdrawView(APIView):
    permission_classes = (IsAuthenticated,)

    def delete(self, request):
        user = request.user
        user.delete()
        return Response(
            {"message": "회원 탈퇴가 완료되었습니다."},
            status=status.HTTP_204_NO_CONTENT,
        )


##############################################################################


class NaverCookieView(APIView):
    permission_classes = (IsAuthenticated,)

    def patch(self, request):
        user = request.user
        raw_cookies = request.data.get("cookies")

        if raw_cookies is None or raw_cookies == "":
            user.naver_account_cookie = None
            user.save(update_fields=["naver_account_cookie"])
            return Response(
                {"message": "네이버 연동 정보가 초기화되었습니다."},
                status=status.HTTP_200_OK,
            )

        playwright_cookies = []

        if isinstance(raw_cookies, str):
            cookie_items = raw_cookies.split(";")
            for item in cookie_items:
                if "=" in item:
                    name, value = item.strip().split("=", 1)
                    name = name.strip()
                    value = value.strip()

                    if (
                        name
                        and value
                        and name in ["NID_AUT", "NID_SES", "NID_JDK", "NID_JKL"]
                    ):
                        playwright_cookies.append(
                            {
                                "name": name,
                                "value": value,
                                "domain": ".naver.com",
                                "path": "/",
                                "secure": True,
                                "httpOnly": True,
                                "sameSite": "Lax",
                            }
                        )
        elif isinstance(raw_cookies, list):
            playwright_cookies = raw_cookies
        else:
            return Response(
                {"error": "올바르지 않은 쿠키 형식입니다."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.naver_account_cookie = playwright_cookies
        user.save(update_fields=["naver_account_cookie"])

        return Response(
            {
                "message": "네이버 계정이 성공적으로 연동되었습니다.",
                "cookie_count": len(playwright_cookies),
            },
            status=status.HTTP_200_OK,
        )


####################################################################


class NaverAccountView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        return Response(
            {
                "naver_id": user.naver_id,
                "naver_pw": user.naver_pw,
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request):
        user = request.user
        naver_id = request.data.get("naver_id")
        naver_pw = request.data.get("naver_pw")

        if naver_id is not None:
            user.naver_id = naver_id.strip()
        if naver_pw is not None:
            user.naver_pw = naver_pw.strip()

        user.save(update_fields=["naver_id", "naver_pw"])

        return Response(
            {
                "message": "네이버 계정 정보가 성공적으로 저장되었습니다.",
                "naver_id": user.naver_id,
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request):
        user = request.user
        user.naver_id = None
        user.naver_pw = None
        user.save(update_fields=["naver_id", "naver_pw"])

        return Response(
            {"message": "네이버 계정 연동이 해제되었습니다."},
            status=status.HTTP_200_OK,
        )


####################################################################


class PushTokenView(APIView):
    permission_classes = (IsAuthenticated,)

    def patch(self, request):
        push_token = request.data.get("push_token")

        if not push_token:
            return Response(
                {"error": "pushToken이 제공되지 않았습니다."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user
        user.push_token = push_token
        user.save()

        return Response(
            {
                "message": "푸시 토큰이 성공적으로 저장되었습니다.",
                "pushToken": user.push_token,
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request):
        user = request.user
        user.push_token = None
        user.save()

        return Response(
            {"message": "푸시 토큰이 성공적으로 삭제되었습니다."},
            status=status.HTTP_200_OK,
        )
