function checkUserRole(role) {
    return function(req, res, next) {
      if (req.user && req.user.role === role) {
        return next();
      } else {
        return res.status(403).json({ message: 'Forbidden: Insufficient role' });
      }
    };
}

module.exports = {
    checkUserRole,
}