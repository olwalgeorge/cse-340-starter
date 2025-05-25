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


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

// Inventory routes
app.use("/inv", require("./routes/inventoryRoute"))

// Index route
app.get("/", utilities.handleErrors(async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}))

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
