const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  try {
    const data = await invModel.getInventoryByClassificationId(classification_id)
    if (!data || !data.rows || data.rows.length === 0) {
      const grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
      let nav = await utilities.getNav()
      res.render("./inventory/classification", {
        title: "No Vehicles Found",
        nav,
        grid,
      })
      return
    }
    const grid = await utilities.buildClassificationGrid(data.rows)
    let nav = await utilities.getNav()
    const className = data.rows[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    console.error("Error in buildByClassificationId:", error)
    next(error)
  }
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildVehicleDetail = async function (req, res, next) {
  const inv_id = req.params.invId
  try {
    const data = await invModel.getVehicleById(inv_id)
    if (!data || !data.rows || data.rows.length === 0) {
      const vehicleDetailView = '<p class="notice">Sorry, vehicle details could not be found.</p>'
      let nav = await utilities.getNav()
      res.render("./inventory/detail", {
        title: "Vehicle Not Found",
        nav,
        vehicleDetailView,
      })
      return
    }
    const vehicleDetailView = await utilities.buildVehicleDetailView(data.rows[0])
    let nav = await utilities.getNav()
    const vehicleTitle = `${data.rows[0].inv_year} ${data.rows[0].inv_make} ${data.rows[0].inv_model}`
    res.render("./inventory/detail", {
      title: vehicleTitle,
      nav,
      vehicleDetailView,
    })
  } catch (error) {
    console.error("Error in buildVehicleDetail:", error)
    next(error)
  }
}

/* ***************************
 *  Intentional Error Route (Task 3)
 *  This route is designed to trigger a 500 error for testing
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  try {
    // Intentionally throw an error to test error handling middleware
    throw new Error('This is an intentional 500 type error for testing the error handling middleware.')
  } catch (error) {
    console.error("Intentional error triggered:", error)
    next(error)
  }
}

module.exports = invCont
