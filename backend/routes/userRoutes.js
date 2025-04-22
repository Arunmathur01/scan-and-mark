import { Router } from "express";
const router = Router();
import UserController from "../controllers/UserController.js";
import JWT from "../middleware/JWT.js";

//login
router.post("/signin", UserController.Login);
// Create a new user
router.post("/signup", UserController.Signup);
// forgot password
router.post("/forgotpassword", UserController.ForgotPassword);
//edit user details
router.post(
  "/edituserdetails",
  JWT.verifyToken,
  UserController.EditUserDetails
);

export default router;
