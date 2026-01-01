// server/index.js
// Load environment variables FIRST - look in parent directory
require('dotenv').config({ path: '../.env' });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const path = require('path');
// Fix the path - config is in same directory as server folder
const { getConnection, closeConnection } = require('./config/database');
const { initSocket } = require('./services/socketService');

// Debug environment variables
console.log('🔍 Environment Variables Check:');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('PORT:', process.env.PORT || '5000');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? `Set (${process.env.OPENAI_API_KEY.substring(0, 10)}...)` : 'Missing ❌');
console.log('DB_SERVER:', process.env.DB_SERVER || 'Not configured');
console.log('DB_NAME:', process.env.DB_NAME || 'Not configured');
console.log('DB_INSTANCE:', process.env.DB_INSTANCE || 'Not configured');
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN || 'Default (*)');

// Validate critical environment variables
const requiredEnvVars = ['OPENAI_API_KEY', 'DB_SERVER', 'DB_NAME'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn('⚠️  Missing environment variables:', missingEnvVars.join(', '));
  console.warn('⚠️  Some features may not work properly.');
}

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.IO
console.log('🔌 Initializing Socket.IO...');
const io = initSocket(server);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for API development
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:19006',
      'http://192.168.3.26:19006',
      'http://127.0.0.1:19006',
      ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [])
    ];
    
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn('⚠️  CORS blocked origin:', origin);
      callback(null, true); // Allow in development, change to false in production
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/health', async (req, res) => {
  let dbStatus = 'unknown';
  
  try {
    await getConnection();
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'disconnected';
  }
  
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    services: {
      openai: process.env.OPENAI_API_KEY ? 'configured' : 'not configured',
      database: dbStatus,
      socketio: io ? 'initialized' : 'not initialized'
    },
    server: {
      port: PORT,
      cors: corsOptions.origin ? 'configured' : 'default'
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Voice Office Assistant API',
    status: 'running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/health',
      '/api/chat',
      '/api/tasks',
      '/api/reminders',
      '/api/calendar',
      '/api/voice'
    ]
  });
});

// API Routes with error handling
const routeFiles = [
  { path: '/api/chat', file: './routes/chat' },
  { path: '/api/tasks', file: './routes/tasks' },
  { path: '/api/reminders', file: './routes/reminders' },
  { path: '/api/calendar', file: './routes/calendar' },
  { path: '/api/voice', file: './routes/voice' }
];

routeFiles.forEach(({ path: routePath, file }) => {
  try {
    const route = require(file);
    app.use(routePath, route);
    console.log(`✅ Route loaded: ${routePath}`);
  } catch (error) {
    console.warn(`⚠️  Failed to load route ${routePath}:`, error.message);
    // Create a fallback route
    app.use(routePath, (req, res) => {
      res.status(503).json({
        error: 'Service temporarily unavailable',
        message: `Route ${routePath} is not available`,
        timestamp: new Date().toISOString()
      });
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Global error handler:', error);
  
  res.status(error.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : error.message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Database connection and server startup
const startServer = async () => {
  let dbConnected = false;
  
  // Test database connection
  try {
    console.log('🔄 Testing database connection...');
    await getConnection();
    console.log('✅ Database connection successful');
    dbConnected = true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('⚠️  Server will start without database connection');
  }
  
  // Start the server
  server.listen(PORT, '0.0.0.0', (error) => {
    if (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
    
    console.log('\n🎉 Server Started Successfully!');
    console.log('📍 Server Details:');
    console.log(`   Local:    http://localhost:${PORT}`);
    console.log(`   Network:  http://192.168.3.26:${PORT}`);
    console.log(`   Health:   http://localhost:${PORT}/health`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️  Database: ${dbConnected ? '✅ Connected' : '❌ Disconnected'}`);
    console.log(`🤖 OpenAI: ${process.env.OPENAI_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
    console.log(`🔌 Socket.IO: ${io ? '✅ Ready' : '❌ Not initialized'}`);
    console.log('\n📝 Available endpoints:');
    console.log('   GET  /');
    console.log('   GET  /health');
    console.log('   POST /api/chat');
    console.log('   GET  /api/tasks');
    console.log('   GET  /api/reminders');
    console.log('   GET  /api/calendar');
    console.log('   POST /api/voice');
    console.log('\n🚀 Ready to accept connections!\n');
  });
};

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
  
  // Close server
  server.close(() => {
    console.log('🔒 HTTP server closed');
  });
  
  // Close database connections
  try {
    await closeConnection();
    console.log('🔒 Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database:', error.message);
  }
  
  console.log('✅ Shutdown complete');
  process.exit(0);
};

// Handle process termination
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Start the server
startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

module.exports = { app, server, io };