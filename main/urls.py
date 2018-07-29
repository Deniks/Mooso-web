from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('author/', views.author, name='author')
]