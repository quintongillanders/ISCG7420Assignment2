from django.urls import path
from rest_framework import routers
from .views import RoomViewSet, ReservationViewSet, UserViewSet, current_user, test_email

router = routers.DefaultRouter()
router.register(r'rooms', RoomViewSet, basename='room')
router.register(r'reservations', ReservationViewSet, basename='reservation')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('users/me/', current_user, name='current_user'),
    path('test-email/', test_email, name='test_email'),
]

urlpatterns += router.urls
