from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Room, Reservation


# -----------------------------
# USER SERIALIZER
# -----------------------------
class UserSerializer(serializers.ModelSerializer):
    """
    Serializes basic user info for authentication, reservations, and admin use.
    Includes `is_staff` so frontend can detect admin users.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff']


# -----------------------------
# ROOM SERIALIZER
# -----------------------------
class RoomSerializer(serializers.ModelSerializer):
    """
    Serializes room data for viewing and admin CRUD operations.
    """
    class Meta:
        model = Room
        fields = '__all__'


# -----------------------------
# RESERVATION SERIALIZER
# -----------------------------
class ReservationSerializer(serializers.ModelSerializer):
    """
    Serializes reservation details, including related room and user info.
    Adds easy-to-use frontend fields `room_name` and `user_name`.
    """
    user = UserSerializer(read_only=True)  # Nested user info
    # Allow admins to pass a target user_id when creating on behalf of someone else
    user_id = serializers.IntegerField(write_only=True, required=False)
    room_name = serializers.CharField(source='room.name', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Reservation
        fields = [
            'id',
            'user',
            'user_id',
            'user_name',
            'room',
            'room_name',
            'start_time',
            'end_time',
            'created_at',
        ]
