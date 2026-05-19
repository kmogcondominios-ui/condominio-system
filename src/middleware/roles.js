function superadmin(req, res, next) {
  if (req.user.rol !== "superadmin") {
    return res.status(403).json({
      error: "No autorizado"
    });
  }

  next();
}

module.exports = {
  superadmin
};