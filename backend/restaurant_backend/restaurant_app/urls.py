from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('signup/', views.create_user),
    path('login/', views.login_user),
    path('register/', views.register_restaurant),
    path('upload/', views.upload_menu),
    path('remove/', views.remove_restaurant),
    path('info/<int:restaurant_id>/', views.get_info),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)