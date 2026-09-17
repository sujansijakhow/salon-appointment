from decimal import Decimal

from django.core.validators import MinValueValidator
from django.db import models

class Service (models.Model):
    name = models.CharField(max_length=120, unique=True)
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    
    duration = models.PositiveIntegerField(
        help_text="Duration in minutes",
        validators=[MinValueValidator(1)]
        
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    
    def __str__(self):
        return f"{self.name} - NPR {self.price} - {self.duration} minutes"


class Appointment(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "pending"
        CONFIRMED = "CONFIRMED", "confirmed"
        COMPLETED = "COMPLETED", "completed"
        CANCELLED = "CANCELLED", "cancelled"
        
    customer_name = models.CharField(max_length=200)
    customer_phone = models.CharField(max_length=10)
    service = models.ForeignKey(
        Service,
        on_delete=models.PROTECT,
        related_name="appointments"
    )
    
    date = models.DateField()
    time = models.TimeField()
    notes = models.TextField(blank=True)
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    class Meta:
        ordering = ["date", "time"]
        constraints = [
            models.UniqueConstraint(
                fields=["service", "date", "time"],
                condition=~models.Q(status="CANCELLED"),
                name="unique_active_slot_per_service",
            )
        ]
    