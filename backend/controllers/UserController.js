import dotenv from "dotenv";
import { Student } from "../model/Student.js";
import { Teacher } from "../model/Teacher.js";
import { generateToken } from "../config/jwt.js";
import bcrypt from "bcrypt";

dotenv.config();

// Login
async function Login(req, res) {
  const { email, password, type } = req.body;
  console.log(email);
  console.log(password);
  console.log(type);

  try {
    let user;
    if (type === "student") {
      user = await Student.findOne({ email });
    } else {
      user = await Teacher.findOne({ email });
    }
    
    console.log(user);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
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

// Signup
async function Signup(req, res) {
  const { name, email, password, type, rollno, pno, dob } = req.body;

  console.log("Signup request received:", { name, email, type, rollno, pno, dob });

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (type === "student") {
      if (!rollno) {
        return res.status(400).json({ message: "Roll number is required for students" });
      }

      const existingUser = await Student.findOne({ email }).exec();
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = new Student({
        name,
        email,
        rollno,
        password: hashedPassword,
      });

      const newUser = await user.save();
      res.status(201).json(newUser);
    } else {
      if (!pno || !dob) {
        return res.status(400).json({ message: "Phone number and date of birth are required for teachers" });
      }

      const existingUser = await Teacher.findOne({ email }).exec();
      console.log(existingUser)
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = new Teacher({
        name,
        email,
        pno,
        dob,
        password: hashedPassword,
      });

      const newUser = await user.save();
      res.status(201).json(newUser);
    }
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
}

// Forgot Password
async function ForgotPassword(req, res) {
  const { email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user = await Student.findOneAndUpdate({ email }, { password: hashedPassword }).exec();
    if (!user) {
      user = await Teacher.findOneAndUpdate({ email }, { password: hashedPassword }).exec();
    }

    if (user) {
      res.status(200).json({ message: "Password changed successfully" });
    } else {
      res.status(400).json({ message: "No such User" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during password reset" });
  }
}

// Edit User Details
async function EditUserDetails(req, res) {
  const { email, name, pno, dob } = req.body;

  try {
    let user = await Student.findOneAndUpdate({ email }, { name, pno, dob }).exec();
    if (!user) {
      user = await Teacher.findOneAndUpdate({ email }, { name, pno, dob }).exec();
    }

    if (user) {
      res.status(200).json({ message: "User updated" });
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during update" });
  }
}

const UserController = {
  Login,
  Signup,
  ForgotPassword,
  EditUserDetails,
};

export default UserController;
