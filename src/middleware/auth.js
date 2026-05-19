const jwt = require("jsonwebtoken");

const SECRET = "SUPER_SECRET_KEY";

function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      error: "Token requerido"
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Token inválido"
    });
  }
}

module.exports = auth;