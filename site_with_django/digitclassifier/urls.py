from django.urls import path
from . import views

urlpatterns = [
    path("", views.default, name="default"),
    path("predictAPI", views.predictAPI, name="predictAPI")
]