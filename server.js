/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const connectPgSimple = require("connect-pg-simple")(session)


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new connectPgSimple({
    pool: pool,
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser())

/* ***********************
 * Routes
 *************************/
app.use(static)

// Inventory routes
app.use("/inv", require("./routes/inventoryRoute"))

// Account routes
app.use("/account", require("./routes/accountRoute"))

// Index route
app.get("/", utilities.handleErrors(async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}))

// Favicon route
app.get("/favicon.ico", (req, res) => {
  res.sendFile(__dirname + "/public/images/site/favicon-32x32.png")
})

/* ***********************
 * File Not Found Route - must be last route in list
 *************************/
app.use(utilities.handle404)

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(utilities.errorHandler)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on http://${host}:${port}`)
})
