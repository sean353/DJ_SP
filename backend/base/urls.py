from rest_framework import routers
from django.urls import path, include

from .views import CategoryViewSet, MyTokenObtainPairView, ProductViewSet, CustomerViewSet, OrderViewSet, OrderDetailsViewSet,register
from rest_framework_simplejwt.views import (
    
    TokenRefreshView,
)

from . import views

router = routers.DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'order-details', OrderDetailsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', register, name='register'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('get_all_images', views.getImages),
    path('upload_image/',views.APIViews.as_view()),


]



