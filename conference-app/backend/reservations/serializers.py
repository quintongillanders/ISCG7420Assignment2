from rest_framework import serializers
from .models import Room, Reservation
from django.contrib.auth.models import User

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

class ReservationSerializer(serializers.ModelSerializer):
    room = serializers.SlugRelatedField(
        queryset=Room.objects.all(),
        slug_field='name'
    )
    class Meta:
        model = Reservation
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']