const JWT = require("jsonwebtoken");

const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res
          .status(401)
          .json({ error: "Unauthorized: No token provided" });
      }

      const decoded = JWT.verify(token, process.env.JWT_SECRET);
      if (!allowedRoles.includes(decoded.role)) {
        return res
          .status(403)
          .json({ error: "Forbidden: Insufficient permissions" });
      }

      req.user = decoded; // Attach user data to request for use in controllers
      next();
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error verifying token", details: error.message });
    }
  };
};

module.exports = verifyRole;
