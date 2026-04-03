from django.urls import path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'applications', views.ApplicationViewSet, basename='application')

urlpatterns = [
    path(
        'applications/submit/',
        views.SubmitApplicationView.as_view(),
        name='application-submit',
    ),
] + router.urls
