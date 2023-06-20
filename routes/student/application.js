var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();

router.get(
  "/api/application/pending-application-list",
  async (req, res, next) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("UserID", sql.Int, req.query.UserID)
        .execute(`mbl_PendingApplicationListSSP`);

      res.status(200).json(await result.recordset);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
);

router.get("/api/application/details", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("ApplicationNic", sql.NVarChar(100), req.query.ApplicationNic)
      .execute(`mbl_PendingApplicationSSP`);
    console.log("await result.recordset", await result.recordset);
    res.status(200).json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.post("/api/application-pending/save", async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("AutoID", sql.Int, req.body.AutoID)
      .input("StudentNic", sql.NVarChar(100), req.body.StudentNic)
      .input("Certificate", sql.NVarChar(sql.MAX), req.body.Certificate)
      .execute(`mbl_PendingApplicationMSP`);

    res.status(200).json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports = router;

module.exports = router;
