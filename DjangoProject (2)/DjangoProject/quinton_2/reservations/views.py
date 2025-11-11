from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.conf import settings
from .models import Room, Reservation
from .serializers import RoomSerializer, ReservationSerializer, UserSerializer
from .emails import send_booking_confirmation, send_booking_notification


# =======================
# ✅ ROOM VIEWSET
# =======================
class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# =======================
# ✅ RESERVATION VIEWSET
# =======================
class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Reservation.objects.all()
        return Reservation.objects.filter(user=user)

    def perform_create(self, serializer):
        # Save the booking first
        booking = serializer.save(user=self.request.user)
        
        try:
            # Send confirmation email to the user
            send_booking_confirmation(booking, self.request.user.email)
            
            # Send notification to admin (using the admin email from settings)
            admin_emails = [settings.EMAIL_HOST_USER]  # Or define a list of admin emails
            send_booking_notification(booking, admin_emails)
            
        except Exception as e:
            # Log the error but don't fail the request
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to send booking emails: {str(e)}")
            # You might want to handle this error differently in production


# =======================
# ✅ USER VIEWSET (ADMIN)
# =======================
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]  # ✅ fixed (no parentheses)

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """Return the current logged-in user's info"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


# =======================
# ✅ CURRENT USER ENDPOINT (/api/users/me/)
# =======================
@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([permissions.IsAdminUser])
def test_email(request):
    """
    Test endpoint to verify email functionality
    Only accessible by admin users
    """
    from django.core.mail import send_mail
    from django.conf import settings
    
    try:
        send_mail(
            'Test Email from Django',
            'This is a test email to verify email settings.',
            settings.DEFAULT_FROM_EMAIL,
            [settings.EMAIL_HOST_USER],  # Send to yourself for testing
            fail_silently=False,
        )
        return Response({"status": "Test email sent successfully!"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
