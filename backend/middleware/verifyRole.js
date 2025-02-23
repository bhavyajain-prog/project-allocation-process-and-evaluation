const verifyRole = (req, res, role) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== role) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    return decoded;
  } catch (error) {
    res.status(500).json({ error: "Error verifying token", details: error.message });
  }
};

module.exports = verifyRole;