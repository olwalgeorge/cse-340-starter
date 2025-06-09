const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password) VALUES ($1, $2, $3, $4) RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using account ID
* ***************************** */
async function getAccountById (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching account found")
  }
}

/* *****************************
* Update account information
* ***************************** */
async function updateAccount(account_firstname, account_lastname, account_email, account_id) {
  try {
    const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Update account password
* ***************************** */
async function updatePassword(account_password, account_id) {
  try {
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *"
    const result = await pool.query(sql, [account_password, account_id])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Get account by GitHub ID
* ***************************** */
async function getAccountByGitHubId(github_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, github_id FROM account WHERE github_id = $1',
      [github_id])
    return result.rows[0]
  } catch (error) {
    return null
  }
}

/* *****************************
* Create account from GitHub OAuth
* ***************************** */
async function createAccountFromGitHub(userData) {
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, github_id, account_type) VALUES ($1, $2, $3, $4, $5) RETURNING account_id, account_firstname, account_lastname, account_email, account_type, github_id"
    const result = await pool.query(sql, [
      userData.account_firstname, 
      userData.account_lastname, 
      userData.account_email, 
      userData.github_id,
      userData.account_type
    ])
    return result.rows[0]
  } catch (error) {
    throw new Error(`Failed to create GitHub account: ${error.message}`)
  }
}

/* *****************************
* Link GitHub account to existing user
* ***************************** */
async function linkGitHubAccount(account_id, github_id) {
  try {
    const sql = "UPDATE account SET github_id = $1 WHERE account_id = $2 RETURNING *"
    const result = await pool.query(sql, [github_id, account_id])
    return result.rows[0]
  } catch (error) {
    throw new Error(`Failed to link GitHub account: ${error.message}`)
  }
}

module.exports = {
  registerAccount, 
  checkExistingEmail, 
  getAccountByEmail, 
  getAccountById, 
  updateAccount, 
  updatePassword,
  getAccountByGitHubId,
  createAccountFromGitHub,
  linkGitHubAccount
}
