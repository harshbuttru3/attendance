import { useState } from "react";
import axios from "axios";

const AttendanceForm = () => {
  const [subject, setSubject] = useState("");
  const [daysPresent, setDaysPresent] = useState(0);

  const updateAttendance = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://https://dce-attendance.onrender.com/api/attendance", { subject, daysPresent });
      alert("Attendance updated successfully!");
    } catch (error) {
      alert("Error updating attendance");
    }
  };

  return (
    <form onSubmit={updateAttendance}>
      <input type="text" placeholder="Subject" onChange={(e) => setSubject(e.target.value)} required />
      <input type="number" placeholder="Days Present" onChange={(e) => setDaysPresent(e.target.value)} required />
      <button type="submit">Update Attendance</button>
    </form>
  );
};

export default AttendanceForm;
