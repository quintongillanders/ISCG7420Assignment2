from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Allow login with either username or email in the 'username' field
        identifier = attrs.get(self.username_field)
        password = attrs.get('password')

        if identifier and '@' in identifier:
            # Treat as email; resolve to username if possible
            User = get_user_model()
            try:
                user = User.objects.get(email__iexact=identifier)
                attrs[self.username_field] = getattr(user, self.username_field)
            except User.DoesNotExist:
                # Fall back to default behavior -> will raise invalid credentials
                pass

        data = super().validate(attrs)

        # Attach a small user payload for convenience (optional)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'is_staff': self.user.is_staff,
        }
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
