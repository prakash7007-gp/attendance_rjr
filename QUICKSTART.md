# Quick Start Commands

## Initial Setup
```bash
# Install dependencies (already done)
npm install

# Generate Prisma Client
npx prisma generate

# Push database schema to Supabase
npx prisma db push
```

## Development
```bash
# Start development server
npm run dev
```

## Production
```bash
# Build for production
npm run build

# Start production server
npm start
```

## Database Management
```bash
# Generate Prisma Client
npx prisma generate

# Push schema changes
npx prisma db push

# Open Prisma Studio (Database GUI)
npx prisma studio
```

## Important URLs
- Development: http://localhost:3000
- Login: http://localhost:3000/login
- Register: http://localhost:3000/register
- Admin Dashboard: http://localhost:3000/dashboard/admin
- Employee Dashboard: http://localhost:3000/dashboard/employee

## Environment Setup
1. Copy `.env.example` to `.env`
2. Fill in your Supabase credentials
3. Run `npx prisma generate`
4. Run `npx prisma db push`
5. Run `npm run dev`

## Default Test Credentials
After registration, you can create users via:
- Register page: /register
- Supabase Dashboard: Authentication → Users

To make a user an admin:
1. Go to Supabase Dashboard
2. Navigate to Database → Table Editor
3. Open `User` table
4. Find your user and change `role` to `ADMIN`
