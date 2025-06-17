const jwt = require("jsonwebtoken");
const errorHandler = require("../helper/errorHandler");

module.exports = (req, res, next) => {
  try {
    let decodedToken;
    const authHeader = req.get("Authorization");
    if (!authHeader) errorHandler(401, "Not authenticated.");
    const token = authHeader.split(" ")[1];

    decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) errorHandler(401, "Not authenticated");

    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    throw error;
  }
};
