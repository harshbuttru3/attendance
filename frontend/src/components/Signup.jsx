import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../css/Signup.module.css";

const subjectsList = ["Mathematics", "Physics", "Physics-L", "Chemistry", "Chemistry-L", 
                      "Biology", "PPS", "PPS-L", "English", "DSA", "DSA-L", 
                      "OOPS", "OOPS-L", "AE"];

const branchesList = ["CSE", "EEE", "Mechanical", "Civil", "Cybersecurity", "FTS"];

const semestersList = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    subjects: [],  // ✅ Store multiple selected subjects
    semesters: [], // ✅ Store multiple selected semesters
    branches: [],  // ✅ Store multiple selected branches
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked
          ? [...prevData[name], value]  // Add value if checked
          : prevData[name].filter((item) => item !== value), // Remove if unchecked
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", formData);
      alert(res.data.message);
      navigate("/dashboard");
    } catch (err) {
      alert("Error: " + err.response.data.error);
    }
  };

  const [passwordMatch, setPasswordMatch] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "confirmPassword") {
      setPasswordMatch(value === formData.password);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <div id={styles.signupForm}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <div className={styles.passwordInput}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="button" onClick={togglePasswordVisibility}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div className={styles.passwordInput}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handlePasswordChange}
            required
          />
          <button type="button" onClick={toggleConfirmPasswordVisibility}>
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
        {passwordMatch === false && <p style={{ color: "red" }}>Passwords do not match</p>}
        {passwordMatch === true && <p style={{ color: "green" }}>Passwords match</p>}
      </div>
      {/* Subject Selection */}
      <label className={styles.label}>Select Subjects:</label>
      <div id={styles.subjects}>
        {subjectsList.map((subject, index) => (
          <div key={index}>
            <input
              type="checkbox"
              name="subjects"
              value={subject}
              onChange={handleChange}
            />
            <label>{subject}</label>
          </div>
        ))}
      </div>
      {/* Semester Selection */}
      <label className={styles.label2}>Select Semester: </label>
      {semestersList.map((semester, index) => (
        <div key={index}>
          <input
            type="checkbox"
            name="semesters"
            value={semester}
            onChange={handleChange}
          />
          <label>{semester} Semester</label>
        </div>
      ))}

      {/* Branch Selection */}
      <label className={styles.label2}>Select Branch:</label>
      {branchesList.map((branch, index) => (
        <div key={index} >
          <input
            type="checkbox"
            name="branches"
            value={branch}
            onChange={handleChange}
          />
          <label>{branch}</label>
        </div>
      ))}

      <button type="submit" id={styles.singupButton}>Signup</button>
      <br />
      <p>Already have an account?</p>
      <button type="button" onClick={() => navigate("/login")}>
        Login
      </button>
    </form>
  );
};

export default Signup;
