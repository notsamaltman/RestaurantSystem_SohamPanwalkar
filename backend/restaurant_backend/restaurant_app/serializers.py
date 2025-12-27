from rest_framework import serializers
from .models import (
    Restaurant,
    MenuCategory,
    MenuItem,
    Table,
    Order,
    OrderItem,
)

from django.contrib.auth.models import User


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuCategory
        fields = "__all__"


class DishSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source="category.name")

    class Meta:
        model = MenuItem
        fields = "__all__"


class TableSerializer(serializers.ModelSerializer):
    dishes = DishSerializer(many=True, read_only=True)

    class Meta:
        model = Table
        fields = "__all__"


class OrderItemSerializer(serializers.ModelSerializer):
    dish_name = serializers.ReadOnlyField(source="dish.name")

    class Meta:
        model = OrderItem
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = "__all__"

    def get_total_price(self, obj):
        return sum(
            item.quantity * item.price
            for item in obj.items.all()
        )

class AdminSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "email",
            "password",
        ]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            is_staff=True,      # admin access
            is_superuser=True   # optional, depends on your system
        )
        return user


