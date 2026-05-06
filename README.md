# Summit Works - Hotel Booking Platform

A modern hotel booking management system built with Angular 21 and deployed on Vercel (frontend) and Render (backend).

**Backend Repository:** https://github.com/arbin-mahato/summitworks-project

---

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- A code editor like **VS Code** - [Download](https://code.visualstudio.com/)

### Step 1: Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/arbin-mahato/sm-frontend-main.git
cd sm-frontend-main
```

### Step 2: Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will download and install all dependencies listed in `package.json`.

### Step 3: Start the Development Server

Run the local development server:

```bash
npm start
```

The application will automatically open in your browser at:
```
http://localhost:4200/
```

The app will automatically reload whenever you modify source files.

### Step 4: Access the Application

1. Navigate to `http://localhost:4200/`
2. Create a new account using the **Sign Up** page
3. Log in with your credentials
4. Explore the hotel listing, search, and booking features

---

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm start` | Runs the development server at http://localhost:4200 |
| `npm run build` | Builds the app for production with SSR support |
| `npm run serve:ssr` | Serves the SSR production build locally |
| `npm test` | Runs unit tests using Angular testing framework |

---

## 🌍 Deployment

### Frontend (Vercel)
The frontend is automatically deployed to Vercel whenever you push to the `main` branch.

**Live URL:** https://sm-frontend-main.vercel.app/

### Backend (Render)
The backend API is deployed on Render.

**API URL:** https://summitworks-project.onrender.com/

### Manual Deployment

To deploy manually:

```bash
# Build the project
npm run build

# Push to GitHub
git add .
git commit -m "Deployment update"
git push origin main

# Vercel will automatically deploy
```

---

## 🏗️ Project Architecture

### Frontend Technology Stack

- **Angular 21** - Modern web framework with standalone components
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **RxJS** - Reactive programming library
- **Angular SSR** - Server-side rendering for better performance
- **Signals** - Modern Angular state management

### Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── guards/          # Route protection
│   │   ├── interceptors/    # HTTP request handling
│   │   ├── models/          # TypeScript interfaces
│   │   └── services/        # API services
│   ├── features/
│   │   ├── admin/           # Admin features
│   │   ├── auth/            # Login & signup
│   │   ├── bookings/        # User bookings
│   │   └── hotels/          # Hotel listing & details
│   ├── layout/              # Common layout components
│   ├── app.routes.ts        # Route configuration
│   └── app.ts               # Main app component
├── environments/            # Environment-specific config
├── main.ts                  # Application entry point
└── styles.css              # Global styles
```

---

## 📱 Features

### User Features
- ✅ **User Authentication** - Secure login and registration
- ✅ **Hotel Search** - Filter hotels by location, date, and duration
- ✅ **Hotel Details** - View detailed information and room availability
- ✅ **Booking System** - Book rooms with available dates
- ✅ **Booking Management** - View and manage your bookings
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile

### Admin Features
- ✅ **Admin Dashboard** - View key metrics and statistics
- ✅ **Hotel Management** - Add, edit, and delete hotels
- ✅ **Booking Management** - View all platform bookings
- ✅ **Room Management** - Manage rooms and availability

---

## 🔐 Environment Configuration

The app automatically uses different API endpoints based on the environment:

- **Development** (localhost): Uses the backend configured in `src/environments/environment.ts`
- **Production** (Vercel): Uses the backend configured in `src/environments/environment.prod.ts`

### Current Configuration

**Development:**
```
Backend API: https://summitworks-project.onrender.com
```

**Production:**
```
Backend API: https://summitworks-project.onrender.com
```

---

## 🧪 Testing

Run the test suite:

```bash
npm test
```

This will start the test runner in watch mode. Tests will re-run whenever you modify source files.

---

## 🐛 Troubleshooting

### Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install
```

### Issue: Port 4200 already in use

**Solution:**
```bash
# Use a different port
ng serve --port 4300
```

Then visit `http://localhost:4300/`

### Issue: Images not loading

**Solution:**
- Check your internet connection
- Images are loaded from Unsplash CDN
- Ensure ad-blockers aren't blocking image requests
- Check browser console for CORS errors

### Issue: API requests failing (404)

**Solution:**
- Verify backend is running or deployed
- Check the API URL in `src/environments/environment.ts`
- Ensure CORS is properly configured on the backend

---

## 📚 Backend Setup

To run the complete application, you also need the backend server.

**Backend Repository:** https://github.com/arbin-mahato/summitworks-project

Follow the backend README for setup instructions.

---

## 🔑 Test Credentials

### Admin Account (Full Access)

Use these credentials to access the admin panel and all administrative features:

```
Email: arbin@example.com
Password: abc123
```

**Admin Features Available:**
- Dashboard with key metrics
- Hotel management (add, edit, delete)
- Booking management (view all bookings)
- Room availability management

### Regular User Account

You can also create your own account using the **Sign Up** page and log in with your registered credentials.

---

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the browser console for error messages (F12 → Console tab)
3. Open an issue on the GitHub repository

---

## 📝 Git Workflow

### Basic Git Commands

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main
```

---

## 🎓 Learning Resources

- [Angular Documentation](https://angular.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [RxJS Documentation](https://rxjs.dev/)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Developer

**Arbin Mahato**

---

## 🚀 Current Version

**v1.0.0** - Initial Release

- Angular 21 with SSR
- Complete hotel booking system
- Admin management dashboard
- Vercel + Render deployment
