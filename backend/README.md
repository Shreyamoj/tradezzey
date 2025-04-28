
# Trading App Backend

This is the Django backend for the trading application.

## Setup

1. Create a virtual environment:
```
python -m venv venv
```

2. Activate the virtual environment:
```
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```
pip install django djangorestframework django-cors-headers
```

4. Run migrations:
```
python manage.py migrate
```

5. Create a superuser:
```
python manage.py createsuperuser
```

6. Run the server:
```
python manage.py runserver
```

## API Documentation

The API documentation is available at `/api/docs/` when the server is running.
