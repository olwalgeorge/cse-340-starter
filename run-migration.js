const pool = require('./database')
const fs = require('fs')

async function runMigration() {
  try {
    const migration = fs.readFileSync('./database/github-oauth-migration.sql', 'utf8')
    await pool.query(migration)
    console.log('✅ GitHub OAuth migration completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

runMigration()
