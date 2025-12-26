from rest_framework import serializers
from .models import (
    Restaurant,
    Category,
    Dish,
    Menu,
    Order,
    OrderItem,
    StaffAdmin
)


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class DishSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source="category.name")

    class Meta:
        model = Dish
        fields = "__all__"


class MenuSerializer(serializers.ModelSerializer):
    dishes = DishSerializer(many=True, read_only=True)

    class Meta:
        model = Menu
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


class StaffAdminSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = StaffAdmin
        fields = [
            "id",
            "email",
            "name",
            "role",
            "is_active",
            "password"
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = StaffAdmin(**validated_data)
        user.set_password(password)
        user.save()
        return user
