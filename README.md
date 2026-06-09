# Nagar Setu - HRMS Platform

**Tagline:** "Employees aur departments ke beech digital bridge."

Nagar Setu is a unified Human Resource Management System (HRMS) designed for the Municipal Corporation of Delhi (MCD). The platform digitally connects employees and departments while managing recruitment, attendance, transfers, payroll, performance tracking, grievance redressal, and inter-department coordination.

## 🚀 Features

### Core Modules

1. **Employee Management**
   - Create, view, update, and delete employee profiles
   - Employee ID, name, department, designation, joining date, salary, contact details

2. **Recruitment & Onboarding**
   - Post job vacancies
   - Online application system
   - Shortlisting, approval, and onboarding workflow

3. **Attendance & Leave Management**
   - Daily attendance system (manual + simulated GPS-based)
   - Leave request and approval system
   - Monthly attendance reports

4. **Transfer & Posting Module**
   - Employee transfer requests
   - Rule-based approval workflow
   - Department-wise vacancy tracking

5. **Payroll Management**
   - Automatic salary calculation using attendance data
   - Monthly payslip generation
   - Salary history view for employees

6. **Performance Tracking**
   - KPI-based performance reviews
   - Supervisor ratings and remarks
   - Department-level performance reports

7. **Grievance Redressal System**
   - Employees can raise grievances
   - Ticket-based tracking with status updates
   - Escalation and resolution workflow

8. **Admin & Inter-Department Dashboard**
   - Centralized employee database
   - Role-based access control
   - Visual dashboards with charts and summaries

## 🛠️ Tech Stack

- **Frontend:** React 18.2.0
- **Backend:** Node.js with Express
- **Database:** MongoDB
- **Authentication:** JWT-based with role-based access control

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Nagarsetu
```

### 2. Install Dependencies

Install backend and frontend dependencies:

```bash
# Install root dependencies (for running both servers)
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

Or use the convenience script:

```bash
npm run install-all
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/nagar-setu
JWT_SECRET=your-secret-key-change-this-in-production
PORT=5000
```

**Note:** For MongoDB Atlas, use:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nagar-setu
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows
mongod

# On macOS (if installed via Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

### 5. Seed Database with Dummy Data

Run the seed script to populate the database with sample data:

```bash
npm run seed
```

This will create:
- 6 departments
- 30 employees
- 4 demo user accounts
- Sample data for all modules

### 6. Start the Application

#### Option 1: Run Both Servers Together (Recommended)

```bash
npm run dev
```

This starts both backend (port 5000) and frontend (port 3000) concurrently.

#### Option 2: Run Servers Separately

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

### 7. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api

## 🔐 Demo Login Credentials

After seeding the database, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@mcd.gov.in | admin123 |
| HR Officer | hr@mcd.gov.in | hr123 |
| Department Head | depthead@mcd.gov.in | dept123 |
| Employee | employee@mcd.gov.in | emp123 |

**Note:** All employees (employee1@mcd.gov.in to employee30@mcd.gov.in) can login with password: `emp123`

## 📁 Project Structure

```
Nagarsetu/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── scripts/         # Seed data script
│   ├── server.js        # Express server
│   └── .env             # Environment variables
├── frontend/
│   ├── public/          # Public assets
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/       # Page components
│   │   ├── context/    # React context (Auth)
│   │   ├── services/   # API service
│   │   └── App.js      # Main app component
│   └── package.json
├── package.json         # Root package.json
└── README.md
```

## 🎨 UI Features

- Clean, government-style interface
- Responsive design for desktop and mobile
- Dashboard with charts and statistics
- Role-based navigation menu
- Color-coded status badges
- Modal forms for data entry
- Search and filter functionality

## 🔑 Role-Based Access Control

### Admin
- Full access to all modules
- Manage employees, departments
- Approve/reject leaves, transfers
- Generate payroll
- View all grievances

### HR Officer
- Manage employees and departments
- Handle recruitment
- Approve leaves and transfers
- Generate payroll
- Manage grievances

### Department Head
- View employees in their department
- Approve leaves for department employees
- View department attendance
- View department performance

### Employee
- View own profile and attendance
- Request leaves and transfers
- View own payroll
- Raise grievances
- View own performance reviews

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance/summary` - Get monthly summary

### Leaves
- `GET /api/leaves` - Get leave requests
- `POST /api/leaves` - Create leave request
- `PUT /api/leaves/:id/approve` - Approve/reject leave

### Transfers
- `GET /api/transfers` - Get transfer requests
- `POST /api/transfers` - Create transfer request
- `PUT /api/transfers/:id/approve` - Approve/reject transfer

### Payroll
- `GET /api/payroll` - Get payroll records
- `POST /api/payroll/generate` - Generate payroll
- `POST /api/payroll/generate-all` - Generate for all employees

### Performance
- `GET /api/performance` - Get performance reviews
- `POST /api/performance` - Create performance review
- `GET /api/performance/department/summary` - Department summary

### Grievances
- `GET /api/grievances` - Get grievances
- `POST /api/grievances` - Create grievance
- `PUT /api/grievances/:id/status` - Update grievance status

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/attendance/trends` - Get attendance trends
- `GET /api/dashboard/departments/employees` - Department-wise stats

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env` file
- For MongoDB Atlas, verify connection string and network access

### Port Already in Use
- Change `PORT` in `backend/.env`
- Or kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # macOS/Linux
  lsof -ti:5000 | xargs kill
  ```

### Frontend Not Loading
- Ensure backend is running on port 5000
- Check browser console for errors
- Verify proxy settings in `frontend/package.json`

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET in backend `.env`
- Verify token in browser DevTools > Application > Local Storage

## 🚀 Deployment

### Backend Deployment (Heroku/Node.js hosting)

1. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT` (usually auto-set by hosting provider)

2. Update CORS settings in `backend/server.js` if needed

### Frontend Deployment (Netlify/Vercel)

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Set environment variable:
   - `REACT_APP_API_URL` - Your backend API URL

3. Deploy the `build` folder

## 📝 Notes

- This is an MVP/demo version suitable for hackathons or demonstrations
- Uses dummy data for demonstration purposes
- GPS-based attendance uses simulated coordinates (defaults to Delhi)
- All passwords are stored as bcrypt hashes
- JWT tokens expire after 7 days

## 🤝 Contributing

This is a demonstration project. Feel free to fork and enhance!

## 📄 License

This project is created for demonstration purposes.

## 👥 Credits

Developed for Municipal Corporation of Delhi (MCD) HRMS demonstration.

---

**Nagar Setu** - Building digital bridges between employees and departments! 🌉


