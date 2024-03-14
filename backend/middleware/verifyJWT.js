const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split("Bearer ")[1];

  jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden: JWT token expired!" });
    }
    req.user = decoded.username;
    next();
  });
};

module.exports = verifyJWT;
