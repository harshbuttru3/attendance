import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import subjectsData from "../assets/subjectData"; // Import the subjects data

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  // State for dropdown selections
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [subject, setSubject] = useState("");

  // State for dropdown options
  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // State for user's subjects
  const [userSubjects, setUserSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Update branches when semester changes
  useEffect(() => {
    if (semester) {
      const selectedSemester = subjectsData.find(
        (sem) => sem.semester === parseInt(semester)
      );
      setBranches(
        selectedSemester ? selectedSemester.branches.map((b) => b.branch) : []
      );
      setBranch("");
      setSubjects([]);
    }
  }, [semester]);

  // Update subjects when branch changes
  useEffect(() => {
    if (semester && branch) {
      const selectedSemester = subjectsData.find(
        (sem) => sem.semester === parseInt(semester)
      );
      const selectedBranch = selectedSemester?.branches.find(
        (b) => b.branch === branch
      );
      setSubjects(
        selectedBranch ? selectedBranch.subjects.map((sub) => sub.name) : []
      );
      setSubject("");
    }
  }, [branch, semester]);

  // Handle adding a subject
  const handleAddSubject = () => {
    if (semester && branch && subject) {
      setLoading(true);
      setTimeout(() => {
        setUserSubjects((prev) => [...prev, subject]); // Add subject to user's list
        setLoading(false);
      }, 1000);
    } else {
      alert("Please select semester, branch, and subject.");
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } transition duration-300 p-4`}
    >
      <div
        className={`w-full max-w-6xl bg-white ${
          darkMode ? "dark:bg-gray-800" : ""
        } p-8 rounded-xl shadow-2xl border ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } transition duration-300`}
      >
        <h2 className="text-3xl font-bold mb-8">Welcome, {user?.name}</h2>

        {/* Dropdowns */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
          {/* Semester Dropdown */}
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className={`w-full md:w-1/4 px-4 py-2 rounded-lg border focus:outline-none ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-gray-900 border-gray-300"
            }`}
          >
            <option value="">-- Select Semester --</option>
            {subjectsData.map((sem) => (
              <option key={sem.semester} value={sem.semester}>
                Semester {sem.semester}
              </option>
            ))}
          </select>

          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className={`w-full md:w-1/4 px-4 py-2 rounded-lg border focus:outline-none ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-gray-900 border-gray-300"
            }`}
            disabled={!semester}
          >
            <option value="">-- Select Branch --</option>
            {branches.map((br) => (
              <option key={br} value={br}>
                {br}
              </option>
            ))}
          </select>

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={`w-full md:w-1/4 px-4 py-2 rounded-lg border focus:outline-none ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-gray-900 border-gray-300"
            }`}
            disabled={!branch}
          >
            <option value="">-- Select Subject --</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>

          {/* Add Subject Button */}
          <button
            onClick={handleAddSubject}
            disabled={!semester || !branch || !subject || loading}
            className={`w-full md:w-auto px-4 py-2 ${
              semester && branch && subject
                ? darkMode
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            } text-white rounded-lg transition duration-300 focus:outline-none shadow-md`}
          >
            {loading ? "Adding..." : "Add Subject"}
          </button>
        </div>

        {/* User's Subjects */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Your Subjects</h3>
          {loading ? (
            <p>Loading...</p>
          ) : userSubjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userSubjects.map((sub, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  } transition duration-300`}
                >
                  <p className="font-medium">{sub}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No subjects added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
