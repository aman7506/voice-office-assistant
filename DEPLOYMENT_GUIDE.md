# Voice Office Assistant - Production Deployment Guide

## Table of Contents

1. [Pre-Deployment Checklist](#1-pre-deployment-checklist)
2. [Backend Deployment](#2-backend-deployment)
3. [Database Deployment](#3-database-deployment)
4. [Mobile App Deployment](#4-mobile-app-deployment)
5. [Environment Configuration](#5-environment-configuration)
6. [Security Hardening](#6-security-hardening)
7. [Post-Deployment Verification](#7-post-deployment-verification)
8. [Monitoring and Maintenance](#8-monitoring-and-maintenance)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Pre-Deployment Checklist

### 1.1 Code Preparation

**Backend Readiness**:
- [ ] All environment variables documented
- [ ] Error handling implemented for all routes
- [ ] Logging configured for production
- [ ] Database connection pooling configured
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] Security headers added (Helmet.js)
- [ ] Input validation on all endpoints

**Frontend Readiness**:
- [ ] Production API URL configured
- [ ] Error boundaries implemented
- [ ] Loading states for all async operations
- [ ] Offline error handling
- [ ] App icons and splash screens configured
- [ ] Build configuration optimized

**Database Readiness**:
- [ ] All tables created with proper indexes
- [ ] Stored procedures deployed
- [ ] Constraints and triggers in place
- [ ] Backup strategy defined
- [ ] Connection strings secured

### 1.2 Third-Party Service Setup

**OpenAI API**:
- [ ] Production API key obtained
- [ ] Usage limits understood
- [ ] Billing configured
- [ ] Error handling for API failures

**Google Calendar API**:
- [ ] OAuth credentials created for production
- [ ] Redirect URLs configured
- [ ] Consent screen configured and verified
- [ ] API quotas reviewed

### 1.3 Documentation Review

- [ ] README.md updated with production URLs
- [ ] API documentation accurate
- [ ] Deployment procedures documented
- [ ] Rollback procedures defined
- [ ] Contact information for support

---

## 2. Backend Deployment

### 2.1 Deployment Platform Comparison

**Railway** (Recommended)

Pros:
- Easy GitHub integration
- Automatic deployments from Git
- Built-in PostgreSQL (if switching from SQL Server)
- Environment variable management
- Reasonable pricing

Cons:
- Limited SQL Server support (uses PostgreSQL)

**Render**

Pros:
- Free tier available
- GitHub integration
- Environment variable management
- PostgreSQL support
- Static site hosting

Cons:
- Free tier has cold starts
- Limited SQL Server support

**Azure App Service** (Best for SQL Server)

Pros:
- Native SQL Server integration
- Enterprise-grade
- Automatic scaling
- Excellent Windows/SQL Server support

Cons:
- More expensive
- Steeper learning curve

**For this project, we'll use Railway for backend and Azure SQL for database.**

### 2.2 Railway Deployment Steps

**Step 1: Prepare Repository**

Ensure your project is pushed to GitHub:
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

**Step 2: Sign Up for Railway**

1. Go to https://railway.app/
2. Sign up with GitHub account
3. Authorize Railway to access repositories

**Step 3: Create New Project**

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository: `voice-office-assistant`
4. Railway will detect Node.js project automatically

**Step 4: Configure Build Settings**

Railway auto-detects configuration, but verify:

```
Build Command: npm install
Start Command: npm start
Root Directory: . (or /server if using monorepo structure)
```

**Step 5: Configure Environment Variables**

Add all environment variables in Railway dashboard:

```
NODE_ENV=production
PORT=5000
OPENAI_API_KEY=your_production_openai_key
JWT_SECRET=your_secure_jwt_secret_min_32_chars
JWT_EXPIRES_IN=24h

DB_SERVER=your_azure_sql_server.database.windows.net
DB_NAME=VoiceOfficeAssistant
DB_USER=your_db_username
DB_PASSWORD=your_secure_db_password
DB_PORT=1433
DB_ENCRYPT=true

GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_client_secret
GOOGLE_REDIRECT_URI=https://your-railway-url.up.railway.app/api/calendar/auth/callback

CORS_ORIGIN=https://your-mobile-app-domain.com
SOCKET_CORS_ORIGIN=https://your-mobile-app-domain.com

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Step 6: Deploy**

Railway automatically deploys on push to main branch:
1. Railway detects changes
2. Builds application
3. Runs health checks
4. Deploys to production URL

**Step 7: Get Production URL**

Railway provides a URL: `your-app-name.up.railway.app`

You can also add custom domain:
1. Go to Settings → Domains
2. Add custom domain
3. Configure DNS records

### 2.3 Alternative: Render Deployment

**Step 1: Create Render Account**

1. Go to https://render.com/
2. Sign up with GitHub

**Step 2: Create Web Service**

1. Click "New +" → "Web Service"
2. Connect GitHub repository
3. Configure:
   - Name: voice-office-assistant
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free or Starter

**Step 3: Add Environment Variables**

Same variables as Railway (see Step 5 above)

**Step 4: Deploy**

Render automatically deploys and provides URL

### 2.4 Backend Production Configuration

**Update server/index.js for production**:

```javascript
// Production-specific configuration
if (process.env.NODE_ENV === 'production') {
  // Trust proxy for Railway/Render
  app.set('trust proxy', 1);
  
  // Strict CORS in production
  const corsOptions = {
    origin: process.env.CORS_ORIGIN.split(','),
    credentials: true,
    optionsSuccessStatus: 200
  };
  
  // Force HTTPS
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

---

## 3. Database Deployment

### 3.1 Azure SQL Database Setup

**Step 1: Create Azure Account**

1. Go to https://portal.azure.com/
2. Sign up for free tier (12 months free + $200 credit)

**Step 2: Create SQL Database**

1. In Azure Portal, click "Create a resource"
2. Search for "SQL Database"
3. Click "Create"

**Step 3: Configure Database**

Basic Settings:
```
Subscription: Your subscription
Resource Group: Create new "VoiceOfficeAssistant-RG"
Database Name: VoiceOfficeAssistant
Server: Create new server
  Server name: voice-assistant-sql (must be globally unique)
  Location: Choose nearest region
  Authentication: SQL authentication
  Server admin login: sqladmin
  Password: [Create secure password]
  
Compute + storage:
  Service tier: Basic or Standard S0 (for development)
  Backup storage: LRS (Locally-redundant)
```

**Step 4: Configure Firewall**

1. Go to SQL Server resource
2. Click "Firewalls and virtual networks"
3. Add your IP address
4. Enable "Allow Azure services"
5. Click "Save"

**Step 5: Get Connection String**

1. Go to Database resource
2. Click "Connection strings"
3. Copy ADO.NET connection string
4. Replace {your_password} with actual password

Connection string format:
```
Server=tcp:voice-assistant-sql.database.windows.net,1433;
Initial Catalog=VoiceOfficeAssistant;
Persist Security Info=False;
User ID=sqladmin;Password={your_password};
MultipleActiveResultSets=False;
Encrypt=True;TrustServerCertificate=False;
Connection Timeout=30;
```

**Step 6: Deploy Database Schema**

Connect using SQL Server Management Studio (SSMS) or Azure Data Studio:

1. Open SSMS
2. Connect to `voice-assistant-sql.database.windows.net`
3. Use SQL authentication with credentials
4. Execute schema creation scripts:

```sql
-- Create all tables
-- Execute from DATABASE_SCHEMA.md

-- Create indexes
CREATE INDEX idx_tasks_userid ON Tasks(UserID);
CREATE INDEX idx_tasks_status ON Tasks(Status);
-- Add all other indexes

-- Create stored procedures
-- Execute stored procedure scripts

-- Create triggers
-- Execute trigger scripts

-- Verify deployment
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;
```

### 3.2 Database Connection Configuration

**Update backend environment variables**:

```env
DB_SERVER=voice-assistant-sql.database.windows.net
DB_NAME=VoiceOfficeAssistant
DB_USER=sqladmin
DB_PASSWORD=your_secure_password
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=false
```

**Test connection**:

```bash
npm run test-db
```

### 3.3 Database Backup Strategy

**Automated Backups** (Azure SQL):
- Point-in-time restore (7-35 days retention)
- Automatic daily backups
- Geo-redundant backups (optional)

**Manual Backup**:

```sql
-- Export database (via Azure Portal)
1. Go to database resource
2. Click "Export"
3. Choose storage account
4. Download .bacpac file
```

**Restore Process**:

```sql
-- Import database (via Azure Portal)
1. Go to SQL Server
2. Click "Import database"
3. Select .bacpac file
4. Configure database settings
```

---

## 4. Mobile App Deployment

### 4.1 Expo Application Services (EAS) Setup

**Step 1: Install EAS CLI**

```bash
npm install -g eas-cli
```

**Step 2: Login to Expo**

```bash
eas login
```

**Step 3: Configure EAS**

Initialize EAS in mobile directory:

```bash
cd mobile
eas build:configure
```

This creates `eas.json`:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "buildType": "app-store"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

**Step 4: Update app.json**

```json
{
  "expo": {
    "name": "Voice Office Assistant",
    "slug": "voice-office-assistant",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.amanmishra.voiceofficeassistant"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.amanmishra.voiceofficeassistant",
      "permissions": [
        "RECORD_AUDIO",
        "NOTIFICATIONS"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### 4.2 Android Deployment

**Step 1: Create Production Build**

```bash
eas build --platform android --profile production
```

This process:
1. Creates Android App Bundle (.aab)
2. Signs with auto-generated keystore
3. Uploads to Expo servers
4. Provides download link

Build typically takes 15-30 minutes.

**Step 2: Download Build**

After build completes:
1. Download .aab file from Expo dashboard
2. Or use CLI: `eas build:download`

**Step 3: Create Google Play Console Account**

1. Go to https://play.google.com/console
2. Create developer account ($25 one-time fee)
3. Accept developer agreement

**Step 4: Create App in Play Console**

1. Click "Create app"
2. Fill in app details:
   - App name: Voice Office Assistant
   - Default language: English
   - App type: App
   - Category: Productivity
   - Free/Paid: Free

**Step 5: Complete Store Listing**

Required information:
- App description (4000 characters max)
- Screenshots (minimum 2)
- Feature graphic (1024 x 500)
- App icon (512 x 512)
- Privacy policy URL

**Step 6: Upload APK/AAB**

1. Go to "Production" → "Create new release"
2. Upload .aab file
3. Fill release notes
4. Review and rollout

Timelines:
- First review: 3-7 days
- Updates: 1-3 days

### 4.3 iOS Deployment

**Step 1: Apple Developer Account**

1. Enroll at https://developer.apple.com/ ($99/year)
2. Complete enrollment process

**Step 2: Create App ID**

1. Go to Certificates, Identifiers & Profiles
2. Create new identifier
3. Bundle ID: `com.amanmishra.voiceofficeassistant`

**Step 3: Create Production Build**

```bash
eas build --platform ios --profile production
```

**Step 4: App Store Connect**

1. Go to https://appstoreconnect.apple.com/
2. Click "My Apps" → "+"
3. Create new app:
   - Platform: iOS
   - Name: Voice Office Assistant
   - Primary Language: English
   - Bundle ID: com.amanmishra.voiceofficeassistant

**Step 5: Submit for Review**

Required:
- App description
- Keywords
- Screenshots (5.5" and 6.5" displays)
- App preview video (optional)
- Privacy policy URL
- App category: Productivity

Review timeline: 1-3 days

### 4.4 Over-the-Air (OTA) Updates

**Configure OTA updates** in app.json:

```json
{
  "expo": {
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0
    }
  }
}
```

**Publish OTA update**:

```bash
eas update --branch production --message "Bug fixes and improvements"
```

Users get updates automatically without app store submission.

---

## 5. Environment Configuration

### 5.1 Production Environment Variables

**Backend (.env)**:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database Configuration (Azure SQL)
DB_SERVER=voice-assistant-sql.database.windows.net
DB_NAME=VoiceOfficeAssistant
DB_USER=sqladmin
DB_PASSWORD=SecurePassword123!
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=false

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-3.5-turbo

# JWT Configuration
JWT_SECRET=super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=super-secret-refresh-key-different-from-jwt

# Google Calendar
GOOGLE_CLIENT_ID=123456789-xxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxx
GOOGLE_REDIRECT_URI=https://your-app.up.railway.app/api/calendar/auth/callback

# CORS Configuration
CORS_ORIGIN=https://your-mobile-app.com,https://www.your-mobile-app.com
SOCKET_CORS_ORIGIN=https://your-mobile-app.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=logs/production.log
```

**Frontend (config.js)**:

```javascript
const ENV = {
  production: {
    apiUrl: 'https://your-app.up.railway.app',
    socketUrl: 'https://your-app.up.railway.app',
    enableLogging: false,
    timeout: 15000,
  },
};

export default ENV.production;
```

### 5.2 Secrets Management

**Never commit**:
- .env files
- API keys
- Database passwords
- Private keys
- OAuth secrets

**Use platform secret management**:
- Railway: Environment variables in dashboard
- Render: Environment variables in settings
- Azure: Key Vault (advanced)

**Rotate secrets regularly**:
- JWT secrets: Every 3-6 months
- Database passwords: Every 6 months
- API keys: When compromised

---

## 6. Security Hardening

### 6.1 HTTPS Configuration

**Railway/Render**: HTTPS enabled by default

**Custom domain HTTPS**:
1. Add custom domain in platform
2. Platform auto-provisions SSL certificate
3. Configure DNS records
4. Force HTTPS redirect

**Verify HTTPS**:
```bash
curl -I https://your-app.up.railway.app
# Look for: Strict-Transport-Security header
```

### 6.2 Security Headers

Already implemented in Helmet.js, verify:

```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### 6.3 Database Security

**Firewall Rules**:
- Whitelist only application server IPs
- Remove "Allow Azure services" after initial setup
- Use Azure Private Link for production

**Encrypted Connections**:
- Enforce SSL/TLS connections
- Set `Encrypt=True` in connection string

**Access Control**:
- Use dedicated database user (not admin)
- Grant minimum required permissions
- Implement row-level security (future)

### 6.4 API Security

**Rate Limiting**: Already implemented

**Input Validation**:
```javascript
const validateTaskInput = (req, res, next) => {
  const { title, priority } = req.body;
  
  if (!title || title.length > 200) {
    return res.status(400).json({ error: 'Invalid title' });
  }
  
  if (priority && !['low', 'medium', 'high', 'urgent'].includes(priority)) {
    return res.status(400).json({ error: 'Invalid priority' });
  }
  
  next();
};
```

**SQL Injection Prevention**:
```javascript
// Always use parameterized queries
const result = await pool.request()
  .input('userId', sql.Int, userId)
  .query('SELECT * FROM Tasks WHERE UserID = @userId');
```

---

## 7. Post-Deployment Verification

### 7.1 Backend Health Checks

**Test health endpoint**:
```bash
curl https://your-app.up.railway.app/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2026-01-01T10:00:00.000Z",
  "services": {
    "database": "connected",
    "openai": "configured"
  }
}
```

**Test API endpoints**:
```bash
# Test task creation
curl -X POST https://your-app.up.railway.app/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{"title":"Deploy Test Task","priority":"high"}'
```

### 7.2 Database Connectivity

**Verify database connection**:

```bash
# From backend logs
# Look for: "Database connection successful"
```

**Test database operations**:
```sql
-- Run from SSMS connected to Azure SQL
SELECT COUNT(*) FROM Tasks;
SELECT COUNT(*) FROM Users;
```

### 7.3 Mobile App Testing

**Android Testing**:
1. Install production build on device
2. Test all screens and navigation
3. Verify API connectivity
4. Test voice features
5. Check notifications

**iOS Testing** (if applicable):
1. Install via TestFlight
2. Repeat Android testing steps

**Checklist**:
- [ ] App launches successfully
- [ ] Can create tasks via voice
- [ ] Can view tasks list
- [ ] Calendar integration works
- [ ] Reminders are created
- [ ] Real-time updates functional
- [ ] No console errors
- [ ] Performance is acceptable

---

## 8. Monitoring and Maintenance

### 8.1 Application Monitoring

**Railway Metrics** (built-in):
- CPU usage
- Memory usage
- Request count
- Response time

**External Monitoring** (recommended):

**UptimeRobot** (free):
1. Sign up at https://uptimerobot.com/
2. Add monitor: `https://your-app.up.railway.app/health`
3. Set check interval: 5 minutes
4. Configure alert email

**Sentry** (error tracking):
```bash
npm install @sentry/node
```

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: 'your_sentry_dsn',
  environment: 'production',
});

app.use(Sentry.Handlers.errorHandler());
```

### 8.2 Log Management

**Production Logging**:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: 'error.log', 
      level: 'error' 
    }),
  ],
});

// Use logger
logger.info('Server started');
logger.error('Database connection failed', { error });
```

**View logs in Railway**:
1. Go to deployment
2. Click "Deployments" tab
3. Select active deployment
4. View real-time logs

### 8.3 Database Maintenance

**Regular Tasks**:

Weekly:
- Review slow query log
- Check index usage
- Monitor database size

Monthly:
- Update statistics
- Rebuild fragmented indexes
- Review and archive old data

**Automated maintenance**:
```sql
-- Azure SQL automatically handles:
-- - Index maintenance
-- - Statistics updates
-- - Backup retention
```

### 8.4 Update Procedures

**Backend Updates**:

1. Test changes locally
2. Commit to feature branch
3. Create pull request
4. Merge to main branch
5. Railway auto-deploys
6. Verify deployment
7. Monitor for errors

**Mobile App Updates**:

Minor changes (OTA):
```bash
eas update --branch production --message "UI improvements"
```

Major changes (new build):
```bash
eas build --platform all --profile production
# Submit to app stores
```

---

## 9. Troubleshooting

### 9.1 Common Deployment Issues

**Issue: "Module not found" errors**

Solution:
```bash
# Ensure all dependencies in package.json
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

**Issue: Database connection timeout**

Solution:
- Check Azure SQL firewall rules
- Verify connection string
- Ensure database is not paused (Basic tier auto-pauses)
- Check network connectivity

**Issue: API returns 502 Bad Gateway**

Solution:
- Check backend logs for errors
- Verify environment variables
- Ensure server is listening on correct PORT
- Check health endpoint

**Issue: Mobile app can't connect to API**

Solution:
- Verify API URL in config.js
- Check CORS configuration
- Test API with curl
- Verify app has internet permission (Android)

### 9.2 Rollback Procedures

**Backend Rollback** (Railway):
1. Go to Deployments
2. Find previous working deployment
3. Click "Redeploy"

**Mobile App Rollback**:

OTA rollback:
```bash
eas update --branch production --message "Rollback to previous version"
```

Full rollback:
- Submit previous working build to app stores

### 9.3 Performance Issues

**Slow API response**:
- Check database query performance
- Add database indexes
- Implement caching
- Optimize complex queries

**High memory usage**:
- Check for memory leaks
- Implement connection pooling properly
- Review large data processing

**Database connection pool exhausted**:
- Increase pool size
- Fix connection leaks
- Implement connection timeout

---

## 10. Production Checklist

### Pre-Launch Checklist

**Code**:
- [ ] All tests passing
- [ ] No console.log in production code
- [ ] Error handling implemented
- [ ] Input validation on all endpoints
- [ ] Security headers configured

**Environment**:
- [ ] All environment variables set
- [ ] Production API keys configured
- [ ] Database migrated and seeded
- [ ] CORS configured correctly
- [ ] HTTPS enabled

**Monitoring**:
- [ ] Uptime monitoring configured
- [ ] Error tracking setup
- [ ] Log aggregation configured
- [ ] Alert recipients configured

**Documentation**:
- [ ] README updated with production URLs
- [ ] API documentation current
- [ ] Deployment guide reviewed
- [ ] Rollback procedures documented

**Testing**:
- [ ] End-to-end tests passed
- [ ] Load testing completed
- [ ] Security scan performed
- [ ] Mobile app tested on real devices

### Post-Launch Checklist

**Week 1**:
- [ ] Monitor error rates daily
- [ ] Review performance metrics
- [ ] Check database performance
- [ ] Gather user feedback

**Month 1**:
- [ ] Review costs and optimize
- [ ] Analyze user behavior
- [ ] Plan feature improvements
- [ ] Update documentation

---

**Document Version**: 1.0

**Last Updated**: January 2026

**Author**: Aman Mishra

**Support**: Issues via GitHub repository
