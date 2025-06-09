const express = require('express')
const router = new express.Router()
const passport = require('../utilities/passport-config')
const utilities = require('../utilities/')

/* ***************************
 *  GitHub OAuth Routes
 * ************************** */

// Initiate GitHub OAuth
router.get('/github', 
  passport.authenticate('github', { scope: ['user:email'] })
)

// GitHub OAuth callback
router.get('/github/callback', 
  passport.authenticate('github', { 
    failureRedirect: '/account/login',
    failureMessage: true 
  }),
  async (req, res) => {
    try {
      // Set user session data
      req.session.user = {
        account_id: req.user.account_id,
        account_firstname: req.user.account_firstname,
        account_lastname: req.user.account_lastname,
        account_email: req.user.account_email,
        account_type: req.user.account_type
      }
      
      req.session.loggedin = true
      
      // Set flash message for successful login
      req.flash('notice', `Welcome ${req.user.account_firstname}! You have successfully signed in with GitHub.`)
      
      // Redirect to account management
      res.redirect('/account/')
      
    } catch (error) {
      console.error('GitHub OAuth callback error:', error)
      req.flash('notice', 'Authentication failed. Please try again.')
      res.redirect('/account/login')
    }
  }
)

module.exports = router
