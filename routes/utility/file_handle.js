var express = require("express");
var config = require("../../config");
const path = require("path");
var multer = require("multer");
var router = express.Router();
var { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const download = require("download");
var fileupload = require("express-fileupload");
const base64Img = require("base64-img");
const uuid = require("uuid");
router.use(fileupload());
const { Buffer } = require("buffer");

let Location = {
  Application: path.join(__dirname, "../../uploads/temp"),
  Report: path.join(__dirname, "../../uploads"),
};

let Path = "";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, Path);
  },
  filename: (req, file, callback) => {
    console.log(file);
    callback(null, uuidv4() + path.extname(file.originalname));
  },
});

let upload = multer({ storage: storage }).single("file");

// router.post("/api/temp-upload", (req, res, next) => {
//   try {
//     var base64Data = req.body.testdot;

//     const fileContents = new Buffer(base64Data, 'base64')
//     fs.writeFile("../../uploads/", fileContents, (err) => {
//       if (err) return console.error(err)
//       console.log('file saved to ', "../../uploads/")
//     })

//   } catch (error) {
//     console.error(error);
//   }
// });

router.post("/api/temp-upload", (req, res) => {
  var base64Data = req.body.testdot.replace(/^data:image\/png;base64,/, "");
  let UnicID = uuidv4() + ".png";
  Path = path.join(__dirname, "../../uploads/daily_summery_report/" + UnicID);

  fs.writeFile(Path, base64Data, "base64", function (err) {
    if (err) {
      res.status(500).send({
        Error: "Error",
      });
    } else {
      res.status(200).send({
        FileName: UnicID,
        //FilePath: req.protocol + '://' + req.get('host') + '/' + UnicID,
        FilePath: "http://31.220.63.95:2090" + "/" + UnicID,
      });
    }
  });
});

router.post("/api/upload-document", (req, res) => {
  var base64Data = req.body.testdot.replace(/^data:image\/png;base64,/, "");
  let UnicID = uuidv4() + ".png";
  Path = path.join(__dirname, "../../uploads/audit_document/" + UnicID);

  fs.writeFile(Path, base64Data, "base64", function (err) {
    if (err) {
      res.status(500).send({
        Error: "Error",
      });
    } else {
      res.status(200).send({
        FileName: UnicID,
        //FilePath: req.protocol + '://' + req.get('host') + '/' + UnicID,
        FilePath: "http://31.220.63.95:2090" + "/" + UnicID,
      });
    }
  });
});

router.post("/api/report-upload", (req, res, next) => {
  try {
    Path = path.join(__dirname, "../../uploads/layout" /*, req.query.Folder*/);

    console.log("Path", Path);
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json(err);
      } else if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).send(req.file);
    });
    res.send(req.file);
  } catch (error) {
    console.error(error);
  }
});

router.get("/api/file-delete", async (req, res, next) => {
  try {
    fs.unlinkSync(
      path.join(
        __dirname,
        `../../uploads/${req.query.Folder}/`,
        req.query.FileName
      )
    );

    console.log("File is deleted.");
  } catch (error) {
    console.log(error);
  }
});

router.post("/api/upload/internship", function (req, res, next) {
  const file = req.files.file;

  console.log("file", req.files.file);

  let folder = path.join(__dirname, `../../uploads/${req.query.Folder}/`);

  file.mv(folder + req.query.FileName, function (err, result) {
    if (err) throw err;
    res.send({
      success: true,
      message: "File uploaded!",
      filePath: folder + req.query.FileName,
    });
  });
});

router.post("/api/upload/profile-image", function (req, res, next) {
  const file = req.files.file;

  console.log("file", req.files.file);

  let folder = path.join(__dirname, `../../uploads/${req.query.Folder}/`);

  file.mv(folder + req.query.FileName, function (err, result) {
    if (err) throw err;
    res.send({
      success: true,
      message: "File uploaded!",
      filePath:
        req.protocol + "://" + req.get("host") + "/" + req.query.FileName,
    });
  });
});

