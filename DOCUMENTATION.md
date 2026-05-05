# EventHub - Modern Event Management Frontend

A beautiful, responsive React frontend for managing college events with user authentication, event registration, and real-time notifications.

## 🎯 Features

### 🔐 Authentication
- User login and signup with JWT
- Role-based access (Student/Admin)
- Protected routes
- Persistent authentication with localStorage

### 📅 Event Management
- Browse all events with search functionality
- View detailed event information
- Filter events by category (Technical, Cultural, Sports, Academic)
- Admin can create new events

### 🎫 Registrations
- Register for events
- Track registration status (Pending, Approved, Rejected)
- View all your registrations
- Cancel registrations

### 🔔 Notifications
- Receive real-time notifications
- Mark notifications as read
- Delete notifications
- Badge showing unread count

### 👤 User Profile
- View profile information
- Manage account settings
- Logout functionality

### 🎨 Modern UI/UX
- Fully responsive design (mobile, tablet, desktop)
- Clean and intuitive interface
- Smooth animations and transitions
- Tailwind CSS styling
- Lucide React icons

## 🚀 Tech Stack

- **Framework**: React 18
- **Routing**: React Router v6
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Date Formatting**: date-fns

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── client.js           # Axios instance with interceptors
│   │   ├── endpoints.js        # All API endpoints
│   │   └── index.js            # API exports
│   │
│   ├── components/
│   │   ├── Header.jsx          # Navigation bar
│   │   ├── Footer.jsx          # Footer
│   │   ├── ProtectedRoute.jsx  # Route protection wrapper
│   │   ├── Alert.jsx           # Alert/Toast component
│   │   ├── Dropdown.jsx        # Custom dropdown
│   │   ├── EventCard.jsx       # Event display card
│   │   ├── Loading.jsx         # Loading spinners
│   │   └── index.js            # Component exports
│   │
│   ├── pages/
│   │   ├── HomePage.jsx              # Main home page
│   │   ├── LoginPage.jsx             # Login form
│   │   ├── SignupPage.jsx            # Signup form
│   │   ├── EventDetailPage.jsx       # Event details
│   │   ├── MyRegistrationsPage.jsx  # User registrations
│   │   ├── NotificationsPage.jsx     # Notifications
│   │   ├── ProfilePage.jsx           # User profile
│   │   ├── CreateEventPage.jsx       # Create event (admin)
│   │   └── index.js                  # Page exports
│   │
│   ├── store/
│   │   ├── authStore.js              # Auth state (Zustand)
│   │   ├── eventStore.js             # Events state
│   │   ├── registrationStore.js      # Registrations state
│   │   ├── notificationStore.js      # Notifications state
│   │   └── index.js                  # Store exports
│   │
│   ├── styles/
│   │   └── index.css           # Global styles
│   │
│   ├── App.jsx                 # Main app with routing
│   └── main.jsx                # Entry point
│
├── public/                     # Static assets
├── index.html                  # HTML template
├── package.json               # Dependencies
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
├── jsconfig.json             # JS config with path aliases
├── .eslintrc.cjs             # ESLint configuration
├── .gitignore                # Git ignore file
├── .env.example              # Environment variables template
├── README.md                 # This file
└── SETUP.md                  # Setup instructions
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16 or higher
- npm or yarn package manager
- Backend running on `http://localhost:8080`

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` if needed:
```env
VITE_API_URL=http://localhost:8080/api
```

### Step 3: Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Step 4: Build for Production
```bash
npm run build
```

The build output will be in the `dist/` directory.

## 📋 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## 🔗 API Integration

### Authentication Endpoints
- `POST /api/auth/signin` - Login
- `POST /api/auth/signup` - Register

### Event Endpoints
- `GET /api/events` - Get all events
- `GET /api/events/{id}` - Get event details
- `POST /api/events` - Create event (admin)
- `PUT /api/events/{id}` - Update event (admin)
- `DELETE /api/events/{id}` - Delete event (admin)

### Registration Endpoints
- `GET /api/registrations` - Get all registrations
- `POST /api/registrations` - Register for event
- `PUT /api/registrations/{id}` - Update registration status
- `DELETE /api/registrations/{id}` - Cancel registration

### Notification Endpoints
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/{id}/read` - Mark as read
- `DELETE /api/notifications/{id}` - Delete notification

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

