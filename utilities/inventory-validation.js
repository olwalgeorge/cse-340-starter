const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
  return [
    // classification_name is required and must be alphanumeric only
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Classification name cannot contain spaces or special characters.")
  ]
}

/* ******************************
 * Check classification data and return errors or continue to insert
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
  return [
    // inv_make is required
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle make."),

    // inv_model is required  
    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle model."),

    // inv_year is required and must be 4 digits
    body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be exactly 4 digits.")
      .isNumeric()
      .withMessage("Year must be numeric."),

    // inv_description is required
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle description."),

    // inv_image is required
    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide an image path."),

    // inv_thumbnail is required
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail image path."),

    // inv_price is required and must be numeric
    body("inv_price")
      .trim()
      .isNumeric()
      .withMessage("Price must be a number."),

    // inv_miles is required and must be numeric (no commas)
    body("inv_miles")
      .trim()
      .isNumeric()
      .withMessage("Miles must be a number with no commas or spaces."),

    // inv_color is required
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle color."),

    // classification_id is required
    body("classification_id")
      .trim()
      .isNumeric()
      .withMessage("Please select a classification.")
  ]
}

/* ******************************
 * Check inventory data and return errors or continue to insert
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    })
    return
  }
  next()
}

/* ******************************
 * Check update data and return errors or continue to update
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      classificationList,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
    return
  }
  next()
}

module.exports = validate
