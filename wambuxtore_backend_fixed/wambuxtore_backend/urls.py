from django.urls import path
from products.views import ProductListView, ProductDetailView, ProductImageUploadView
from contact.views import ContactView, OrderView
from users.views import LoginView, RegisterView, WishlistView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Products
    path('api/products/', ProductListView.as_view()),
    path('api/products/upload-image/', ProductImageUploadView.as_view()),
    path('api/products/<str:pk>/', ProductDetailView.as_view()),

    # Contact
    path('api/contact/', ContactView.as_view()),

    # Orders
    path('api/orders/', OrderView.as_view()),

    # Auth
    path('api/auth/register/', RegisterView.as_view()),
    path('api/auth/login/', LoginView.as_view()),
    path('api/auth/refresh/', TokenRefreshView.as_view()),

    # Wishlist
    path('api/wishlist/<str:username>/', WishlistView.as_view()),
]
