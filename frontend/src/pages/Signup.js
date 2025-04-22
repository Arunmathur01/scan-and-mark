import React, { useEffect, useState } from "react";
import "../styles/Signup.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import image512 from "../assets/logo512.png";
import image192 from "../assets/logo192.png";
import { SHA256 } from "crypto-js";
import see from "../assets/see.png";
import hide from "../assets/hide.png";
import API_BASE_URL from '../config';
// ... existing code ...

// ... existing code ...

// Configure axios defaults
axios.defaults.withCredentials = true;

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("student");
  const navigate = useNavigate();

  function computeHash(input) {
    return SHA256(input).toString();
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    let name = e.target.name.value;
    let email = e.target.email.value;
    let type = e.target.type.value;
    let password = e.target.password.value;
    let confirmPassword = e.target.confirmPassword.value;
    let rollno = e.target.rollno?.value;
    let pno = e.target.pno?.value;
    let dob = e.target.dob?.value;

    if (password.length > 0 && confirmPassword.length > 0) {
      if (password === confirmPassword) {
        password = computeHash(password);
        password = computeHash(email + password);
        const formData = {
          name,
          email,
          password,
          type,
          ...(type === "student" ? { rollno } : { pno, dob })
        };
        try {
          const response = await axios.post(`${API_BASE_URL}/users/signup`, formData, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (response.data) {
            navigate("/login");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Registration failed");
        }
      } else {
        setError("Passwords do not match");
      }
    } else {
      setError("Please fill all the fields");
    }
  };

  useEffect(() => {
    if (token !== "") {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <div className="register-main">
      <div className="register-left">
        <img alt="Full" src={image512} />
      </div>
      <div className="register-right">
        <div className="register-right-container">
          <div className="register-logo">
            <img alt="logo" src={image192} />
          </div>
          <div className="register-center">
            <h2>Welcome to our website!</h2>
            <p>Please enter your details</p>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleRegisterSubmit}>
              <select 
                name="type" 
                id="type"
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
              <input
                type="text"
                placeholder="Name"
                name="name"
                required={true}
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                required={true}
              />
              {userType === "student" ? (
                <input
                  type="text"
                  placeholder="Roll Number"
                  name="rollno"
                  required={true}
                />
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    name="pno"
                    required={true}
                  />
                  <input 
                    type="date" 
                    name="dob" 
                    id="dob" 
                    required={true}
                    placeholder="Date of Birth"
                  />
                </>
              )}
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  required={true}
                />
                {showPassword ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword(false);
                    }}
                    style={{ color: "white", padding: 0 }}
                  >
                    <img className="hide" src={hide} alt="hide" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword(true);
                    }}
                    style={{ color: "white", padding: 0 }}
                  >
                    <img className="see" src={see} alt="see" />
                  </button>
                )}
              </div>
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  required={true}
                />
                {showPassword ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword(false);
                    }}
                    style={{ color: "white", padding: 0 }}
                  >
                    <img className="hide" src={hide} alt="hide" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword(true);
                    }}
                    style={{ color: "white", padding: 0 }}
                  >
                    <img className="see" src={see} alt="see" />
                  </button>
                )}
              </div>
              <button type="submit">Register</button>
            </form>
          </div>

          <p className="register-bottom-p">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#76ABAE" }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
