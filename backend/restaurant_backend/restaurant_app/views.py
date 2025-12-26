from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import (
    Restaurant,
    Category,
    Dish,
    Menu,
    Order,
    OrderItem,
    StaffAdmin
)

from .serializers import (
    RestaurantSerializer,
    CategorySerializer,
    DishSerializer,
    MenuSerializer,
    OrderSerializer,
    OrderItemSerializer,
    StaffAdminSerializer
)

@api_view(["POST"])
def create_user(request):
    if(request.method=="POST"):
        serialiser = StaffAdminSerializer(data=request.data)
        
        if serialiser.is_valid():
            user = serialiser.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Admin created",
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }, status=status.HTTP_201_CREATED)
        
        return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)
