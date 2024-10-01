from rest_framework import serializers
from .models import Category, Product, Customer, Order, OrderDetails



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.Catdesc', read_only=True)

    class Meta:
        model = Product
        fields = '__all__' 

class CustomerSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='user.username', read_only=True)
    user = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Customer
        fields = '__all__' 

class OrderDetailsSerializer(serializers.ModelSerializer):
    product_desc = serializers.CharField(source = "product.description" , read_only=True)
    customer_name = serializers.CharField(source='order.customer.username', read_only=True)
    total_price = serializers.CharField(source='order.total_price', read_only=True)
    Date = serializers.DateTimeField(source='order.created_at', read_only=True)
    product_price = serializers.CharField(source = 'product.price' , read_only=True)
    class Meta:
        model = OrderDetails
        fields = '__all__'
       

class OrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.username', read_only=True)
    
    order_details = OrderDetailsSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
