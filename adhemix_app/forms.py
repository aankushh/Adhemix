from django.forms import ModelForm
from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.contrib.auth.models import User
from .models import BillingAddress

class CreateUserForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

class BillingAddressForm(UserCreationForm):
    class Meta:
        model = BillingAddress
        fields = '__all__'