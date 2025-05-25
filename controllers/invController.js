const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data.rows)
  let nav = await utilities.getNav()
  const className = data.rows[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildVehicleDetail = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getVehicleById(inv_id)
  const vehicleDetailView = await utilities.buildVehicleDetailView(data.rows[0])
  let nav = await utilities.getNav()
  const vehicleTitle = `${data.rows[0].inv_year} ${data.rows[0].inv_make} ${data.rows[0].inv_model}`
  res.render("./inventory/detail", {
    title: vehicleTitle,
    nav,
    vehicleDetailView,
  })
}

module.exports = invCont
