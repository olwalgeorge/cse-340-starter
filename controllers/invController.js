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
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationList: classificationSelect,
    })
  } catch (error) {
    console.error("Error in buildManagement:", error)
    next(error)
  }
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  } catch (error) {
    console.error("Error in buildAddClassification:", error)
    next(error)
  }
}

/* ***************************
 *  Process Add Classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  
  try {
    const regResult = await invModel.addClassification(classification_name)
    
    if (regResult) {
      req.flash("notice", `Congratulations, you added "${classification_name}" classification.`)
      let nav = await utilities.getNav() // Rebuild nav to show new classification
      res.status(201).render("inventory/management", {
        title: "Vehicle Management",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, adding the classification failed.")
      res.status(501).render("inventory/add-classification", {
        title: "Add New Classification",
        nav: await utilities.getNav(),
        errors: null,
      })
    }
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the classification.')
    res.status(500).render("inventory/add-classification", {
      title: "Add New Classification",
      nav: await utilities.getNav(),
      errors: null,
    })
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null,
    })
  } catch (error) {
    console.error("Error in buildAddInventory:", error)
    next(error)
  }
}

/* ***************************
 *  Process Add Inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  const { 
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
  } = req.body
  
  try {
    const regResult = await invModel.addInventory(
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
    )
    
    if (regResult) {
      req.flash("notice", `Congratulations, you added the ${inv_year} ${inv_make} ${inv_model}.`)
      let nav = await utilities.getNav()
      res.status(201).render("inventory/management", {
        title: "Vehicle Management",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, adding the vehicle failed.")
      let nav = await utilities.getNav()
      let classificationList = await utilities.buildClassificationList(classification_id)
      res.status(501).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        errors: null,
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
    }
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the vehicle.')
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.status(500).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null,
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

/* ***************************
 *  Build inventory reports view
 * ************************** */
invCont.buildInventoryReport = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    
    // Get inventory statistics
    const stats = await invModel.getInventoryStats()
    const classificationStats = await invModel.getClassificationStats()
    const recentVehicles = await invModel.getRecentVehicles()
    
    res.render("./inventory/report", {
      title: "Inventory Reports & Analytics",
      nav,
      stats,
      classificationStats,
      recentVehicles,
      errors: null,
    })
  } catch (error) {
    console.error("Error in buildInventoryReport:", error)
    next(error)
  }
}

/* ***************************
 *  Build management tools view
 * ************************** */
invCont.buildManagementTools = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    
    res.render("./inventory/tools", {
      title: "Management Tools",
      nav,
      errors: null,
    })
  } catch (error) {
    console.error("Error in buildManagementTools:", error)
    next(error)
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async function (req, res, next) {
  const classification_id = parseInt(req.params.classification_id)
  try {
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData.rows.length > 0) {
      return res.json(invData.rows)
    } else {
      next(new Error("No data returned"))
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  try {
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehicleById(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.rows[0].classification_id)
    const itemName = `${itemData.rows[0].inv_make} ${itemData.rows[0].inv_model}`
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList: classificationSelect,
      errors: null,
      inv_id: itemData.rows[0].inv_id,
      inv_make: itemData.rows[0].inv_make,
      inv_model: itemData.rows[0].inv_model,
      inv_year: itemData.rows[0].inv_year,
      inv_description: itemData.rows[0].inv_description,
      inv_image: itemData.rows[0].inv_image,
      inv_thumbnail: itemData.rows[0].inv_thumbnail,
      inv_price: itemData.rows[0].inv_price,
      inv_miles: itemData.rows[0].inv_miles,
      inv_color: itemData.rows[0].inv_color,
      classification_id: itemData.rows[0].classification_id
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
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
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationSelect,
    errors: null,
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
  }
}

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteConfirmation = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  try {
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehicleById(inv_id)
    const itemName = `${itemData.rows[0].inv_make} ${itemData.rows[0].inv_model}`
    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData.rows[0].inv_id,
      inv_make: itemData.rows[0].inv_make,
      inv_model: itemData.rows[0].inv_model,
      inv_year: itemData.rows[0].inv_year,
      inv_price: itemData.rows[0].inv_price
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)

  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult) {
    req.flash("notice", "The deletion was successful.")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect("/inv/delete/"+inv_id)
  }
}

module.exports = invCont
