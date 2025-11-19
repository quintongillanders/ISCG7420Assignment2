from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from reservations.auth_views import register_user
from reservations.custom_auth import CustomTokenObtainPairView

urlpatterns = [
    # Django admin panel
    path("admin/", admin.site.urls),

    # Authentication endpoints
    path("api/register/", register_user, name="register"),
    path("api/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Core API (rooms, reservations, users)
    path("api/", include("reservations.urls")),
]
