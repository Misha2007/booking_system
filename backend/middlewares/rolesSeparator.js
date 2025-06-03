export const rolesSeparator = async (req, res, next) => {
  const user = req.user;
  console.log(user.role);
  if (user && user.role === "admin") {
    return next();
  } else {
    return res.status(403).json({ message: "Access denied" });
  }
};
