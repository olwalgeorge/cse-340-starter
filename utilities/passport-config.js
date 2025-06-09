const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy
const accountModel = require('../models/account-model')

// Configure GitHub Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.APP_URL}/auth/github/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('GitHub OAuth Profile:', {
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      emails: profile.emails
    })
    
    // Check if user already exists with this GitHub ID
    let user = await accountModel.getAccountByGitHubId(profile.id)
    
    if (user) {
      console.log('Found existing user by GitHub ID:', user.account_email)
      // User exists, return user
      return done(null, user)
    }
      // Check if user exists with same email
    const emails = profile.emails || []
    console.log('GitHub profile emails:', emails)
    
    // Try to find a primary or verified email
    let primaryEmail = null
    if (emails.length > 0) {
      // Look for primary email first
      primaryEmail = emails.find(email => email.primary)?.value || 
                    emails.find(email => email.verified)?.value || 
                    emails[0].value
      
      console.log('Using email:', primaryEmail)
      
      if (primaryEmail) {
        user = await accountModel.getAccountByEmail(primaryEmail)
        if (user) {
          console.log('Found existing user by email, linking GitHub account:', user.account_email)
          // Link GitHub account to existing user
          const linkedUser = await accountModel.linkGitHubAccount(user.account_id, profile.id)
          return done(null, linkedUser)
        }
      }
    }
    
    // If no email from GitHub, we can't proceed
    if (!primaryEmail) {
      console.error('No email available from GitHub profile')
      return done(new Error('No email address available from GitHub. Please make sure your GitHub email is public or verified.'), null)
    }
      // Create new user from GitHub profile
    console.log('Creating new user from GitHub profile')
    const newUser = {
      account_firstname: profile.displayName ? profile.displayName.split(' ')[0] || profile.username : profile.username,
      account_lastname: profile.displayName ? profile.displayName.split(' ').slice(1).join(' ') || 'User' : 'User',
      account_email: primaryEmail,
      github_id: profile.id,
      account_type: 'Client'
    }
    
    console.log('New user data:', newUser)
    const createdUser = await accountModel.createAccountFromGitHub(newUser)
    console.log('Created user:', createdUser)
    return done(null, createdUser)
    
  } catch (error) {
    console.error('GitHub OAuth Error:', error)
    return done(error, null)
  }
}))

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.account_id)
})

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await accountModel.getAccountById(id)
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

module.exports = passport
