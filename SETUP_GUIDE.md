# E-Commerce Application Setup & Deployment Guide

## 📋 Prerequisites

- Node.js v18 or higher
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Git

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the backend directory:
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/db
JWT_SECRET=your_secret_key_min_32_characters
FRONTEND_URL=http://localhost:3000
```

#### Start Backend Server
```bash
npm run dev          # Development with hot reload
npm start            # Production mode
```

The backend will run on `http://localhost:5001`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

#### Configure Environment Variables
Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_UPLOAD_URL=http://localhost:5001
NEXT_PUBLIC_DEBUG=false
```

#### Start Frontend Development Server
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

#### Build for Production
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
ecommerce/
├── backend/
│   ├── config/              # Configuration files
│   │   ├── db.js           # MongoDB connection
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── apiResponse.js
│   │   ├── logger.js
│   │   └── validators.js
│   ├── models/              # Database schemas
│   ├── controllers/         # Business logic
│   ├── routes/              # API endpoints
│   ├── uploads/             # Uploaded files
│   ├── server.js            # Main server file
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── app/            # Next.js pages
    │   ├── components/     # Reusable components
    │   ├── services/       # API integration
    │   └── types/          # TypeScript types
    ├── package.json
    └── .env.local
```

---

## 🔐 Security Best Practices

✅ **Implemented:**
- JWT Authentication
- Password Hashing (bcryptjs)
- CORS Configuration
- Input Validation
- Error Handling
- Environment Variable Protection

⚠️ **Recommendations:**
1. Use HTTPS in production
2. Add rate limiting
3. Implement CSRF protection
4. Add request logging
5. Use helmet.js for HTTP headers
6. Implement request/response compression

---

## 🧪 API Documentation

### Authentication Endpoints
- `POST /api/agents/login` - Admin login
- `POST /api/agents/register` - Register new agent
- `POST /api/agents/:id` - Update agent

### Product Management
- `GET /api/user/products` - Get all products
- `GET /api/user/products/:id` - Get product by ID
- `POST /api/admin/products` - Create product (requires auth)
- `PUT /api/admin/products/:id` - Update product (requires auth)
- `DELETE /api/admin/products/:id` - Delete product (requires auth)

### File Upload
- `POST /api/upload` - Upload image

### Orders
- `GET /api/admin/orders` - Get all orders (admin)
- `POST /api/admin/orders` - Create order
- `PUT /api/admin/orders/:id` - Update order status

---

## 📝 API Response Format

All responses follow a standardized format:

**Success Response (200-201):**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

**Error Response (4xx-5xx):**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ /* detailed errors if applicable */ ]
}
```

---

## 🔄 Development Workflow

1. **Create a new branch** for each feature
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Make changes** and test thoroughly

3. **Commit** with clear messages
   ```bash
   git commit -m "feat: Add new feature"
   ```

4. **Push** and create a pull request

---

## 📊 Environment Configuration

### Development
- Hot reload enabled
- Logging enabled
- CORS allows all origins
- Debug mode enabled

### Production
- Optimized builds
- Error handling only logs errors
- CORS restricted to specific origins
- Debug mode disabled

---

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5001 is already in use
- Verify MongoDB URI is correct
- Ensure all environment variables are set

### Frontend can't connect to backend
- Verify backend is running on port 5001
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Clear browser cache and cookies

### Authentication failing
- Check JWT_SECRET matches between frontend and backend
- Verify the token is being sent in Authorization header
- Check token expiration

### Image upload fails
- Ensure uploads directory exists
- Check file size (max 5MB)
- Verify only image files are uploaded

---

## 📦 Dependencies

### Backend
- express - Web framework
- mongoose - MongoDB ODM
- jsonwebtoken - JWT handling
- bcryptjs - Password hashing
- multer - File upload
- cors - CORS middleware
- dotenv - Environment variables

### Frontend
- next - React framework
- react - UI library
- axios - HTTP client
- zustand - State management
- react-icons - Icon library
- gsap - Animation library

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check browser console for errors
4. Check server logs

---

## 📄 License

This project is licensed under the ISC License.

---

**Last Updated:** February 25, 2026
