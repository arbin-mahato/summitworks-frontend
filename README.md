# Summit Works Assignment - Hotel Booking Platform

A modern hotel booking management system built with Angular 21 and deployed on Vercel (frontend) and Render (backend).

**Backend Repository:** https://github.com/arbin-mahato/summitworks-project

---

## 🌐 Live Deployment

| Environment     | URL                                      |
| --------------- | ---------------------------------------- |
| **Frontend**    | https://sm-frontend-main.vercel.app/     |
| **Backend API** | https://summitworks-project.onrender.com |
| **Live Demo**   | https://sm-frontend-main.vercel.app/     |

---

## � Quick Test Credentials

### Admin Account (Full Access)

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

## 📹 Project Walkthrough

**Watch the complete walkthrough:** [Summit Works Assignment Walkthrough](https://drive.google.com/file/d/1cAPZWT5vW15FEW4VzwZxFyRR0T0W20ZQ/view?usp=sharing)

---

## �🚀 Quick Start Guide

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

| Command             | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `npm start`         | Runs the development server at http://localhost:4200 |
| `npm run build`     | Builds the app for production with SSR support       |
| `npm run serve:ssr` | Serves the SSR production build locally              |
| `npm test`          | Runs unit tests using Angular testing framework      |

---

## 📖 Project Overview & System Architecture

### What is Summit Works Assignment?

**Summit Works Assignment** is a full-stack hotel booking management system that enables users to browse hotels, check real-time room availability with interactive calendars, and make instant bookings. The platform implements role-based access control with distinct user experiences:

- **Regular Users**: Browse hotels, view availability, create bookings, manage booking history
- **Administrators**: Manage hotels, rooms, inventory, and view all platform bookings

---

### Complete Technology Stack

#### Frontend (This Repository)

- **Angular 21** - Modern component-based framework with signals
- **TypeScript 5+** - Type-safe development with strict checking
- **Tailwind CSS 3** - Utility-first CSS for rapid UI development
- **RxJS** - Reactive programming for async operations
- **Angular Signals** - Fine-grained reactivity for state management
- **Lucide Icons** - Beautiful SVG icons library
- **Angular SSR** - Server-side rendering for better SEO and performance

#### Backend

- **Java 17** - Modern LTS runtime with improved performance
- **Spring Boot 3.3.5** - Enterprise framework for rapid development
- **Spring Security + JWT** - Stateless token-based authentication
- **PostgreSQL** - Robust relational database with ACID compliance
- **Flyway** - Version-controlled database migrations
- **Maven** - Dependency management and build automation

#### Deployment & Infrastructure

- **Frontend Hosting**: Vercel (CI/CD enabled)
- **Backend Hosting**: Render (Container-based deployment)
- **Database**: PostgreSQL (Managed cloud database)
- **CDN**: Cloudflare (Static assets and image optimization)

---

### Key Architectural Decisions

#### 1. **Stateless JWT Authentication**

- Tokens contain user ID and role claims
- No server-side session storage needed
- Scales horizontally without session synchronization
- Suitable for both web and mobile clients

#### 2. **Database-First Availability Logic**

- Room availability calculated from actual bookings table
- Prevents inconsistencies between room flags and booking data
- Accurate 7-day calendar with real-time updates
- Supports complex overlapping date queries

#### 3. **Three-Tier Frontend Architecture**

```
Presentation Layer (Components)
           ↓
Business Logic Layer (Services, Guards)
           ↓
Data Access Layer (API, Interceptors)
```

- Clear separation of concerns
- Reusable components and services
- Testable and maintainable code

#### 4. **Role-Based Access Control (RBAC)**

- Frontend: Route guards and UI hiding (immediate feedback)
- Backend: Spring Security enforcement (security guarantee)
- Two roles: USER (booking) and ADMIN (management)
- Defense in depth approach

#### 5. **Mobile-First Responsive Design**

- Optimized for small screens first
- Progressive enhancement for tablets and desktops
- Single responsive codebase
- Touch-friendly interface

---

### Data Flow Architecture

```
User Action
    ↓
Component Event Handler
    ├─→ [Local Updates] → Signal Update → Re-render
    └─→ [API Required]
         ↓
    Service Layer
    (Business Logic)
         ↓
    HTTP Interceptor
    (Add JWT Token)
         ↓
    Backend API
    (Authentication & Authorization)
         ↓
    Database Query
    (PostgreSQL)
         ↓
    Response Flow
    Error Handling
         ↓
    Service Updates Signal
         ↓
    Component Re-renders
```

---

### Security Architecture

**Defense in Depth** (4 layers):

1. **Frontend Validation** - Input sanitization, route guards, client-side validation
2. **Network Security** - HTTPS, JWT in Authorization header, CORS configured
3. **Backend Authorization** - Spring Security filters, JWT validation, role checks
4. **Database Security** - Prepared statements, FK constraints, password hashing with BCrypt

**Key Security Features**:

- JWT tokens expire after 60 minutes
- Passwords hashed with BCrypt (salted)
- Role-based method security (`@PreAuthorize`)
- CORS restricted to frontend domain
- No sensitive data in tokens or logs

---

### Core Features Implementation

#### User Booking Flow

1. User searches hotels by location and dates
2. System queries available rooms (calculates from bookings table)
3. 7-day calendar shows availability visually
4. User selects dates and available room
5. Booking created instantly with confirmation
6. User can view/manage bookings anytime

#### Admin Capabilities

- View complete booking history with user and hotel details
- Create new rooms under existing hotels
- Delete rooms with validation (prevents deletion if bookings exist)
- Dashboard with key metrics
- Export booking reports

#### Real-Time Availability

- Queries booking table for date overlaps
- Calculates available rooms for each day
- Updates as new bookings are created
- Visual 7-day calendar with color indicators

---

### Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── guards/              # Route protection (admin, auth)
│   │   ├── interceptors/        # JWT attachment, error handling
│   │   ├── models/              # TypeScript interfaces
│   │   └── services/            # API & business logic
│   │       ├── auth.service.ts       # Authentication
│   │       ├── hotel.service.ts      # Hotels & rooms
│   │       └── booking.service.ts    # Booking logic
│   ├── features/
│   │   ├── admin/               # Admin-only routes
│   │   │   ├── dashboard/
│   │   │   ├── booking-management/
│   │   │   └── hotel-management/
│   │   ├── auth/                # Login & signup
│   │   ├── hotels/              # Browse & book
│   │   └── bookings/            # User bookings
│   ├── layout/                  # Header, footer, navigation
│   ├── app.routes.ts            # Route configuration
│   └── app.ts                   # Main component
├── environments/                # Configuration per environment
├── main.ts                      # Application bootstrap
└── styles.css                   # Global Tailwind CSS
```

---

### Performance Optimizations

- **Frontend**: Lazy loading routes, image optimization, code splitting
- **Backend**: Database indexing, query optimization, connection pooling
- **Caching**: Browser cache headers, service worker ready
- **Bundle Size**: Tree shaking, minification, no unused dependencies

---

### For Detailed Architecture Documentation

👉 **See [ARCHITECTURE.md](ARCHITECTURE.md)** for in-depth information on:

- System flows (diagrams and sequences)
- Component architecture
- Database schema design
- Security implementation details
- Error handling strategy
- Extensibility & future enhancements
- Deployment configurations
- Performance considerations
- CI/CD pipeline setup

---

## 🌍 Deployment

The application is deployed on modern cloud platforms with automatic CI/CD:

**Frontend**: Automatically deployed to Vercel on every `main` branch push

- Build: `npm run build`
- Deploy: Push to GitHub (automatic)

**Backend**: Deployed on Render with container orchestration

- See [Backend Repository](https://github.com/arbin-mahato/summitworks-project) for deployment instructions

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
