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
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

    class RegisterSerializer(serializers.ModelSerializer):
        password = serializers.CharField(write_only=True, required=True)
        confirm_password = serializers.CharField(write_only=True, required=True)

        class Meta:
            model = User
            fields = ['id', 'username', 'email', 'password', 'confirm_password']

        # Validate that passwords match
        def validate(self, data):
            if data['password'] != data['confirm_password']:
                raise serializers.ValidationError("Passwords do not match.")
            return data

        # Create user with hashed password
        def create(self, validated_data):
            validated_data.pop('confirm_password')  # remove confirm password
            user = User(
                username=validated_data['username'],
                email=validated_data['email']
            )
            user.set_password(validated_data['password'])  # hash password
            user.save()
            return user

