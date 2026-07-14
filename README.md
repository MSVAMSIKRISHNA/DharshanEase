<h1 align="center">
  🛕 DharshanEase
</h1>

<p align="center">
  <b>A modern full-stack web platform for temple Darshan ticket booking, donation management, and temple administration.</b>
</p>

<p align="center">
  <a href="https://dharshan-ease.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🌐%20Live%20Demo-dharshan--ease.vercel.app-4F46E5?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Deployed-Vercel%20%7C%20Railway-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

---

## 📖 Overview

**DharshanEase** is a comprehensive temple management and Darshan booking platform that bridges the gap between devotees and temples. It enables users to browse temples, book Darshan slots, make donations, rate temples, submit feedback, and manage their bookings — all from one seamless interface. Temple organizers and admins get powerful dashboards to manage operations efficiently.

---

## ✨ Features

### 👤 For Devotees (Users)
- 🔍 **Browse Temples** — Discover temples with search, filter & sort options
- 📅 **Book Darshan Slots** — Select available time slots and confirm bookings
- 🎫 **E-Tickets with QR Code** — Download PDF tickets with QR codes for entry
- 💳 **Donations** — Make donations to temples securely
- ⭐ **Ratings & Reviews** — Rate and review temples
- 💬 **Feedback** — Submit feedback about the platform and temple experience
- 🔔 **Notifications** — Receive booking confirmations and updates
- ❤️ **Wishlist** — Save favourite temples for later
- 👤 **Profile Management** — Manage personal details and view booking history

### 🏛️ For Temple Organizers
- 🛕 **Temple Management** — Add, edit, and manage temple listings
- 🗓️ **Slot Management** — Create and manage Darshan time slots
- 📊 **Organizer Dashboard** — View bookings, revenue, and slot occupancy
- 📑 **Reports** — Export reports for bookings and revenue

### 🔑 For Admins
- 👥 **User Management** — View, manage, and moderate all users
- 🏛️ **Temple Moderation** — Approve or manage all temple listings
- 📈 **Analytics Dashboard** — Platform-wide analytics and insights
- 💰 **Donation Tracking** — Monitor and manage all donations
- 🗒️ **Audit Logs** — Full audit trail for platform actions
- 📬 **Feedback & Ratings Moderation** — Review user feedback and ratings

---

## 🛠️ Tech Stack

### Frontend (`/client`)
| Technology | Purpose |
|---|---|
| **React 18** | UI Framework |
| **Vite** | Build tool & dev server |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client |
| **Bootstrap 5** | UI components & grid |
| **Lucide React** | Icon library |
| **Recharts** | Charts & analytics |
| **QRCode.React** | QR code generation |
| **jsPDF + html2canvas** | PDF ticket generation |
| **date-fns** | Date utilities |

### Backend (`/server`)
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT** | Authentication (Access + Refresh tokens) |
| **bcryptjs** | Password hashing |
| **Nodemailer** | Email notifications |
| **Multer** | File uploads (temple images) |
| **PDFKit** | Server-side PDF generation |
| **QRCode** | Server-side QR code generation |
| **Helmet** | Security headers |
| **express-validator** | Request validation |
| **Morgan** | HTTP request logging |

---

## 📁 Project Structure

```
DharshanEase/
├── client/                     # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   └── common/         # Shared components (Pagination, etc.)
│   │   ├── context/            # React context (Auth, etc.)
│   │   ├── layouts/            # Page layouts (Dashboard, etc.)
│   │   ├── pages/              # Page components
│   │   │   ├── auth/           # Login, Register pages
│   │   │   ├── booking/        # Booking flow pages
│   │   │   ├── dashboard/      # Admin, Organizer, User dashboards
│   │   │   └── temples/        # Temple listing & detail pages
│   │   ├── routes/             # Route guards (ProtectedRoute)
│   │   ├── services/           # API service layer (Axios)
│   │   ├── styles/             # CSS stylesheets
│   │   └── utils/              # Helper utilities
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── server/                     # Node.js + Express backend
    ├── config/                 # DB & app configuration
    ├── controllers/            # Route controller logic
    ├── middleware/             # Auth, error handler, validators
    ├── models/                 # Mongoose models
    │   ├── User.js
    │   ├── Temple.js
    │   ├── DarshanSlot.js
    │   ├── Booking.js
    │   ├── Payment.js
    │   ├── Donation.js
    │   ├── Feedback.js
    │   ├── Rating.js
    │   ├── Notification.js
    │   ├── Event.js
    │   └── Wishlist.js
    ├── routes/                 # Express route definitions
    ├── services/               # Business logic & external services
    ├── utils/                  # Utilities (logger, seed script)
    ├── validators/             # Input validation schemas
    ├── uploads/                # Uploaded files (temple images)
    ├── server.js               # App entry point
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas cluster)
- npm or yarn

---

### 1. Clone the Repository

```bash
git clone https://github.com/MSVAMSIKRISHNA/DharshanEase.git
cd DharshanEase
```

---

### 2. Setup the Backend (`/server`)

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory using the example below:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/darshanease

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRE=30d

# Email (SMTP)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
FROM_EMAIL=noreply@darshanease.com
FROM_NAME=DarshanEase

# Client URL
CLIENT_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

**Start the backend server:**

```bash
# Development (with nodemon auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000/api`

**Seed the database (optional):**
```bash
npm run seed
```

---

### 3. Setup the Frontend (`/client`)

```bash
cd ../client
npm install
```

Create a `.env.local` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

**Start the frontend dev server:**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT tokens |
| GET | `/api/temples` | List all temples |
| GET | `/api/temples/:id` | Get temple details |
| GET | `/api/slots` | Get available Darshan slots |
| POST | `/api/bookings` | Create a new booking |
| GET | `/api/bookings/my` | Get current user's bookings |
| POST | `/api/donations` | Make a donation |
| POST | `/api/ratings` | Submit a temple rating |
| POST | `/api/feedback` | Submit feedback |
| GET | `/api/notifications` | Get user notifications |
| GET | `/api/wishlist` | Get user wishlist |
| GET | `/api/analytics` | Admin analytics data |
| GET | `/api/health` | API health check |

---

## 🌐 Deployment

| Layer | Platform |
|---|---|
| **Frontend** | [Vercel](https://vercel.com/) |
| **Backend** | [Railway](https://railway.app/) |
| **Database** | MongoDB Atlas |

---

## 👥 User Roles

| Role | Access |
|---|---|
| **User** | Book darshan, donate, rate, review, wishlist, notifications |
| **Organizer** | Manage temples, slots, view bookings & revenue |
| **Admin** | Full platform control, analytics, user management, moderation |

---


## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request

---

## 📄 License

This project is developed as part of the **Smart Bridge** academic project.

---

## 👨‍💻 Author

**M.S. Vamsi Krishna**  
[![GitHub](https://img.shields.io/badge/GitHub-MSVAMSIKRISHNA-181717?style=flat&logo=github)](https://github.com/MSVAMSIKRISHNA)

---

<p align="center">Made with ❤️ for devotees everywhere</p>
