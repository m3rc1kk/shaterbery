from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView
from rest_framework.filters import OrderingFilter, SearchFilter

from .models import Application
from .serializers import ApplicationSerializer, ApplicationSubmitSerializer


class ApplicationSubmitThrottle(AnonRateThrottle):
    rate = '5/hour'


class SubmitApplicationView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ApplicationSubmitThrottle]

    def post(self, request, *args, **kwargs):
        serializer = ApplicationSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        application = serializer.save()
        return Response(
            ApplicationSerializer(application).data,
            status=status.HTTP_201_CREATED,
        )


class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['full_name', 'phone', 'location']
    ordering_fields = ['created_at', 'event_date', 'event_time', 'total_price', 'status', 'source']
    ordering = ['-created_at', '-id']

    def get_queryset(self):
        qs = super().get_queryset()
        status_param = self.request.query_params.get('status')
        if status_param and status_param in Application.Status.values:
            qs = qs.filter(status=status_param)
        source_param = self.request.query_params.get('source')
        if source_param and source_param in Application.Source.values:
            qs = qs.filter(source=source_param)
        return qs
