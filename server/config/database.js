// config/database.js
const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'VoiceOfficeAssistant',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 1433, // Default SQL Server port
  options: {
    instanceName: process.env.DB_INSTANCE || 'SQLEXPRESS',
    encrypt: process.env.NODE_ENV === 'production', // Enable encryption in production
    trustServerCertificate: true,
    connectTimeout: 30000,
    requestTimeout: 30000,
    enableArithAbort: true
  },
  authentication: {
    type: 'default'
  },
  // Use Windows Authentication if no user/password provided
  ...(process.env.DB_USER && process.env.DB_PASSWORD ? {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  } : {})
};

// Connection pool for better performance
let pool = null;

const getConnection = async () => {
  try {
    // Reuse existing pool if available
    if (pool && pool.connected) {
      return pool;
    }

    // Close existing pool if it exists but not connected
    if (pool) {
      await pool.close();
    }

    console.log('🔄 Connecting to SQL Server...');
    console.log('Server:', dbConfig.server);
    console.log('Database:', dbConfig.database);
    console.log('Port:', dbConfig.port);
    console.log('Instance:', dbConfig.options.instanceName);
    console.log('Auth Type:', process.env.DB_USER ? 'SQL Server' : 'Windows');

    pool = await sql.connect(dbConfig);
    console.log('✅ Connected to SQL Server successfully!');
    
    return pool;
  } catch (err) {
    console.error('❌ Database Connection Failed!');
    console.error('Configuration:');
    console.error('  DB_SERVER:', process.env.DB_SERVER || 'localhost');
    console.error('  DB_NAME:', process.env.DB_NAME || 'VoiceOfficeAssistant');
    console.error('  DB_PORT:', process.env.DB_PORT || '1433 (default)');
    console.error('  DB_INSTANCE:', process.env.DB_INSTANCE || 'SQLEXPRESS');
    console.error('  DB_USER:', process.env.DB_USER || 'Windows Authentication');
    console.error('  NODE_ENV:', process.env.NODE_ENV || 'development');
    
    console.error('\n🔍 Error Details:');
    console.error('  Code:', err.code);
    console.error('  Number:', err.number);
    console.error('  State:', err.state);
    console.error('  Class:', err.class);
    console.error('  Server:', err.server);
    console.error('  Procedure:', err.procName);
    console.error('  Line:', err.lineNumber);
    console.error('  Message:', err.message);
    
    // Common error solutions
    console.error('\n💡 Troubleshooting Tips:');
    if (err.code === 'ECONNREFUSED') {
      console.error('  • SQL Server service might not be running');
      console.error('  • Check if SQL Server is installed and started');
      console.error('  • Verify the server name and port');
    } else if (err.code === 'ENOTFOUND') {
      console.error('  • Server name might be incorrect');
      console.error('  • Check network connectivity');
    } else if (err.number === 18456) {
      console.error('  • Login failed - check username/password');
      console.error('  • Verify SQL Server authentication mode');
    } else if (err.number === 2) {
      console.error('  • Named instance might not be found');
      console.error('  • Try using IP address instead of server name');
      console.error('  • Check if SQL Server Browser service is running');
    }
    
    pool = null;
    throw err;
  }
};

// Graceful shutdown
const closeConnection = async () => {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('🔒 Database connection closed');
    }
  } catch (err) {
    console.error('❌ Error closing database connection:', err.message);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, closing database connection...');
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, closing database connection...');
  await closeConnection();
  process.exit(0);
});

// Helper to test connection directly
if (require.main === module) {
  const testConnection = async () => {
    try {
      console.log('🧪 Testing database connection...\n');
      const connection = await getConnection();
      
      // Test with a simple query
      const result = await connection.request().query('SELECT @@VERSION as version, DB_NAME() as currentDb');
      console.log('📊 Database Info:');
      console.log('  Version:', result.recordset[0].version.split('\n')[0]);
      console.log('  Current DB:', result.recordset[0].currentDb);
      
      console.log('\n✅ Test connection successful!');
      await closeConnection();
      process.exit(0);
    } catch (error) {
      console.error('\n❌ Test connection failed!');
      process.exit(1);
    }
  };
  
  testConnection();
}

module.exports = { 
  getConnection, 
  closeConnection,

};