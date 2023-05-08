var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();

router.get("/api/bank-deposit/list", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("UserID", sql.Int, req.query.UserID)
      .execute(`mbl_BankDepositListSSP`);

    res.status(200).json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/api/bank-deposit/details", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("BankDepositID", sql.Int, req.query.BankDepositID)
      .execute(`mbl_BankDepositSSP`);

    res.status(200).json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.post("/api/bank-deposit/save", async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("AutoID", sql.Int, req.body.AutoID)
      .input("BankDepositID", sql.Int, req.body.BankDepositID)
      .input("BankDeposit", sql.NVarChar(sql.MAX), req.body.BankDeposit)
      .execute(`mbl_BankDepositMSP`);

    res.status(200).json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports = router;
