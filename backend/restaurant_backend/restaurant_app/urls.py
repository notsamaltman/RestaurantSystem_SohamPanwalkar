from django.urls import path
from . import views

urlpatters = [
    path('/signup', views.create_user),
]