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

  // 🔹 Fetch subjects after selecting semester & branch
  const fetchSubjects = () => {
    if (semester && branch) {
      axios
        .get(`http://192.168.29.220:5000/api/subjects/${user.id}/${semester}/${branch}`)
        .then((res) => {
          if (res.data.length > 0) {
            setSubjects(res.data);
            setShowSubjectDropdown(true); // ✅ Show subject dropdown
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

  // 🔹 Fetch students & attendance when semester, branch, and subject are selected
  const fetchStudents = () => {
    if (semester && branch && selectedSubject) {
      axios.get(`http://192.168.29.220:5000/api/attendance/${semester}/${branch}/${selectedSubject}`)
        .then(res => {
          setStudents(res.data);
          setAttendance(
            res.data.map(student => ({
              student_id: student.id,
              subject: selectedSubject,
              semester,
              branch,
              total_classes: student.total_classes || 0,
              attended_classes: student.attended_classes || 0,
            }))
          );
        })
        .catch(err => {
          console.error("Error fetching students:", err);
          alert("No students found for this selection.");
        });
    }
  };

  // 🔹 Update attendance input fields correctly
  const handleInputChange = (index, field, value) => {
    setAttendance((prevAttendance) => {
      const updatedAttendance = [...prevAttendance];
  
      if (field === "total_classes") {
        // ✅ Update "total_classes" for all students
        updatedAttendance.forEach((entry) => {
          entry.total_classes = value;
        });
      } else {
        // ✅ Update only the specific student's field
        updatedAttendance[index][field] = value;
      }
  
      return updatedAttendance;
    });
  };
  

  // 🔹 Submit attendance
  const handleSubmit = () => {
    axios
      .post("http://192.168.29.220:5000/api/attendance/update", attendance)
      .then(() => alert("Attendance updated successfully!"))
      .catch((err) => console.error("Error updating attendance:", err));
  };

  return (
    <div>
      <h2>Welcome, {user?.name}</h2>
      <button onClick={logout}>Logout</button>

      {/* 🔹 Semester Selection */}
      <label>Select Semester:</label>
      <select value={semester} onChange={(e) => setSemester(e.target.value)}>
        <option value="">-- Select Semester --</option>
        {["1st", "2nd", "3rd"].map((sem) => (
          <option key={sem} value={sem}>{sem} Semester</option>
        ))}
      </select>

      {/* 🔹 Branch Selection */}
      <label>Select Branch:</label>
      <select value={branch} onChange={(e) => setBranch(e.target.value)}>
        <option value="">-- Select Branch --</option>
        {["CSE", "ECE", "EEE", "Cybersecurity"].map((br) => (
          <option key={br} value={br}>{br}</option>
        ))}
      </select>

      {/* 🔹 Load Subjects Button */}
      <button onClick={fetchSubjects} disabled={!semester || !branch}>Load Subjects</button>

      {/* 🔹 Subject Selection - Disabled by Default */}
      {showSubjectDropdown && (
        <>
          <label>Select Subject:</label>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="">-- Select Subject --</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject}>{subject}</option>
            ))}
          </select>

          <button onClick={fetchStudents}>Load Students</button>
        </>
      )}

      {/* 🔹 Student Attendance Table */}
      {students.length > 0 && (
        <div>
          <h3>Subject: {selectedSubject}</h3>
          <table border="1">
            <thead>
              <tr>
                <th>Reg ID</th>
                <th>Name</th>
                <th>Total Classes</th>
                <th>Attended Classes</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={`${student.id}-${selectedSubject}-${semester}-${branch}`}>
                  <td>{student.registration_no}</td>
                  <td>{student.name}</td>
                  <td>
                    <input
                      type="number"
                      value={attendance[index]?.total_classes || ""}
                      onChange={(e) => handleInputChange(index, "total_classes", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={attendance[index]?.attended_classes || ""}
                      onChange={(e) => handleInputChange(index, "attended_classes", e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
