import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import subjectsData from "../assets/subjectData";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { TrashIcon } from "@heroicons/react/24/outline";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [subject, setSubject] = useState("");

  const [branches, setBranches] = useState([]); // Initialize as empty array
  const [subjects, setSubjects] = useState([]); // Initialize as empty array
  const [userSubjects, setUserSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [addSubjectLoading, setAddSubjectLoading] = useState(false);
  const [fetchSubjectsLoading, setFetchSubjectsLoading] = useState(true);
  const [fetchStudentsLoading, setFetchStudentsLoading] = useState(false);
  const [removeSubjectLoading, setRemoveSubjectLoading] = useState(null);
  const [submitAttendanceLoading, setSubmitAttendanceLoading] = useState(false);
  const [selectedSubjectForAttendance, setSelectedSubjectForAttendance] =
    useState(null);
  const [previousTotalClasses, setPreviousTotalClasses] = useState(""); // Add this line

  const getOrdinalSuffix = (value) => {
    if (typeof value === "string" && /^\d+(st|nd|rd|th)$/.test(value)) {
      return value;
    }
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
      setFetchSubjectsLoading(false);
      return;
    }

    console.log(`Workspaceing subjects for user ID: ${user.id}`);
    setFetchSubjectsLoading(true);

    axios
      .get(
        `https://dce-attendance.onrender.com/api/dashboard/subjects/${user.id}`
      )
      .then((res) => {
        console.log("Fetched subjects:", res.data);
        setUserSubjects(res.data);
      })
      .catch((err) => {
        console.error(
          "Error fetching subjects:",
          err.response?.data || err.message
        );
        toast.error("No Subject Found");
      })
      .finally(() => setFetchSubjectsLoading(false));
  };

  useEffect(() => {
    if (semester) {
      const selectedSemester = subjectsData.find(
        (sem) => sem.semester === semester
      );
      setBranches(
        selectedSemester ? selectedSemester.branches.map((b) => b.branch) : []
      ); // Set to empty array if no semester is found
      setBranch(""); // Reset branch
      setSubjects([]); // Reset subjects
    } else {
      setBranches([]); // Reset branches if no semester is selected
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
      ); // Set to empty array if no branch is found
      setSubject(""); // Reset subject
    } else {
      setSubjects([]); // Reset subjects if no branch is selected
    }
  }, [branch, semester]);

  const handleAddSubject = async () => {
    if (!user || !user.id) {
      toast.error("User not authenticated. Please log in.");
      navigate("/login");
      return;
    }

    if (!semester || !branch || !subject) {
      toast.error("Please select semester, branch, and subject.");
      return;
    }

    setAddSubjectLoading(true);

    const ordinalSemester = getOrdinalSuffix(semester);

    const payload = {
      teacher_id: user.id,
      subject,
      semester: ordinalSemester,
      branch,
    };

    console.log("Sending Data:", payload);

    try {
      await axios.post(
        "https://dce-attendance.onrender.com/api/dashboard/add-subjects",
        payload
      );
      fetchUserSubjects();
      toast.success("Subject added successfully!");
      setSemester("");
      setBranch("");
      setSubject("");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      toast.error(
        "Error: " + (err.response?.data?.error || "Something went wrong")
      );
    } finally {
      setAddSubjectLoading(false);
    }
  };

  const fetchStudents = async (
    selectedSubject,
    selectedSemester,
    selectedBranch
  ) => {
    if (!selectedSubject || !selectedSemester || !selectedBranch) {
      toast.error("Invalid subject selection.");
      return;
    }

    const ordinalSemester = getOrdinalSuffix(selectedSemester);

    console.log("Fetching students for:", {
      selectedSubject,
      ordinalSemester,
      selectedBranch,
    });

    setFetchStudentsLoading(true);
    setStudents([]); // Reset to empty array
    setAttendance([]); // Reset to empty array
    setSelectedSubjectForAttendance(selectedSubject);

    try {
      const studentsRes = await axios.get(
        `https://dce-attendance.onrender.com/api/dashboard/students/${ordinalSemester}/${selectedBranch}`
      );
      const studentList = studentsRes.data;
      setStudents(studentList);

      try {
        const attendanceRes = await axios.get(
          `https://dce-attendance.onrender.com/api/dashboard/attendance/${ordinalSemester}/${selectedBranch}/${selectedSubject}`
        );
        const pastAttendance = attendanceRes.data;

        // Check if pastAttendance is valid
        if (!pastAttendance || pastAttendance.length === 0) {
          toast.error("No past attendance data found.");
          setPreviousTotalClasses(""); // Clear previous total classes
          setAttendance(
            studentList.map((student) => ({
              student_id: student.id,
              subject: selectedSubject,
              semester: ordinalSemester,
              branch: selectedBranch,
              total_classes: 0,
              attended_classes: 0,
            }))
          );
          return;
        }

        // Extract previous total classes if available
        setPreviousTotalClasses(pastAttendance[0].total_classes); // Assuming total classes is the same for all

        const updatedAttendance = studentList.map((student) => {
          const existingRecord = pastAttendance.find(
            (record) => record.student_id === student.id
          );

          return {
            student_id: student.id,
            subject: selectedSubject,
            semester: ordinalSemester,
            branch: selectedBranch,
            total_classes: existingRecord ? existingRecord.total_classes : 0,
            attended_classes: existingRecord
              ? existingRecord.attended_classes
              : 0,
          };
        });
        setAttendance(updatedAttendance);
      } catch (err) {
        console.error("Error fetching past attendance:", err);
        toast.error("Could not fetch past attendance.");
        setPreviousTotalClasses(""); // Clear if there's an error
        setAttendance(
          studentList.map((student) => ({
            student_id: student.id,
            subject: selectedSubject,
            semester: ordinalSemester,
            branch: selectedBranch,
            total_classes: 0,
            attended_classes: 0,
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      toast.error("No students found for this selection.");
    } finally {
      setFetchStudentsLoading(false);
    }
  };

  useEffect(() => {
    if (previousTotalClasses !== "") {
      setAttendance((prevAttendance) =>
        prevAttendance.map((entry) => ({
          ...entry,
          total_classes: Number(previousTotalClasses),
        }))
      );
    }
  }, [previousTotalClasses]);

  const handleTotalClassesChange = (value) => {
    if (!attendance) return; // Add check for undefined
    const numericValue = value === "" ? 0 : Math.max(0, Number(value)); // Ensure it's a number

    // Update previousTotalClasses
    setPreviousTotalClasses(numericValue);

    // Update attendance state
    setAttendance((prevAttendance) =>
      prevAttendance.map((entry) => ({
        ...entry,
        total_classes: numericValue, // Update total_classes for all entries
      }))
    );
  };

  const handleInputChange = (index, field, value) => {
    if (!attendance) return; // Add check for undefined
    setAttendance((prevAttendance) => {
      const updatedAttendance = [...prevAttendance];
      let numericValue = value === "" ? 0 : Math.max(0, Number(value)); // Ensure it's a number
      updatedAttendance[index][field] = numericValue;
      return updatedAttendance;
    });
  };

  const handleSubmit = async () => {
    if (!attendance || attendance.length === 0) {
      toast.error("No attendance data to submit.");
      return;
    }
    setSubmitAttendanceLoading(true);

    // Debugging: Log the attendance data being sent
    console.log("Submitting attendance data:", attendance);

    try {
      const response = await axios.post(
        "https://dce-attendance.onrender.com/api/dashboard/attendance/update",
        attendance
      );
      console.log("Backend response:", response.data); // Debugging
      toast.success("Attendance updated successfully!");
    } catch (err) {
      console.error("Error updating attendance:", err);
      toast.error("Error updating attendance.");
    } finally {
      setSubmitAttendanceLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedSubjectForAttendance) {
      setPreviousTotalClasses("");
    }
  }, [selectedSubjectForAttendance]);

  useEffect(() => {
    if (previousTotalClasses !== "") {
      setAttendance((prevAttendance) =>
        prevAttendance.map((entry) => ({
          ...entry,
          total_classes: Number(previousTotalClasses),
        }))
      );
    }
  }, [previousTotalClasses]);

  const handleRemoveSubject = async (
    subjectToRemove,
    semesterToRemove,
    branchToRemove
  ) => {
    if (
      !window.confirm(
        `Are you sure you want to remove ${subjectToRemove} (${semesterToRemove} - ${branchToRemove})?`
      )
    ) {
      return;
    }

    const ordinalSemester = getOrdinalSuffix(semesterToRemove);

    const payload = {
      teacher_id: user.id,
      subject: subjectToRemove,
      semester: ordinalSemester,
      branch: branchToRemove,
    };

    setRemoveSubjectLoading(subjectToRemove);

    try {
      await axios.delete(
        "https://dce-attendance.onrender.com/api/dashboard/remove-subject",
        {
          data: payload,
        }
      );
      toast.success("Subject removed successfully!");
      fetchUserSubjects();
      if (selectedSubjectForAttendance === subjectToRemove) {
        setStudents([]); // Reset to empty array
        setAttendance([]); // Reset to empty array
        setSelectedSubjectForAttendance(null);
      }
    } catch (err) {
      console.error(
        "Error removing subject:",
        err.response?.data || err.message
      );
      toast.error(
        "Error: " + (err.response?.data?.error || "Something went wrong")
      );
    } finally {
      setRemoveSubjectLoading(null);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } transition duration-300 pt-24 p-4`}
    >
      <div
        className={`w-full max-w-6xl p-6 md:p-8 rounded-xl shadow-2xl border ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } transition duration-300`}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
          Welcome, {user?.name}
        </h2>

        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6 md:mb-8">
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className={`w-full md:w-1/4 px-3 py-2 rounded-lg border focus:outline-none ${
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
            className={`w-full md:w-1/4 px-3 py-2 rounded-lg border focus:outline-none ${
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
            className={`w-full md:w-1/4 px-3 py-2 rounded-lg border focus:outline-none ${
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
            disabled={!semester || !branch || !subject || addSubjectLoading}
            className={`w-full md:w-auto px-4 py-2 rounded-lg transition duration-300 focus:outline-none shadow-md ${
              semester && branch && subject
                ? darkMode
                  ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                  : "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                : "bg-gray-400 cursor-not-allowed text-gray-700"
            }`}
          >
            {addSubjectLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
            ) : (
              "Add Subject"
            )}
          </button>
        </div>

        <div className="mb-6 md:mb-8">
          <h3 className="text-xl md:text-2xl font-bold mb-4">Your Subjects</h3>
          {fetchSubjectsLoading ? (
            <div className="flex justify-center">
              <Loader size="h-8 w-8" color="text-blue-500" />
            </div>
          ) : userSubjects && userSubjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userSubjects.map((sub, index) => (
                <div
                  key={index}
                  className={`p-3 md:p-4 rounded-lg w-full flex justify-between items-center transition duration-300 ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
                >
                  <button
                    onClick={() =>
                      fetchStudents(sub.subject, sub.semester, sub.branch)
                    }
                    className="text-left flex-grow cursor-pointer"
                    disabled={fetchStudentsLoading}
                  >
                    <p className="font-medium text-sm md:text-base">
                      {sub.subject} ({sub.semester} Semester - {sub.branch})
                      {fetchStudentsLoading && (
                        <span className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></span>
                      )}
                    </p>
                  </button>
                  <button
                    onClick={() =>
                      handleRemoveSubject(sub.subject, sub.semester, sub.branch)
                    }
                    className={`ml-2 md:ml-4 p-1 rounded-full transition duration-300 focus:outline-none cursor-pointer ${
                      darkMode
                        ? "text-red-400 hover:bg-red-500 hover:text-white"
                        : "text-red-500 hover:bg-red-500 hover:text-white"
                    }`}
                    disabled={removeSubjectLoading === sub.subject}
                  >
                    {removeSubjectLoading === sub.subject ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                    ) : (
                      <TrashIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No subjects added yet.</p>
          )}
        </div>

        {students && students.length > 0 && (
          <div className="mt-4 md:mt-6 w-full">
            <h3 className="text-xl md:text-2xl font-bold mb-4">
              {selectedSubjectForAttendance}
            </h3>

            <div className="mb-4">
              <label
                htmlFor="total-classes"
                className="block font-semibold mb-1"
              >
                Total Classes for this Subject
              </label>
              <input
                type="text" // Changed from "number" to "text"
                id="total-classes"
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                }`}
                placeholder="Enter total classes"
                value={previousTotalClasses} // Bind the value to previousTotalClasses
                onChange={(e) => {
                  const value = e.target.value;
                  // Ensure the value is a valid number
                  if (/^\d*$/.test(value)) {
                    // Only allow numeric input
                    console.log("onChange:", value); // Debugging
                    handleTotalClassesChange(value); // Update both states
                  }
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                  // Ensure the value is a valid number
                  if (/^\d*$/.test(value)) {
                    // Only allow numeric input
                    console.log("onBlur:", value); // Debugging
                    handleTotalClassesChange(value); // Update both states
                  }
                }}
              />
            </div>

            <div className="overflow-x-auto">
              <table
                className={`border-collapse w-full ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <thead>
                  <tr className={darkMode ? "bg-gray-700" : "bg-gray-200"}>
                    <th className="border px-2 py-2 md:px-4 md:py-2 text-left">
                      Reg ID
                    </th>
                    <th className="border px-2 py-2 md:px-4 md:py-2 text-left">
                      Name
                    </th>
                    <th className="border px-2 py-2 md:px-4 md:py-2 text-left">
                      Attended Classes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students
                    .sort((a, b) =>
                      a.registration_no.localeCompare(b.registration_no)
                    )
                    .map((student, index) => (
                      <tr
                        key={student.id}
                        className={darkMode ? "bg-gray-800" : "bg-white"}
                      >
                        <td className="border px-2 py-2 md:px-4 md:py-2">
                          {student.registration_no}
                        </td>
                        <td className="border px-2 py-2 md:px-4 md:py-2">
                          {student.name}
                        </td>
                        <td className="border px-2 py-2 md:px-4 md:py-2">
                          <input
                            type="text"
                            value={attendance[index]?.attended_classes || 0}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*$/.test(value)) {
                                handleInputChange(
                                  index,
                                  "attended_classes",
                                  value
                                );
                              }
                            }}
                            className={`w-full text-center px-1 py-0.5 rounded border focus:outline-none ${
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
            </div>
            <button
              onClick={handleSubmit}
              className={`mt-4 px-4 py-2  cursor-pointer ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              disabled={submitAttendanceLoading || attendance.length === 0}
            >
              {submitAttendanceLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
              ) : (
                "Submit Attendance"
              )}
            </button>
          </div>
        )}

        {students &&
          students.length === 0 &&
          userSubjects.length > 0 &&
          !fetchStudentsLoading && (
            <p className="mt-6 text-gray-600 dark:text-gray-400">
              Click on a subject to view and manage attendance.
            </p>
          )}
      </div>
    </div>
  );
};

export default Dashboard;
