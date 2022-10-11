const express = require("express");
const getuser = require("../middleware/getuser");
const nodemailer = require("nodemailer");
const multer = require("multer");
var jwt = require("jsonwebtoken");
const User = require("../model/user");
var brcypt = require("bcryptjs");
const { findOne } = require("../model/user");
const axios = require("axios");
const router = express.Router();
const sucuresting = "anil";

var storage = multer.diskStorage({
  destination: function (res, file, cd) {
    cd(null, "./public");
  },
  filename: function (req, file, cd) {
    cd(null, Date.now() + "" + file.originalname);
  },
});

const upload = multer({ storage, limits: 1000000000 });

router.post("/register", async (req, res) => {
  // const { name, email, password, dob } = req.body;
  try {
    const { name, password, email, dob } = req.body;

    let user = await User.findOne({ email: email });

    if (user) {
      return res.status(400).json({ false: "user allready presnt" });
    }

    const salt = await brcypt.genSalt(10);
    const secPass = await brcypt.hash(password, salt);

    const newdate = new Date(dob);

    user = await User.create({
      name: name,
      email: email,
      passsword: secPass,
      dob: newdate,
    });

    const data = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(data, sucuresting);

    res.status(200).json({ true: "you have registerd", token });
    console.log(name, password, email, dob);
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { password, email } = req.body;

    let user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ false: "First register" });
    }

    const compnarepas = await brcypt.compare(password, user.password);

    if (!compnarepas) {
      return res
        .status(400)
        .json({ false: "please login with right creadebtials" });
    }

    const data = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(data, sucuresting);

    res.status(200).json({ true: "you have login succeffly", token });
    console.log(password, email);
  } catch (error) {
    console.log(error);
  }
});

router.put("/upload", upload.single("myFile"), getuser, async (req, res) => {});

// const sendmail = async (email, otp) => {
//   var transporter = nodemailer.createTransport({
//     service: "smtp.ethereal.email",

//     port: 587,
//     auth: {
//       user: "anil babu",
//       pass: "Anilb@1234",
//     },
//   });

//   transporter.verify(function (error, success) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Server is reafy to take our messases");
//     }
//   });

//   var mailoptions = {
//     from: "anilb3245@gmail.com",
//     to: email,
//     subject: ` you opt is for reset password ${otp}`,
//   };

//   transporter.sendMail(mailoptions, function (error, info) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("opt send :" + info.response);
//     }
//   });
// };

router.post("/forgetpassword", async (req, res) => {
  // const { name, email, password, dob } = req.body;
  const { email } = req.body;
  const otp = Math.floor(Math.random() * 1000000);
  const user = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        otp,
      },
    }
  );
  //   console.log(user)
  if (!user) {
    res.status(404).json({ false: "wrong email" });
  }
  var data = {
    service_id: "service_5izbypl",
    template_id: "template_1v5tarv",
    user_id: "82HUNCTaunwlfzNDn",
    template_params: {
      username: "James",
      "g-recaptcha-response": "03AHJ_ASjnLA214KSNKFJAK12sfKASfehbmfd...",
    },
  };
  //   axios
  //     .post("https://api.emailjs.com/api/v1.0/email/send", JSON.stringify(data))
  //     .then((res) => {
  //       console.log("send mail");
  //     })
  //     .catch((err) => console.log(JSON.stringify(err)));

  res.send("ok");
});

router.post("/forgotpasswordconfirm", async (req, res) => {
  try {
    const { email, otp, newpassword } = req.body;

    const vuser = await User.findOne({ email, otp });
    if (!vuser) return res.status(401).json("Enter a vaild otp");

    const salt = await brcypt.genSalt(10);
    const secPass = await brcypt.hash(newpassword, salt);
    await vuser.updateOne({
      $set: {
        password: secPass,
        otp: null,
      },
    });
    res.json("ok");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
