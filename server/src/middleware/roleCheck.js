export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in first." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden. This resource requires one of the following roles: [${allowedRoles.join(
          ", "
        )}]. Current role: ${req.user.role}.`,
      });
    }

    next();
  };
};
