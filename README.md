# 📚 Book Exchange Portal (MERN Stack)

A Peer-to-Peer Book Exchange Portal that allows users to register as book **owners** or **seekers**, list books, and request books for borrowing. Built with **MERN stack**, it supports authentication, book management, and role-based access.

---

## 🚀 Features

- 🔐 User Authentication (Register, Login, Logout)
- 📦 Book Listing by Owners
- 🔎 View Available Books
- 🔄 Update Book Status (Issued/Returned)
- ✏️ Edit Book Details
- 👥 Role-Based Access Control (Owner / Seeker)

---

## 🧱 Tech Stack

- **Frontend:** React (with Redux Toolkit, Tailwind CSS)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose)
- **Authentication:** JWT & Cookies
- **Image Upload (optional):** Cloudinary

---

## 📂 API Endpoints

### 👤 User Routes (`/api/users`)
| Method | Route | Description |
|--------|-------|-------------|
| POST   | `/register` | Register a new user |
| POST   | `/login`    | Login user |
| POST   | `/logout`   | Logout (requires JWT) |

### 📚 Book Routes (`/api/books`)
| Method | Route | Description |
|--------|-------|-------------|
| POST   | `/list`             | List a new book (owner only) |
| PATCH  | `/status/:id`       | Update book status (owner only) |
| PATCH  | `/update/:id`       | Update book details (owner only) |
| GET    | `/`                 | Get all books |
| GET    | `/:id`              | Get a specific book by ID |

---

## 🛠️ Running Locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/githubRahuld/Book-Exchange-Portal.git
   cd Book-Exchange-Portal

2. **Install backend dependencies**
   ```bash
   cd Backend
   npm install
3. **Create .env file in /Backend**
   ```bash
   PORT=
   MONGODB_URI=
   CORS_ORIGIN=*
   ACCESS_TOKEN_SECRET=
   ACCESS_TOKEN_EXPIRY=
   REFRESH_TOKEN_SECRET=
   REFRESH_TOKEN_EXPIRY=
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=

4. **Start the backend**
   ```bash
   npm run dev

5. **Setup frontend in /(vite)Frontend similarly.**
   
6. **🙌 Author**
Made with ❤️ by Rahul Dhakad

7. **Used ChatGPT For fixing bugs**
  
