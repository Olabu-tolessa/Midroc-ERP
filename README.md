# Midroc ERP - Construction & Consulting Management System

A comprehensive Enterprise Resource Planning (ERP) system specifically designed for construction and consulting companies, featuring project management, team coordination, financial tracking, and safety compliance.

## 🏗️ Features

### Core Modules
- **Construction Dashboard** - Real-time project metrics and overview
- **Construction Projects** - Comprehensive project management with progress tracking
- **Human Resources** - Team management for engineers, consultants, and construction workers
- **Construction Finance** - Budget tracking, contract management, and financial reporting
- **Construction Analytics** - Project performance insights and reporting
- **Quality & Safety** - Safety compliance and quality control management
- **Client Relations** - Client management and contract tracking

### User Roles & Permissions

#### Administrator (Full Access)
- ✅ Create, edit, delete projects
- ✅ View all projects and data
- ✅ Export all data
- ✅ Manage users and system settings
- ✅ Access all financial data
- ✅ Full HR access
- ✅ View all reports

#### General Manager (Management Access)
- ✅ Create, edit, delete projects
- ✅ View all projects and data
- ✅ Export project data
- ✅ Manage team members
- ✅ Access financial data
- ✅ Full HR access
- ✅ View all reports
- ❌ System administration

#### Project Manager (Project-Focused Access)
- ✅ Create and edit projects
- ✅ View all projects
- ✅ Export project data
- ✅ View project reports
- ❌ Delete projects
- ❌ User management
- ❌ Financial access
- ❌ HR access
- ❌ System settings

#### Consultant (Limited Project Access)
- ✅ Edit assigned projects
- ✅ Export own project data
- ✅ View project reports for assigned projects
- ❌ Create/delete projects
- ❌ View all projects
- ❌ User management
- ❌ Financial access
- ❌ HR access

#### Engineer (Task-Level Access)
- ✅ Edit assigned project tasks
- ❌ Create/delete projects
- ❌ View all projects (only assigned)
- ❌ Export data
- ❌ Management functions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd midroc-erp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Demo Credentials

Use these credentials to test different user roles:

- **Administrator**: `admin@midroc.com` / `password`
- **General Manager**: `gm@midroc.com` / `password`
- **Project Manager**: `pm@midroc.com` / `password`
- **Consultant**: `consultant@midroc.com` / `password`
- **Engineer**: `engineer@midroc.com` / `password`

## 🎨 Design System

### Color Palette
- **Primary**: Forest Green (#2D5016) - Professional construction industry branding
- **Secondary**: White (#FFFFFF) - Clean, modern interface
- **Accent Colors**: Blue, Purple, Orange for different data categories
- **Status Colors**: Green (success), Red (danger), Yellow (warning), Blue (info)

### Typography
- **Headings**: Bold, clear hierarchy
- **Body Text**: Readable, professional
- **UI Elements**: Medium weight for buttons and navigation

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/              # Login and signup components
│   ├── dashboard/         # Dashboard widgets and metrics
│   ├── layout/           # Navigation and layout components
│   ├── modules/          # Core ERP modules
│   └── projects/         # Project management components
├── contexts/             # React contexts (Auth, etc.)
├── data/                # Mock data and constants
├── types/               # TypeScript type definitions
└── App.tsx              # Main application component
```

## 🔧 Logo Upload Instructions

### Method 1: Direct File Upload (Recommended)
1. Navigate to `src/assets/` directory
2. Replace the existing logo file with your company logo
3. Update the import path in `Navigation.tsx`
4. Recommended formats: SVG, PNG (transparent background)
5. Optimal size: 40x40px to 60x60px

### Method 2: Using External URL
1. Upload your logo to a cloud service (AWS S3, Cloudinary, etc.)
2. Update the logo source in `Navigation.tsx`:
   ```tsx
   <img src="https://your-logo-url.com/logo.png" alt="Midroc Logo" />
   ```

### Method 3: Base64 Encoding (For Small Logos)
1. Convert your logo to Base64 format
2. Replace the Building2 icon with an img tag:
   ```tsx
   <img src="data:image/png;base64,YOUR_BASE64_STRING" alt="Logo" />
   ```

### Troubleshooting Logo Upload Issues

#### Browser Compatibility Issues:
- **Chrome/Edge**: Clear browser cache (Ctrl+Shift+Delete)
- **Firefox**: Disable strict tracking protection for localhost
- **Safari**: Enable "Develop" menu and disable caches

#### File Upload Not Working:
1. **Check file permissions**: Ensure the assets folder is writable
2. **File size limits**: Keep logos under 1MB for optimal performance
3. **Supported formats**: Use PNG, SVG, or JPG formats
4. **Path issues**: Verify the file path is correct relative to src/

#### Alternative Upload Methods:
1. **Drag and Drop**: Drag logo file directly into VS Code assets folder
2. **Command Line**: Use `cp logo.png src/assets/` command
3. **File Explorer**: Copy-paste through your operating system's file manager

## 🏗️ Construction Industry Customizations

### Project Types Supported
- **Highway Construction** - Road and infrastructure projects
- **Urban Planning** - City development and planning consultations  
- **Commercial Building** - Office and retail construction
- **Residential Development** - Housing and apartment projects
- **Infrastructure Assessment** - Bridge, tunnel, and utility evaluations

### Industry-Specific Features
- **Safety Compliance Tracking** - Monitor safety inspections and incidents
- **Equipment Management** - Track heavy machinery and tools
- **Material Cost Tracking** - Monitor construction material expenses
- **Site Progress Monitoring** - Visual progress tracking with photos
- **Environmental Compliance** - Track environmental impact assessments
- **Permit Management** - Monitor construction permits and approvals

## 🔒 Security Features

- **Role-based Access Control** - Granular permissions by user role
- **Secure Authentication** - Password-based login with session management
- **Data Validation** - Input validation and sanitization
- **Audit Trails** - Track user actions and system changes

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** - Full feature access with optimal layout
- **Tablet** - Adapted interface for touch interaction
- **Mobile** - Essential features accessible on smartphones

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system

## 📄 License

This project is proprietary software developed for Midroc construction and consulting operations.

## 🤝 Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.

---

**Midroc ERP** - Empowering Construction Excellence Through Technology