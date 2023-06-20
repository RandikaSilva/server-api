var createError = require("http-errors");
var express = require("express");
var cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
var app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use(
  cors([
    "capacitor://localhost",
    "ionic://localhost",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8100",
    "*",
  ])
);

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", req.headers.origin);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var Admin = require("./routes/admin/Admin");
var Branch = require("./routes/masters/Branch");
var Lecture = require("./routes/lecture/lecture");
var DailySummeryReport = require("./routes/daily-summery-report/DailySummeryReport");
var fileHandleRouter = require("./routes/utility/file_handle");
var job = require("./routes/new_job/job");
var student = require("./routes/student/student");
var expences = require("./routes/expences/expences");
var bank_deposite = require("./routes/bank-deposit/bank_deposit");
var application = require("./routes/student/application");

const { AccessToken } = require("./configCommon");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "./uploads/daily_summery_report")));
app.use(express.static(path.join(__dirname, "./uploads/audit_document")));
app.use(
  express.static(path.join(__dirname, "./uploads/daily_summer_rerport02"))
);
app.use(
  express.static(path.join(__dirname, "./uploads/lecture_attendance_images"))
);
app.use(
  express.static(path.join(__dirname, "./uploads/student_profile_image"))
);
app.use(express.static(path.join(__dirname, "./uploads/expences")));
app.use(express.static(path.join(__dirname, "./uploads/bank_deposite")));
app.use(express.static(path.join(__dirname, "./uploads/certificate")));

app.use("/", Admin);
app.use("/", Branch);
app.use("/", DailySummeryReport);
app.use("/", fileHandleRouter);
app.use("/", job);
app.use("/", Lecture);
app.use("/", student);
app.use("/", expences);
app.use("/", bank_deposite);
app.use("/", application);

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
