from django.shortcuts import render, get_object_or_404, redirect, HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView, DetailView, View
from django.utils import timezone
from django.contrib import messages
from django.views.generic import TemplateView
from django.contrib.auth import authenticate, login, logout

MERCHANT_KEY = ''
MERCHANT_ID = ''


from .forms import CreateUserForm 
from .models import Item, OrderItem, Order, BillingAddress, Wishlist

from paytm import checksum

# Create your views here.
def HomeView(request):
    return render(request, 'adhemix_app/index.html')

class ShopView(ListView):
    # login_url = 'adhemix_app:login'
    model = Item
    paginate_by = 10
    template_name = 'adhemix_app/shop_fullwidth.html'

class ItemDetailView(DetailView):
    # login_url = 'adhemix_app:login'
    model = Item
    template_name = 'adhemix_app/product_details.html'

def about(request):
    context = {
    }
    return render(request, 'adhemix_app/about.html', context)

def why_us(request):
    context = {
    }
    return render(request, 'adhemix_app/why_us.html', context)

def not_found(request):
    context = {

    }
    return render(request, 'adhemix_app/404.html', context)

def contact_message(request):

    if request.method == 'POST':
        name = request.POST['name']
        email = request.POST['email']
        phone = request.POST['phone']
        subject = request.POST['subject']
        message = request.POST['message']
        print(name,subject, message, phone)

    context = {
    }
    return redirect('adhemix_app:index')

@login_required(login_url='adhemix_app:login')
def my_account(request):
    context = {

    }
    return render(request, 'adhemix_app/my_account.html', context)

class CheckoutView(View):
    def get(self, *args, **kwargs):
        context = {}
        return render(self.request, 'adhemix_app/checkout.html', {})

    def post(self, *args, **kwargs):
        street_address = 'Raju ka Ghar'
        apartment_address = 'Bagal Wali Gali'
        country = 'India'
        zip_code = '183920'
        payment_option = 'Card'

        try:
            order = Order.objects.get(user=self.request.user, ordered = False)

            billing_address = BillingAddress(
                user = self.request.user,
                street_address = street_address,
                apartment_address = apartment_address,
                country = country,
                zip_code = zip_code,
                )
            billing_address.save()
            order.billing_address = billing_address
            order.save()
            messages.success(self.request, "Address Details Saved")
            return redirect('adhemix_app:checkout')

        except ObjectDoesNotExist:
            messages.error(self.request, "You Do Not Have an Active Order.")
            return redirect("adhemix_app:cart")

def login_user(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username = username, password=password)
        
        if user is not None:
            login(request, user)
            messages.info(request, "Logged in as " + str(user.username))
            return redirect('/')
        else:
            messages.info(request, 'Username or Password is Incorrect')

    context = {
    }

    return render(request, 'adhemix_app/login.html', context)

def register(request):
    form = CreateUserForm()

    if request.method == 'POST':
        form = CreateUserForm(request.POST)

        if form.is_valid():
            user = form.save()
            username = form.cleaned_data.get('username')

            messages.info(request, "Profile Created Successfully for: "+ username)
            return redirect("adhemix_app:login")

    context = {
    }

    return render(request, 'adhemix_app/register.html', context)

@login_required(login_url='adhemix_app:login')
def add_to_cart(request, slug):
    item = get_object_or_404(Item, slug=slug)
    order_item, created = OrderItem.objects.get_or_create(item=item, user=request.user, ordered=False)
    order_qs = Order.objects.filter(user=request.user, ordered=False)

    if order_qs.exists():
        order = order_qs[0]

        if order.items.filter(item__slug=item.slug).exists():
            order_item.quantity += 1
            order_item.save()
            messages.info(request, "Item quantity was Updated.")
            return redirect("adhemix_app:cart")
        else:
            order.items.add(order_item)
            messages.info(request, "This item was Added to your Cart.")
            return redirect("adhemix_app:cart")

    else:
        ordered_date = timezone.now()
        order = Order.objects.create(user=request.user, ordered_date=ordered_date)
        order.items.add(order_item)
        messages.info(request, "This Item was Added to your Cart.")
        return redirect("adhemix_app:cart")

@login_required(login_url='adhemix_app:login')
def add_to_wishlist(request, slug):
    item = get_object_or_404(Item, slug=slug)

    wishlist_qs = Wishlist.objects.filter(user=request.user)

    if wishlist_qs.exists():
        wishlist = wishlist_qs[0]
        wishlist.items.add(item)
        messages.info(request, "This item was Added to your Wishlist.")
        return redirect("adhemix_app:wishlist")

    else:
        wishlist = Wishlist.objects.create(user=request.user)
        wishlist.items.add(item)
        messages.info(request, "This Item was Added to your Wishlist.")
        return redirect("adhemix_app:wishlist")



@login_required(login_url='adhemix_app:login')
def remove_from_cart(request, slug):
    item = get_object_or_404(Item, slug=slug)
    order_qs = Order.objects.filter(user=request.user, ordered=False)

    if order_qs.exists():
        order = order_qs[0]
        if order.items.filter(item__slug=item.slug).exists():
            order_item = OrderItem.objects.filter(item=item, user=request.user, ordered=False)[0]
            order.items.remove(order_item)
            order_item.delete()
            messages.info(request, "This Item was removed from your Cart.")
            return redirect("adhemix_app:cart")
        else:
            messages.info(request, "This Item is not in your Cart.")
            return redirect("adhemix_app:product_details", slug=slug)
    else:
        messages.info(request, "You do not have an active Order.")
        return redirect("adhemix_app:product_details", slug=slug)


