# viewsets.py (garantir a importação)

from rest_framework import viewsets, permissions, generics
from .serializers import UserSerializer, UserRegisterSerializer
from user.models import CustomUser
from user.permissions import IsAdminOrSelf

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSelf]