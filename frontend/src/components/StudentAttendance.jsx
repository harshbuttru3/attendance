import { useState, useContext } from "react";
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

  const fetchAttendance = () => {
    if (semester && branch) {
      axios
        .get(
          `http://localhost:5000/api/student-attendance/${semester}/${branch}`
        )
        .then((res) => {
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
            setAttendanceData({});
            setSummaryData({});
            toast.error(
              "No valid attendance records found for the selected semester and branch."
            );
          }
        })
        .catch((err) => {
          console.error("Error fetching attendance:", err);
          toast.error("No attendance records found.");
        });
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
          };
        }
        summary[student.registration_no].total_classes += student.total_classes;
        summary[student.registration_no].attended_classes +=
          student.attended_classes;
      });
    });
    return summary;
  };

  const toggleSubject = (subject) => {
    setExpandedSubject(expandedSubject === subject ? null : subject);
  };

  //csv download button 
  const exportToCSV = () => {
    if (Object.keys(attendanceData).length === 0) {
      alert("No attendance data to export.");
      return;
    }
  
    let csvContent = "data:text/csv;charset=utf-8,";
  
    // Headers
    csvContent += "Subject,Registration No,Name,Total Classes,Attended Classes,Attendance %\n";
  
    // Data rows
    Object.keys(attendanceData).forEach((subject) => {
      attendanceData[subject].forEach((student) => {
        const attendancePercentage =
          student.total_classes > 0
            ? (student.attended_classes / student.total_classes) * 100
            : 0;
  
        csvContent += `${subject},${student.registration_no},${student.name},${student.total_classes},${student.attended_classes},${attendancePercentage.toFixed(2)}%\n`;
      });
    });
  
    // Create a link and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Attendance_Sem${semester}_Branch_${branch}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  



  return (
    <div
      className={`min-h-screen p-4 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-4">DCE Attendance System</h1>
      <h2 className="text-2xl font-bold mb-4">Check Attendance</h2>

      {/* Dropdowns for Semester and Branch */}
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
        <select
          onChange={(e) => setSemester(e.target.value)}
          className={`w-full md:w-1/4 px-4 py-2 rounded-lg border focus:outline-none ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-gray-900 border-gray-300"
          }`}
        >
          <option value="">-- Select Semester --</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <option key={sem} value={sem}>
              {sem} Semester
            </option>
          ))}
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
          disabled={!semester || !branch}
          className={`w-full md:w-auto px-4 py-2 rounded-lg transition duration-300 focus:outline-none shadow-md ${
            semester && branch
              ? darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-400 cursor-not-allowed text-gray-700"
          }`}
        >
          View Attendance
        </button>
        <button
  onClick={exportToCSV}
  disabled={Object.keys(attendanceData).length === 0}
  className={`w-full md:w-auto px-4 py-2 rounded-lg transition duration-300 focus:outline-none shadow-md ${
    semester && branch
      ? darkMode
        ? "bg-blue-600 hover:bg-blue-700 text-white"
        : "bg-blue-500 hover:bg-blue-600 text-white"
      : "bg-gray-400 cursor-not-allowed text-gray-700"
  }`}
>
  Export CSV
</button>

      </div>

      {/* Attendance Data */}
      <div>
        {Object.keys(attendanceData).length > 0 ? (
          Object.keys(attendanceData)
            .filter((subject) => subject && subject !== "null") // Remove null values
            .map((subject, index) => (
              <div key={index} className="mb-4">
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
                  <table
                    className={`w-full border-collapse mt-2 rounded-lg overflow-hidden ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <thead>
                      <tr className={darkMode ? "bg-gray-700" : "bg-gray-200"}>
                        <th className="border px-4 py-2">Reg ID</th>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Total Classes</th>
                        <th className="border px-4 py-2">Attended Classes</th>
                        <th className="border px-4 py-2">Attendance %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData[subject].map((student, idx) => {
                        const attendancePercentage =
                          student.total_classes > 0
                            ? (student.attended_classes /
                                student.total_classes) *
                              100
                            : 0;
                        return (
                          <tr
                            key={idx}
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
                            <td className="border px-4 py-2">
                              {student.registration_no}
                            </td>
                            <td className="border px-4 py-2">{student.name}</td>
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
                )}
              </div>
            ))
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
