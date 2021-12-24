var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();
router.post("/api/create-new-job", async (req, res, next) => {

    try {

       
        let pool = await sql.connect(config);
        let result = await pool
            .request()
            .input("JobID", sql.Int, req.body.JobID)
            .input("Job", sql.NVarChar(sql.Max), req.body.Job)
            .input("UserID", sql.Int, req.body.UserID)


            .execute(`MobileJobMSP`);


        res.status(200).json(await result.recordset);
    } catch (e) {
        console.log(e);
        next(e);
    }
});


router.get("/api/user-wise-create-jobs", async (req, res, next) => {
    try {

        let pool = await sql.connect(config);
        let result = await pool
            .request()
            .input("UserID", sql.Int, req.query.UserID)
            .input("BranchID", sql.Int, req.query.BranchID)
            .execute(`MobileJobSSP`);

        res.status(200).json(await result.recordset);
    } catch (e) {
        console.log(e);
        next(e);
    }
});

router.get("/api/user-wise-assing-jobs", async (req, res, next) => {
    try {

        let pool = await sql.connect(config);
        let result = await pool
            .request()
            .input("UserID", sql.Int, req.query.UserID)
            .execute(`MobileJobAssignUserSSP`);

        res.status(200).json(await result.recordset);
    } catch (e) {
        console.log(e);
        next(e);
    }
});

router.post("/api/user-wise-assing-jobs-update-status", async (req, res, next) => {
    try {

        let pool = await sql.connect(config);
        let result = await pool
            .request()
            .input("DocumentID", sql.Int, req.body.DocumentID)
            .query(`UPDATE [dbo].[MobileJobMain]
                     SET [AuditStatus]=3
                     WHERE [AutoID] = @DocumentID`);

        res.status(200).json(await result.recordset);
    } catch (e) {
        console.log(e);
        next(e);
    }
});






module.exports = router;