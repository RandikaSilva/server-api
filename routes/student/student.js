var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();

router.get("/api/student/serach-student-by-nic", async (req, res, next) => {
  try {
    console.log(" req.query.NIC", req.query.NIC);
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("NIC", sql.NVarChar(100), req.query.NIC)
      .query(
        `Select id,fullName,address,profileImage From Student Where idNo = @NIC`
      );

    res.status(200).json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.post("/api/student/student-profile-upload", async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("nic", sql.NVarChar(100), req.body.nic)
      .input("studentImage", sql.NVarChar(sql.MAX), req.body.studentImage)
      .execute(`mbl_StudentProfileImageMSP`);

    res.status(200).json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports = router;
