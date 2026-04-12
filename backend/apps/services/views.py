from rest_framework import generics, permissions, viewsets

from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import City, Service
from .serializers import CitySerializer, ServiceSerializer


class CityListView(generics.ListAPIView):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


class CityAdminViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class = None


class ServiceListView(generics.ListAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        qs = Service.objects.all()
        city = self.request.query_params.get('city')
        if city:
            qs = qs.filter(city__slug=city)
        return qs


class ServiceAdminViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    pagination_class = None
