# 🚀 Crypto Taskboard

A full-stack **MERN** (MongoDB, Express.js, React, Node.js) task management application built as part of a Frontend Developer Intern assignment. This project demonstrates my understanding of modern web development practices, RESTful API design, and secure authentication systems.

---

## 📌 Project Overview

**Crypto Taskboard** is a productivity application designed for managing tasks efficiently. Users can register, log in, and manage their personal tasks with features like filtering, searching, and priority-based organization.

This project showcases:
- Clean, modular code architecture
- Separation of concerns between frontend and backend
- Industry-standard authentication using JWT
- Responsive UI with TailwindCSS

---

## ✨ Features

### 🔐 Authentication
- User registration with email validation
- Secure login with JWT token generation
- Password hashing using bcrypt (10 salt rounds)
- Auto-logout on token expiration
- Protected routes on both frontend and backend

### 📋 Task Management (CRUD)
- **Create** - Add new tasks with title, description, priority, status, and due date
- **Read** - View all tasks with real-time filtering
- **Update** - Edit task details inline
- **Delete** - Remove tasks with confirmation

### 📊 Dashboard
- Task statistics (total, pending, in-progress, completed)
- High-priority alerts
- Search by title/description
- Filter by status (pending, in-progress, completed)
- Filter by priority (low, medium, high)

### 👤 Profile Management
- View profile information
- Update display name

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 | UI Components |
| | Vite | Fast build tool |
| | TailwindCSS | Styling |
| | React Router DOM | Client-side routing |
| | Axios | HTTP requests |
| | Context API | State management |
| **Backend** | Node.js | Runtime environment |
| | Express.js | Web framework |
| | MongoDB | NoSQL database |
| | Mongoose | ODM for MongoDB |
| | JWT | Token-based auth |
| | bcryptjs | Password hashing |
| | express-validator | Input validation |

---

## 📁 Folder Structure

```
crypto-taskboard/
│
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection setup
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification middleware
│   │   └── errorHandler.js        # Global error handler
│   │
│   ├── models/
│   │   ├── User.js                # User schema with bcrypt hooks
│   │   └── Task.js                # Task schema with indexes
│   │
│   ├── routes/
│   │   ├── authRoutes.js          # POST /register, /login
│   │   ├── profileRoutes.js       # GET, PUT /profile
│   │   └── taskRoutes.js          # CRUD /tasks
│   │
│   ├── .env                       # Environment variables
│   ├── .env.example               # Environment template
│   ├── package.json
│   └── server.js                  # Express app entry point
│
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   │
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           # Axios instance with interceptors
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Navigation component
│   │   │   ├── ProtectedRoute.jsx # Auth guard for routes
│   │   │   ├── SearchBar.jsx      # Search input component
│   │   │   ├── TaskForm.jsx       # Create/Edit task modal
│   │   │   └── TaskList.jsx       # Task display component
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Authentication state
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx      # Main task management page
│   │   │   ├── Login.jsx          # Login page
│   │   │   ├── Profile.jsx        # User profile page
│   │   │   └── Register.jsx       # Registration page
│   │   │
│   │   ├── App.jsx                # Route configuration
│   │   ├── index.css              # Global styles + Tailwind
│   │   └── main.jsx               # React entry point
│   │
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── Crypto-Taskboard-API.postman_collection.json
└── README.md
```

---

## 🚀 How to Run

