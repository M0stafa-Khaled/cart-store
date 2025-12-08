<div align="center">
  <img src="web/public/logo.png" alt="Cart Store Logo" width="120">
  <h1>Cart Store</h1>
  <p><strong>Modern E-commerce Solution</strong></p>
</div>

A high-performance, full-featured e-commerce platform built with a modern technology stack.

## 🚀 Tech Stack

### Frontend (`web`)

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Shadcn UI](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3068B7?style=for-the-badge&logo=zod&logoColor=white)
![Auth.js](https://img.shields.io/badge/Auth.js-purple?style=for-the-badge)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

### Backend (`api`)

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=Cloudinary&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=Stripe&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-blue?style=for-the-badge)

### Tools

![NPM](https://img.shields.io/badge/npm-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)

---

## ✨ Features

*   **🔐 Authentication & Authorization**
    *   Secure Login/Register
    *   Email Verification & Password Reset
    *   Role-based access control (Admin/User)
    *   Secure Session Management with Refresh Tokens

*   **🛍️ Product Management**
    *   Advanced Product Filtering & Search
    *   Categories, Sub-categories, and Brands
    *   Product Variants (Colors, Sizes)
    *   Rich Text Descriptions & Image Galleries

*   **🛒 Shopping Experience**
    *   Optimistic Shopping Cart
    *   Local Storage based Wishlist
    *   Coupon Code System
    *   Real-time Stock Management

*   **💳 Checkout & Orders**
    *   Secure Stripe Integration
    *   Order Tracking & History
    *   Order Status Management (Pending, Paid, Delivered, etc.)
    *   Address Management

*   **📊 Admin Dashboard**
    *   Sales Analytics & Charts
    *   User & Order Management
    *   Inventory Control

---

## 🛠️ Installation & Setup

### Prerequisites
*   Node.js (v18 or higher)
*   PostgreSQL Database

### 1. Clone the repository
```bash
git clone <repository-url>
cd cart-store
```

### 2. Install Frontend Dependencies
```bash
cd web
npm install
```

### 3. Install Backend Dependencies
```bash
cd api
npm install
```

### 4. Environment Configuration

#### Backend (`api/.env`)
Create a `.env` file in `api` based on `.env.example`:
```env
# Application
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/cart_store?schema=public"

# Auth
JWT_SECRET="your-super-secret-jwt-key"
ACCESS_TOKEN_EXPIRES=1d
REFRESH_TOKEN_EXPIRES=3d

# Email (SMTP)
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="user@example.com"
SMTP_PASSWORD="password"
EMAIL_FROM="noreply@example.com"

# Storage
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Stripe
STRIPE_PUBLISH_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

#### Frontend (`web/.env`)
Create a `.env` file in `web` based on `.env.example`:
```env
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:300

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="next-auth-secret-key"
AUTH_TRUST_HOST=true


```

### 5. Database Setup
Initialize the database using Prisma:
```bash
# Navigate to the api directory or run from root using filter
cd api
npm run db:generate
npm run db:migrate
npm run db:seed # Optional: Seed initial data
```

### 6. Running the Application
Run the frontend and backend applications:

```bash
# From the web directory
npm run dev

# From the api directory
npm run start:dev
```

*   **Frontend**: http://localhost:3000
*   **Backend API**: http://localhost:5000 (NestJS default) -> *Note: Check your specific port configuration.*

---

## 📂 Project Structure

```
cart-store/
├── web/                 # Next.js Frontend Application
│   └── src/
│       ├── app/         # App Router Pages
│       │   ├── components/  # Reusable UI Components
│       │   ├── lib/         # Utilities & API Clients
│       │   └── hooks/       # Custom React Hooks
│       └── public/          # Static Assets
│    
│── api/                 # NestJS Backend Application
│   └── src/
│       ├── common/      # Common Utilities & Services
│       ├── modules/     # Feature Modules (Auth, Products, Orders)
│       │   ├── auth/    # Authentication Module
│       │   ├── products/ # Products Module
│       │   ├── orders/   # Orders Module
│       │   └── users/    # Users Module
│       └── prisma/      # Database Schema & Seeds
│    
└── README.md            # Workspace Configuration
```

## 📄 License

This project is licensed under the MIT License.
