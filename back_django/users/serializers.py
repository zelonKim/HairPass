from rest_framework import serializers
from django.contrib.auth import get_user_model
import re

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("username", "password", "password_confirm")

    def validate_username(self, value):

        if len(value) < 3 :
            raise serializers.ValidationError("아이디는 3자 이상이어야 합니다.")

        if len(value) > 20:
            raise serializers.ValidationError("아이디는 20자 이내이어야 합니다.")

        if not re.search(r"[A-Za-z]", value):
            raise serializers.ValidationError(
                "아이디는 영문자를 최소 1자 이상 포함해야 합니다."
            )

        if re.search(r"[ㄱ-ㅎㅏ-ㅣ가-힣]", value):
            raise serializers.ValidationError("아이디에 한글은 사용할 수 없습니다.")

        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("이미 사용중인 아이디 입니다.")

        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("비밀번호는 8자 이상이어야 합니다.")

        if len(value) > 20:
            raise serializers.ValidationError("비밀번호는 20자 이내이어야 합니다.")

        if not re.search(r"[A-Za-z]", value) or not re.search(r"[0-9]", value):
            raise serializers.ValidationError(
                "비밀번호는 영문과 숫자를 모두 포함해야 합니다."
            )

        return value

    def validate(self, attrs):
        password = attrs.get("password")
        password_confirm = attrs.get("password_confirm")

        if password != password_confirm:
            raise serializers.ValidationError(
                {"password_confirm": "비밀번호가 서로 일치하지 않습니다."}
            )

        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")

        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


#####################################################


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


#####################################################


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "favorite_salon",
            "favorite_designer",
            "favorite_menu",
        )


#####################################################


class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "push_token", "naver_id", "naver_pw")
        read_only_fields = ("id", "username")
