from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            "username",
            "password",
        )

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)  # 비밀번호 암호화 저장
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
