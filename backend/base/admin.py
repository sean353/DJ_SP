from django.contrib import admin

# Register your models here.
from .models import Product,Category,Customer,Order,OrderDetails

admin.site.register(Product)
admin.site.register(Category)
admin.site.register(Customer)
admin.site.register(Order)
admin.site.register(OrderDetails)

