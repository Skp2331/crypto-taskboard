🚀 Crypto Taskboard

A full-stack MERN (MongoDB, Express.js, React, Node.js) task-management web application built as part of a Frontend Developer Intern Assignment.

This project demonstrates skills in modern frontend development, backend API engineering, JWT-based authentication, CRUD operations, state management, and responsive UI using TailwindCSS.

✨ Features
🔐 Authentication

User registration with email validation

Secure login using JWT

Password hashing using bcrypt

Auto-logout on token expiration

Protected frontend & backend routes

🗂️ Task Management (CRUD)

Create, Read, Update, Delete tasks

Search tasks by title

Filter by status (To-Do, In-Progress, Done)

Filter by priority (Low, Medium, High)

Responsive and clean UI

👤 User Profile

Fetch logged-in user profile

Update user name & email

Protected using JWT middleware

🧰 Technical Features

Modular backend with Express routers

MongoDB with Mongoose models

Axios interceptors for token handling

TailwindCSS responsive UI

Clean folder structure for scalability

🛠️ Tech Stack
Frontend

React (Vite)

TailwindCSS

Axios

React Router

Context API

Backend

Node.js

Express.js

MongoDB + Mongoose

bcrypt

JSON Web Tokens (JWT)

express-validator

📁 Folder Structure
crypto-taskboard/
│
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── package.json
│
├── Crypto-Taskboard-API.postman_collection.json
└── README.md

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/Skp2331/crypto-taskboard.git
cd crypto-taskboard

🌐 Backend Setup (Port 5000)
cd backend
npm install


Create .env file:

MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
PORT=5000


Run backend:

npm run dev

💻 Frontend Setup (Port 5173)
cd frontend
npm install
npm run dev


Frontend will run at:
👉 http://localhost:5173

Backend at:
👉 http://localhost:5000

📌 API Endpoints
🔐 Auth Routes
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login user
👤 Profile Routes
Method	Endpoint	Description
GET	/api/profile	Get logged-in user
PUT	/api/profile	Update logged-in user
📝 Task Routes
Method	Endpoint	Description
GET	/api/tasks	Get all tasks (with filters)
POST	/api/tasks	Create a new task
PUT	/api/tasks/:id	Update task
DELETE	/api/tasks/:id	Delete task
🧪 Postman Collection

Import this file:
📄 Crypto-Taskboard-API.postman_collection.json

Includes:

Auth flows

Profile queries

CRUD operations

Sample request bodies

🚀 Scaling Strategy for Production

Move environment variables to secure vaults

Use Refresh Tokens + short-lived access tokens

Use Nginx reverse proxy

Deploy:

Frontend → Vercel / Netlify

Backend → Render / Railway

Database → MongoDB Atlas

Add rate limiting & CORS whitelisting

Implement logging (Winston / Morgan)

Add pagination to tasks API

🔒 Security Practices

Passwords hashed with bcrypt

JWT authentication middleware

Server-side input validation

Mongo injection prevention via Mongoose

No secrets committed to repository

📸 (Optional) Add Screenshots Here

You can add:

Login page

Dashboard

Task creation

Profile page

It improves recruiter first impression.

👨‍💻 Author

Som K
Frontend Developer | MERN Stack | Java | DSA
