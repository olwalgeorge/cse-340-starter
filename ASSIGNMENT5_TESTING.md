## Assignment 5 Testing Checklist

### Task 1: Header Partial Updates
- [x] Header shows "My Account" when not logged in
- [ ] Header shows "Welcome [Name]" and "Logout" when logged in
- [ ] Links are not just hidden but not present in markup

### Task 2: Middleware for Account Type
- [x] Middleware added to inventory management routes
- [ ] Employee/Admin can access inventory management
- [ ] Client cannot access inventory management
- [ ] Non-logged-in users redirected to login

### Task 3: Account Management View
- [ ] Client sees welcome message with first name
- [ ] Employee/Admin sees welcome + inventory management link
- [ ] Client does not see inventory management section
- [ ] Update account information link present for all

### Task 4: Account Update View
- [x] Two separate forms created
- [x] Account update form with first name, last name, email
- [x] Password change form with validation requirements
- [x] Hidden account_id fields in both forms

### Task 5: Routes and Controllers
- [x] GET route for account update view
- [x] POST routes for account update and password change
- [x] Controller functions implemented
- [x] Model functions for getAccountById, updateAccount, updatePassword

### Task 6: Logout Process
- [x] Logout route and controller function
- [x] JWT cookie deletion
- [x] Redirect to home page

## Test Steps:

1. **Test Header Without Login:**
   - Visit homepage
   - Verify "My Account" link is present
   - Verify no "Welcome" or "Logout" links

2. **Test Login Process:**
   - Register a new account if needed
   - Login with valid credentials
   - Verify JWT token is created
   - Verify header changes to show "Welcome [Name]" and "Logout"

3. **Test Account Management:**
   - Navigate to /account/
   - Verify appropriate content based on account type
   - Test "Update Account Information" link

4. **Test Account Update:**
   - Update account information
   - Verify changes are saved
   - Test password change functionality

5. **Test Middleware Protection:**
   - Try accessing /inv/ with different account types
   - Verify Employee/Admin can access
   - Verify Client cannot access

6. **Test Logout:**
   - Click logout link
   - Verify cookie is cleared
   - Verify redirect to home page
   - Verify header returns to "My Account"
