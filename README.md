# 🍽️ Restaurant Management & QR Ordering System

A full-stack restaurant management platform that allows restaurant owners to digitize menus using OCR + AI, generate QR codes for tables, and manage customer orders in real time through an admin dashboard.

This system replaces physical menus and manual order handling with a modern, scalable solution.

---

## ✨ Features

### 🔐 Authentication
- JWT-based authentication
- Role-based access (restaurant admins)

### 🏪 Restaurant Management
- Admins can register and manage their restaurant
- Secure, protected admin routes

### 🧾 AI-Powered Menu Digitization
- Upload menu images
- OCR extracts text from images
- AI converts raw text into structured menu data:
  - Categories
  - Item names
  - Prices
  - Descriptions
- AI suggestions for cleanup and normalization

### 📱 QR Code Table Ordering
- Admin enters number of tables
- Unique QR codes generated per table
- QR codes link customers directly to the restaurant menu

### 🛒 Customer Ordering Flow
- Scan QR → view menu
- Place orders from phone (no app required)
- Orders are linked to restaurant and table

### 📊 Order Management Dashboard
- View incoming orders
- Update order status:
  - Pending
  - Preparing
  - Served
- Clear separation of active and completed orders

---

## 🧠 High-Level Architecture

```
Customer (QR Scan)
        ↓
 REST API (JWT Auth)
        ↓
 Menu & Order Service
        ↓
 Admin Dashboard
```

OCR + AI pipeline is triggered during menu upload and stores structured data in the database.

---

## 🛠️ Tech Stack

**Backend**
- Django
- Django REST Framework
- JWT Authentication

**AI / OCR**
- OCR engine for text extraction
- AI pipeline for menu structuring and suggestions

**Other**
- QR code generation
- RESTful API design

---

## 📂 Project Structure (Simplified)

```
backend/
├── authentication/
├── restaurant/
├── menu/
├── orders/
├── ocr_pipeline/
├── qr/
├── manage.py
└── requirements.txt
```

---

## ⚙️ Setup & Run

### 1. Clone the repository
```bash
git clone https://github.com/notsamaltman/RestaurantSystem_SohamPanwalkar.git
cd RestaurantSystem_SohamPanwalkar/backend
```

### 2. Create a virtual environment
```bash
python -m venv venv
source venv/bin/activate
# Windows: venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Run migrations
```bash
python manage.py migrate
```

### 5. Start the server
```bash
python manage.py runserver
```

Server runs at:
```
http://127.0.0.1:8000/
```

---

## 🔐 Authentication Flow
1. Admin registers/logs in
2. JWT access & refresh tokens issued
3. Tokens required for protected endpoints (menu upload, QR generation, order updates)

---

## 🚀 Future Improvements
- Payment gateway integration
- WebSocket-based real-time order updates
- Analytics dashboard
- Multi-restaurant support
- Admin UI for manual menu edits

---

## 👨‍💻 Author

**Soham Deepak Panwalkar**  
Computer Science Engineering  
D. J. Sanghvi College
