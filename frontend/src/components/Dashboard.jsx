import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  // State for dropdowns
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [subject, setSubject] = useState("");

  // State for user's subjects and fetched subjects
  const [userSubjects, setUserSubjects] = useState([]);
  const [fetchedSubjects, setFetchedSubjects] = useState([]);

  // State for loading
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch user's subjects (dummy data for now)
  const fetchUserSubjects = () => {
    setLoading(true);
    // Replace with actual API call
    setTimeout(() => {
      setUserSubjects(["Mathematics", "Physics", "Chemistry"]); // Dummy data
      setLoading(false);
    }, 1000);
  };

  // Fetch all subjects (dummy data for now)
  const fetchAllSubjects = () => {
    setLoading(true);
    // Replace with actual API call
    setTimeout(() => {
      setFetchedSubjects(["Biology", "Computer Science", "English"]); // Dummy data
      setLoading(false);
    }, 1000);
  };

  // Handle adding a subject (dummy function for now)
  const handleAddSubject = () => {
    if (year && branch && subject) {
      setLoading(true);
      // Replace with actual API call
      setTimeout(() => {
        setUserSubjects((prev) => [...prev, subject]); // Add subject to user's list
        setLoading(false);
      }, 1000);
    } else {
      alert("Please select year, branch, and subject.");
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
        {/* Welcome Message */}
        <h2 className="text-3xl font-bold mb-8">Welcome, {user?.name}</h2>

        {/* Dropdowns and Add Subject Button */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
          {/* Year Dropdown */}
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={`w-full md:w-1/4 px-4 py-2 rounded-lg border ${
              darkMode
                ? "border-gray-600 bg-gray-700 text-white"
                : "border-gray-300 bg-white"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
          >
            <option value="">-- Select Year --</option>
            {["1st", "2nd", "3rd", "4th"].map((yr) => (
              <option key={yr} value={yr}>
                {yr} Year
              </option>
            ))}
          </select>

          {/* Branch Dropdown */}
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className={`w-full md:w-1/4 px-4 py-2 rounded-lg border ${
              darkMode
                ? "border-gray-600 bg-gray-700 text-white"
                : "border-gray-300 bg-white"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
          >
            <option value="">-- Select Branch --</option>
            {["CSE", "Civil", "EEE", "Cybersecurity", "Mechanical", "FTS"].map(
              (br) => (
                <option key={br} value={br}>
                  {br}
                </option>
              )
            )}
          </select>

          {/* Subject Dropdown */}
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={`w-full md:w-1/4 px-4 py-2 rounded-lg border ${
              darkMode
                ? "border-gray-600 bg-gray-700 text-white"
                : "border-gray-300 bg-white"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
          >
            <option value="">-- Select Subject --</option>
            {[
              "Mathematics",
              "Physics",
              "Chemistry",
              "Biology",
              "Computer Science",
              "English",
            ].map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>

          {/* Add Subject Button */}
          <button
            onClick={handleAddSubject}
            disabled={!year || !branch || !subject || loading}
            className={`w-full md:w-auto px-4 py-2 ${
              year && branch && subject
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

        {/* Fetched Subjects */}
        <div>
          <h3 className="text-2xl font-bold mb-4">All Subjects</h3>
          {loading ? (
            <p>Loading...</p>
          ) : fetchedSubjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fetchedSubjects.map((sub, index) => (
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
            <p>No subjects found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
