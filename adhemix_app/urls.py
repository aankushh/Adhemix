from django.urls import path
from . import views
from .apps import AdhemixAppConfig

app_name = AdhemixAppConfig.name

urlpatterns = [
    path('', views.HomeView, name="index"),
    path('about/', views.about, name="about"),
    path('why_us/', views.why_us, name="why_us"),
    path('my_account/', views.my_account, name="my_account"),
    path('checkout/', views.CheckoutView.as_view(), name="checkout"),
    path('login/', views.login_user, name="login"),
    path('register/', views.register, name="register"),

    path('shop/', views.ShopView.as_view(), name="shop"),
    path('place_order/', views.place_order, name="place_order"),
    
    path('order_tracking/', views.order_tracking, name="order_tracking"),
    path('product_details/<slug>', views.ItemDetailView.as_view(), name="product_details"),
    # path('product_details/<slug>', views.product_details_sticky, name="product_details"),

    path('cart/', views.CartView.as_view(), name="cart"),
    path('not_found/', views.not_found, name="not_found"),
    path('compare/', views.compare, name="compare"),
    path('contact/', views.contact, name="contact"),

    path('wishlist/', views.WishlistView.as_view(), name="wishlist"),
    path('add_to_wishlist/<slug>/', views.add_to_wishlist, name="add_to_wishlist"),
    path('remove_from_wishlist/<slug>/', views.remove_from_wishlist, name="remove_from_wishlist"),

    path('logout/', views.user_logout, name="logout"),
    path('contact_message/', views.contact_message, name="contact_message"),
    path('handle_paytm_request/', views.handle_paytm_request, name="handle_paytm_request"),
    
    path('add_to_cart/<slug>/', views.add_to_cart, name="add_to_cart"),
    path('remove_from_cart/<slug>/', views.remove_from_cart, name="remove_from_cart"),
    path('remove_single_item_from_cart/<slug>/', views.remove_single_item_from_cart, name="remove_single_item_from_cart"),
]