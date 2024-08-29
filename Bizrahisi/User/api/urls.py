from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from .views import MyTokenObtainPairView


urlpatterns = [
    path("register", views.UserRegistrationView.as_view(), name="register"),
    path("login/", MyTokenObtainPairView.as_view(), name="login_obtain_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("user-details", views.UserView.as_view(), name="user-details"),
]