router.get("/api/file-move", async (req, res, next) => {
  try {
    let folder = path.join(
      __dirname,
      "../../uploads/application/app" + req.query.ApplicationID
    );

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }

    let currentPath = path.join(
      __dirname,
      "../../uploads/temp/",
      req.query.File
    );
    let destinationPath = path.join(folder, "/", req.query.File);

    console.log("currentPath", currentPath);
    console.log("destinationPath", destinationPath);

    fs.rename(currentPath, destinationPath, function (err) {
      if (err) {
        throw err;
      } else {
        console.log("Successfully moved the file!");
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/api/upload", function (req, res, next) {
  const file = req.files.file;

  console.log("file", req.files.file);

  let folder = path.join(__dirname, `../../uploads/${req.query.Folder}/`);

  file.mv(folder + req.query.FileName, function (err, result) {
    if (err) throw err;
    res.send({
      success: true,
      message: "File uploaded!",
    });
  });
});

router.get("/api/file-download", async (req, res, next) => {
  try {
    let FilePath = path.join(
      __dirname,
      "../../uploads/application/",
      req.query.FileName
    );

    res.download(FilePath);
    //res.sendFile(file);
  } catch (error) {
    console.log(error);
  }
});

router.get("/api/file-download/internship", async (req, res, next) => {
  try {
    // let FilePath = path.join(
    //   req.query.FileName
    // );
    let FilePath = path.join(
      __dirname,
      "../../uploads/internship/",
      req.query.FileName
    );
    res.download(FilePath);
    //res.sendFile(file);
  } catch (error) {
    console.log(error);
  }
});

router.post("/api/upload-document-daily_summery_report-02", (req, res) => {
  var base64Data = req.body.testdot.replace(/^data:image\/png;base64,/, "");
  let UnicID = uuidv4() + ".png";
  Path = path.join(__dirname, "../../uploads/daily_summer_rerport02/" + UnicID);

  fs.writeFile(Path, base64Data, "base64", function (err) {
    if (err) {
      res.status(500).json({
        Error: "Error",
      });
    } else {
      res.status(200).send({
        FileName: UnicID,
        //FilePath: req.protocol + '://' + req.get('host') + '/' + UnicID,
        FilePath: "http://31.220.63.95:2090" + "/" + UnicID,
      });
    }
  });
});

router.post("/api/upload-document-lecture-attendance-images", (req, res) => {
  const fileBuffer = Buffer.from(req.files.file.data);
  let UnicID = uuidv4() + ".png";
  Path = path.join(
    __dirname,
    "../../uploads/lecture_attendance_images/" + UnicID
  );

  fs.writeFile(Path, fileBuffer, function (err) {
    if (err) {
      res.status(500).send({
        Error: "Error",
      });
    } else {
      res.status(200).json({
        FileName: UnicID,
        FilePath: "http://31.220.63.95:2090" + "/" + UnicID,
      });
    }
  });
});

router.post("/api/upload-student-profile-image", (req, res) => {
  const fileBuffer = Buffer.from(req.files.file.data);
  let UnicID = uuidv4() + ".png";
  Path = path.join(__dirname, "../../uploads/student_profile_image/" + UnicID);

  fs.writeFile(Path, fileBuffer, function (err) {
    if (err) {
      res.status(500).send({
        Error: "Error",
      });
    } else {
      res.status(200).json({
        FileName: UnicID,
        FilePath: "http://31.220.63.95:2090" + "/" + UnicID,
      });
    }
  });
});

router.post("/api/upload-expences-image", (req, res) => {
  const fileBuffer = Buffer.from(req.files.file.data);
  let UnicID = uuidv4() + ".png";
  Path = path.join(__dirname, "../../uploads/expences/" + UnicID);

  fs.writeFile(Path, fileBuffer, function (err) {
    if (err) {
      res.status(500).send({
        Error: "Error",
      });
    } else {
      res.status(200).json({
        FileName: UnicID,
        FilePath: "http://31.220.63.95:2090" + "/" + UnicID,
      });
    }
  });
});

router.post("/api/upload-bank-deposit-image", (req, res) => {
  const fileBuffer = Buffer.from(req.files.file.data);
  let UnicID = uuidv4() + ".png";
  Path = path.join(__dirname, "../../uploads/bank_deposite/" + UnicID);

  fs.writeFile(Path, fileBuffer, function (err) {
    if (err) {
      res.status(500).send({
        Error: "Error",
      });
    } else {
      res.status(200).json({
        FileName: UnicID,
        FilePath: "http://31.220.63.95:2090" + "/" + UnicID,
      });
    }
  });
});

router.post("/api/upload-pending-application-image", (req, res) => {
  const fileBuffer = Buffer.from(req.files.file.data);
  let UnicID = uuidv4() + ".png";
  Path = path.join(__dirname, "../../uploads/certificate/" + UnicID);

  fs.writeFile(Path, fileBuffer, function (err) {
    if (err) {
      res.status(500).send({
        Error: "Error",
      });
    } else {
      res.status(200).json({
        FileName: UnicID,
        FilePath: "http://31.220.63.95:2090" + "/" + UnicID,
      });
    }
  });
});

router.get("/api/delete-expences", async (req, res) => {
  try {
    var files = req.query.FileName.split("|");

    files.forEach((element) => {
      fs.unlinkSync(path.join(__dirname, `../../uploads/expences`, element));
    });

    console.log("File is deleted.");
    res.status(200).json({ Result: "File is deleted." });
  } catch (error) {
    res.status(500).send({
      Error: "Error",
    });
  }
});

router.get("/api/delete-bank-deposit-image", async (req, res) => {
  try {
    var files = req.query.FileName.split("|");

    files.forEach((element) => {
      fs.unlinkSync(
        path.join(__dirname, `../../uploads/bank_deposite`, element)
      );
    });

    console.log("File is deleted.");
    res.status(200).json({ Result: "File is deleted." });
  } catch (error) {
    res.status(500).send({
      Error: "Error",
    });
  }
});

router.get(
  "/api/delete-document-lecture-attendance-images",
  async (req, res) => {
    try {
      var files = req.query.FileName.split("|");

      files.forEach((element) => {
        fs.unlinkSync(
          path.join(
            __dirname,
            `../../uploads/lecture_attendance_images`,
            element
          )
        );
      });

      console.log("File is deleted.");
      res.status(200).json({ Result: "File is deleted." });
    } catch (error) {
      res.status(500).send({
        Error: "Error",
      });
    }
  }
);

module.exports = router;
