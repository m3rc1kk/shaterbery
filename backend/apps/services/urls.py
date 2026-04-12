from django.urls import path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'services/admin', views.ServiceAdminViewSet, basename='service-admin')
router.register(r'cities/admin', views.CityAdminViewSet, basename='city-admin')

urlpatterns = [
    path('services/', views.ServiceListView.as_view(), name='service-list'),
    path('cities/', views.CityListView.as_view(), name='city-list'),
] + router.urls
