/* ****************************************
* Utilities
* **************************************** */
const invModel = require("../models/inventory-model")

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
 * Middleware For Handling Errors 
 **************************************** */
function handleErrors(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
}

module.exports = { getNav, buildClassificationGrid, buildVehicleDetailView, handleErrors }
