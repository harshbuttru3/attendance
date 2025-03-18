import React, { useState, useContext } from "react"; // Import React
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import toast from "react-hot-toast";

const StudentAttendance = () => {
  const { darkMode } = useContext(ThemeContext); // Access dark mode state
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [attendanceData, setAttendanceData] = useState({});
  const [summaryData, setSummaryData] = useState({});
  const [expandedSubject, setExpandedSubject] = useState(null); // Track expanded subject
  const [showSummary, setShowSummary] = useState(false); // Track summary dropdown state
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  //format semester
  const formatSemester = (sem) => {
    if (sem === "1") return "1st";
    if (sem === "2") return "2nd";
    if (sem === "3") return "3rd";
    if (sem === "4") return "4th";
    if (sem === "5") return "5th";
    if (sem === "6") return "6th";
    if (sem === "7") return "7th";
    if (sem === "8") return "8th";
    return sem; // 4th, 5th, 6th, 7th, 8th
  };

  const fetchAttendance = () => {
    if (semester && branch) {
      setIsLoading(true); // Set loading to true
      // Clear previous data before fetching
      setAttendanceData({});
      setSummaryData({});
      const formattedSemester = formatSemester(semester);

      axios
        .get(
          `https://dce-attendance.onrender.com/api/student-attendance/${formattedSemester}/${branch}`
        )
        .then((res) => {
          setIsLoading(false); // Set loading to false
          console.log("Raw API Response:", res.data); // Debugging Step

          // Filter out null, undefined, or invalid subjects
          const filteredData = Object.keys(res.data || {}).reduce(
            (acc, subject) => {
              if (
                subject &&
                subject !== "null" &&
                res.data[subject] &&
                Array.isArray(res.data[subject])
              ) {
                acc[subject] = res.data[subject];
              }
              return acc;
            },
            {}
          );

          if (Object.keys(filteredData).length > 0) {
            setAttendanceData(filteredData);
            setSummaryData(calculateSummary(filteredData));
          } else {
            toast.error(
              "No valid attendance records found for the selected semester and branch."
            );
          }
        })
        .catch((err) => {
          setIsLoading(false); // Set loading to false
          console.error("Error fetching attendance:", err);
          toast.error("No attendance records found.");
        });
    } else {
      toast.error("Please select both semester and branch.");
    }
  };

  const calculateSummary = (data) => {
    let summary = {};
    Object.keys(data).forEach((subject) => {
      data[subject].forEach((student) => {
        if (!summary[student.registration_no]) {
          summary[student.registration_no] = {
            name: student.name,
            total_classes: 0,
            attended_classes: 0,
            subjects: {}, // Store subject-wise data
          };
        }
        summary[student.registration_no].total_classes += student.total_classes;
        summary[student.registration_no].attended_classes +=
          student.attended_classes;
        summary[student.registration_no].subjects[subject] = {
          total_classes: student.total_classes,
          attended_classes: student.attended_classes,
        };
      });
    });
    return summary;
  };

  const toggleSubject = (subject) => {
    setExpandedSubject(expandedSubject === subject ? null : subject);
  };

  const toggleSummary = () => {
    setShowSummary(!showSummary);
  };

  // CSV download button for specific subject or summary
  const exportToCSV = (dataType, subject = null) => {
    let csvContent = "data:text/csv;charset=utf-8,";

    if (dataType === "subject" && subject) {
      // Export specific subject data
      const subjectData = attendanceData[subject];
      if (!subjectData || subjectData.length === 0) {
        toast.error("No attendance data to export for this subject.");
        return;
      }

      // Headers
      csvContent +=
        "Subject,Registration No,Name,Total Classes,Attended Classes,Attendance %,Low Attendance\n";

      // Data rows
      subjectData.forEach((student) => {
        const attendancePercentage =
          student.total_classes > 0
            ? (student.attended_classes / student.total_classes) * 100
            : 0;
        const isLowAttendance = attendancePercentage < 75 ? "Yes" : "No";

        csvContent += `${subject},${student.registration_no},${student.name},${
          student.total_classes
        },${student.attended_classes},${attendancePercentage.toFixed(
          2
        )}%,${isLowAttendance}\n`;
      });
    } else if (dataType === "summary") {
      // Export summary data
      if (Object.keys(summaryData).length === 0) {
        toast.error("No summary data to export.");
        return;
      }

      // Headers
      csvContent += "Registration No,Name,";
      Object.keys(attendanceData).forEach((subject) => {
        csvContent += `${subject} Total Classes,${subject} Attended Classes,`;
      });
      csvContent +=
        "Total Classes,Attended Classes,Attendance %,Low Attendance\n";

      // Data rows
      Object.keys(summaryData).forEach((regId) => {
        const student = summaryData[regId];
        csvContent += `${regId},${student.name},`;
        Object.keys(attendanceData).forEach((subject) => {
          const subjectData = student.subjects[subject] || {
            total_classes: 0,
            attended_classes: 0,
          };
          csvContent += `${subjectData.total_classes},${subjectData.attended_classes},`;
        });
        const attendancePercentage =
          student.total_classes > 0
            ? (student.attended_classes / student.total_classes) * 100
            : 0;
        const isLowAttendance = attendancePercentage < 75 ? "Yes" : "No";
        csvContent += `${student.total_classes},${
          student.attended_classes
        },${attendancePercentage.toFixed(2)}%,${isLowAttendance}\n`;
      });
    } else {
      toast.error("Invalid export request.");
      return;
    }

    // Create a link and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      dataType === "subject"
        ? `Attendance_${subject}.csv`
        : `Attendance_Summary.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`min-h-screen p-4 md:p-6 lg:p-8 ${
        // Increased padding for larger screens
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-4 md:mb-6 lg:mb-8">
        DCE Attendance System
      </h1>
      <h2 className="text-2xl font-bold mb-4 md:mb-6 lg:mb-8">
        Check Attendance
      </h2>

      {/* Dropdowns for Semester and Branch */}
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6 md:mb-8 lg:mb-10">
        <select
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
          onChange={(e) => setBranch(e.target.value)}
          className={`w-full md:w-1/4 px-4 py-2 rounded-lg border focus:outline-none ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-gray-900 border-gray-300"
          }`}
        >
          <option value="">-- Select Branch --</option>
          {["CSE", "FTS", "EEE", "Cybersecurity", "Civil", "Mechanical"].map(
            (br) => (
              <option key={br} value={br}>
                {br}
              </option>
            )
          )}
        </select>

        <button
          onClick={fetchAttendance}
          disabled={!semester || !branch || isLoading}
          className={`cursor-pointer w-full md:w-auto px-4 py-2 rounded-lg transition duration-300 focus:outline-none shadow-md flex items-center justify-center ${
            semester && branch && !isLoading
              ? darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-400 cursor-not-allowed text-gray-700"
          }`}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            "View Attendance"
          )}
        </button>
      </div>

      {/* Attendance Data */}
      <div>
        {isLoading ? (
          <div
            className={`p-6 rounded-lg text-center ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <p className="text-lg">Loading attendance data...</p>
          </div>
        ) : Object.keys(attendanceData).length > 0 ? (
          <>
            {Object.keys(attendanceData)
              .filter((subject) => subject && subject !== "null") // Remove null values
              .map((subject, index) => (
                <div key={index} className="mb-6 md:mb-8">
                  {/* Subject Title with Toggle Button */}
                  <div
                    className={`cursor-pointer p-4 rounded-lg flex justify-between items-center transition duration-300 ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    onClick={() => toggleSubject(subject)}
                  >
                    <h3 className="text-xl font-bold">Subject: {subject}</h3>
                    <span className="text-lg">
                      {expandedSubject === subject ? "▲" : "▼"}
                    </span>
                  </div>

                  {/* Expanded Table */}
                  {expandedSubject === subject && (
                    <div className="overflow-x-auto mt-2">
                      <table
                        className={`w-full border-collapse rounded-lg overflow-hidden ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        <thead>
                          <tr
                            className={darkMode ? "bg-gray-700" : "bg-gray-200"}
                          >
                            <th className="border px-4 py-2 text-left">
                              Reg ID
                            </th>
                            <th className="border px-4 py-2 text-left">Name</th>
                            <th className="border px-4 py-2 text-left">
                              Total Classes
                            </th>
                            <th className="border px-4 py-2 text-left">
                              Attended Classes
                            </th>
                            <th className="border px-4 py-2 text-left">
                              Attendance %
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendanceData[subject]
                            .sort((a, b) =>
                              a.registration_no.localeCompare(b.registration_no)
                            )
                            .map((student, idx) => {
                              const attendancePercentage =
                                student.total_classes > 0
                                  ? (student.attended_classes /
                                      student.total_classes) *
                                    100
                                  : 0;
                              return (
                                <tr
                                  key={idx}
                                  className={
                                    darkMode ? "bg-gray-800" : "bg-white"
                                  }
                                  style={{
                                    backgroundColor:
                                      attendancePercentage < 75
                                        ? darkMode
                                          ? "rgba(239, 68, 68, 0.2)" // Dark mode red
                                          : "rgba(239, 68, 68, 0.1)" // Light mode red
                                        : "transparent",
                                  }}
                                >
                                  <td className="border px-4 py-2">
                                    {student.registration_no}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {student.name}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {student.total_classes}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {student.attended_classes}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {attendancePercentage.toFixed(2)}%
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>

                      {/* Export Button for Subject */}
                      <button
                        onClick={() => exportToCSV("subject", subject)}
                        className={`cursor-pointer mt-4 px-4 py-2 rounded-lg transition duration-300 focus:outline-none shadow-md ${
                          darkMode
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        Export {subject} to CSV
                      </button>
                    </div>
                  )}
                </div>
              ))}

            {/* Summary Dropdown */}
            <div className="mb-6 md:mb-8">
              <div
                className={`cursor-pointer p-4 rounded-lg flex justify-between items-center transition duration-300 ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={toggleSummary}
              >
                <h3 className="text-xl font-bold">Summary</h3>
                <span className="text-lg">{showSummary ? "▲" : "▼"}</span>
              </div>

              {/* Expanded Summary Table */}
              {showSummary && (
                <div className="overflow-x-auto mt-2">
                  <table
                    className={`w-full border-collapse rounded-lg overflow-hidden ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <thead>
                      <tr className={darkMode ? "bg-gray-700" : "bg-gray-200"}>
                        <th className="border px-4 py-2 text-left">Reg ID</th>
                        <th className="border px-4 py-2 text-left">Name</th>
                        {Object.keys(attendanceData).map((subject) => (
                          <React.Fragment key={subject}>
                            <th className="border px-4 py-2 text-left">
                              {subject} Total Classes
                            </th>
                            <th className="border px-4 py-2 text-left">
                              {subject} Attended Classes
                            </th>
                          </React.Fragment>
                        ))}
                        <th className="border px-4 py-2 text-left">
                          Total Classes
                        </th>
                        <th className="border px-4 py-2 text-left">
                          Attended Classes
                        </th>
                        <th className="border px-4 py-2 text-left">
                          Attendance %
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(summaryData)
                        .sort((a, b) => a.localeCompare(b))
                        .map((regId) => {
                          const student = summaryData[regId];
                          const attendancePercentage =
                            student.total_classes > 0
                              ? (student.attended_classes /
                                  student.total_classes) *
                                100
                              : 0;
                          return (
                            <tr
                              key={regId}
                              className={darkMode ? "bg-gray-800" : "bg-white"}
                              style={{
                                backgroundColor:
                                  attendancePercentage < 75
                                    ? darkMode
                                      ? "rgba(239, 68, 68, 0.2)" // Dark mode red
                                      : "rgba(239, 68, 68, 0.1)" // Light mode red
                                    : "transparent",
                              }}
                            >
                              <td className="border px-4 py-2">{regId}</td>
                              <td className="border px-4 py-2">
                                {student.name}
                              </td>
                              {Object.keys(attendanceData).map((subject) => {
                                const subjectData = student.subjects[
                                  subject
                                ] || {
                                  total_classes: 0,
                                  attended_classes: 0,
                                };
                                return (
                                  <React.Fragment key={subject}>
                                    <td className="border px-4 py-2">
                                      {subjectData.total_classes}
                                    </td>
                                    <td className="border px-4 py-2">
                                      {subjectData.attended_classes}
                                    </td>
                                  </React.Fragment>
                                );
                              })}
                              <td className="border px-4 py-2">
                                {student.total_classes}
                              </td>
                              <td className="border px-4 py-2">
                                {student.attended_classes}
                              </td>
                              <td className="border px-4 py-2">
                                {attendancePercentage.toFixed(2)}%
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>

                  {/* Export Button for Summary */}
                  <button
                    onClick={() => exportToCSV("summary")}
                    className={`cursor-pointer mt-4 px-4 py-2 rounded-lg transition duration-300 focus:outline-none shadow-md ${
                      darkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    Export Summary to CSV
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div
            className={`p-6 rounded-lg text-center ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <p className="text-lg">
              No attendance records found. Select a semester and branch to view
              attendance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAttendance;
