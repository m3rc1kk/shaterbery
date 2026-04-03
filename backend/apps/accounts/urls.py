from django.urls import path
from . import views

urlpatterns = [
    path('sign-in', views.UserLoginView.as_view(), name='login'),
    path('logout', views.UserLogoutView.as_view(), name='logout'),
]
