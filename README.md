# Restaurant Management & QR Ordering System

This is a full-stack restaurant management system built to digitize menus, simplify table ordering using QR codes, and give restaurant owners a clean way to manage incoming orders.

The goal of this project was to solve a very real problem seen in restaurants — physical menus, manual order taking, and lack of a simple order tracking system.

---

## What this project does

- Allows restaurant owners to register and manage their restaurant
- Converts menu images into a structured digital menu using OCR + AI
- Generates QR codes for tables so customers can order directly from their phone
- Provides an admin dashboard to track and update order statuses

---

## Main Features

### Authentication
- JWT-based authentication
- Protected admin routes

### Menu Digitization
- Upload menu images
- OCR extracts text
- AI processes the text into structured menu items (name, price, category)
- Helpful AI suggestions to clean up messy menus

### QR-Based Ordering
- Admin enters number of tables
- Unique QR code generated for each table
- Customers scan QR to view menu and place orders

### Order Management
- Orders are linked to restaurant and table
- Admin dashboard shows all incoming orders
- Order statuses can be updated (pending, preparing, served)

---

## Tech Stack

**Backend**
- Django
- Django REST Framework
- JWT Authentication
- SQLite (development)

**Frontend**
- React
- Vite
- JavaScript

**Other**
- OCR for menu extraction
- AI for menu structuring
- QR code generation

---

## Project Structure

```
RestaurantSystem_SohamPanwalkar/
├── backend/
│   ├── restaurant_backend/
│   ├── restaurant_app/
│   │   ├── ocr/
│   │   ├── qr/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── media/
│   ├── db.sqlite3
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   └── restaurant-frontend/
│       ├── src/
│       ├── public/
│       ├── index.html
│       ├── package.json
│       └── vite.config.js
│
├── README.md
└── .gitignore
```

---

## Running the Project

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
# Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs on:
```
http://127.0.0.1:8000/
```

---

### Frontend

```bash
cd frontend/restaurant-frontend
npm install
npm run dev
```

Frontend runs on:
```
http://localhost:5173/
```

---

## How it works (high level)

1. Admin registers and logs in
2. Menu image is uploaded and processed using OCR + AI
3. Digital menu is stored in the database
4. QR codes are generated for each table
5. Customers scan QR and place orders
6. Admin manages orders from the dashboard

---

## Possible Improvements
- Payments integration
- Real-time order updates using WebSockets
- Better analytics for restaurants
- Manual menu editing UI

---

## Author

**Soham Deepak Panwalkar**  
Computer Science Engineering  
D. J. Sanghvi College
