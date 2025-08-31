# NextStop App - Setup Instructions

## 🚌 Quick Start Guide

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Git

### 1. Environment Setup

1. **Copy environment files:**
   ```bash
   # For nextstop-app
   cp nextstop-app/.env.example nextstop-app/.env.local
   
   # For bus-simulator
   cp bus-simulator/.env.example bus-simulator/.env
   ```

2. **Configure Supabase credentials:**
   - Create a new Supabase project at https://supabase.com
   - Copy your Project URL and anon key
   - Update both `.env.local` and `.env` files with your credentials

### 2. Database Setup

1. **Run SQL scripts in your Supabase SQL Editor (in this order):**
   ```sql
   -- 1. Create the main schema
   nextstop-app/sql/complete_schema.sql
   
   -- 2. Create RPC functions
   nextstop-app/sql/get_stops_near_me.sql
   nextstop-app/sql/trip_management_functions.sql
   
   -- 3. Insert sample data
   nextstop-app/sql/sample_data.sql
   nextstop-app/sql/driver_sample_data.sql
   ```

2. **Create Storage Bucket for Driver Documents:**
   - Go to Storage in Supabase Dashboard
   - Create a new bucket named `driver-documents`
   - Set it to public or private as needed

### 3. Install Dependencies

```bash
# Install frontend dependencies
cd nextstop-app
npm install

# Install simulator dependencies
cd ../bus-simulator
npm install
```

### 4. Run the Application

**Terminal 1 - Frontend:**
```bash
cd nextstop-app
npm run dev
```

**Terminal 2 - Bus Simulator (optional):**
```bash
cd bus-simulator
npm start
```

### 5. Access the Application

- **Passenger App:** http://localhost:5173
- **Driver Login:** http://localhost:5173/driver/login
- **Driver Signup:** http://localhost:5173/driver/signup

## 🎯 Features Implemented

### ✅ **Completed Features**

#### Phase 1: Backend Foundation
- ✅ Complete database schema with all tables
- ✅ Sample data for Mathura routes and stops
- ✅ RPC functions for nearby stops
- ✅ Trip management functions

#### Phase 2: Frontend & Authentication  
- ✅ React app with routing
- ✅ User authentication (Supabase Auth)
- ✅ Onboarding modal with language/city selection
- ✅ Internationalization (English/Hindi)

#### Phase 3: Passenger Map Experience
- ✅ Interactive map with user location
- ✅ Nearby bus stops display
- ✅ Real-time bus tracking
- ✅ Bottom sheet with trip information
- ✅ Route visualization

#### Phase 4: Driver Interface
- ✅ Driver login/signup pages
- ✅ Driver application form with document upload
- ✅ Driver dashboard with trip management
- ✅ Start/End trip functionality
- ✅ Status-based routing (pending/approved/rejected)

#### Phase 5: Simulation & Advanced Features
- ✅ Bus movement simulator
- ✅ Real-time data synchronization
- ✅ Multi-language support
- ✅ Interactive bottom sheet
- ✅ Route polylines

## 🔧 Development Workflow

### Testing Different User Flows

1. **Passenger Flow:**
   - Visit http://localhost:5173
   - Complete onboarding (language/city selection)
   - Sign up/Login as passenger
   - View map with nearby stops and real-time buses

2. **Driver Flow:**
   - Visit http://localhost:5173/driver/signup
   - Create driver account
   - Fill out application form
   - Admin manually approve in Supabase (set status to 'approved')
   - Login and access driver dashboard
   - Start/end trips

3. **Admin Tasks (in Supabase Dashboard):**
   - Review driver applications in `drivers` table
   - Assign buses and routes to approved drivers
   - Create scheduled trips in `trips` table

### Customization

- **Add new cities:** Update `OnboardingModal.jsx` and translation files
- **Add new languages:** Create new JSON files in `src/locales/`
- **Modify routes:** Edit sample data or add through Supabase interface
- **Styling:** Update inline styles or create CSS modules

## 🚀 Production Deployment

1. **Frontend (Vercel/Netlify):**
   ```bash
   cd nextstop-app
   npm run build
   # Deploy dist folder
   ```

2. **Simulator (Railway/Heroku):**
   ```bash
   cd bus-simulator
   # Deploy to cloud platform
   ```

3. **Environment Variables:**
   - Set production Supabase credentials
   - Configure CORS in Supabase for your domain

## 📞 Support

For issues or questions:
- Check browser console for errors
- Verify Supabase credentials and database setup
- Ensure all SQL scripts were executed successfully
- Check that storage bucket permissions are correct

## 🎯 Next Steps

To extend the app further:
1. Add admin panel for managing drivers/routes
2. Implement push notifications
3. Add payment integration
4. Create mobile apps with React Native
5. Add analytics and reporting features
