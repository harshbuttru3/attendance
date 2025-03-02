import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // ✅ Define fetchSubjects before use
  const fetchSubjects = () => {
    if (semester && branch) {
      axios
        .get(`http://localhost:5000/api/subjects/${user.id}/${semester}/${branch}`)
        .then((res) => {
          if (res.data.length > 0) {
            setSubjects(res.data);
            setShowSubjectDropdown(true);
          } else {
            alert("No subjects assigned for this selection.");
            setShowSubjectDropdown(false);
          }
        })
        .catch((err) => {
          console.error("Error fetching subjects:", err);
          setShowSubjectDropdown(false);
        });
    }
  };

  return (
    <div>
      <h2>Welcome, {user?.name}</h2>
      <button onClick={logout}>Logout</button>

      <label>Select Semester:</label>
      <select value={semester} onChange={(e) => setSemester(e.target.value)}>
        <option value="">-- Select Semester --</option>
        {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map((sem) => (
          <option key={sem} value={sem}>{sem} Semester</option>
        ))}
      </select>

      <label>Select Branch:</label>
      <select value={branch} onChange={(e) => setBranch(e.target.value)}>
        <option value="">-- Select Branch --</option>
        {["CSE", "Civil", "EEE", "Cybersecurity", "Mechanical", "FTS"].map((br) => (
          <option key={br} value={br}>{br}</option>
        ))}
      </select>

      <button onClick={fetchSubjects} disabled={!semester || !branch}>
        Load Subjects
      </button>

      {showSubjectDropdown && (
        <>
          <label>Select Subject:</label>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="">-- Select Subject --</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject}>{subject}</option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};

export default Dashboard;
