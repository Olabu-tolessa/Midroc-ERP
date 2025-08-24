# 🚀 MIDROC ERP - XAMPP + MySQL Setup Guide

This guide will help you set up the MIDROC ERP system using XAMPP with MySQL instead of Supabase.

## 📋 **Prerequisites**

1. **XAMPP** - [Download here](https://www.apachefriends.org/download.html)
2. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
3. **VS Code** - [Download here](https://code.visualstudio.com/)

## 🛠️ **Step 1: Install and Setup XAMPP**

1. **Download and install XAMPP**
2. **Start XAMPP Control Panel**
3. **Start these services:**
   - ✅ **Apache**
   - ✅ **MySQL**

## 🗄️ **Step 2: Create MySQL Database**

1. **Open phpMyAdmin:**
   - Go to `http://localhost/phpmyadmin`
   - Or click "Admin" next to MySQL in XAMPP Control Panel

2. **Import the database:**
   - Click **"New"** to create a new database
   - Name it: `midroc`
   - Click **"Create"**
   - Go to **"Import"** tab
   - Choose file: `database/midroc_database.sql`
   - Click **"Import"**

## 📁 **Step 3: Setup PHP Backend**

1. **Copy backend files to XAMPP:**
   ```bash
   # Copy the backend folder to XAMPP htdocs
   # Windows: C:\xampp\htdocs\midroc-erp\
   # Mac: /Applications/XAMPP/htdocs/midroc-erp/
   # Linux: /opt/lampp/htdocs/midroc-erp/
   
   cp -r backend/ /path/to/xampp/htdocs/midroc-erp/
   ```

2. **Directory structure should be:**
   ```
   xampp/htdocs/midroc-erp/
   ├── backend/
   │   ├── api/
   │   │   ├── contracts.php
   │   │   └── supervision.php
   │   ├── config/
   │   │   ├── database.php
   │   │   └── cors.php
   │   └── .htaccess
   ```

3. **Test the API:**
   - Open: `http://localhost/midroc-erp/backend/api/contracts`
   - You should see a JSON response

## ⚙️ **Step 4: Configure React App**

1. **Create/Update .env file:**
   ```env
   # Use MySQL instead of Supabase
   VITE_DATABASE_TYPE=mysql
   
   # Optional: Keep Supabase credentials for fallback
   # VITE_SUPABASE_URL=your_supabase_url
   # VITE_SUPABASE_ANON_KEY=your_supabase_key
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## 🚀 **Step 5: Start Development**

1. **Start React development server:**
   ```bash
   npm run dev
   ```

2. **Open the application:**
   - URL: `http://localhost:5173`
   - Login with demo accounts:
     - **Admin**: `admin@midroc.com` / `password`
     - **Project Manager**: `pm@midroc.com` / `password`
     - **Client**: `client@midroc.com` / `password`

## 🧪 **Step 6: Test Database Integration**

1. **Contract Management:**
   - Go to **Contract Management** module
   - Create a new contract form
   - Check phpMyAdmin to see the data in `contract_forms` table

2. **Supervision Module:**
   - Go to **Supervision** module
   - Create supervision reports
   - Check `supervision_reports` table in phpMyAdmin

3. **Quality Audit:**
   - Try creating quality tasks
   - Check `quality_tasks` table

## 🛠️ **Database Configuration**

**Default MySQL settings in `backend/config/database.php`:**
```php
private $host = "localhost";
private $db_name = "midroc";
private $username = "root";
private $password = "";  // Default XAMPP password is empty
```

**If you changed MySQL root password:**
1. Open `backend/config/database.php`
2. Update the `$password` variable
3. Save the file

## 📊 **Database Tables**

The system creates these main tables:
- 📋 `contracts` - Contract records
- 📝 `contract_forms` - Contract forms with signatures
- 🔍 `supervision_reports` - Supervision reports
- ✅ `quality_safety_reports` - Quality & safety audits
- 📋 `quality_tasks` - Quality audit tasks
- 👥 `users` - System users
- 🏗️ `projects` - Project records

## 🔧 **Troubleshooting**

### **API Not Working:**
1. Make sure Apache is running in XAMPP
2. Check if files are in correct XAMPP htdocs path
3. Verify URL: `http://localhost/midroc-erp/backend/api/contracts`

### **Database Connection Error:**
1. Make sure MySQL is running in XAMPP
2. Verify database name is `midroc`
3. Check credentials in `backend/config/database.php`

### **CORS Errors:**
1. Make sure `.htaccess` file is in backend folder
2. Check if Apache mod_rewrite is enabled
3. Verify React dev server is running on port 5173

### **React App Not Connecting:**
1. Check `.env` file has `VITE_DATABASE_TYPE=mysql`
2. Make sure backend API is accessible
3. Check browser network tab for API call errors

## 🔄 **Switching Back to Supabase**

If you want to switch back to Supabase:
1. Update `.env` file:
   ```env
   VITE_DATABASE_TYPE=supabase
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
2. Restart the development server

## 📈 **Performance Tips**

1. **Enable Apache mod_rewrite** for clean URLs
2. **Use MySQL indexes** (already included in SQL file)
3. **Enable PHP OPcache** in XAMPP
4. **Use connection pooling** for production

## 🔐 **Security Notes**

1. **Change MySQL root password** for production
2. **Create dedicated database user** with limited privileges
3. **Enable HTTPS** for production deployment
4. **Add input validation** and sanitization
5. **Implement proper authentication** tokens

Your MIDROC ERP system is now fully configured with XAMPP + MySQL! 🎉
