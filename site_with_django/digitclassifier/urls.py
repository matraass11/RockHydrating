from django.urls import path
from . import views

urlpatterns = [
    path("", views.none, name="none"),
    path("pred", views.display_prediction, name="pred")
]