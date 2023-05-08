var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();

router.get("/api/expences/list", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("UserID", sql.Int, req.query.UserID)
      .execute(`mbl_ExpencesListSSP`);

    res.status(200).json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/api/expences/details", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("ExpencesID", sql.Int, req.query.ExpencesID)
      .execute(`mbl_ExpencesSSP`);

    res.status(200).json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.post("/api/expences/save", async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("AutoID", sql.Int, req.body.AutoID)
      .input("ExpencesID", sql.Int, req.body.ExpencesID)
      .input("Expences", sql.NVarChar(sql.MAX), req.body.Expences)
      .execute(`mbl_ExpencesMSP`);

    res.status(200).json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports = router;
