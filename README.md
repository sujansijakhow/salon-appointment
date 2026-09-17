# Salon Booking System

A simple app for salon staff to manage services and book customer appointments.

## Tech Stack

- Frontend: React + TypeScript (Vite), Tailwind CSS
- Backend: Django REST Framework
- Database: SQLite

## How to Run

### Backend

cd backend
python -m venv venv
venv\Scripts\Activate.ps1

pip install -r requirements.txt
python manage.py migrate
python manage.py seed

python manage.py runserver

Backend runs at `http://localhost:8000`.

### Frontend

Open a new terminal:

cd frontend
npm install
copy .env.example .env
npm run dev

Frontend runs at `http://localhost:5173`.

Both servers need to be running at the same time.

## Features

- Manage services (add, edit, delete)
- Book appointments with a service, date, time, and customer details
- View all appointments in a table
- Filter appointments by status (Pending, Confirmed, Completed, Cancelled)
- Filter appointments by date
- Search appointments by customer name or phone
- Update appointment status, following a fixed flow (Pending → Confirmed → Completed, or Cancelled)
- Prevents double-booking the same service at the same date and time
- Responsive layout for smaller screens

## Sample Data

`python manage.py seed` adds 3 sample services and 4 sample appointments. Safe to run again it won't create duplicates. Use `python manage.py seed --flush` to reset and reseed.

## API Endpoints

| Method | Endpoint | What it does |
|--------|----------|---------------|
| GET | /api/services | List services |
| POST | /api/services | Add a service |
| PUT | /api/services/:id | Edit a service |
| DELETE | /api/services/:id | Delete a service |
| GET | /api/appointments | List appointments (supports `?status=`, `?date=`, `?search=`) |
| POST | /api/appointments | Book an appointment |
| PATCH | /api/appointments/:id/status | Change appointment status |
| DELETE | /api/appointments/:id | Delete an appointment |

## Key Decisions

- Prices use Decimal (not float) to avoid rounding errors with money.
- Double-booking is blocked at the database level, not just in the form so it can't be bypassed even by accident.
- Cancelled appointments free up their time slot so it can be booked again.
- Deleting a service that already has appointments is blocked, to avoid losing appointment history.
- Status updates use a separate, focused endpoint so other appointment details can't be changed accidentally.
