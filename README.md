# Meklit MVP 🏫

A comprehensive childcare and daycare management system designed to streamline daily operations, track children's activities, manage staff responsibilities, and maintain detailed health records.

## ✨ Features

### 📊 Daily Reports & Analytics
- **Comprehensive Daily Reports**: Generate detailed reports with activity logs, health records, and attendance tracking
- **Period Comparisons**: Compare current performance with previous periods
- **Visual Analytics**: Interactive charts and statistics for better insights
- **Real-time Data**: Live updates on daily activities and metrics

### 👶 Child Management
- **Child Profiles**: Detailed profiles with personal information, emergency contacts, and medical history
- **Activity Tracking**: Log daily activities, meals, naps, and learning milestones
- **Health Records**: Comprehensive health monitoring with medication tracking and incident reports
- **Attendance Management**: Automated check-in/check-out systems with real-time attendance tracking

### 👩‍🏫 Staff Management
- **Staff Profiles**: Manage staff information, roles, and responsibilities
- **Activity Assignment**: Assign staff to specific activities and children
- **Performance Tracking**: Monitor staff activities and generate performance reports
- **Role-based Access**: Different permission levels for administrators, teachers, and assistants

### 🏥 Health & Safety
- **Medical Records**: Maintain detailed health records for each child
- **Medication Tracking**: Log medication administration with timestamps and staff verification
- **Incident Reports**: Document and track any incidents or injuries
- **Emergency Contacts**: Quick access to parent and emergency contact information

### 📱 User Interface
- **Modern Design**: Clean, intuitive interface with responsive design
- **Custom Color System**: Consistent branding with CSS custom properties
- **Filter & Search**: Advanced filtering options for reports and records
- **Real-time Updates**: Live data updates without page refreshes

## 🛠️ Technology Stack

### Frontend
- **React** - Modern UI library for building interactive interfaces
- **Redux Toolkit (RTK Query)** - State management and API data fetching
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Lucide React** - Beautiful, customizable icons
- **Recharts** - Composable charting library for data visualization

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Web framework for building RESTful APIs
- **Database** - [Specify your database: PostgreSQL, MySQL, MongoDB, etc.]
- **Authentication** - Secure user authentication and authorization

### Development Tools
- **TypeScript** - Type-safe JavaScript development
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Git** - Version control

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- [Database system] installed and running

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/binmek94th/meklit-mvp.git
   cd meklit-mvp
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Configure your environment variables in `.env`:
   ```env
   PORT=3000
   ```

4. **Database Setup**
   ```bash
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`
6. **Frontend Setup**
   Open a new terminal, navigate to the `src` directory, and install dependencies:
   ```bash
   cd client
   npm install
   # or
   yarn install
   ```
7. **Start the frontend development server**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173` (or another port if specified)

## 📖 API Documentation

### Daily Reports
```
GET /api/report/daily?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
```
Retrieve comprehensive daily reports with activity logs, health records, and analytics.

### Children Management
```
GET    /api/children          - Get all children
POST   /api/children          - Create new child profile
```

### Staff Management
```
GET    /api/staff             - Get all staff members
POST   /api/staff             - Create new staff profile
```


## 🎨 UI Components

### Custom Components
- **DailyReportComponent**: Comprehensive dashboard for daily operations
- **FilterSelects**: Beautiful, accessible filter components
- **ActivityLog**: Interactive activity timeline
- **HealthRecords**: Medical records management interface

### Styling
The project uses a custom CSS variable system for consistent theming:
```css
:root {
    --color-blue: 59 130 246;
    --color-green: 34 197 94;
    --color-purple: 168 85 247;
    --color-blue-bg: 239 246 255;
    --color-green-bg: 240 253 244;
    --color-purple-bg: 250 245 255;
}
```

## 📂 Project Structure

```
meklit-mvp/
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── store/             # Redux store configuration
│   ├── services/          # API services and RTK Query
│   ├── utils/             # Utility functions
│   └── styles/            # Global styles and CSS variables
├── server/
│   ├── routes/            # API route handlers
│   ├── models/            # Database models
│   ├── middleware/        # Express middleware
│   └── utils/             # Server utilities
├── public/                # Static assets
└── docs/                  # Documentation
```


## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Docker Deployment
```bash
docker build -t meklit-mvp .
docker run -p 3000:3000 meklit-mvp
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Update documentation for new features
- Ensure all tests pass before submitting PR
