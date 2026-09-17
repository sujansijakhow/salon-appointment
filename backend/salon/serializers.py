from rest_framework import serializers

from .models import Appointment, Service


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ["id", "name", "price", "duration", "created_at"]

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be a positive number.")
        return value

    def validate_duration(self, value):
        if value <= 0:
            raise serializers.ValidationError("Duration must be greater than zero.")
        return value


class AppointmentSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source="service.name", read_only=True)
    service_price = serializers.DecimalField(
        source="service.price", max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = Appointment
        fields = [
            "id",
            "customer_name",
            "customer_phone",
            "service",
            "service_name",
            "service_price",
            "date",
            "time",
            "notes",
            "status",
            "created_at",
        ]

    def validate_customer_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Customer name cannot be empty.")
        return value

    def validate_customer_phone(self, value):
        if not value.strip():
            raise serializers.ValidationError("Customer phone cannot be empty.")
        return value

    def validate(self, attrs):
        service = attrs.get("service") or getattr(self.instance, "service", None)
        date = attrs.get("date") or getattr(self.instance, "date", None)
        time = attrs.get("time") or getattr(self.instance, "time", None)

        conflict_qs = Appointment.objects.filter(
            service=service, date=date, time=time
        ).exclude(status=Appointment.Status.CANCELLED)

        if self.instance is not None:
            conflict_qs = conflict_qs.exclude(pk=self.instance.pk)

        if conflict_qs.exists():
            raise serializers.ValidationError(
                {"non_field_errors": ["This service is already booked for the selected date and time."]}
            )

        return attrs


class AppointmentStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ["status"]

    def validate_status(self, value):
        valid = [choice for choice, _ in Appointment.Status.choices]
        if value not in valid:
            raise serializers.ValidationError(f"Status must be one of {valid}.")
        return value