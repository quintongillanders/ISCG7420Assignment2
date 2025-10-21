from rest_framework import viewsets
from .models import Room, Reservation
from .serializers import RoomSerializer, ReservationSerializer, UserSerializer
from django.contrib.auth.models import User

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

