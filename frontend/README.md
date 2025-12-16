# Travel Booking Frontend

Modern React frontend for the Travel Booking application with user and admin interfaces.

## 🚀 Features

### User Features

- 🔐 User authentication (register/login)
- 🔍 Search buses by source, destination, and date
- 💺 Interactive seat selection
- 🎫 Book tickets with passenger details
- 📋 View booking history
- ❌ Cancel bookings with refund

### Admin Features

- 🔐 Admin login
- 📊 Dashboard with statistics
- 🚌 Manage buses (CRUD)
- 🗺️ Manage routes (CRUD)
- 📅 View all bookings
- 👥 User management

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: Context API
- **Styling**: CSS3

## 📦 Installation

1. **Install Dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment**

   - The `.env` file is already created
   - Update `VITE_API_URL` if backend is on different port

3. **Start Development Server**

   ```bash
   npm run dev
   ```

   Application will run on `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│  │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── AdminRoute.jsx
│   ├── config/              # Configuration files
│   │   └── api.js           # Axios instance
│   ├── context/             # Context providers
│   │   └── AuthContext.jsx  # Authentication state
│   ├── pages/               # Page components
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── AdminLogin.jsx
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ManageBuses.jsx
│   │   │   ├── ManageRoutes.jsx
│   │   │   └── ViewBookings.jsx
│   │   ├── Home.jsx
│   │   ├── SearchBuses.jsx
│   │   ├── SeatSelection.jsx
│   │   └── MyBookings.jsx
│   ├── styles/              # CSS files
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Available Pages

### Public Pages

- `/` - Home page with search
- `/login` - User login
- `/register` - User registration
- `/admin/login` - Admin login

### User Pages (Protected)

- `/search` - Search buses
- `/seat-selection/:busId/:routeId` - Select seats
- `/my-bookings` - View bookings

### Admin Pages (Admin Only)

- `/admin/dashboard` - Statistics dashboard
- `/admin/buses` - Manage buses
- `/admin/routes` - Manage routes
- `/admin/bookings` - View all bookings

## 🔧 Configuration

### API Configuration

The frontend connects to the backend API. Configuration is in `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Vite Proxy

Vite is configured to proxy API calls to avoid CORS issues in development:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  }
}
```

## 🚦 Running the App

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🔐 Authentication Flow

1. User/Admin logs in
2. JWT token stored in localStorage
3. Token automatically added to API requests
4. Protected routes check authentication
5. Auto-logout on token expiration

## 📝 Usage Guide

### For Users

1. Register or login
2. Search for buses
3. Select seats
4. Enter passenger details
5. Complete booking
6. View/cancel bookings

### For Admins

1. Login with admin credentials
2. View dashboard statistics
3. Add buses and routes
4. Monitor bookings
5. Manage users

## 🎨 UI Features

- ✨ Modern, clean design
- 📱 Fully responsive
- 🎯 Interactive seat selection
- 🔔 Error/success notifications
- ⚡ Fast loading states
- 🎨 Gradient hero sections

## 🔄 Integration with Backend

The frontend is designed to work seamlessly with the Node.js backend:

1. Start backend: `cd ../backend && npm run dev`
2. Start frontend: `npm run dev`
3. Backend should run on port 5000
4. Frontend runs on port 3000

## 📱 Responsive Design

The application is fully responsive and works on:

- 💻 Desktop (1200px+)
- 📱 Tablets (768px - 1199px)
- 📱 Mobile (< 768px)

## 🐛 Troubleshooting

**API Connection Issues:**

- Ensure backend is running on port 5000
- Check `.env` file configuration
- Verify CORS is enabled in backend

**Build Errors:**

- Delete `node_modules` and run `npm install` again
- Clear Vite cache: `rm -rf .vite`

## 👥 Development Team

Built for 6-member MERN stack project team

## 📄 License

ISC

---

**Happy Coding! 🚀**
