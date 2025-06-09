const express = require('express')
const router = new express.Router()
const passport = require('../utilities/passport-config')
const utilities = require('../utilities/')
const jwt = require('jsonwebtoken')
require('dotenv').config()

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
  }),  async (req, res) => {
    try {
      if (!req.user) {
        console.error('OAuth callback: No user object found')
        req.flash('notice', 'Authentication failed. No user data received.')
        return res.redirect('/account/login')
      }
      
      // Create user data object (same structure as regular login)
      const userData = {
        account_id: req.user.account_id,
        account_firstname: req.user.account_firstname,
        account_lastname: req.user.account_lastname,
        account_email: req.user.account_email,
        account_type: req.user.account_type      }
      
      console.log('ACCESS_TOKEN_SECRET exists:', !!process.env.ACCESS_TOKEN_SECRET)
      
      if (!process.env.ACCESS_TOKEN_SECRET) {
        console.error('ACCESS_TOKEN_SECRET environment variable is missing!')
        req.flash('notice', 'Server configuration error. Please contact administrator.')
        return res.redirect('/account/login')
      }
      
      // Create JWT token (same as regular login)
      const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      
      // Set JWT cookie (same as regular login)
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      
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
