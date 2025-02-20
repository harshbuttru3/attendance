import { useState } from "react";
import axios from "axios";

const subjectsList = ["Mathematics", "Physics", "Physics-L", "Chemistry", "Chemistry-L", 
                      "Biology", "PPS", "PPS-L", "English", "DSA", "DSA-L", 
                      "OOPS", "OOPS-L", "AE"];

const branchesList = ["CSE", "EEE", "Mechanical", "Civil", "Electrical", "Cybersecurity", "FTS"];

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
    } catch (err) {
      alert("Error: " + err.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

      {/* Subject Selection */}
      <label>Select Subjects:</label>
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

      {/* Semester Selection */}
      <label>Select Semester:</label>
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
      <label>Select Branch:</label>
      {branchesList.map((branch, index) => (
        <div key={index}>
          <input
            type="checkbox"
            name="branches"
            value={branch}
            onChange={handleChange}
          />
          <label>{branch}</label>
        </div>
      ))}

      <button type="submit">Signup</button>
    </form>
  );
};

export default Signup;
