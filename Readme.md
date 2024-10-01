# Supermarket Application

## Overview
This project is a supermarket application built using Django and React, with a SQlite database. It allows users to manage products, categories, and orders. Users can purchase products using PayPal, while admin users can manage all aspects of the store.

## Features
- **User Registration & Authentication**: Users can register and log in to the application. JWT authentication is used for secure access.
  
- **Product Management**: Admins can add, update, and delete products, including product images.
  
- **Category Management**: Admins can manage product categories.
  
- **Order Management**: Users can create orders for products. Admins can view all orders, while users can view their own orders.
  
- **PayPal Integration**: Users can pay for their orders using PayPal.

## API Endpoints

### Registration
- **POST** `/register/`

### Login
- **POST** `/api/token/`

### Products
- **GET** `/products/` - Get Products
- **POST** `/products/` - Create Product (Admin)
- **PUT** `/products/<id>/` - Update Product (Admin)
- **DELETE** `/products/<id>/` - Delete Product (Admin)

### Categories
- **GET** `/categories/` - Get Categories
- **POST** `/categories/` - Create Categories (Admin)
- **PUT** `/categories/<id>/` - Update Categories (Admin)
- **DELETE** `/categories/<id>/` - Delete Categories (Admin)

### Customers
- **GET** `/customers/` - Get Customers
- **POST** `/customers/` - Create Customer (Admin)
- **PUT** `/customers/<id>/` - Update Customer (Admin)
- **DELETE** `/customers/<id>/` - Delete Customer (Admin)

### Orders
- **POST** `/orders/` - Create Order
- **GET** `/orders/` - Get Orders (Admin can see all orders; users can see their own)
- **PUT** `/orders/<id>/` - Update Order (Admin)
- **DELETE** `/orders/<id>/` - Delete Order (Admin)

### Order Details
- **POST** `/order-details/` - Create Order Details
- **GET** `/order-details/` - Get Order Details (Admin can see all orders; users can see their own)
- **PUT** `/order-details/<id>/` - Update Order Details (Admin)
- **DELETE** `/order-details/<id>/` - Delete Order Details (Admin)

## Models
The application consists of the following models:

1. **Category**
   - `Catdesc`: A description of the category.

2. **Product**
   - `description`: A description of the product.
   - `price`: The price of the product.
   - `category`: A foreign key linking to the Category model.
   - `image`: An image of the product.

3. **Customer**
   - `user`: A one-to-one relationship with the Django User model.
   - `address`: The address of the customer.
   - `phone`: The phone number of the customer.

4. **Order**
   - `customer`: A foreign key linking to the User model.
   - `created_at`: The date and time the order was created.
   - `total_price`: The total price of the order.
   - `paypal_ID`: The PayPal transaction ID.

5. **OrderDetails**
   - `order`: A foreign key linking to the Order model.
   - `product`: A foreign key linking to the Product model.
   - `quantity`: The quantity of the product in the order.

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
