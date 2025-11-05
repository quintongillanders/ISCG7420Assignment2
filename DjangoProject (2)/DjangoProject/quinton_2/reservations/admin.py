from django.contrib import admin
from .models import Room, Reservation

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "capacity", "location")
    search_fields = ("name", "location")
    list_filter = ("location",)
    ordering = ("name",)


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "room", "start_time", "end_time", "created_at")
    list_filter = ("room", "start_time")
    search_fields = ("user__username", "room__name")
    ordering = ("-start_time",)

    # Automatically assign the logged-in user who creates the reservation
    def save_model(self, request, obj, form, change):
        if not obj.pk:  # If new reservation
            obj.user = request.user
        super().save_model(request, obj, form, change)
