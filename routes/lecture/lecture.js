var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();

router.get(
  "/api/lecture/filter-lecture-branch-date",
  async (req, res, next) => {
    try {
      console.log("req.query.Date", req.query.Date);
      console.log("req.query.Date", req.query.BranchID);
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("Date", sql.DateTime, req.query.Date)
        .input("BranchID", sql.Int, req.query.BranchID)
        .execute(`mbl_FilterLectureBranchDate`);

      res.status(200).json(await result.recordset);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
);

router.get("/api/lecture/lecture-details", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("TimeTableLine", sql.DateTime, req.query.TimeTableLine)
      .execute(`mbl_LectureDetails`);

    res.status(200).json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.post("/api/lecture/lecture-attendance", async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input(
        "LectureAttendanceUploadID",
        sql.Int,
        req.body.LectureAttendanceUploadID
      )
      .input(
        "LectureAttendance",
        sql.NVarChar(sql.MAX),
        req.body.LectureAttendance
      )
      .input(
        "LectureAttendanceImages",
        sql.NVarChar(sql.MAX),
        req.body.LectureAttendanceImages
      )
      .execute(`mbl_LectureAttendanceMSP`);

    res.status(200).json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get("/api/lecture/lecture-attendance", async (req, res, next) => {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("UserID", sql.Int, req.query.UserID)
      .execute(`mbl_LectureAttendanceListSSP`);
    console.log("result.recordset", result.recordset);

    res.status(200).json(await result.recordset);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get(
  "/api/lecture/lecture-attendance-by-formID",
  async (req, res, next) => {
    try {
      console.log("req.query.FormID", req.query.FormID);
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("LectureAttendanceUploadID", sql.Int, req.query.FormID)
        .execute(`mbl_LectureAttendanceSSP`);
      console.log("result.recordset", result.recordset);

      res.status(200).json(await result.recordset);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
);

module.exports = router;
