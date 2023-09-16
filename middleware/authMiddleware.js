const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.cookies.token || req.headers.authorization.split(' ')[1];

    console.log(token)

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.username = decoded['id'];

    console.log(req.username)

    next()

  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

};

module.exports = verifyToken;