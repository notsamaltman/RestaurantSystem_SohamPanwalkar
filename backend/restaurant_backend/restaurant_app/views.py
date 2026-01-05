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
            frontend_base_url = request.data.get("frontend_base_url")
            qr_url = f"{frontend_base_url}customer/order/{restaurant.id}/{table_number}/"

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

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_orders(request, restaurant_id):
    restaurant = get_object_or_404(
        Restaurant,
        id=restaurant_id,
        owner=request.user
    )

    pending_orders = Order.objects.filter(
        restaurant=restaurant,
        status__in=["pending", "preparing"]
    ).prefetch_related("items__item", "table").order_by("-created_at")

    served_orders = Order.objects.filter(
        restaurant=restaurant,
        status="served"
    ).prefetch_related("items__item", "table").order_by("-created_at")

    def serialize_order(order):
        return {
            "order_id": order.id,
            "table_number": order.table.table_number if order.table else None,
            "status": order.status,
            "created_at": order.created_at,
            "items": [
                {
                    "name": oi.item.name,
                    "quantity": oi.quantity,
                    "price": oi.item.price,
                    "is_veg": oi.item.is_veg,
                }
                for oi in order.items.all()
            ],
        }

    return Response({
        "restaurant": restaurant.name,
        "pending_orders": [serialize_order(o) for o in pending_orders],
        "served_orders": [serialize_order(o) for o in served_orders],
    })

@api_view(["POST"])
def place_order(request, restaurant_id, table_id):
    restaurant = get_object_or_404(
        Restaurant,
        id=restaurant_id,
        is_active=True
    )

    table = get_object_or_404(
        Table,
        table_number=table_id,
        restaurant=restaurant
    )


    items_data = request.data.get("items")

    if not items_data or not isinstance(items_data, list):
        return Response(
            {"error": "Items list is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    with transaction.atomic():
        order = Order.objects.create(
            restaurant=restaurant,
            table=table,
            status="pending"
        )

        for entry in items_data:
            item_id = entry.get("item_id")
            quantity = entry.get("quantity", 1)

            if not item_id or quantity <= 0:
                transaction.set_rollback(True)
                return Response(
                    {"error": "Invalid item data"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            menu_item = get_object_or_404(
                MenuItem,
                id=item_id,
                category__restaurant=restaurant,
                is_available=True
            )

            OrderItem.objects.create(
                order=order,
                item=menu_item,
                quantity=quantity
            )

    return Response(
        {
            "message": "Order placed successfully",
            "order_id": order.id,
            "table": table.table_number,
            "status": order.status
        },
        status=status.HTTP_201_CREATED
    )

@api_view(["GET"])
def get_status(request, order_id):
    order = get_object_or_404(
        Order.objects.prefetch_related("items__item"),
        id=order_id
    )

    items = []
    total = 0

    for oi in order.items.all():
        price = float(oi.item.price)
        subtotal = price * oi.quantity
        total += subtotal

        items.append({
            "name": oi.item.name,
            "quantity": oi.quantity,
            "price": price,
        })

    return Response({
        "order_id": order.id,
        "status": order.status, 
        "table": order.table.table_number if order.table else None,
        "items": items,         
        "total": total,          
    })

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_status(request, order_id):
    order = get_object_or_404(
        Order,
        id=order_id,
        restaurant__owner=request.user
    )

    ALLOWED_STATUSES = ["pending", "preparing", "ready", "served"]
    new_status = request.data.get("status")

    if new_status not in ALLOWED_STATUSES:
        return Response(
            {"error": "Invalid status"},
            status=status.HTTP_400_BAD_REQUEST
        )

    order.status = new_status
    order.save()

    return Response(
        {
            "order_id": order.id,
            "status": order.status,
        },
        status=status.HTTP_200_OK
    )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_data(request):
    """
    Returns all user and restaurant data for dashboard
    """
    user = request.user
    user_data = {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
    }

    try:
        restaurant = Restaurant.objects.get(owner=user)
        restaurant_data = RestaurantSerializer(restaurant).data
        user_data["has_restaurant"] = True
    except Restaurant.DoesNotExist:
        restaurant_data = None
        user_data["has_restaurant"] = False

    return Response({
        "user": user_data,
        "restaurant": restaurant_data
    })