## 🎨 Customization

### Colors & Branding
Edit `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: "#3b82f6",    // Change primary color
      secondary: "#8b5cf6",  // Change secondary color
      accent: "#ec4899",     // Change accent color
    },
  },
}
```

### Component Styling
All components use Tailwind CSS utility classes. Global component classes are defined in `src/styles/index.css`:
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.card` - Card component
- `.input-field` - Input field

## 🏃 Usage Guide

### For Students
1. **Sign Up** - Create account with email and password
2. **Browse Events** - Search and explore available events
3. **Register** - Click "Register" on event card
4. **Track Status** - View registration status in "My Events"
5. **Get Updates** - Check notifications for event updates

### For Admins
1. **Create Events** - Click "Create Event" on home page
2. **Add Details** - Fill in title, description, date, venue
3. **Set Category** - Choose event category
4. **Manage** - View and edit events

## 🐛 Troubleshooting

### Issue: API requests failing with CORS error
**Solution**: Ensure backend is configured to accept requests from `http://localhost:3000`

### Issue: Cannot login/signup
**Solution**: 
- Verify backend is running on `http://localhost:8080`
- Check network tab in DevTools
- Verify credentials are correct

### Issue: Notifications not loading
**Solution**:
- Clear localStorage and re-login
- Check backend notifications API
- Verify JWT token in browser storage

### Issue: Images not loading
**Solution**:
- Check public directory for assets
- Verify file paths in components
- Check browser console for 404 errors

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop** - Full-featured experience
- **Tablet** - Optimized layout
- **Mobile** - Touch-friendly interface with mobile menu

Responsive breakpoints:
- `sm`: 640px
- `md`: 768px (default breakpoint used)
- `lg`: 1024px
- `xl`: 1280px

## 🔒 Security Features

- JWT-based authentication
- Secure token storage in localStorage
- Protected routes for authenticated users
- CORS configuration on backend
- Input validation on forms
- XSS protection with React

## 🎯 Performance Optimization

- Code splitting with React Router
- Lazy component loading
- Optimized re-renders with Zustand
- Image optimization
- CSS minification with Tailwind
- Production build optimization with Vite

## 🚀 Deployment

### Deploy to Vercel
```bash
npm run build
vercel deploy
```

### Deploy to Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Docker Deployment
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📚 Components Documentation

### Header Component
- Navigation menu
- User profile dropdown
- Notification badge
- Mobile responsive menu

### EventCard Component
- Event title and description
- Date, time, and venue
- Category badge
- Register button

### Alert Component
- Success/Error/Info/Warning types
- Auto-dismiss after 3 seconds
- Dismissible with X button

### ProtectedRoute Component
- Redirects unauthenticated users to login
- Wraps authenticated pages

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/YourFeature`
2. Commit changes: `git commit -m 'Add YourFeature'`
3. Push to branch: `git push origin feature/YourFeature`
4. Submit pull request

## 📄 License

MIT License - feel free to use this project!

## 🆘 Support

For issues or questions:
1. Check the SETUP.md for quick start guide
2. Review the troubleshooting section
3. Check browser console for errors
4. Verify backend is running and accessible

## 🎉 Future Enhancements

- [ ] Dark mode support
- [ ] Event calendar view
- [ ] Advanced filtering and sorting
- [ ] Email notifications
- [ ] Social sharing
- [ ] Event recommendations
- [ ] User ratings and reviews
- [ ] Event ticket system
- [ ] QR code check-in
- [ ] Analytics dashboard

---

**Built with ❤️ using React, Tailwind CSS, and Zustand**
