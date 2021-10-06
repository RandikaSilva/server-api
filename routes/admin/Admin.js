var express = require("express");
var config = require("../../config");
var sql = require("mssql");
var router = express.Router();
var jwt = require('jsonwebtoken');
const { AccessToken } = require("../../configCommon");


router.post("/api/admin/user-create", async (req, res, next) => {
    try {
       
        console.log(req.body.UserID)
        let pool = await sql.connect(config);
        let result = await pool
            .request()
            .input("UserID", sql.NVarChar(20), req.body.UserID)
            .input("User", sql.NVarChar(sql.Max), req.body.User)
            .execute(`MobileUserMSP`);

        
        res.status(200).json(await result.recordset);
    } catch (e) {
        console.log(e);
        next(e);
    }
});


router.get("/api/master/all-users", async (req, res, next) => {
    try {
        console.log(req.body.User)
        let pool = await sql.connect(config);
        let result = await pool
            .request()
            .query(`SELECT * FROM [dbo].[MobileUser]`);

        console.log("await result.recordset",await result.recordset)
        res.status(200).json(await result.recordset);
    } catch (e) {
        console.log(e);
        next(e);
    }
});



router.post("/api/admin/user-login", async (req, res, next) => {
    try {

        let UserData = {}

        let pool = await sql.connect(config);
        let result = await pool
            .request()
            .input("Email", sql.NVarChar(20), req.body.Email)
            .input("Password", sql.NVarChar(20), req.body.Password)
            .execute(`MobileUserASP`);


            res.status(200).json(await result.recordset);
    } catch (e) {
        console.log(e);
        next(e);
    }
});

router.get("/api/admin/user", async (req, res, next) => {
    try {
        let UserData= {
            User:"asd"
        }
    

        res.status(200).json(UserData);
    } catch (e) {
        console.log(e);
        next(e);
    }
});



module.exports = router;
