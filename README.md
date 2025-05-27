
# 🏨 Hotel Booking App

A full-stack hotel booking platform where users can browse, book hotels, save favorites, and securely pay online. Built using **React** for the frontend and **Node.js (Express)** with **MySQL** and **Sequelize** for the backend. Secure authentication is handled with **Bcrypt**, and payments are integrated via **Stripe**.

---

## 🔧 Tech Stack

### Frontend
- React
- React Router
- Custom CSS

### Backend
- Node.js
- Express.js
- Sequelize (ORM)
- MySQL
- Bcrypt
- JWT (Authentication)
- Stripe (Payments)

---

## 🚀 Features

- 🔍 Search and browse hotels
- 🛏️ Book hotel rooms
- 💖 Save and manage favorite hotels
- 🔐 Secure login & registration using Bcrypt
- 💳 Stripe-powered payments
- 🗂️ Persistent storage using MySQL & Sequelize

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Misha2007/booking_system.git
cd booking_system
````

---

## 🖥️ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory with the following content:

```env
PORT=port

DATABASE_USER=your_mysql_user
DATABASE_PASSWORD=your_mysql_password
DATABASE_HOST=your_database_host
DATABASE_DIALECT=your_database_dialect

JWT_SECRET=your_jwt_secret
secretKey=your_stripe_secret_key
```

Create a `config` folder in the `backend` directory and create there a `auth.config.js`  file with the following content:

```auth.config.js
export default {
  secret:
    "your_secret_key",
};
```

In addition create in the same directory `backend/config` create a `config.json` file with the following content:

```config.json
{
  "development": {
    "username": "your_mysql_user",
    "password": "your_mysql_password",
    "database": "booking_system",
    "host": "your_database_host",
    "dialect": "mysql"
  },
  "test": {
    "username": "your_mysql_user",
    "password": "your_mysql_password",
    "database": "booking_system",
    "host": "your_database_host",
    "dialect": "mysql"
  },
  "production": {
    "username": "your_mysql_user",
    "password": "your_mysql_password",
    "database": "booking_system",
    "host": "your_database_host",
    "dialect": "mysql"
  }
}
```


Then start the server:

```bash
node index.js
```

---

## 💻 Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 📁 Project Structure

```
booking_system/
│
├── frontend/          # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── ...
│
├── backend/           # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── ...
```

---

## 🛡️ Security & Auth

* Passwords are hashed with **Bcrypt**
* User sessions are managed using **JWT**
* Sensitive keys and credentials stored in `.env` files

---

## 💳 Payments

* Integrated with **Stripe Checkout**
* Handles secure booking payments in real-time

---

## 📌 License

This project is open-source and available under the [MIT License](LICENSE).

```

MIT License

Copyright (c) 2025 Misha2007

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```
