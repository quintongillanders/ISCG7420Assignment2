from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

def send_booking_confirmation(booking, user_email):
    """
    Send a booking confirmation email to the user
    """
    subject = f'Booking Confirmation - {booking.room.name}'
    
    # Create HTML message
    html_message = render_to_string('emails/booking_confirmation.html', {
        'booking': booking,
        'user': booking.user,
        'room': booking.room,
        'support_email': settings.DEFAULT_FROM_EMAIL,
    })
    
    # Create plain text message
    plain_message = strip_tags(html_message)
    
    # Send email
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        html_message=html_message,
        fail_silently=False,
    )

def send_booking_notification(booking, admin_emails):
    """
    Send a notification to admins about a new booking
    """
    subject = f'New Booking - {booking.room.name} by {booking.user.username}'
    
    # Create HTML message
    html_message = render_to_string('emails/booking_notification.html', {
        'booking': booking,
        'user': booking.user,
        'room': booking.room,
    })
    
    # Create plain text message
    plain_message = strip_tags(html_message)
    
    # Send email to all admin emails
    for email in admin_emails:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            html_message=html_message,
            fail_silently=False,
        )
