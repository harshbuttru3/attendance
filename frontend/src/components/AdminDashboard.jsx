import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


const AdminDashboard = () => {
  const navigate = useNavigate();
   const { user, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    registration_no: "",
    name: "",
    branch: "",
    semester: "",
  });

  const [promotionSemester, setPromotionSemester] = useState("");
  const [updateData, setUpdateData] = useState({ registration_no: "", newSemester: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/admin/register-student", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert(res.data.message);
    } catch (err) {
      alert("Error: " + err.response.data.error);
    }
  };

  const handlePromote = async () => {
    try {
      const res = await axios.put("http://localhost:5000/api/admin/promote-semester", { currentSemester: promotionSemester }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert(res.data.message);
    } catch (err) {
      alert("Error: " + err.response.data.error);
    }
  };

  const handleUpdateSemester = async () => {
    try {
      const res = await axios.put("http://localhost:5000/api/admin/update-student-semester", updateData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert(res.data.message);
    } catch (err) {
      alert("Error: " + err.response.data.error);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
        <button onClick={logout}>Logout</button>
      {/* Register Student */}
      <h3>Register New Student</h3>
      <input type="text" name="registration_no" placeholder="Registration No" onChange={handleChange} required />
      <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
      <select name="branch" onChange={handleChange}>
        <option value="">Select Branch</option>
        <option value="CSE">CSE</option>
        <option value="ECE">ECE</option>
        <option value="EEE">EEE</option>
        <option value="Cybersecurity">Cybersecurity</option>
      </select>
      <select name="semester" onChange={handleChange}>
        <option value="">Select Semester</option>
        {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map(sem => (
          <option key={sem} value={sem}>{sem}</option>
        ))}
      </select>
      <button onClick={handleRegister}>Register Student</button>

      {/* Promote Students */}
      <h3>Promote Students</h3>
      <select onChange={(e) => setPromotionSemester(e.target.value)}>
        <option value="">Select Semester to Promote</option>
        {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th"].map(sem => (
          <option key={sem} value={sem}>{sem}</option>
        ))}
      </select>
      <button onClick={handlePromote}>Promote Students</button>

      {/* Update Student Semester */}
      <h3>Update Student Semester</h3>
      <input type="text" placeholder="Registration No" onChange={(e) => setUpdateData({ ...updateData, registration_no: e.target.value })} />
      <select onChange={(e) => setUpdateData({ ...updateData, newSemester: e.target.value })}>
        {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map(sem => (
          <option key={sem} value={sem}>{sem}</option>
        ))}
      </select>
      <button onClick={handleUpdateSemester}>Update Semester</button>
    </div>
  );
};

export default AdminDashboard;
// ✅ Now the AdminDashboard component is ready to be used in the application.