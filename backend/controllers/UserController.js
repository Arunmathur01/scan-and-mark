import dotenv from "dotenv";
dotenv.config();
import { Student } from "../model/Student.js";
import { Teacher } from "../model/Teacher.js";
import { generateToken } from "../config/jwt.js";

//login
async function Login(req, res) {
  const { email, password, type } = req.body;
  
  try {
    let user;
    if (type === "student") {
      user = await Student.findOne({ email });
    } else {
      user = await Teacher.findOne({ email });
    }

    if (user) {
      if (user.password === password) {
        const token = generateToken({ email: user.email });
        user.type = type;
        res
          .cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          })
          .status(200)
          .json({ user: user, type: type, token: token });
      } else {
        res.status(400).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(400).json({ message: "No such User" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

// Create a new user
async function Signup(req, res) {
  const { name, email, password, type, rollno, pno, dob } = req.body;
  
  try {
    if (type === "student") {
      if (!rollno) {
        return res.status(400).json({ message: "Roll number is required for students" });
      }
      const user = new Student({
        name,
        email,
        rollno,
        password,
      });
      const existingUser = await Student.findOne({ email }).exec();
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const newUser = await user.save();
      res.status(201).json(newUser);
    } else {
      const user = new Teacher({
        name,
        email,
        pno,
        dob,
        password,
      });
      const existingUser = await Teacher.findOne({ email }).exec();
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const newUser = await user.save();
      res.status(201).json(newUser);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

//change password
async function ForgotPassword(req, res) {
  const { email, password } = req.body;
  //check if user is a student
  let user = await Student.findOneAndUpdate({ email }, { password }).exec();
  if (!user) {
    user = await Teacher.findOneAndUpdate({ email }, { password }).exec();
  }
  if (user) {
    res.status(200).json({ message: "Password changed successfully" });
  } else {
    res.status(400).json({ message: "No such User" });
  }
}

//edit user details
async function EditUserDetails(req, res) {
  const { email, name, pno, dob } = req.body;
  //check if user is a student
  let user = await Student.findOneAndUpdate({ email }, { name, pno, dob }).exec();
  if (!user) {
    user = await Teacher.findOneAndUpdate({ email }, { name, pno, dob }).exec();
  }
  if (user) {
    res.status(200).json({ message: "User updated" });
  }
}

const UserController = {
  Login,
  Signup,
  ForgotPassword,
  EditUserDetails,
};

export default UserController;
