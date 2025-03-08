import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import subjectData from "../assets/subjectData"; // Importing subject data

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    registration_no: "",
    name: "",
    branch: "",
    semester: "",
  });

  const [promotionSemester, setPromotionSemester] = useState("");
  const [updateData, setUpdateData] = useState({
    registration_no: "",
    newSemester: "",
  });

  // State for collapsible sections
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isPromoteOpen, setIsPromoteOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Convert semester number to ordinal (1st, 2nd, 3rd, etc.)
  const toOrdinalSemester = (semester) => {
    if (semester === 1) return "1st";
    if (semester === 2) return "2nd";
    if (semester === 3) return "3rd";
    return `${semester}th`;
  };

  const handleRegister = async () => {
    if (
      !formData.registration_no ||
      !formData.name ||
      !formData.branch ||
      !formData.semester
    ) {
      alert("Please fill all fields to register a student.");
      return;
    }

    // Convert semester to ordinal format
    const ordinalSemester = toOrdinalSemester(formData.semester);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/register-student",
        { ...formData, semester: ordinalSemester },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(res.data.message);
      setFormData({ registration_no: "", name: "", branch: "", semester: "" }); // Clear form
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Something went wrong"));
    }
  };

  const handlePromote = async () => {
    if (!promotionSemester) {
      alert("Please select a semester to promote students.");
      return;
    }

    // Convert semester to ordinal format
    const ordinalSemester = toOrdinalSemester(promotionSemester);

    try {
      const res = await axios.put(
        "http://localhost:5000/api/admin/promote-semester",
        { currentSemester: ordinalSemester },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(res.data.message);
      setPromotionSemester(""); // Clear selection
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Something went wrong"));
    }
  };

  const handleUpdateSemester = async () => {
    if (!updateData.registration_no || !updateData.newSemester) {
      alert("Please fill all fields to update a student's semester.");
      return;
    }

    // Convert semester to ordinal format
    const ordinalSemester = toOrdinalSemester(updateData.newSemester);

    try {
      const res = await axios.put(
        "http://localhost:5000/api/admin/update-student-semester",
        { ...updateData, newSemester: ordinalSemester },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(res.data.message);
      setUpdateData({ registration_no: "", newSemester: "" }); // Clear form
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Something went wrong"));
    }
  };

  // Get subjects based on selected branch and semester
  const selectedSubjects = () => {
    if (!formData.branch || !formData.semester) return [];
    const semesterData = subjectData.find(
      (sem) => sem.semester === parseInt(formData.semester)
    );
    if (!semesterData) return [];
    const branchData = semesterData.branches.find(
      (b) => b.branch === formData.branch
    );
    return branchData ? branchData.subjects : [];
  };

  return (
    <div
      className={`min-h-screen p-8 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-6">
            Admin Dashboard
          </h2>
        </div>

        {/* Student Section Heading */}
        <h3 className="text-2xl font-bold mb-4">Student Section</h3>

        {/* Register Student Section */}
        <div
          className={`mb-8 p-6 rounded-lg shadow-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setIsRegisterOpen(!isRegisterOpen)}
          >
            <h3 className="text-xl font-bold">Register New Student</h3>
            <span>{isRegisterOpen ? "▲" : "▼"}</span>
          </div>
          {isRegisterOpen && (
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="registration_no"
                  placeholder="Registration No"
                  value={formData.registration_no}
                  onChange={handleChange}
                  className={`p-2 rounded-lg border focus:outline-none ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                  }`}
                  required
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`p-2 rounded-lg border focus:outline-none ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                  }`}
                  required
                />
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className={`p-2 rounded-lg border focus:outline-none ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                  }`}
                >
                  <option value="">Select Branch</option>
                  {subjectData[0].branches.map((b) => (
                    <option key={b.branch} value={b.branch}>
                      {b.branch}
                    </option>
                  ))}
                </select>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className={`p-2 rounded-lg border focus:outline-none ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                  }`}
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      {toOrdinalSemester(sem)} Semester
                    </option>
                  ))}
                </select>
              </div>

              {/* Display Subjects */}
              {formData.branch && formData.semester && (
                <div className="mt-4">
                  <h4 className="text-xl font-bold">Subjects:</h4>
                  <ul className="list-disc pl-6">
                    {selectedSubjects().map((subject) => (
                      <li key={subject.id}>{subject.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={handleRegister}
                className={`mt-4 px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white w-full md:w-auto`}
              >
                Register Student
              </button>
            </div>
          )}
        </div>

        {/* Update Semester Section */}
        <div
          className={`mb-8 p-6 rounded-lg shadow-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setIsUpdateOpen(!isUpdateOpen)}
          >
            <h3 className="text-xl font-bold">Update Student Semester</h3>
            <span>{isUpdateOpen ? "▲" : "▼"}</span>
          </div>
          {isUpdateOpen && (
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="registration_no"
                  placeholder="Registration No"
                  value={updateData.registration_no}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      registration_no: e.target.value,
                    })
                  }
                  className={`p-2 rounded-lg border focus:outline-none ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                  }`}
                  required
                />
                <select
                  name="newSemester"
                  value={updateData.newSemester}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      newSemester: e.target.value,
                    })
                  }
                  className={`p-2 rounded-lg border focus:outline-none ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                  }`}
                >
                  <option value="">Select New Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      {toOrdinalSemester(sem)} Semester
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleUpdateSemester}
                className={`mt-4 px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-yellow-500 hover:bg-yellow-600"
                } text-white w-full md:w-auto`}
              >
                Update Semester
              </button>
            </div>
          )}
        </div>

        {/* Promote Students Section */}
        <div
          className={`mb-8 p-6 rounded-lg shadow-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setIsPromoteOpen(!isPromoteOpen)}
          >
            <h3 className="text-xl font-bold">Promote Students</h3>
            <span>{isPromoteOpen ? "▲" : "▼"}</span>
          </div>
          {isPromoteOpen && (
            <div className="mt-4">
              <div className="flex flex-col md:flex-row gap-4">
                <select
                  value={promotionSemester}
                  onChange={(e) => setPromotionSemester(e.target.value)}
                  className={`p-2 rounded-lg border focus:outline-none ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                  }`}
                >
                  <option value="">Select Semester to Promote</option>
                  {[1, 2, 3, 4, 5, 6, 7].map((sem) => (
                    <option key={sem} value={sem}>
                      {toOrdinalSemester(sem)} Semester
                    </option>
                  ))}
                </select>
                <button
                  onClick={handlePromote}
                  className={`px-4 py-2 rounded-lg ${
                    darkMode
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white w-full md:w-auto`}
                >
                  Promote Students
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
