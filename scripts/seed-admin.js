const pool = require("../database/")
const bcrypt = require("bcryptjs")
require("dotenv").config()

/**
 * Admin Seeding Script
 * Checks if an admin user exists, creates one if none found
 * This ensures there's always at least one admin for the application
 */

async function seedAdmin() {
  try {
    console.log("🔍 Checking for existing admin users...")
    
    // Check if any admin users exist
    const adminCheck = await pool.query(
      "SELECT COUNT(*) as admin_count FROM account WHERE account_type = 'Admin'"
    )
    
    const adminCount = parseInt(adminCheck.rows[0].admin_count)
    
    if (adminCount > 0) {
      console.log(`✅ Found ${adminCount} existing admin user(s). No action needed.`)
      return
    }
    
    console.log("⚠️  No admin users found. Creating default admin...")
    
    // Default admin credentials (should be changed on first login)
    const defaultAdminEmail = process.env.ADMIN_EMAIL || 'admin@cse340.com'
    const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123!'
    const defaultAdminFirstName = process.env.ADMIN_FIRSTNAME || 'System'
    const defaultAdminLastName = process.env.ADMIN_LASTNAME || 'Administrator'
    
    // Check if email already exists (just in case)
    const emailCheck = await pool.query(
      "SELECT * FROM account WHERE account_email = $1",
      [defaultAdminEmail]
    )
    
    if (emailCheck.rows.length > 0) {
      // If email exists but isn't admin, promote to admin
      await pool.query(
        "UPDATE account SET account_type = 'Admin' WHERE account_email = $1",
        [defaultAdminEmail]
      )
      console.log(`✅ Promoted existing user ${defaultAdminEmail} to Admin`)
      return
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(defaultAdminPassword, 10)
    
    // Create the admin user
    const result = await pool.query(
      `INSERT INTO account 
       (account_firstname, account_lastname, account_email, account_password, account_type) 
       VALUES ($1, $2, $3, $4, 'Admin') 
       RETURNING account_id, account_email, account_firstname, account_lastname`,
      [defaultAdminFirstName, defaultAdminLastName, defaultAdminEmail, hashedPassword]
    )
    
    const newAdmin = result.rows[0]
    
    console.log("🎉 Admin user created successfully!")
    console.log("📋 Admin Details:")
    console.log(`   ID: ${newAdmin.account_id}`)
    console.log(`   Name: ${newAdmin.account_firstname} ${newAdmin.account_lastname}`)
    console.log(`   Email: ${newAdmin.account_email}`)
    console.log(`   Type: Admin`)
    console.log("")
    console.log("🔐 Login Credentials:")
    console.log(`   Email: ${defaultAdminEmail}`)
    console.log(`   Password: ${defaultAdminPassword}`)
    console.log("")
    console.log("⚠️  SECURITY NOTICE: Please change the admin password after first login!")
    
  } catch (error) {
    console.error("❌ Error seeding admin user:", error.message)
    throw error
  }
}

// Run the seeding function if called directly
if (require.main === module) {
  seedAdmin()
    .then(() => {
      console.log("✅ Admin seeding completed")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Admin seeding failed:", error.message)
      process.exit(1)
    })
}

module.exports = seedAdmin
