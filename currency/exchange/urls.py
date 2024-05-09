from django.contrib import admin
from django.urls import path,include
from . import views
from exchange.views import *

urlpatterns = [
    path('main/', ReactView.as_view(), name="anything"),
    path('get_currencies/', views.GetCurrencies.as_view(), name='get_currencies'),
    path('fetch_exchange_rates/', views.FetchExchangeRates.as_view(), name='fetch_exchange_rates'),
]