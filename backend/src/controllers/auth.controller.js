
export async function checkAuth(req, res, next) {
  // Return the authenticated user
  if (!req.user) {
    return res.status(401).json({
      message: "unauthorized",
    });
  }

  res.status(200).json(req.user);
}
