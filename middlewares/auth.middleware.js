const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  const { token } = req.cookies;
  // check if token exist / user logged in
  if (!token) {
    return res.json({ message: "please login" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
    if (error) {
      return res.json({ message: "session expired" });
    }
    req.user = { id: payload.id, admin: payload.admin };
  });
  next();
};

module.exports = authentication;
