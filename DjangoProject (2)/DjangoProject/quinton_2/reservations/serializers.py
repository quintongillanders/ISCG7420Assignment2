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


class UserAdminSerializer(serializers.ModelSerializer):
    """
    Serializer for admin CRUD on users. Accepts a write-only password and
    hashes it via set_password() on create/update. On update, if password is
    omitted, the existing password is kept.
    """
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


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
