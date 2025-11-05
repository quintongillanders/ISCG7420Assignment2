from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from reservations.auth_views import register_user

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('reservations.urls')),
    path('api/register/', register_user, name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
