import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import subjectsData from "../assets/subjectData";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [subject, setSubject] = useState("");

  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [userSubjects, setUserSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper function to convert numeric values to ordinal strings (e.g., 8 -> "8th")
  const getOrdinalSuffix = (value) => {
    // If the value is already an ordinal string (e.g., "3rd"), return it as-is
    if (typeof value === "string" && /^\d+(st|nd|rd|th)$/.test(value)) {
      return value;
    }

    // If the value is numeric, convert it to an ordinal string
    const number = parseInt(value);
    const suffixes = ["th", "st", "nd", "rd"];
    const remainder = number % 100;
    return `${number}${
      suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]
    }`;
  };

  useEffect(() => {
    if (!user) {
      console.log("User ID is missing, redirecting to login page.");
      navigate("/login");
    } else {
      fetchUserSubjects();
    }
  }, [user, navigate]);

  const fetchUserSubjects = () => {
    if (!user?.id) {
      console.error("User ID is undefined, cannot fetch subjects.");
      return;
    }

    console.log(`Fetching subjects for user ID: ${user.id}`);

    axios
      .get(`https://dce-attendance.onrender.com/api/dashboard/subjects/${user.id}`)
      .then((res) => {
        console.log("Fetched subjects:", res.data);
        setUserSubjects(res.data);
      })
      .catch((err) =>
        console.error(
          "Error fetching subjects:",
          err.response?.data || err.message
        )
      );
  };

  useEffect(() => {
    if (semester) {
      const selectedSemester = subjectsData.find(
        (sem) => sem.semester === semester
      );
      setBranches(
        selectedSemester ? selectedSemester.branches.map((b) => b.branch) : []
      );
      setBranch("");
      setSubjects([]);
    }
  }, [semester]);

  useEffect(() => {
    if (semester && branch) {
      const selectedSemester = subjectsData.find(
        (sem) => sem.semester === semester
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

  const handleAddSubject = () => {
    if (!user || !user.id) {
      alert("User not authenticated. Please log in.");
      navigate("/login");
      return;
    }

    if (!semester || !branch || !subject) {
      alert("Please select semester, branch, and subject.");
      return;
    }

    setLoading(true);

    // Convert semester to ordinal string if necessary
    const ordinalSemester = getOrdinalSuffix(semester);

    const payload = {
      teacher_id: user.id, // Ensure this is correctly set
      subject,
      semester: ordinalSemester, // Send semester as "1st", "2nd", etc.
      branch,
    };

    console.log("Sending Data:", payload);

    axios
      .post("https://dce-attendance.onrender.com/api/dashboard/add-subjects", payload)
      .then(() => {
        fetchUserSubjects();
        alert("Subject added successfully!");
      })
      .catch((err) => {
        console.error("Error:", err.response?.data || err.message);
        alert(
          "Error: " + (err.response?.data?.error || "Something went wrong")
        );
      })
      .finally(() => setLoading(false));
  };

  const fetchStudents = (selectedSubject, selectedSemester, selectedBranch) => {
    if (!selectedSubject || !selectedSemester || !selectedBranch) {
      alert("Invalid subject selection.");
      return;
    }

    // Convert semester to ordinal string if necessary
    const ordinalSemester = getOrdinalSuffix(selectedSemester);

    console.log("Fetching students for:", {
      selectedSubject,
      ordinalSemester,
      selectedBranch,
    });

    // Fetch students for the selected semester & branch
    axios
      .get(
        `https://dce-attendance.onrender.com/api/dashboard/students/${ordinalSemester}/${selectedBranch}`
      )
      .then((res) => {
        const studentList = res.data;
        setStudents(studentList);

        // Fetch past attendance records for the selected subject
        axios
          .get(
            `https://dce-attendance.onrender.com/api/dashboard/attendance/${ordinalSemester}/${selectedBranch}/${selectedSubject}`
          )
          .then((attendanceRes) => {
            const pastAttendance = attendanceRes.data;

            // Map past attendance to students, if records exist
            const updatedAttendance = studentList.map((student) => {
              const existingRecord = pastAttendance.find(
                (record) => record.student_id === student.id
              );

              return {
                student_id: student.id,
                subject: selectedSubject,
                semester: ordinalSemester, // Use "1st", "2nd", etc.
                branch: selectedBranch,
                total_classes: existingRecord
                  ? existingRecord.total_classes
                  : 0,
                attended_classes: existingRecord
                  ? existingRecord.attended_classes
                  : 0,
              };
            });

            setAttendance(updatedAttendance);
          })
          .catch((err) => {
            console.error("Error fetching past attendance:", err);
            alert("Could not fetch past attendance.");

            // If no past attendance, initialize fresh records
            setAttendance(
              studentList.map((student) => ({
                student_id: student.id,
                subject: selectedSubject,
                semester: ordinalSemester, // Use "1st", "2nd", etc.
                branch: selectedBranch,
                total_classes: 0,
                attended_classes: 0,
              }))
            );
          });
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        alert("No students found for this selection.");
      });
  };

  const handleTotalClassesChange = (value) => {
    setAttendance((prevAttendance) =>
      prevAttendance.map((entry) => ({
        ...entry,
        total_classes: value === "" ? "" : Math.max(0, Number(value)),
      }))
    );
  };

  const handleInputChange = (index, field, value) => {
    setAttendance((prevAttendance) => {
      const updatedAttendance = [...prevAttendance];
      let numericValue = value === "" ? "" : Math.max(0, Number(value));
      updatedAttendance[index][field] = numericValue;
      return updatedAttendance;
    });
  };

  const handleSubmit = () => {
    axios
      .post("https://dce-attendance.onrender.com/api/dashboard/attendance/update", attendance)
      .then(() => alert("Attendance updated successfully!"))
      .catch((err) => console.error("Error updating attendance:", err));
  };

  const handleRemoveSubject = (subject, semester, branch) => {
    if (
      !window.confirm(
        `Are you sure you want to remove ${subject} (${semester} - ${branch})?`
      )
    ) {
      return;
    }

    // Convert semester to ordinal string if necessary
    const ordinalSemester = getOrdinalSuffix(semester);

    const payload = {
      teacher_id: user.id,
      subject,
      semester: ordinalSemester, // Use "1st", "2nd", etc.
      branch,
    };

    axios
      .delete("https://dce-attendance.onrender.com/api/dashboard/remove-subject", {
        data: payload,
      })
      .then(() => {
        alert("Subject removed successfully!");
        window.location.reload();
        fetchUserSubjects(); // Refresh subject list
      })
      .catch((err) => {
        console.error(
          "Error removing subject:",
          err.response?.data || err.message
        );
        alert(
          "Error: " + (err.response?.data?.error || "Something went wrong")
        );
      });
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } transition duration-300 p-4`}
    >
      <div
        className={`w-full max-w-6xl p-8 rounded-xl shadow-2xl border ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } transition duration-300`}
      >
        <h2 className="text-3xl font-bold mb-8">Welcome, {user?.name}</h2>

        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
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
            {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map(
              (sem) => (
                <option key={sem} value={sem}>
                  {sem} Semester
                </option>
              )
            )}
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

          <button
            onClick={handleAddSubject}
            disabled={!semester || !branch || !subject || loading}
            className={`w-full md:w-auto px-4 py-2 rounded-lg transition duration-300 focus:outline-none shadow-md ${
              semester && branch && subject
                ? darkMode
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-400 cursor-not-allowed text-gray-700"
            }`}
          >
            {loading ? "Adding..." : "Add Subject"}
          </button>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Your Subjects</h3>
          {userSubjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userSubjects.map((sub, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg w-full flex justify-between items-center transition duration-300 ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
                >
                  <button
                    onClick={() =>
                      fetchStudents(sub.subject, sub.semester, sub.branch)
                    }
                    className="text-left flex-grow"
                  >
                    <p className="font-medium">
                      {sub.subject} ({sub.semester} Semester - {sub.branch})
                    </p>
                  </button>
                  <button
                    onClick={() =>
                      handleRemoveSubject(sub.subject, sub.semester, sub.branch)
                    }
                    className={`ml-4 p-1 rounded-full transition duration-300 ${
                      darkMode
                        ? "text-red-400 hover:bg-red-500 hover:text-white"
                        : "text-red-500 hover:bg-red-500 hover:text-white"
                    }`}
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No subjects added yet.</p>
          )}
        </div>

        {students.length > 0 && (
          <div className="mt-6 w-full">
            <h3 className="text-2xl font-bold mb-4">
              {attendance[0]?.subject}
            </h3>
            <table
              className={`border-collapse w-full ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <thead>
                <tr className={darkMode ? "bg-gray-700" : "bg-gray-200"}>
                  <th className="border px-4 py-2">Reg ID</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Total Classes</th>
                  <th className="border px-4 py-2">Attended Classes</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((entry, index) => (
                  <tr
                    key={entry.student_id}
                    className={darkMode ? "bg-gray-800" : "bg-white"}
                  >
                    <td className="border px-4 py-2">
                      {students[index]?.registration_no}
                    </td>
                    <td className="border px-4 py-2">
                      {students[index]?.name}
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="number"
                        value={entry.total_classes}
                        onChange={(e) =>
                          handleTotalClassesChange(e.target.value)
                        }
                        className={`w-full text-center ${
                          darkMode
                            ? "bg-gray-700 text-white border-gray-600"
                            : "bg-white text-gray-900 border-gray-300"
                        }`}
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="number"
                        value={entry.attended_classes}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "attended_classes",
                            e.target.value
                          )
                        }
                        className={`w-full text-center ${
                          darkMode
                            ? "bg-gray-700 text-white border-gray-600"
                            : "bg-white text-gray-900 border-gray-300"
                        }`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={handleSubmit}
              className={`mt-4 px-4 py-2 rounded ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Submit Attendance
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
