from django.urls import path
from .views import BookingListCreateView, BookingDetailDeleteView, BookingSuccessUpdateView


urlpatterns = [
    path("", BookingListCreateView.as_view(), name="booking-list-create"),
    path("<int:pk>/", BookingDetailDeleteView.as_view(), name="booking-delete"),
    path(
        "success-update/",
        BookingSuccessUpdateView.as_view(),
        name="booking-success-update",
    ),
]
