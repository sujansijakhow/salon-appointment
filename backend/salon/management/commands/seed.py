from datetime import date, time, timedelta

from django.core.management.base import BaseCommand
from django.db import transaction

from salon.models import Appointment, Service


class Command(BaseCommand):
    help = "Seed the database with sample services and appointments."

    def add_arguments(self, parser):
        parser.add_argument(
            "--flush",
            action="store_true",
            help="Delete existing services and appointments before seeding.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        if options["flush"]:
            Appointment.objects.all().delete()
            Service.objects.all().delete()
            self.stdout.write(self.style.WARNING("Cleared existing services and appointments."))

        services_data = [
            {"name": "Hair Trimming", "price": 800, "duration": 30},
            {"name": "Hair Coloring", "price": 2000, "duration": 120},
            {"name": "Makeup", "price": 4500, "duration": 60},
        ]

        services = {}
        for data in services_data:
            service, created = Service.objects.get_or_create(
                name=data["name"],
                defaults={"price": data["price"], "duration": data["duration"]},
            )
            services[data["name"]] = service
            status_label = "created" if created else "already exists"
            self.stdout.write(f"Service '{service.name}' {status_label}.")

        today = date.today()
        appointments_data = [
            {
                "customer_name": "Sujan Sijakhow",
                "customer_phone": "9804000001",
                "service": services["Hair Trimming"],
                "date": today + timedelta(days=1),
                "time": time(10, 0),
                "status": Appointment.Status.PENDING,
                "notes": "",
            },
            {
                "customer_name": "Rameshwor Yadav",
                "customer_phone": "9800000002",
                "service": services["Makeup"],
                "date": today + timedelta(days=1),
                "time": time(11, 0),
                "status": Appointment.Status.CONFIRMED,
                "notes": "Prefers organic products",
            },
            {
                "customer_name": "Gita Halwai",
                "customer_phone": "9800000003",
                "service": services["Hair Coloring"],
                "date": today + timedelta(days=2),
                "time": time(14, 0),
                "status": Appointment.Status.COMPLETED,
                "notes": "",
            },
            {
                "customer_name": "Hari Bahadur",
                "customer_phone": "9800000004",
                "service": services["Hair Trimming"],
                "date": today - timedelta(days=1),
                "time": time(9, 0),
                "status": Appointment.Status.CANCELLED,
                "notes": "Rescheduling requested",
            },
        ]

        for data in appointments_data:
            appointment, created = Appointment.objects.get_or_create(
                service=data["service"],
                date=data["date"],
                time=data["time"],
                defaults={
                    "customer_name": data["customer_name"],
                    "customer_phone": data["customer_phone"],
                    "status": data["status"],
                    "notes": data["notes"],
                },
            )
            status_label = "created" if created else "already exists"
            self.stdout.write(f"Appointment for '{appointment.customer_name}' {status_label}.")

        self.stdout.write(self.style.SUCCESS("Seeding complete."))