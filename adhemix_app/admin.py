from django.contrib import admin
from .models import Order, OrderItem, BillingAddress, Item, Wishlist

# Register your models here.
admin.site.register((Order, OrderItem, BillingAddress, Item, Wishlist))
