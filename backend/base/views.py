import json
from rest_framework import viewsets
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Category, Product, Customer, Order, OrderDetails
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializer import CategorySerializer, ProductSerializer, CustomerSerializer, OrderSerializer, OrderDetailsSerializer
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
import logging
from functools import wraps



logger = logging.getLogger(__name__)

logger.setLevel(logging.INFO)

# יצירת FileHandler עבור שמירת הלוגים בקובץ
file_handler = logging.FileHandler('app.log')
file_handler.setLevel(logging.INFO)

# הגדרת הפורמט של הלוגים
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)

# הוספת ה־FileHandler ללוגר
logger.addHandler(file_handler)


def log_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        logger.info(f"Starting function: {func.__name__}")
        try:
            result = func(*args, **kwargs)
            logger.info(f"Function {func.__name__} completed successfully")
            return result
        except Exception as e:
            logger.error(f"Error in function {func.__name__}: {str(e)}")
            raise e
    return wrapper


@api_view(['POST'])
@log_decorator
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    address = request.data.get('address')
    phone = request.data.get('phone')

    # בדיקה אם כל השדות הנחוצים נשלחו
    if not all([username, email, password, address, phone]):
        return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

    # בדיקה אם שם המשתמש כבר קיים
    if User.objects.filter(username=username).exists():
        logger.info(f"New user '{username}' registered successfully")
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

    # יצירת המשתמש החדש
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
    )
    
    user.is_active = True
    user.is_staff = True
    user.is_superuser = False
    user.save()

    # יצירת או השגת פרופיל לקוח
    customer, created = Customer.objects.get_or_create(
        user=user,
        defaults={'address': address, 'phone': phone}
    )
    
    # אם הפרופיל כבר קיים, נעדכן אותו
    if not created:
        customer.address = address
        customer.phone = phone
        customer.save()

    return Response("New user and customer profile created successfully", status=status.HTTP_201_CREATED)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        logger.info(f"User '{user.username}' has logged in. Is admin: {user.is_superuser}")
        # Add custom claims
        token['username'] = user.username
        token['admin'] = user.is_superuser
        
        
        # ...


        return token
    

    # return all images to client (without serialize)
@api_view(['GET'])
def getImages(request):
    res=[] #create an empty list
    for img in Product.objects.all(): #run on every row in the table...
        res.append({"description":img.description,
                "price":img.price,
                "category":img.category,
                "completed":False,
               "image":str( img.image)
                }) #append row by to row to res list
    return Response(res) #return array as json response


# upload image method (with serialize)
class APIViews(APIView):
    parser_class=(MultiPartParser,FormParser)
    def post(self,request,*args,**kwargs):
        api_serializer=ProductSerializer(data=request.data)
       
        if api_serializer.is_valid():
            api_serializer.save()
            return Response(api_serializer.data,status=status.HTTP_201_CREATED)
        else:
            print('error',api_serializer.errors)
            return Response(api_serializer.errors,status=status.HTTP_400_BAD_REQUEST)





class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    @log_decorator
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        logger.info(f"Category '{request.data.get('Catdesc')}' added")
        return response

    @log_decorator
    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        logger.info(f"Category '{request.data.get('Catdesc')}' updated")
        return response

    @log_decorator
    def destroy(self, request, *args, **kwargs):
        category = self.get_object()
        logger.info(f"Category '{category.Catdesc}' deleted")
        return super().destroy(request, *args, **kwargs)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    @log_decorator
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        logger.info(f"Product '{request.data.get('description')}' added with price {request.data.get('price')}")
        return response

    @log_decorator
    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        logger.info(f"Product '{request.data.get('description')}' updated with price {request.data.get('price')}")
        return response

    @log_decorator
    def destroy(self, request, *args, **kwargs):
        product = self.get_object()
        logger.info(f"Product '{product.description}' deleted")
        return super().destroy(request, *args, **kwargs)


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    @log_decorator
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        customer = self.get_object()
        logger.info(f"Customer '{customer.user.username}' added with phone '{request.data.get('phone')}' And added with Address '{request.data.get('address')}'")
        return response

    @log_decorator
    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        customer = self.get_object()
        
        logger.info(f"Customer '{customer.user.username}' updated with phone '{request.data.get('phone')}' And added with Address '{request.data.get('address')}'")
        return response

    @log_decorator
    def destroy(self, request, *args, **kwargs):
        customer = self.get_object()
        logger.info(f"Customer '{customer.user.username}' deleted")
        return super().destroy(request, *args, **kwargs)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    @log_decorator
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        logger.info(f"Order for customer '{request.user.username}' created with total price {request.data.get('total_price')}")
        return response

    @log_decorator
    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        logger.info(f"Order {request.data.get('id')} updated with total price {request.data.get('total_price')}")
        return response

    @log_decorator
    def destroy(self, request, *args, **kwargs):
        order = self.get_object()
        logger.info(f"Order {order.id} for customer '{order.customer.username}' deleted")
        return super().destroy(request, *args, **kwargs)


class OrderDetailsViewSet(viewsets.ModelViewSet):
    queryset = OrderDetails.objects.all()
    serializer_class = OrderDetailsSerializer

    @log_decorator
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        product_id = request.data.get('product')

        product = Product.objects.get(id=product_id)

        logger.info(f"OrderDetail for order '{request.data.get('order')}' added, product '{product.description}' quantity {request.data.get('quantity')}")
        return response

    @log_decorator
    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        product_id = request.data.get('product')

        product = Product.objects.get(id=product_id)
        logger.info(f"OrderDetail for order '{request.data.get('order')}' updated, product '{product.description}' quantity {request.data.get('quantity')}")
        return response

    @log_decorator
    def destroy(self, request, *args, **kwargs):
        order_detail = self.get_object()
        logger.info(f"OrderDetail for order '{order_detail.order.id}' and product '{order_detail.product.description}' deleted")
        return super().destroy(request, *args, **kwargs)





