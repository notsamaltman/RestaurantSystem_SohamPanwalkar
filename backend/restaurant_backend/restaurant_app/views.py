import uuid
import json
import os
from django.conf import settings
from django.db import transaction
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .qr.qrCode import generate_qr
from .ocr.pipeline import pipeline

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
@permission_classes([IsAuthenticated])
def upload_menu(request):
    image = request.FILES.get("menu")

    if not image:
        return Response({"error": "No menu image provided"}, status=400)

    job_id = str(uuid.uuid4())

    upload_dir = os.path.join(settings.MEDIA_ROOT, "uploads")
    os.makedirs(upload_dir, exist_ok=True)

    image_path = os.path.join(upload_dir, f"{job_id}.jpg")

    try:
        with open(image_path, "wb+") as f:
            for chunk in image.chunks():
                f.write(chunk)

        # OCR
        result = pipeline(image_path)
        cleaned = result.replace("```json", "").replace("```", "").strip()
        parsed = json.loads(cleaned)

        return Response(
            {"result": parsed},
            status=202
        )

    finally:
        if os.path.exists(image_path):
            os.remove(image_path)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_restaurant(request):
    data = request.data
    user = request.user   

    try:
        menu_items = json.loads(data.get("restaurant_menu", "[]"))
    except json.JSONDecodeError:
        return Response({"error": "Invalid menu format"}, status=400)

    if not menu_items:
        return Response({"error": "Menu cannot be empty"}, status=400)

    try:
        table_count = int(data.get("restaurant_tables", 0))
        if table_count <= 0:
            raise ValueError
    except ValueError:
        return Response({"error": "Invalid number of tables"}, status=400)

    with transaction.atomic():
        restaurant = Restaurant.objects.create(
            owner=user,
            name=data.get("restaurant_name"),
            description=data.get("restaurant_description", ""),
            address=data.get("restaurant_address"),
            no_of_tables=table_count,
        )

        category_map = {}

        for item in menu_items:
            category_name = item.get("category", "").strip()
            if not category_name:
                return Response({"error": "Menu item missing category"}, status=400)

            if category_name not in category_map:
                category_obj, _ = MenuCategory.objects.get_or_create(
                    restaurant=restaurant,
                    name=category_name,
                )
                category_map[category_name] = category_obj

        menu_objects = [
            MenuItem(
                category=category_map[item["category"]],
                name=item["name"],
                description=item.get("description", ""),
                price=item["price"],
                is_available=True,
                is_veg=item.get("veg", True)
            )
            for item in menu_items
        ]

        MenuItem.objects.bulk_create(menu_objects)

        for table_number in range(1, table_count + 1):
            token = uuid.uuid4().hex

            table = Table.objects.create(
                restaurant=restaurant,
                table_number=table_number,
                qr_token=token,
            )

            qr_url = f"http://localhost:5173/customer/order/{restaurant.id}/{table_number}/"

            qr_path = generate_qr(
                link=qr_url,
                filename=f"restaurant_{restaurant.id}_table_{table_number}"
            )

            table.qr_image = qr_path
            table.save()

    return Response(
        {
            "message": "Restaurant setup completed",
            "restaurant_id": restaurant.id,
            "tables_created": table_count,
            "categories": len(category_map),
            "menu_items": len(menu_objects),
        },
        status=201
    )

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def remove_restaurant(request):
    restaurant = get_object_or_404(Restaurant, owner=request.user)

    with transaction.atomic():
        for table in restaurant.tables.all():
            if table.qr_image:
                try:
                    file_path = table.qr_image.path
                    if os.path.exists(file_path):
                        os.remove(file_path)
                except Exception as e:
                    print("QR delete error:", e)

        restaurant.delete()

    return Response(
        {"message": "Restaurant deleted successfully"},
        status=200
    )

@api_view(["GET"])
def get_info(request, restaurant_id):
    try:
        restaurant = Restaurant.objects.get(id=restaurant_id)
    except Restaurant.DoesNotExist:
        return Response({"error": "Restaurant not found"}, status=404)

    # Use 'items' because that's the related_name in MenuItem
    categories = MenuCategory.objects.filter(restaurant=restaurant).prefetch_related('items')

    menu = []
    for category in categories:
        menu.append({
            "category": category.name,
            "items": [
                {
                    "id": item.id,
                    "name": item.name,
                    "description": item.description,
                    "price": float(item.price),
                    "veg": getattr(item, 'is_veg', True),  # Add if you implement veg/non-veg later
                    "available": item.is_available,
                }
                for item in category.items.all()
            ]
        })

    return Response({
        "restaurant": {
            "name": restaurant.name,
            "description": restaurant.description,
            "address": restaurant.address,
        },
        "menu": menu,
    })





