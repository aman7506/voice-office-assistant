# QUICK START GUIDE - Voice Office Assistant

## IMMEDIATE ACTIONS (Copy & Paste These Commands)

### STEP 1: UPLOAD TO GITHUB (15 Minutes)

Open PowerShell and run these commands:

```powershell
# Navigate to project directory
cd "e:\Aman Project Files\ChatBot"

# Initialize Git
git init

# Configure your Git identity (UPDATE EMAIL)
git config --global user.name "Aman Mishra"
git config --global user.email "your-actual-email@example.com"

# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: Voice Office Assistant project setup

- Complete backend server with Express.js and Socket.IO
- React Native mobile application with Expo
- OpenAI GPT integration for AI-powered conversations
- Microsoft SQL Server database integration
- Voice processing capabilities (STT/TTS)
- Calendar integration with Google Calendar API
- Task and reminder management system
- Comprehensive project documentation

Project Type: Full Stack Voice-Based Office Productivity Application
Tech Stack: Node.js, Express, React Native, Expo, SQL Server, OpenAI
Author: Aman Mishra"

# Create GitHub repository NOW:
# 1. Go to https://github.com/aman7506
# 2. Click "New" repository
# 3. Name: voice-office-assistant
# 4. Description: Full-stack voice-enabled office productivity assistant
# 5. Public (for portfolio)
# 6. DO NOT initialize with README
# 7. Click "Create repository"

# After creating repository, run these commands:
git remote add origin https://github.com/aman7506/voice-office-assistant.git
git branch -M main
git push -u origin main
```

**Verify:** Visit https://github.com/aman7506/voice-office-assistant

---

### STEP 2: DEPLOY BACKEND (1 Hour)

**Option A: Railway (Recommended)**

1. **Sign Up:**
   - Go to https://railway.app/
   - Click "Login with GitHub"
   - Authorize Railway

2. **Create Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose "voice-office-assistant"
   - Railway auto-detects Node.js

3. **Add Environment Variables:**
   
   Click "Variables" and add these (UPDATE VALUES):

   ```
   NODE_ENV=production
   PORT=5000
   
   OPENAI_API_KEY=your_openai_api_key_here
   
   JWT_SECRET=create-random-32-character-secret-here
   JWT_EXPIRES_IN=24h
   
   DB_SERVER=your-azure-sql-server.database.windows.net
   DB_NAME=VoiceOfficeAssistant
   DB_USER=your_db_username
   DB_PASSWORD=your_db_password
   DB_PORT=1433
   DB_ENCRYPT=true
   
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=https://your-app.up.railway.app/api/calendar/auth/callback
   
   CORS_ORIGIN=*
   SOCKET_CORS_ORIGIN=*
   
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Deploy:**
   - Railway deploys automatically
   - Wait 2-3 minutes
   - Get your URL: https://your-app-name.up.railway.app

5. **Test:**
   ```powershell
   curl https://your-app-name.up.railway.app/health
   ```

**Option B: Render**

1. Go to https://render.com/
2. Sign up with GitHub
3. New → Web Service
4. Connect repository
5. Add same environment variables
6. Deploy

---

### STEP 3: DEPLOY DATABASE (45 Minutes)

**Azure SQL Database:**

1. **Create Azure Account:**
   - Go to https://portal.azure.com/
   - Sign up (free $200 credit)

2. **Create SQL Database:**
   - Click "Create a resource"
   - Search "SQL Database"
   - Click "Create"
   
   **Configuration:**
   ```
   Resource Group: Create new "VoiceAssistant-RG"
   Database Name: VoiceOfficeAssistant
   Server: Create new
     Server name: voice-assistant-sql-[yourname]
     Location: East US (or nearest)
     Authentication: SQL authentication
     Admin login: sqladmin
     Password: [Create strong password - SAVE THIS]
   
   Compute: Basic (5 DTUs, 2GB)
   ```

3. **Configure Firewall:**
   - Go to SQL Server → Firewalls
   - Add your IP address
   - Enable "Allow Azure services"
   - Save

4. **Get Connection String:**
   - Go to Database → Connection strings
   - Copy and save for Railway

5. **Deploy Schema:**
   - Open SQL Server Management Studio (SSMS)
   - Connect to: voice-assistant-sql-[yourname].database.windows.net
   - Use sqladmin and your password
   - Open and execute: docs/DATABASE_SCHEMA.md scripts

6. **Update Railway:**
   - Update DB_SERVER, DB_USER, DB_PASSWORD in Railway variables
   - Backend will auto-restart

---

### STEP 4: BUILD MOBILE APP (1 Hour)

**Quick Build for Testing:**

```powershell
# Install EAS CLI
npm install -g eas-cli

