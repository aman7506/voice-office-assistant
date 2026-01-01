# SQL Server Connection Troubleshooting

If you see errors like `Failed to connect to AMANMISHRA\SQLEXPRESS in 30000ms`, follow these steps:

## 1. Check Your .env File

Make sure you have the following variables set (example):

```
DB_SERVER=localhost\\SQLEXPRESS
DB_NAME=VoiceOfficeAssistant
DB_USER=your_sql_user   # (optional, for SQL auth)
DB_PASSWORD=your_password  # (optional, for SQL auth)
DB_PORT=1433  # (optional, for static port)
DB_INSTANCE=SQLEXPRESS
```

- For Windows Authentication, you can omit DB_USER and DB_PASSWORD.
- For SQL Authentication, provide DB_USER and DB_PASSWORD.

## 2. Test the Connection

From the `server` directory, run:

```
node config/database.js
```

- If successful, you'll see `Test connection successful.`
- If it fails, you'll see detailed error output.

## 3. Common Fixes

- Ensure SQL Server is running.
- Enable TCP/IP in SQL Server Configuration Manager.
- Start the SQL Server Browser service.
- Open port 1433 in your firewall (or the port your instance uses).
- Use `localhost\\SQLEXPRESS` for local named instances.
- If using a static port, set `DB_PORT` in your `.env`.

## 4. Still Not Working?

- Double-check your credentials and instance name.
- Try connecting with SQL Server Management Studio using the same details.
- Consult the error output for more details.