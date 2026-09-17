from django.db.models import ProtectedError
from django.shortcuts import get_object_or_404
from rest_framework import status as http_status
from rest_framework.decorators import api_view
from rest_framework.response import Response



from .models import Appointment, Service
from .serializers import (
    AppointmentSerializer,
    AppointmentStatusSerializer,
    ServiceSerializer,
)


@api_view(["GET", "POST"])
def services_list(request):
    if request.method == "GET":
        services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True)
        
        return Response(serializer.data)
    

    serializer = ServiceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            serializer.data, 
            status=http_status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=http_status.HTTP_400_BAD_REQUEST)


@api_view(["PUT", "DELETE"])
def service_detail(request, pk):
    service = get_object_or_404(Service, pk=pk)

    if request.method == "PUT":
        serializer = ServiceSerializer(service, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=http_status.HTTP_400_BAD_REQUEST)

    try:
        service.delete()
        
    except ProtectedError:
        return Response(
            {"detail": "Cannot delete a service that has existing appointments."},
            status=http_status.HTTP_409_CONFLICT,
        )
    return Response(status=http_status.HTTP_204_NO_CONTENT)



@api_view(["GET", "POST"])
def appointments_list(request):
    if request.method == "GET":
        appointments = Appointment.objects.select_related("service").all()
        status_param = request.query_params.get("status")
        if status_param:
            appointments = appointments.filter(status=status_param.upper())
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

    serializer = AppointmentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=http_status.HTTP_201_CREATED)
    return Response(serializer.errors, status=http_status.HTTP_400_BAD_REQUEST)


@api_view(["PATCH"])
def appointment_status(request, pk):
    appointment = get_object_or_404(Appointment, pk=pk)
    
    serializer = AppointmentStatusSerializer(
        appointment, 
        data=request.data, 
        partial=True
    )
    if serializer.is_valid():
        serializer.save()
        return Response(AppointmentSerializer(appointment).data)
    return Response(serializer.errors, status=http_status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
def appointment_detail(request, pk):
    appointment = get_object_or_404(Appointment, pk=pk)
    appointment.delete()
    
    
    return Response(status=http_status.HTTP_204_NO_CONTENT)