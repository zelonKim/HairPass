from django.urls import path
from .views import (
    BookingListCreateView,
    BookingDetailDeleteView,
    BookingFinishView,
)


urlpatterns = [
    path("", BookingListCreateView.as_view(), name="booking-list-create"),
    path("<int:pk>/", BookingDetailDeleteView.as_view(), name="booking-delete"),
    path(
        "finish/",
        BookingFinishView.as_view(),
        name="booking-finish",
    ),
]
