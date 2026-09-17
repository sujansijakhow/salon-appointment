from django.urls import path

from . import views

urlpatterns = [
    path("services", views.services_list),
    path("services/<int:pk>", views.service_detail),
    
    path("appointments", views.appointments_list),
    path("appointments/<int:pk>/status", views.appointment_status),
    path("appointments/<int:pk>", views.appointment_detail),
]