### Prerequisites
- Node.js v18+ ([Download](https://nodejs.org/))
- MongoDB v6+ ([Download](https://mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- npm or yarn

### 1️⃣ Clone the Repository
```bash
git clone <repository-url>
cd crypto-taskboard
```

### 2️⃣ Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file (or use existing)
# Make sure to set:
# MONGO_URI=mongodb://localhost:27017/crypto-taskboard
# JWT_SECRET=your_secret_key
# PORT=5000

# Start development server
npm run dev
```

✅ Backend runs at: `http://localhost:5000`

### 3️⃣ Setup Frontend

```bash
# Open new terminal, navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend runs at: `http://localhost:5173`

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | `{ name, email, password }` |
| POST | `/auth/login` | Login user | `{ email, password }` |

**Example Response (Login):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
}
```

### Profile Endpoints (Protected 🔒)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/profile` | Get current user | - |
| PUT | `/profile` | Update profile | `{ name }` |

### Task Endpoints (Protected 🔒)

| Method | Endpoint | Description | Body/Params |
|--------|----------|-------------|-------------|
| GET | `/tasks` | Get all tasks | Query: `?status=pending&priority=high&search=keyword` |
| GET | `/tasks/:id` | Get single task | - |
| POST | `/tasks` | Create task | `{ title, description, status, priority, dueDate, tags }` |
| PUT | `/tasks/:id` | Update task | `{ title, status, priority, ... }` |
| DELETE | `/tasks/:id` | Delete task | - |

**Task Object Structure:**
```json
{
  "_id": "64abc456...",
  "user": "64abc123...",
  "title": "Complete project",
  "description": "Finish the MERN assignment",
  "status": "in-progress",
  "priority": "high",
  "dueDate": "2024-12-31T00:00:00.000Z",
  "tags": ["urgent", "assignment"],
  "createdAt": "2024-12-06T00:00:00.000Z",
  "updatedAt": "2024-12-06T00:00:00.000Z"
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

---

## 📮 Postman Collection

A ready-to-use Postman collection is included in the project root:

```
📄 Crypto-Taskboard-API.postman_collection.json
```

**How to use:**
1. Open Postman
2. Click **Import** → Select the JSON file
3. The collection includes all endpoints with example data
4. Tokens are automatically saved after login/register

---

## 📈 Scaling Strategy for Production

### 1. Database Layer
```
┌─────────────────────────────────────────┐
│           MongoDB Atlas                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ Primary │ │ Secondary│ │ Secondary│   │
│  │ (Write) │ │ (Read)  │ │ (Read)  │   │
│  └─────────┘ └─────────┘ └─────────┘   │
│           Replica Set                    │
└─────────────────────────────────────────┘
```
- Use **MongoDB Atlas** for managed cloud database
- Enable **replica sets** for high availability
- Create **indexes** on frequently queried fields (already implemented)

### 2. Application Layer
```
                    ┌──────────────┐
                    │ Load Balancer│
                    │   (NGINX)    │
                    └──────┬───────┘
           ┌───────────────┼───────────────┐
           │               │               │
    ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
    │   Node.js   │ │   Node.js   │ │   Node.js   │
    │ Instance 1  │ │ Instance 2  │ │ Instance 3  │
    └─────────────┘ └─────────────┘ └─────────────┘
```
- **Horizontal scaling** with multiple Node.js instances
- Use **PM2** for process management and clustering
- Deploy behind **NGINX** reverse proxy

### 3. Caching Layer
- Implement **Redis** for session and frequently accessed data
- Cache task lists with short TTL (5 minutes)

### 4. Container Deployment
```dockerfile
# Example: Deploy with Docker
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

### 5. Cloud Hosting Options
| Service | Use Case |
|---------|----------|
| AWS EC2 / ECS | Full control, scalable |
| Google Cloud Run | Serverless containers |
| Railway / Render | Quick deployment |
| Vercel | Frontend hosting |

---

## 🔒 Why This Solution is Secure and Scalable

### Security Measures Implemented

| Feature | Implementation | Purpose |
|---------|----------------|---------|
| **Password Hashing** | bcrypt with 10 rounds | Protects passwords even if DB is compromised |
| **JWT Authentication** | 7-day expiry tokens | Stateless auth, no session storage needed |
| **Input Validation** | express-validator | Prevents SQL injection, XSS attacks |
| **CORS Configuration** | Whitelist specific origins | Blocks unauthorized domains |
| **Password Not in Response** | `select: false` in schema | Never exposes passwords in API |
| **Error Handling** | Global middleware | Doesn't leak stack traces in production |

### Scalability Design Patterns

1. **Stateless Architecture**
   - JWT tokens eliminate server-side session storage
   - Any server instance can handle any request

2. **Database Indexing**
   ```javascript
   taskSchema.index({ user: 1, status: 1 });
   taskSchema.index({ user: 1, createdAt: -1 });
   ```
   - Speeds up queries significantly as data grows

3. **Modular Code Structure**
   - Separated routes, models, middleware
   - Easy to add new features without breaking existing ones

4. **Environment-Based Configuration**
   - Different settings for development/production
   - Easy to deploy across environments

5. **API-First Design**
   - Frontend and backend are independent
   - Can be deployed separately on different servers

---

## 🎯 Future Improvements

- [ ] Add refresh tokens for better security
- [ ] Implement rate limiting
- [ ] Add task categories/projects
- [ ] Email notifications for due dates
- [ ] Collaborative tasks (team feature)
- [ ] Export tasks to CSV/PDF

---

## 👨‍💻 About the Developer

This project was built as part of a **Frontend Developer Intern** assignment. It demonstrates my ability to:
- Build full-stack applications from scratch
- Implement secure authentication systems
- Write clean, maintainable code
- Design scalable architectures
- Document projects professionally

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<div align="center">
  <p>Built with ❤️ using the MERN Stack</p>
  <p><strong>Crypto Taskboard</strong> - Your tasks, organized.</p>
</div>
#   c r y p t o - t a s k b o a r d  
 