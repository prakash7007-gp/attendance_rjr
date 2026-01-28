# 🚀 RJR Attendance Management System - Setup Guide

## ✅ What We've Built

A **modern, mobile-responsive Attendance Management Web Application** with:

### 🎨 **Design Features**
- **Cyan-based color theme** with glassmorphism effects
- Fully responsive (Mobile, Tablet, Desktop)
- Smooth animations with Framer Motion
- Modern UI components with rounded cards and shadows
- Sidebar navigation (Desktop) + Bottom navigation (Mobile)

### 🔐 **Authentication**
- Supabase Auth integration
- Role-based access (Admin & Employee)
- Secure session management

### 👥 **Employee Management** (Admin Only)
- Add, edit, delete employees
- Store: Name, Employee ID, Department, State, Mobile Number

### ⏰ **Attendance System**
- Check In/Check Out functionality
- Automatic working hours calculation
- Real-time attendance tracking

### 📅 **Permission System**
- **120 minutes (2 hours) daily limit**
- Request permission with start/end time and reason
- Automatic duration calculation
- **Extra time tracking** when exceeding limit
- Clear visual indicators for overtime

### 🏖️ **Leave Management**
- **4 leave days per month** limit
- Leave requests with date range
- Automatic validation against quota
- Admin approval/rejection workflow

### 📊 **Dashboards**

**Employee Dashboard:**
- Today's attendance status (Check In/Out)
- Permission time used today
- Extra permission alerts
- Remaining leave days
- Monthly statistics

**Admin Dashboard:**
- Total employees count
- Daily attendance overview
- Permission usage reports
- Extra time monitoring
- Leave request management
- Quick action cards

---

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Git (optional)

---

## 🛠️ Setup Instructions

### Step 1: Configure Supabase

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be ready (2-3 minutes)

### Step 2: Get Database Credentials

1. In your Supabase project, go to **Settings** → **Database**
2. Scroll to **Connection String** section
3. Copy the **Connection string** (choose "Transaction" mode)
4. It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

### Step 3: Get API Credentials

1. Go to **Settings** → **API**
2. Copy the **Project URL** (e.g., `https://xxxxx.supabase.co`)
3. Copy the **anon/public** key

### Step 4: Configure Environment Variables

1. Open the `.env` file in the project root
2. Replace the placeholder values:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"

NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

### Step 5: Initialize Database

Run these commands in order:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (creates all tables)
npx prisma db push
```

### Step 6: Create Admin User (Optional)

You can create an admin user directly in Supabase:

1. Go to **Authentication** → **Users** in Supabase
2. Click **Add user** → **Create new user**
3. Enter email and password
4. After user is created, go to **Database** → **Table Editor**
5. Open the `User` table
6. Find your user and change `role` from `EMPLOYEE` to `ADMIN`

### Step 7: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 Usage Guide

### For Employees:

1. **Register**: Go to `/register` and fill in your details
2. **Login**: Use your email and password
3. **Check In**: Click "Check In" button on dashboard
4. **Check Out**: Click "Check Out" when leaving
5. **Request Permission**: Navigate to Permissions page
6. **Request Leave**: Navigate to Leave Requests page

### For Admins:

1. **Login** with admin credentials
2. **View Dashboard**: See overall statistics
3. **Manage Employees**: Add/Edit/Delete employee records
4. **Approve Leaves**: Review and approve/reject leave requests
5. **Monitor Permissions**: Track permission usage and overtime
6. **View Reports**: Access attendance and permission reports

---

## 🎯 Key Features Explained

### Permission System (120 min/day)
- Each employee can take up to 120 minutes of permission per day
- If they exceed this limit, the extra time is tracked separately
- Admins can see who exceeded the limit in reports

### Leave System (4 days/month)
- Employees can request up to 4 leave days per month
- System automatically validates against this quota
- Requests exceeding the limit are blocked
- Admins must approve all leave requests

### Attendance Tracking
- Simple Check In/Check Out system
- Automatically calculates total working hours
- Tracks date and time for all entries

---

## 🔧 Troubleshooting

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Regenerate Prisma Client
npx prisma generate

# Rebuild
npm run build
```

### Database Connection Issues
- Verify your DATABASE_URL in `.env`
- Check if Supabase project is active
- Ensure you're using the correct connection string

### Authentication Issues
- Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- Check Supabase project status
- Clear browser cookies and try again

---

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase PostgreSQL
- **ORM**: Prisma 6
- **Auth**: Supabase Auth
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

---

## 📝 Notes

- The app uses **Prisma 6** for better Next.js compatibility
- All API routes are protected with authentication
- Mobile navigation uses bottom tabs for better UX
- Desktop uses sidebar navigation
- All times are stored in UTC, displayed in local timezone

---

## 🎨 Customization

### Change Theme Colors

Edit `src/app/globals.css`:
- Change `--primary` for main color
- Change `--secondary` for accent color
- Modify other CSS variables as needed

### Modify Permission/Leave Limits

Edit the API routes:
- `src/app/api/permissions/route.ts` - Change `MAX_PERMISSION_MINUTES`
- `src/app/api/leaves/route.ts` - Change `MAX_LEAVES_PER_MONTH`

---

## ✅ Build Status

✓ Build successful
✓ TypeScript compilation passed
✓ All routes generated
✓ Static pages optimized
✓ Production ready

---

## 📞 Support

For issues or questions, check:
1. Environment variables are correctly set
2. Database connection is working
3. Prisma client is generated
4. All dependencies are installed

---

**Built with ❤️ using Next.js, Prisma, and Supabase**
