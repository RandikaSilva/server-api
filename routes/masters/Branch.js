var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();

router.get("/api/master/all-branch", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query(`SELECT * FROM [dbo].[Branch]`);

    res.status(200).json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/api/master/user-wise-branch", async (req, res, next) => {
  try {
    console.log("req.query.UserID", req.query.UserID);
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("UserID", sql.Int, req.query.UserID)
      .execute(`MobileUserWiseBranchSSP`);

    res.status(200).json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports = router;
