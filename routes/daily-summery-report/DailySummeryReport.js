var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();



router.get("/api/daily-summery-report", async (req, res, next) => {
    try {
        console.log(req.body.User)
        let pool = await sql.connect(config);
        let result = await pool
            .request()
            .query(`SELECT * FROM [dbo].[Branch] `);

        console.log("await result.recordset", await result.recordset)
        res.status(200).json(await result.recordset);
    } catch (e) {
        console.log(e);
        next(e);
    }
});

router.get("/api/daily-summery-report-uploaded-image", async (req, res, next) => {
    try {
        console.log(req.query.DocumentID)
        let pool = await sql.connect(config);
        let result = await pool
            .request()
            .input("DocumentID", sql.Int, req.query.DocumentID)
            .query(`SELECT * FROM [dbo].[MobileDailySummeryReportDocument] Where [DailySummeryReportID] = @DocumentID `);

        console.log("/api/daily-summery-report-uploaded-image", await result.recordset)
        res.status(200).json(await result.recordset);
    } catch (e) {
        console.log(e);
        next(e);
    }
});

router.post("/api/daily-summery-report", async (req, res, next) => {
    try {

        console.log("-----------------", req.body.DocumentID)
        let pool = await sql.connect(config);
        
        let Document = JSON.parse(req.body.DocumentData)
        
        let Validate = await pool
        .request()
        .input("Date", sql.Date, Document.Date)
        .input("BranchID", sql.Int, Document.BranchID)
        .query("SELECT * FROM [dbo].[MobileDailySummeryReportHeader] WHERE Date = @Date AND BranchID = @BranchID")
        

        if (Validate.recordset.Status != 2) {
            console.log("-----------------", Validate.recordset.length)
            if ((req.body.DocumentID >= 1 && Validate.recordset.length >= 1) || (req.body.DocumentID ==0 && Validate.recordset.length ==0)) {
                let result = await pool
                    .request()
                    .input("UserID", sql.Int, req.body.UserID)
                    .input("DocumentID", sql.Int, req.body.DocumentID)
                    .input("DocumentData", sql.NVarChar(sql.MAX), req.body.DocumentData)
                    .input("DocumentUploadFileData", sql.NVarChar(sql.MAX), req.body.DocumentUploadFileData)

                    .execute(`MobileDailySummeryReportMSP`);
                res.status(200).json(await result.recordset);
            }
            else {
                res.status(201).json("Error");
            }


        } else {
            res.status(202).json("Error");
        }

    } catch (e) {
        console.log(e);
        next(e);
    }
});


router.get("/api/user-wise-daily-summery-report", async (req, res, next) => {
    try {

        let pool = await sql.connect(config);
        let result = await pool
            .request()
            .input("UserID", sql.Int, req.query.UserID)
            .input("BranchID", sql.Int, req.query.BranchID)
            .execute(`MobileDailySummeryReportSSP`);

        console.log("await result.recordset", await result.recordset)
        res.status(200).json(await result.recordset);
    } catch (e) {
        console.log(e);
        next(e);
    }
});

router.get("/api/daily-summery-report-load-default-data", async (req, res, next) => {
    try {
        console.log("req.query.Date", req.query.Date)
        let pool = await sql.connect(config);
        let result = await pool
            .request()
            .input("BranchID", sql.Int, req.query.BranchID)
            .input("Date", sql.Date, req.query.Date)
            .execute(`MobileDailySummeryReportDefaultDataSSP`);

        console.log("await result.recordset", await result.recordset)
        res.status(200).json(await result.recordset);
    } catch (e) {
        console.log(e);
        next(e);
    }
});


router.post("/api/user-wise-daily-summery-report", async (req, res, next) => {
    try {

        var base64Data = req.rawBody.replace(/^data:image\/png;base64,/, "");

        require("fs").writeFile("out.png", base64Data, 'base64', function (err) {
            console.log(err);
        });

        Path = path.join(__dirname, "../../uploads/daily_summery_report");
        let upload = multer({ storage: storage }).single("file");

        upload(req, res, function (err) {
            res.send(req.file.filename);
        });
        res.send(req.file.filename);
    } catch (e) {
        console.log(e);
        next(e);
    }
});





module.exports = router;
