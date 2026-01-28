# RJR Attendance Management System

A modern, mobile-responsive Attendance Management Web Application built with Next.js, Prisma, and Supabase.

## 🚀 Features

### Authentication
- Login/Register using Supabase Auth
- Role-based access (Admin & Employee)

### Employee Management (Admin)
- Add, edit, delete employees
- Store employee details: Name, ID, Department, State, Mobile

### Attendance System
- **Check In/Check Out** functionality
- Automatic working hours calculation
- Date and time tracking

### Daily Permission System
- **2-hour (120 minutes) daily limit**
- Permission request with start time, end time, and reason
- Automatic duration calculation
- Extra time tracking when exceeding limit
- Clear indication of overtime in reports

### Leave Management
- **4 leave days per month** limit
- Leave requests with date range and reason
- Automatic validation against monthly quota
- Admin approval/rejection system

### Dashboards

**Employee Dashboard:**
- Today's attendance status
- Used permission time
- Extra permission time alerts
- Remaining leave days
- Monthly summary

**Admin Dashboard:**
- Total employees count
- Daily attendance overview
- Permission usage reports
- Extra time monitoring
- Leave request management

### UI/UX Features
- **Modern cyan color theme**
- Glassmorphism effects
- Responsive design (Mobile, Tablet, Desktop)
- Smooth animations with Framer Motion
- Sidebar navigation (Desktop)
- Bottom navigation (Mobile)
- Toast notifications

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS
- **UI Components:** Custom components with Radix UI patterns
- **Animations:** Framer Motion
- **Icons:** Lucide React

## 📦 Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in `.env`:
```env
DATABASE_URL="your-supabase-connection-string"
DIRECT_URL="your-supabase-direct-connection-string"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

- **User:** Authentication and role management
- **Employee:** Employee details and profiles
- **Attendance:** Check-in/check-out records
- **Permission:** Permission requests with time tracking
- **LeaveRequest:** Leave applications with approval status

## 🎨 Design Features

- **Color Palette:** Cyan-based gradient theme
- **Components:** Rounded cards with shadows
- **Typography:** Geist Sans font family
- **Responsive:** Mobile-first approach
- **Animations:** Smooth transitions and micro-interactions

## 📱 Mobile Features

- Sticky bottom navigation
- Touch-friendly interface
- Responsive tables and cards
- Slide-out mobile menu

## 🔒 Security

- Supabase authentication
- Role-based access control
- Secure API routes
- Environment variable protection

## 📈 Future Enhancements

- Export reports (CSV/PDF)
- Advanced filtering and search
- Email notifications
- Biometric attendance
- Geolocation tracking

## 👨‍💻 Development

Built by RJR Team with ❤️ using modern web technologies.

## 📄 License

All rights reserved.
"# attendance_rjr" 
