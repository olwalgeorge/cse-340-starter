const pool = require("../database/")
const fs = require('fs')
const path = require('path')
require("dotenv").config()

/**
 * GitHub OAuth Migration Runner
 * Applies the GitHub OAuth migration to add github_id column to account table
 */

async function runGitHubMigration() {
  try {
    console.log("🔍 Starting GitHub OAuth migration...")
    
    // Check if github_id column already exists
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'account' 
      AND table_schema = 'public' 
      AND column_name = 'github_id'
    `)
    
    if (columnCheck.rows.length > 0) {
      console.log("✅ GitHub OAuth migration already applied - github_id column exists")
      return
    }
    
    console.log("⚠️  GitHub OAuth migration not applied. Running migration...")
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '../database/github-oauth-migration.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    // Remove comments and split by semicolon
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`   Executing: ${statement.substring(0, 50)}...`)
        await pool.query(statement)
      }
    }
    
    console.log("🎉 GitHub OAuth migration completed successfully!")
    console.log("📋 Migration Details:")
    console.log("   ✓ Added github_id column to account table")
    console.log("   ✓ Made account_password nullable")
    console.log("   ✓ Added index for github_id lookups")
    console.log("   ✓ Added column comment")
    
    // Verify the migration
    const verifyCheck = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'account' 
      AND table_schema = 'public' 
      AND column_name = 'github_id'
    `)
    
    if (verifyCheck.rows.length > 0) {
      console.log("✅ Migration verification successful")
    } else {
      throw new Error("Migration verification failed - github_id column not found")
    }
    
  } catch (error) {
    console.error("❌ Error running GitHub OAuth migration:", error.message)
    throw error
  }
}

// Run the migration function if called directly
if (require.main === module) {
  runGitHubMigration()
    .then(() => {
      console.log("✅ GitHub OAuth migration completed")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ GitHub OAuth migration failed:", error.message)
      process.exit(1)
    })
}

module.exports = runGitHubMigration