@login_required(login_url='adhemix_app:login')
def remove_from_wishlist(request, slug):
    item = get_object_or_404(Item, slug=slug)
    wishlist_qs = Wishlist.objects.filter(user=request.user)

    if wishlist_qs.exists():
        wishlist = wishlist_qs[0]
        if wishlist.items.filter(slug=item.slug).exists():
            wishlist.items.remove(item)
            messages.info(request, "This Item was removed from your Wishlist.")
            return redirect("adhemix_app:wishlist")
        else:
            messages.info(request, "This Item is not in your Wishlist.")
            return redirect("adhemix_app:product_details", slug=slug)
    else:
        messages.info(request, "Try Adding Your First Item in Wishlist.")
        return redirect("adhemix_app:product_details", slug=slug)


@login_required(login_url='adhemix_app:login')
def remove_single_item_from_cart(request, slug):
    item = get_object_or_404(Item, slug=slug)
    order_qs = Order.objects.filter(user = request.user, ordered = False)

    if order_qs.exists():
        order = order_qs[0]

        if order.items.filter(item__slug=item.slug).exists():
            order_item = OrderItem.objects.filter(item=item, user=request.user, ordered=False)[0]

            if order_item.quantity > 1:
                order_item.quantity -= 1
                order_item.save()
                messages.info(request, "The Item quantity was Updated.")
                return redirect("adhemix_app:cart")
            else:
                order.items.remove(order_item)
                order_item.delete()
                messages.info(request, "The Item was removed from your Cart.")
                return redirect("adhemix_app:cart")
        else:
            messages.info(request, "This Item was not in your Cart.")
            return redirect("adhemix_app:product_details", slug=slug)

    else:
        messages.info(request, "You Do Not Have an Active Oeder.")

@login_required(login_url='adhemix_app:login')
def shop(request):
    context = {
    }
    return render(request, 'adhemix_app/shop.html', context)

@login_required(login_url='adhemix_app:login')
def order_tracking(request):
    context = {
    }
    return render(request, 'adhemix_app/order_tracking.html', context)

def shop_fullwidth(request):
    context = {
    }
    return render(request, 'adhemix_app/shop_fullwidth.html', context)

@login_required(login_url='adhemix_app:login')
def product_details_sticky(request, slug):
    print(slug)
    context = {
        'slug':slug
    }
    return render(request, 'adhemix_app/product_details_sticky.html', context)

@login_required(login_url='adhemix_app:login')
def compare(request):
    context = {
    }
    return render(request, 'adhemix_app/compare.html', context)


def contact(request):
    context = {
    }
    return render(request, 'adhemix_app/contact.html', context)

def place_order(request):

    order_qs = Order.objects.filter(user=request.user,ordered = False)
    if order_qs.exists():
        order = order_qs[0]
        param_dict = {
                'MID':MERCHANT_ID,
                'ORDER_ID': str(order.id),
                'TXN_AMOUNT': str(order.get_paying_amount()),
                'CUST_ID': str(order.user.email),
                'INDUSTRY_TYPE_ID':'Retail',
                'WEBSITE':'WEBSTAGING',
                'CHANNEL_ID':'WEB',
                'CALLBACK_URL':'http://127.0.0.1:8000/handle_paytm_request/',
            }
        

        param_dict['CHECKSUMHASH'] = checksum.generate_checksum(param_dict, MERCHANT_KEY)
        context = {
            'param_dict' : param_dict
        }
        order.ordered = True

        return render(request, 'paytm/paytm.html', context)
    else:
        messages.info(request, "No Order Found. Please Try Again.")
        return redirect("adhemix_app:not_found")



@login_required(login_url='adhemix_app:login')
def user_logout(request):
    logout(request)
    return redirect("adhemix_app:index")

class CartView(View):
    def get(self, *args, **kwargs):
        try:
            order = Order.objects.get(user=self.request.user, ordered=False)
            context = {
                'order':order,
            }
            return render(self.request, "adhemix_app/cart.html", context)
        except ObjectDoesNotExist:
            messages.error(self.request, "You Do Not Have an Active Order.")
            return redirect("/")

class WishlistView(View):
    def get(self, *args, **kwargs):
        try:
            wishlist_items = Wishlist.objects.get(user = self.request.user)
            context = {
                'wishlist_items':wishlist_items,
            }
            return render(self.request, "adhemix_app/wishlist.html", context)

        except ObjectDoesNotExist:
            messages.error(self.request, "Your Wishlist is Empty. Try adding a Product in Wishlist.")
            return redirect("/")

#paytm will handle post request
@csrf_exempt
def handle_paytm_request(request):
    form = request.POST
    response_dict = {}
    for i in forms.keys():
        response_dict[i] = form[i]
        if i == "CHECKSUMHASH":
            cheksum = form[i]
       
    verify = checksum.verify_checksum(response_dict, MERCHANT_KEY, checksum)
    if verify:
        if response_dict['RESPONSE'] == '01':
            print('successful')
        else:
            print('ordr was not successfull because' + response_dict['RESPMSG'])
    return render(request,"paytm/payment_status.html", {'response':response_dict})
