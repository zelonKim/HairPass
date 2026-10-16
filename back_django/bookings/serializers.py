from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = (
            "id",
            "salon_name",
            "designer_name",
            "menu_name",
            "booking_date",
            "booking_time",
            "status",
            "memo",
            "created_at",
            "updated_at",
            "payment_method",
        )
        read_only_fields = ("id", "status", "memo", "created_at", "updated_at")

    def create(self, validated_data):
        return Booking.objects.create(**validated_data)
