import dotenv from "dotenv";
dotenv.config();
import { verifyToken } from "../config/jwt.js";

function verifyTokenMiddleware(req, res, next) {
  // Check for token in cookies or Authorization header
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  
  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  try {
    const verified = verifyToken(token);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
}

function generateToken(data) {
  // Will generate token using user info and server secret key
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "5h" });
}

const JWT = {
  verifyToken: verifyTokenMiddleware,
  generateToken,
};

export default JWT;
