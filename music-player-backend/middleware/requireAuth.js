// middleware/requireAuth.js
export default function requireAuth(req, res, next) {
  if (!req.session.accessToken) {
    return res.status(401).json({ redirect: "/api/auth/login" });
  }
  next();
}
