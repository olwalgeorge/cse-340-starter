const pool = require("../database/")
require("dotenv").config()

/**
 * Database Schema Checker
 * Shows the current account table structure
 */

async function checkAccountSchema() {
  try {
    console.log("🔍 Checking account table schema...")
    
    // Get column information
    const schemaCheck = await pool.query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'account' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `)
    
    console.log("📋 Account Table Schema:")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("Column Name          | Data Type      | Nullable | Default")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    
    schemaCheck.rows.forEach(row => {
      const name = row.column_name.padEnd(20)
      const type = row.data_type.padEnd(14)
      const nullable = row.is_nullable.padEnd(8)
      const defaultVal = (row.column_default || 'NULL').substring(0, 15)
      console.log(`${name} | ${type} | ${nullable} | ${defaultVal}`)
    })
    
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    
    // Check indexes
    const indexCheck = await pool.query(`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE tablename = 'account' 
      AND schemaname = 'public'
    `)
    
    if (indexCheck.rows.length > 0) {
      console.log("\n📊 Indexes on account table:")
      indexCheck.rows.forEach(index => {
        console.log(`   ${index.indexname}: ${index.indexdef}`)
      })
    }
    
    // Test GitHub OAuth readiness
    const githubColumn = schemaCheck.rows.find(row => row.column_name === 'github_id')
    const passwordColumn = schemaCheck.rows.find(row => row.column_name === 'account_password')
    
    console.log("\n🔧 GitHub OAuth Readiness Check:")
    console.log(`   github_id column: ${githubColumn ? '✅ EXISTS' : '❌ MISSING'}`)
    console.log(`   password nullable: ${passwordColumn && passwordColumn.is_nullable === 'YES' ? '✅ YES' : '❌ NO'}`)
    
    if (githubColumn && passwordColumn && passwordColumn.is_nullable === 'YES') {
      console.log("🎉 Database is ready for GitHub OAuth!")
    } else {
      console.log("⚠️  Database needs migration for GitHub OAuth")
    }
    
  } catch (error) {
    console.error("❌ Error checking schema:", error.message)
    throw error
  }
}

// Run the check function if called directly
if (require.main === module) {
  checkAccountSchema()
    .then(() => {
      console.log("✅ Schema check completed")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Schema check failed:", error.message)
      process.exit(1)
    })
}

module.exports = checkAccountSchema
