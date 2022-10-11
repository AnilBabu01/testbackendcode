const jwt = require("jsonwebtoken");
const sucuresting = "anil";

const fetchuser = (req, res, next) => {
  try {
    const token = req.header("auth-token");

    if (!token) {
      res.status(401).send({ error: "invalid token" });
    }

    const data = jwt.verify(token, sucuresting);
    req.user = data.user;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = fetchuser;
