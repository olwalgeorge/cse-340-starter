const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error)
  }
}

/* ***************************
 *  Get vehicle details by inventory_id
 * ************************** */
async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
      WHERE inv_id = $1`,
      [inv_id]
    )
    return data
  } catch (error) {
    console.error("getVehicleById error " + error)
  }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql = `INSERT INTO inventory 
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Get inventory statistics for reports
 * ************************** */
async function getInventoryStats() {
  try {
    const sql = `
      SELECT 
        COUNT(*) as total_vehicles,
        COUNT(DISTINCT classification_id) as total_classifications,
        AVG(inv_price) as average_price,
        MIN(inv_price) as min_price,
        MAX(inv_price) as max_price,
        SUM(inv_price) as total_value
      FROM inventory
    `
    const data = await pool.query(sql)
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryStats error " + error)
    return null
  }
}

/* ***************************
 *  Get classification statistics for reports
 * ************************** */
async function getClassificationStats() {
  try {
    const sql = `
      SELECT 
        c.classification_name,
        COUNT(i.inv_id) as vehicle_count,
        AVG(i.inv_price) as avg_price,
        MIN(i.inv_price) as min_price,
        MAX(i.inv_price) as max_price
      FROM classification c
      LEFT JOIN inventory i ON c.classification_id = i.classification_id
      GROUP BY c.classification_id, c.classification_name
      ORDER BY vehicle_count DESC
    `
    const data = await pool.query(sql)
    return data.rows
  } catch (error) {
    console.error("getClassificationStats error " + error)
    return []
  }
}

/* ***************************
 *  Get recently added vehicles for reports
 * ************************** */
async function getRecentVehicles() {
  try {
    const sql = `
      SELECT 
        i.inv_id,
        i.inv_make,
        i.inv_model,
        i.inv_year,
        i.inv_price,
        c.classification_name
      FROM inventory i
      JOIN classification c ON i.classification_id = c.classification_id
      ORDER BY i.inv_id DESC
      LIMIT 10
    `
    const data = await pool.query(sql)
    return data.rows
  } catch (error) {
    console.error("getRecentVehicles error " + error)
    return []
  }
}

module.exports = { 
  getClassifications, 
  getInventoryByClassificationId, 
  getVehicleById, 
  addClassification, 
  addInventory,
  getInventoryStats,
  getClassificationStats,
  getRecentVehicles
}
