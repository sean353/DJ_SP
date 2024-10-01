from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    Catdesc = models.CharField(max_length=255)

    def __str__(self):
        return self.Catdesc

class Product(models.Model):
    description = models.CharField(max_length=255,default="", blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category,default=None, blank=True, null=True, related_name='products', on_delete=models.CASCADE)
    image = models.ImageField(null=True,blank=True,default='/placeholder.png')

    def __str__(self):
       
     return f" {self.description}"

class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)

    def __str__(self):
        return self.user.username

class Order(models.Model):
    customer = models.ForeignKey(User, related_name='orders', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
  # סכום כולל של ההזמנה
    paypal_ID = models.CharField(max_length=255)  # מזהה תשלום PayPal

    def __str__(self):
        return f"Order {self.customer.username} - {self.total_price}"

class OrderDetails(models.Model):
    order = models.ForeignKey(Order, related_name='order_details', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def __str__(self):
        return f"{self.quantity} x {self.product.description} in Cart {self.order.id}"