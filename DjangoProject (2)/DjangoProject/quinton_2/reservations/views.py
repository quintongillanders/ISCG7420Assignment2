from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from .models import Room, Reservation
from .serializers import RoomSerializer, ReservationSerializer, UserSerializer


# =======================
# ROOM VIEWSET
# =======================
class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# =======================
# RESERVATION VIEWSET
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
        """Save the booking and send confirmation email"""
        reservation = serializer.save(user=self.request.user)
        self.send_confirmation_email(reservation)

    def send_confirmation_email(self, reservation):
        """Send booking confirmation email to the user"""
        user_email = reservation.user.email
        if not user_email:
            return  # Skip if user has no email address

        room_name = reservation.room.name
        date = reservation.date
        time = reservation.time

        subject = f"Booking Confirmation - {room_name}"
        message = (
            f"Hi {reservation.user.username},\n\n"
            f"Your booking for {room_name} on {date} at {time} has been confirmed.\n\n"
            f"Thank you for using our Conference Room Reservation System!\n\n"
            f"- Conference Room Booking System for Te Whare Rūnanga Ltd"
        )

        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user_email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"⚠️ Failed to send confirmation email: {e}")


# =======================
# USER VIEWSET (ADMIN)
# =======================
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """Return the current logged-in user's info"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


# =======================
# CURRENT USER ENDPOINT (/api/users/me/)
# =======================
@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def current_user(request):
    """Return the current authenticated user's data"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
