# WambuXtore

A full-stack electronics e-commerce platform built with a decoupled architecture — a Django REST API backend and a React frontend — designed to give customers a smooth browsing, wishlisting, and ordering experience.

**Live site:** [wambuxtore frontend](https://wambuxtore-frontend.vercel.app/)
**API backend:** (wambuxtore-backend-mfml)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Known Limitations](#known-limitations)
- [Roadmap](#roadmap)
- [Author](#author)

---

## Overview

WambuXtore is a personal e-commerce project focused on electronics retail, built to demonstrate a production-style full-stack setup: a REST API backend, a decoupled frontend, cloud image hosting, transactional email, and a hosted dual-database architecture. The customer-facing side supports account registration, product browsing, wishlisting, cart management, and order placement with email confirmation. Admin/inventory management is currently handled directly via MongoDB Atlas rather than through an in-app dashboard.

---

## Features

### Customer Accounts
- Register a new account with email
- Login / logout with JWT-based authentication
- Account and order history tracked per user

### Product Browsing
- Browse the electronics catalog
- View individual product details

### Wishlist
- Add and remove products from a personal wishlist
- Wishlist persists per logged-in account

### Cart & Ordering
- Add products to cart
- Adjust cart before checkout
- Place an order (no payment gateway yet — orders are recorded and fulfilled manually)
- Automatic order confirmation email sent via SendGrid on successful order placement

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, deployed on Vercel |
| Backend | Django, Django REST Framework |
| Auth Database | PostgreSQL |
| App Data Database | MongoDB Atlas |
| Image Hosting | Cloudinary (cloud name: `dxj2tlp9p`) |
| Transactional Email | SendGrid via `django-anymail` |
| Backend Hosting | Render |
| Frontend Hosting | Vercel |

### Why two databases?

The project uses a dual-database architecture: **PostgreSQL** handles Django's built-in authentication system (users, sessions, permissions), while **MongoDB Atlas** stores the application's core data — products, carts, wishlists, and orders. This split leans on Django's mature, battle-tested auth system while keeping flexible, document-style data (like product catalogs) in a schema-less store better suited to it.

---

## Architecture

```
┌─────────────────┐         HTTPS / REST API         ┌──────────────────────┐
│  React Frontend │ ───────────────────────────────▶ │   Django Backend     │
│   (Vercel)      │ ◀─────────────────────────────── │   (Render)           │
└─────────────────┘         JSON responses            └──────────┬───────────┘
                                                                   │
                                        ┌──────────────────────────┼──────────────────────────┐
                                        │                          │                          │
                               ┌────────▼────────┐       ┌─────────▼─────────┐      ┌─────────▼─────────┐
                               │   PostgreSQL     │       │   MongoDB Atlas    │      │     Cloudinary     │
                               │ (Auth: users,    │       │ (Products, carts,  │      │  (Product images)   │
                               │  sessions)        │      │  wishlists, orders)│      │                     │
                               └──────────────────┘       └────────────────────┘      └─────────────────────┘
                                                                   │
                                                          ┌─────────▼─────────┐
                                                          │     SendGrid       │
                                                          │ (Order confirmation │
                                                          │      emails)        │
                                                          └─────────────────────┘
```

All API communication is centralized on the frontend through a single config file (`src/api.js`), which resolves the base API URL — this was put in place after an earlier bug where the API path was being duplicated in requests.

---

## How It Works

1. **A visitor registers** with an email and password. Django handles authentication and issues a JWT on login.
2. **The catalog loads** from MongoDB Atlas via a Django REST Framework endpoint, with product images served from Cloudinary.
3. **A logged-in user can wishlist products** or add them to their cart — both are tied to their account and stored in MongoDB.
4. **On checkout**, an order record is created (no payment processing yet — it's captured as a pending manual-fulfillment order).
5. **SendGrid sends an order confirmation email** to the customer automatically once the order is placed.
6. **On the backend**, all inventory, order fulfillment, and catalog management is currently done manually through the MongoDB Atlas dashboard rather than an in-app admin panel.

---

## Project Structure

```
wambuxtore/
├── backend/                 # Django project
│   ├── manage.py
│   ├── requirements.txt
│   └── ...
├── frontend/                 # React project
│   ├── src/
│   │   ├── api.js            # Centralized API base URL config
│   │   └── ...
│   └── package.json
└── README.md
```
*(Adjust this to match your actual repo layout if it differs.)*

---

## Getting Started

### Backend

```bash
# from the project root
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1      # Windows PowerShell
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Make sure the environment variables below are set before running either side.

---

## Environment Variables

**Backend (`.env`)**
```
DATABASE_URL=[YOUR_POSTGRES_URL]
MONGO_URI=[YOUR_MONGODB_ATLAS_URI]
CLOUDINARY_CLOUD_NAME=dxj2tlp9p
CLOUDINARY_API_KEY=[YOUR_CLOUDINARY_API_KEY]
CLOUDINARY_API_SECRET=[YOUR_CLOUDINARY_API_SECRET]
SENDGRID_API_KEY=[YOUR_SENDGRID_API_KEY]
DEFAULT_FROM_EMAIL=mantelmanu31@gmail.com
SECRET_KEY=[YOUR_DJANGO_SECRET_KEY]
```

**Frontend (`.env`)**
```
REACT_APP_API_BASE_URL=[YOUR_RENDER_BACKEND_URL]
```

---

## Known Limitations

- **No payment gateway yet** — orders are placed and recorded but not paid for in-app; fulfillment is manual.
- **No admin dashboard** — all product and order management happens directly through MongoDB Atlas rather than a built-in interface.
- **Transactional email may be interrupted** — the SendGrid free tier has expired; order confirmation emails will resume once the subscription is renewed.
- **Product fetch performance** — catalog loading is currently slower than intended and is a known area for optimization.
- Emails have also occasionally landed in spam pending setup of a custom sending domain.

---

## Roadmap

- [ ] Integrate a payment gateway (e.g. M-Pesa via Flutterwave/Daraja, plus card support)
- [ ] Renew SendGrid subscription to restore reliable order confirmation emails
- [ ] Build an in-app admin dashboard (manage products, view/update orders, inventory control) to replace manual MongoDB Atlas management
- [ ] Optimize product-fetching API endpoints for faster catalog load times (indexing, pagination, caching)
- [ ] Expand the API surface (more granular endpoints for filtering, sorting, search)
- [ ] Set up a custom email sending domain to keep confirmation emails out of spam

---

## Author

**Emmanuel Wambua**
Full Stack Developer | BIT Student, Kenyatta University
Email: mantelmanu31@gmail.com