# Navigate to mobile directory
cd mobile

# Login to Expo
eas login

# Configure (first time only)
eas build:configure

# Build Android APK for testing
eas build --platform android --profile preview

# This takes 15-30 minutes
# You'll get a download link when complete
```

**For App Store Submission Later:**

See DEPLOYMENT_GUIDE.md Section 4 for complete instructions.

---

## VERIFY DEPLOYMENT

### Backend Check:
```powershell
curl https://your-railway-url.up.railway.app/health
```

Expected response:
```json
{
  "status": "OK",
  "services": {
    "database": "connected",
    "openai": "configured"
  }
}
```

### Database Check:
1. Open SSMS
2. Connect to Azure SQL
3. Run: `SELECT COUNT(*) FROM Tasks;`
4. Should execute without errors

### Mobile App Check:
1. Install Expo Go on your phone
2. Run: `npm run mobile` (in project root)
3. Scan QR code
4. App should launch

---

## COMMON QUICK FIXES

### "Git not recognized"
```powershell
# Download and install Git: https://git-scm.com/
# Restart PowerShell after installation
```

### "Permission denied" on

 Git push
```powershell
# Use Personal Access Token:
# 1. GitHub → Settings → Developer settings → Personal access tokens
# 2. Generate new token (classic)
# 3. Select 'repo' scope
# 4. Save token
# 5. Use token as password when pushing
```

### Backend won't start on Railway
- Check logs in Railway dashboard
- Verify all environment variables set
- Ensure package.json has "start" script

### Database connection fails
- Check firewall rules in Azure
- Verify connection string
- Ensure database isn't paused (Basic tier auto-pauses)

### Mobile build fails
- Check eas.json exists
- Verify app.json bundle identifier unique
- Review build logs in Expo dashboard

---

## WHAT'S NEXT?

After completing above steps:

**Day 1:**
- ✅ GitHub repository live
- ✅ Backend deployed and accessible
- ✅ Database created and connected
- ✅ Mobile app buildable

**Week 1:**
- Test all features thoroughly
- Submit to app stores (optional)
- Set up monitoring (UptimeRobot)
- Add to your resume/portfolio

**Month 1:**
- Gather usage feedback
- Implement improvements
- Add new features
- Optimize performance

---

## HELP & RESOURCES

**If stuck, check these in order:**

1. **PRODUCTION_CHECKLIST.md** - Common errors section
2. **DEPLOYMENT_GUIDE.md** - Complete deployment steps
3. **GITHUB_SETUP_GUIDE.md** - Detailed Git instructions
4. **PROJECT_COMPLETION_SUMMARY.md** - Overview of everything

**External Resources:**
- Railway Docs: https://docs.railway.app/
- Expo Docs: https://docs.expo.dev/
- Azure SQL Docs: https://docs.microsoft.com/azure/sql-database/

---

## ESTIMATED TIMELINE

- GitHub Upload: 15 minutes ✓
- Railway Backend: 30 minutes
- Azure Database: 45 minutes
- Mobile Build: 30 minutes
- Testing: 30 minutes

**Total: ~2.5 hours to fully deployed!**

---

## SUCCESS CHECKLIST

- [ ] GitHub repository created and visible
- [ ] Backend deployed on Railway
- [ ] Health endpoint returns 200 OK
- [ ] Azure SQL Database created
- [ ] Database schema deployed
- [ ] Backend connects to database
- [ ] Mobile app builds successfully
- [ ] Mobile app tested on device
- [ ] All documentation present in repo

---

## YOU DID IT!

Once all checkboxes above are complete, you have:

🎉 A production-ready full-stack application
🎉 Live backend API
🎉 Cloud database
🎉 Mobile application
🎉 Professional documentation
🎉 Portfolio project ready for interviews

**Share your project:**
- Add to LinkedIn
- Add to resume
- Show in interviews
- Share with your network

---

**Questions?** Review the comprehensive guides in your project folder.

**Ready to deploy?** Start with Step 1 above!

**Author**: Aman Mishra
**Project**: Voice Office Assistant
**Status**: Production Ready
