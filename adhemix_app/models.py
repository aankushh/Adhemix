from django.db import models
from django.conf import settings
from django.shortcuts import reverse
from django_countries.fields import CountryField
from django.utils.text import slugify
from django.dispatch import receiver
import PIL
from django.db.models.signals import post_delete
# Create your models here.

CATEGORY_CHOICES = (
    ('tg', 'Tile Grounting'),
    ('tc', 'Tile Care'),
    ('ta', 'Tile Adhesive')
)

LABEL_CHOICES = (
    ('p', 'primary'),
    ('s', 'secondary'),
    ('d', 'danger')
)

class Item(models.Model):
    title = models.CharField(max_length=300)
    price = models.FloatField()
    image = models.ImageField()
    discount_price = models.FloatField(blank=True, null=True)
    category = models.CharField(choices = CATEGORY_CHOICES, max_length = 50)
    label = models.CharField(choices=LABEL_CHOICES, max_length=50)
    description = models.TextField()
    slug = models.SlugField(max_length=300, unique=True, blank=True)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("adhemix_app:product_details", kwargs={"slug": self.slug})

    def get_add_to_cart_url(self):
        return reverse("adhemix_app:add_to_cart", kwargs={"slug": self.slug})

    def get_remove_from_cart_url(self):
        return reverse("adhemix_app:remove_from_cart", kwargs={'self': self.slug})

    def _get_unique_slug(self):
        slug = slugify(self.title)
        unique_slug = slug
        num = 1
        while Item.objects.filter(slug=unique_slug).exists():
            unique_slug = '{}-{}'.format(slug, num)
            num += 1
        return unique_slug

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self._get_unique_slug()
        super().save(*args, **kwargs)

@receiver(post_delete, sender=Item)
def submission_delete(sender, instance, **kwargs):
    instance.thumbnail.delete(False) 

class Wishlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    items = models.ManyToManyField(Item)

    def __str__(self):
        return self.user.username


class OrderItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    ordered = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.quantity} of {self.item.title}"

    def get_total_item_price(self):
        return self.quantity * self.item.price

    def get_total_discount_price(self):
        return self.quantity * self.item.discount_price

    def get_amount_saved(self):
        return self.get_total_item_price() - self.get_total_discount_price()

    def get_final_price(self):
        if self.item.discount_price:
            return self.get_total_discount_price()
        else:
            return self.get_total_item_price()

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE)

    items = models.ManyToManyField(OrderItem)
    start_date = models.DateTimeField(auto_now_add=True)
    ordered_date = models.DateTimeField()
    ordered = models.BooleanField(default=False)
    billing_address = models.ForeignKey('BillingAddress', on_delete=models.SET_NULL, null=True)
    
    def __str__(self):
        return self.user.username
    
    def get_total(self):
        total = 0

        for order_item in self.items.all():
            total += order_item.get_final_price()
        return total

    def get_paying_amount(self):
        return self.get_total() - 20

class BillingAddress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    street_address = models.CharField(max_length=100)
    apartment_address = models.CharField(max_length=100)
    country = CountryField(multiple=False)
    zip_code = models.CharField(max_length=20)

    def __str__(self):
        return self.user.username