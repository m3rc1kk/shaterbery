from django.urls import path

from . import views

urlpatterns = [
    path('dashboard/cards/', views.DashboardCardsView.as_view(), name='dashboard-cards'),
    path('dashboard/graphs/', views.DashboardGraphsView.as_view(), name='dashboard-graphs'),
    path('dashboard/popular/', views.DashboardPopularView.as_view(), name='dashboard-popular'),
    path('dashboard/recent/', views.DashboardRecentView.as_view(), name='dashboard-recent'),
]
