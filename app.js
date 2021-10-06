var createError = require("http-errors");
var express = require("express");
var cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var jwt = require('jsonwebtoken')

var app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});



var Admin = require("./routes/admin/Admin");
var Branch = require("./routes/masters/Branch")
var DailySummeryReport = require('./routes/daily-summery-report/DailySummeryReport')
var fileHandleRouter = require("./routes/utility/file_handle");
const { AccessToken } = require("./configCommon");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
console.log("Path", path.join(__dirname, "public"));
app.use(express.static(path.join(__dirname, "./uploads/daily_summery_report")));

app.use("/", Admin)
app.use("/", Branch)
app.use("/", DailySummeryReport)
app.use("/", fileHandleRouter)


app.use(function (req, res, next) {
  next(createError(404));
});

// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });




app.listen(process.env.PORT || 2090, "0.0.0.0");

