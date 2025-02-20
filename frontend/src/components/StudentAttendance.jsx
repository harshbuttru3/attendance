import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentAttendance = () => {
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState("");
    const [attendanceData, setAttendanceData] = useState([]);

    // Fetch semesters from backend
    useEffect(() => {
        axios.get("http://localhost:5000/api/semesters")
            .then((response) => setSemesters(response.data))
            .catch((error) => console.error("Error fetching semesters:", error));
    }, []);

    // Fetch attendance when semester changes
    useEffect(() => {
        if (selectedSemester) {
            axios.get(`http://localhost:5000/api/attendance?semester=${selectedSemester}`)
                .then((response) => setAttendanceData(response.data))
                .catch((error) => console.error("Error fetching attendance:", error));
        }
    }, [selectedSemester]);

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">View Attendance</h2>

            {/* Semester Dropdown */}
            <select 
                className="border p-2 rounded mb-4" 
                value={selectedSemester} 
                onChange={(e) => setSelectedSemester(e.target.value)}
            >
                <option value="">Select Semester</option>
                {semesters.map((sem) => (
                    <option key={sem.semester_id} value={sem.semester_id}>
                        {sem.semester_name}
                    </option>
                ))}
            </select>

            {/* Attendance Table */}
            {attendanceData.length > 0 ? (
                <table className="w-full border-collapse border mt-4">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Subject</th>
                            <th className="border p-2">Total Classes</th>
                            <th className="border p-2">Attended</th>
                            <th className="border p-2">Attendance (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceData.map((record) => (
                            <tr key={record.subject_id} className="text-center">
                                <td className="border p-2">{record.subject_name}</td>
                                <td className="border p-2">{record.total_classes_held}</td>
                                <td className="border p-2">{record.total_classes_attended}</td>
                                <td className="border p-2">{record.attendance_percentage.toFixed(2)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                selectedSemester && <p className="mt-4 text-red-500">No attendance data found.</p>
            )}
        </div>
    );
};

export default StudentAttendance;

