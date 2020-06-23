from django.urls import path
from . import views

app_name = 'adhemix_app'

urlpatterns = [
    path('', views.index, name="index"),
    path('about/', views.about, name="about"),
    path('my_account/', views.my_account, name="my_account"),
    path('checkout/', views.checkout, name="checkout"),
    path('login_register/', views.login_register, name="login_register"),
    path('wishlist/', views.wishlist, name="wishlist"),
    path('shop/', views.shop, name="shop"),
    path('order_tracking/', views.order_tracking, name="order_tracking"),
    path('shop_fullwidth/', views.shop_fullwidth, name="shop_fullwidth"),
    path('product_details/', views.product_details, name="product_details"),
    path('product_details_sticky/', views.product_details_sticky, name="product_details_sticky"),
    path('cart/', views.cart, name="cart"),
    path('compare/', views.compare, name="compare"),
    path('contact/', views.contact, name="contact"),
    path('logout/', views.logout, name="logout"),
]