/* ****************************************
* Utilities
* **************************************** */
const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
async function getNav(){
  let data = await invModel.getClassifications()
  let list = '<ul id="navList" role="menu" itemscope itemtype="https://schema.org/SiteNavigationElement">'
  list += '<li role="none"><a href="/" title="Home page" role="menuitem" itemprop="url"><span itemprop="name">Home</span></a></li>'
  data.rows.forEach((row) => {
    list += '<li role="none">'
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles" role="menuitem" itemprop="url"><span itemprop="name">' +
      row.classification_name +
      "</span></a>"
    list += "</li>"
  })
  list += '<li role="none"><a href="/account/login" title="Login" role="menuitem" itemprop="url"><span itemprop="name">My Account</span></a></li>'
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
async function buildClassificationGrid(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
async function buildVehicleDetailView(data) {
  let detailView
  if (data) {
    // Format price with currency
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(data.inv_price)

    // Format mileage with commas
    const formattedMileage = new Intl.NumberFormat('en-US').format(data.inv_miles)

    detailView = '<div class="vehicle-detail">'
    detailView += '<div class="vehicle-image">'
    detailView += '<img src="' + data.inv_image + '" alt="' + data.inv_make + ' ' + data.inv_model + '">'
    detailView += '</div>'
    detailView += '<div class="vehicle-info">'
    detailView += '<h2>' + data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model + '</h2>'
    detailView += '<div class="vehicle-price">' + formattedPrice + '</div>'
    detailView += '<div class="vehicle-details">'
    detailView += '<p><strong>Year:</strong> ' + data.inv_year + '</p>'
    detailView += '<p><strong>Make:</strong> ' + data.inv_make + '</p>'
    detailView += '<p><strong>Model:</strong> ' + data.inv_model + '</p>'
    detailView += '<p><strong>Mileage:</strong> ' + formattedMileage + ' miles</p>'
    detailView += '<p><strong>Color:</strong> ' + data.inv_color + '</p>'
    detailView += '</div>'
    detailView += '<div class="vehicle-description">'
    detailView += '<h3>Description</h3>'
    detailView += '<p>' + data.inv_description + '</p>'
    detailView += '</div>'
    detailView += '</div>'
    detailView += '</div>'
  } else {
    detailView = '<p class="notice">Sorry, vehicle details could not be found.</p>'
  }
  return detailView
}

/* ****************************************
 * Build classification list for select dropdown
 **************************************** */
async function buildClassificationList(classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Middleware For Handling Errors 
 **************************************** */
function handleErrors(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
}

/* ****************************************
 * Express Error Handler
 * Must be placed after all other middleware
 **************************************** */
function errorHandler(err, req, res, next) {
  let nav = `<ul id="navList">
    <li><a href="/" title="Home page">Home</a></li>
    <li><a href="/inv/type/1" title="Custom vehicles">Custom</a></li>
    <li><a href="/inv/type/2" title="Sport vehicles">Sport</a></li>
    <li><a href="/inv/type/3" title="SUV vehicles">SUV</a></li>
    <li><a href="/inv/type/4" title="Truck vehicles">Truck</a></li>
    <li><a href="/inv/type/5" title="Sedan vehicles">Sedan</a></li>
  </ul>`
  
  let message = err.message || 'Oh no! There was a crash. Maybe try a different route?'
  let status = err.status || 500
  
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack)
  }
  
  res.status(status).render("errors/error", {
    title: status == 404 ? 'Sorry, page not found' : 'Server Error',
    message,
    nav,
    status
  })
}

/* ****************************************
 * 404 Handler (File Not Found)
 **************************************** */
function handle404(req, res, next) {
  const err = new Error(`Sorry, we appear to have lost that page.`)
  err.status = 404
  next(err)
}

/* ****************************************
 * Middleware to check token validity
 **************************************** */
function checkJWTToken(req, res, next) {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      (err, accountData) => {
        if (err) {
          req.flash("notice", "Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    next()
  }
}

/* ****************************************
 * Check Login middleware
 **************************************** */
function checkLogin(req, res, next) {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 * Check account type middleware for Employee/Admin
 **************************************** */
function checkAccountType(req, res, next) {
  if (res.locals.loggedin && (res.locals.accountData.account_type == "Employee" || res.locals.accountData.account_type == "Admin")) {
    next()
  } else {
    req.flash("notice", "Please log in with appropriate permissions.")
    return res.redirect("/account/login")
  }
}

module.exports = { 
  getNav, 
  buildClassificationGrid, 
  buildVehicleDetailView, 
  handleErrors,
  errorHandler,
  handle404,
  buildClassificationList,
  checkJWTToken,
  checkLogin,
  checkAccountType
}
