from rest_framework import routers
from django.urls import path, include
from .views import CategoryViewSet, ProductViewSet, CustomerViewSet, OrderViewSet, OrderDetailsViewSet

router = routers.DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'order-details', OrderDetailsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
