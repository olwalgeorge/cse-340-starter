# Admin User Seeding

This document explains how to use the admin user seeding functionality in the CSE 340 application.

## Overview

The admin seeding script (`/scripts/seed-admin.js`) ensures your application always has at least one admin user available. This is crucial for accessing admin-only features and managing the application.

## How It Works

1. **Checks for existing admin users** - Queries the database to count users with `account_type = 'Admin'`
2. **Creates admin if none found** - If no admin users exist, creates a default admin user
3. **Promotes existing user** - If the admin email already exists but isn't an admin, promotes them
4. **Skips if admin exists** - If admin users already exist, no action is taken

## Usage

### Running the Script

```bash
# Using npm script (recommended)
npm run seed-admin

# Or run directly
node scripts/seed-admin.js
```

### Configuration

The script uses environment variables from your `.env` file:

```env
# Admin User Configuration
ADMIN_EMAIL=admin@cse340.com
ADMIN_PASSWORD=AdminPass123!
ADMIN_FIRSTNAME=System
ADMIN_LASTNAME=Administrator
```

**Default values** (used if environment variables aren't set):

- Email: `admin@cse340.com`
- Password: `AdminPass123!`
- First Name: `System`
- Last Name: `Administrator`

## Security Considerations

⚠️ **Important Security Notes:**

1. **Change the default password** immediately after first login
2. **Use strong passwords** in production environments
3. **Don't commit sensitive credentials** to version control
4. **Consider using environment-specific .env files** for different deployment stages

## When to Use

- **First-time setup** - Run after setting up the database
- **Production deployment** - Include in your deployment pipeline
- **Development reset** - If you need to ensure an admin exists after database changes
- **Team onboarding** - Helps new developers get started quickly

## Example Output

### When no admin exists:

```
🔍 Checking for existing admin users...
⚠️  No admin users found. Creating default admin...
🎉 Admin user created successfully!
📋 Admin Details:
   ID: 3
   Name: System Administrator
   Email: admin@cse340.com
   Type: Admin

🔐 Login Credentials:
   Email: admin@cse340.com
   Password: AdminPass123!

⚠️  SECURITY NOTICE: Please change the admin password after first login!
```

### When admin already exists:

```
🔍 Checking for existing admin users...
✅ Found 1 existing admin user(s). No action needed.
```

## Integration

You can also import and use this script programmatically:

```javascript
const seedAdmin = require("./scripts/seed-admin");

// In your application startup or migration scripts
await seedAdmin();
```

## Troubleshooting

**Database connection errors:**

- Ensure your `DATABASE_URL` is correct in `.env`
- Verify the database is running and accessible

**Permission errors:**

- Check that the database user has INSERT/UPDATE permissions on the `account` table

**Email already exists errors:**

- The script handles this automatically by promoting existing users to admin
