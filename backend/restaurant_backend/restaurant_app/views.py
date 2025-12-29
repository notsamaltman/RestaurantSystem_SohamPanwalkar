import uuid
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.core.cache import cache
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

from .ocr.pipeline import pipeline

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

@api_view(["POST"])
def login_user(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {"detail": "Email and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(request, username=email, password=password)

    if user is None:
        return Response(
            {"detail": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)

    return Response(
        {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
            }
        },
        status=status.HTTP_200_OK
    )

@api_view(["POST"])
def register_restaurant(request):
    restaurant_name = request.data.get("restaurant_name")

import os
import uuid
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.cache import cache

@api_view(["POST"])
def upload_menu(request):
    image = request.FILES.get("menu")

    if not image:
        return Response({"error": "No menu image provided"}, status=400)

    job_id = str(uuid.uuid4())

    # ✅ Use MEDIA_ROOT/uploads
    upload_dir = os.path.join(settings.MEDIA_ROOT, "uploads")
    os.makedirs(upload_dir, exist_ok=True)

    image_path = os.path.join(upload_dir, f"{job_id}.jpg")

    # ✅ Save image safely
    with open(image_path, "wb+") as f:
        for chunk in image.chunks():
            f.write(chunk)

    def progress_callback(pct, msg):
        cache.set(
            f"menu_progress_{job_id}",
            {
                "progress": pct,   # 👈 match frontend
                "step": msg
            },
            timeout=300
        )

    # INITIAL STATE
    progress_callback(0, "Starting OCR")

    # 🔥 Run pipeline
    result = pipeline(image_path, progress=progress_callback)

    # Store final result
    cache.set(
        f"menu_result_{job_id}",
        result,
        timeout=300
    )

    return Response({
        "job_id": job_id,
        "status": "processing"
    }, status=202)


@api_view(["GET"])
def menu_progress(request, job_id):
    progress = cache.get(f"menu_progress_{job_id}")

    if not progress:
        return Response(
            {"detail": "Invalid job ID"},
            status=404
        )

    return Response(progress)



