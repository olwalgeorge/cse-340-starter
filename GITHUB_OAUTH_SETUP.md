# GitHub OAuth Setup Guide

## ✅ Prerequisites COMPLETED

1. ✅ **GitHub OAuth app settings configured**:

   - **Application name**: CSE 340 Car Dealership
   - **Homepage URL**: `https://cse-340-starter-tpn1.onrender.com`
   - **Authorization callback URL**: `https://cse-340-starter-tpn1.onrender.com/auth/github/callback`

2. ✅ **Database migration applied**: `github_id` column added to account table
3. ✅ **Dependencies installed**: passport, passport-github2, express-session
4. ✅ **Code implementation complete**: All OAuth routes and passport configuration ready
5. ✅ **Server configuration ready**: Passport middleware integrated

## 🔧 REMAINING SETUP STEPS

### 1. Create GitHub OAuth App (if not done)

If you haven't created your GitHub OAuth app yet:

1. Go to: https://github.com/settings/developers
2. Click "New OAuth App"
3. Use the settings shown in Prerequisites above

### 2. Update Environment Variables

⚠️ **CRITICAL**: Replace these placeholders in your `.env` file with your actual GitHub OAuth credentials:

```env
GITHUB_CLIENT_ID=your_actual_github_client_id_here
GITHUB_CLIENT_SECRET=your_actual_github_client_secret_here
```

### 3. Database Migration Status

✅ **ALREADY APPLIED**: The database migration has been successfully applied.
You can verify this by running:

```bash
npm run check-schema
```

```sql
-- Add GitHub OAuth support to account table
ALTER TABLE public.account
ADD COLUMN github_id CHARACTER VARYING UNIQUE;

-- Add index for faster GitHub ID lookups
CREATE INDEX idx_account_github_id ON public.account(github_id);

-- Make account_password nullable for GitHub OAuth users
ALTER TABLE public.account
ALTER COLUMN account_password DROP NOT NULL;

-- Comment the changes
COMMENT ON COLUMN public.account.github_id IS 'GitHub user ID for OAuth authentication';
```

### 3. Start Your Server

```bash
npm start
# or
node server.js
```

### 4. Test GitHub Login

🚀 **READY TO TEST**: Once you've updated the `.env` file with real credentials:

1. Navigate to `https://cse-340-starter-tpn1.onrender.com/account/login`
2. Click the "Continue with GitHub" button
3. You should be redirected to GitHub for authorization
4. After approval, you'll be redirected back and logged in

## 📊 Current Implementation Status

### ✅ COMPLETED

- Database schema updated with `github_id` column
- All dependencies installed (passport, passport-github2, express-session)
- Passport GitHub strategy configured
- OAuth routes implemented (`/auth/github`, `/auth/github/callback`)
- Account model extended with GitHub OAuth functions
- Login page updated with functional GitHub button
- Server configured with passport middleware

### ⏳ PENDING

- Replace placeholder credentials in `.env` file with actual GitHub OAuth app credentials
- Test complete OAuth flow with real GitHub app

## 🔧 Quick Testing Commands

```bash
# Check database schema
npm run check-schema

# Run GitHub migration (already applied)
npm run migrate-github

# Start server
npm start

# Create admin user if needed
npm run seed-admin
```

## How It Works

### OAuth Flow

1. User clicks "Continue with GitHub"
2. User is redirected to GitHub OAuth authorization
3. GitHub redirects back to `/auth/github/callback` with authorization code
4. Our server exchanges the code for user information
5. We either:
   - Find existing user by GitHub ID and log them in
   - Find existing user by email and link their GitHub account
   - Create new user account from GitHub profile
6. User is logged in and redirected to account management

### Database Schema

```
account table:
├── account_id (integer, primary key)
├── account_firstname (varchar, not null)
├── account_lastname (varchar, not null)
├── account_email (varchar, not null)
├── account_password (varchar, nullable) ← Now nullable for OAuth users
├── account_type (enum, default 'Client')
└── github_id (varchar, nullable, unique) ← New for GitHub OAuth
```

### Files Modified

- ✅ `server.js` - Added Passport configuration and auth routes
- ✅ `models/account-model.js` - Added GitHub OAuth functions
- ✅ `utilities/passport-config.js` - GitHub OAuth strategy
- ✅ `routes/authRoute.js` - OAuth routes
- ✅ `views/account/login.ejs` - Functional GitHub button
- ✅ `database/github-oauth-migration.sql` - Database schema changes
- ✅ `package.json` - Added helpful npm scripts

## Troubleshooting

### Common Issues

1. **"Application not found"**: Check your GitHub Client ID in `.env`
2. **"Invalid client secret"**: Check your GitHub Client Secret in `.env`
3. **"Redirect URI mismatch"**: Ensure callback URL matches exactly
4. **Database errors**: Make sure migration ran successfully

### Testing Tips

1. Test with a GitHub account that has a public email
2. Try linking an existing account by using the same email
3. Test creating a new account with GitHub OAuth

## Security Notes

- Never commit `.env` file with real credentials
- Use different OAuth apps for development and production
- Regularly rotate your client secrets
- Consider implementing rate limiting for OAuth endpoints
