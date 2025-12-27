from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import (
    Restaurant,
    MenuCategory,
    MenuItem,
    Table,
    Order,
    OrderItem,
)

from .serializers import (
    RestaurantSerializer,
    CategorySerializer,
    DishSerializer,
    TableSerializer,
    OrderSerializer,
    OrderItemSerializer,
    AdminSignupSerializer
)

@api_view(["POST"])
def create_user(request): 
    serialiser = AdminSignupSerializer(data=request.data)
    
    if serialiser.is_valid():
        user = serialiser.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Admin created",
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }, status=status.HTTP_201_CREATED)
    
    return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)
