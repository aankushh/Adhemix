from django.shortcuts import render

# Create your views here.

def index(request):
    context = {

    }
    return render(request, 'adhemix_app/index.html', context)

def about(request):
    context = {

    }
    return render(request, 'adhemix_app/404.html', context)

def my_account(request):
    context = {

    }
    return render(request, 'adhemix_app/my_account.html', context)

def checkout(request):
    context = {

    }
    return render(request, 'adhemix_app/checkout.html', context)

def login_register(request):
    context = {

    }
    return render(request, 'adhemix_app/login_register.html', context)

def wishlist(request):
    context = {

    }
    return render(request, 'adhemix_app/wishlist.html', context)

def shop(request):
    context = {

    }
    return render(request, 'adhemix_app/shop.html', context)

def order_tracking(request):
    context = {

    }
    return render(request, 'adhemix_app/order_tracking.html', context)

def shop_fullwidth(request):
    context = {

    }
    return render(request, 'adhemix_app/shop_fullwidth.html', context)

def product_details(request):
    context = {

    }
    return render(request, 'adhemix_app/product_details.html', context)

def product_details_sticky(request):
    context = {

    }
    return render(request, 'adhemix_app/product_details_sticky.html', context)

def cart(request):
    context = {

    }
    return render(request, 'adhemix_app/cart.html', context)

def compare(request):
    context = {

    }
    return render(request, 'adhemix_app/compare.html', context)

def contact(request):
    context = {

    }
    return render(request, 'adhemix_app/contact.html', context)

def logout(request):
    context = {

    }
    return render(request, 'adhemix_app/404.html', context)
