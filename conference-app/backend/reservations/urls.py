from django.urls import path, include
from rest_framework import routers
from .views import RoomViewSet, ReservationViewSet, UserViewSet

router = routers.DefaultRouter()
router.register(r'rooms', RoomViewSet)
router.register(r'reservations', ReservationViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
