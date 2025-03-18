import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import subjectsData from "../assets/subjectData";
import toast from "react-hot-toast";
import { FiArrowLeft, FiPlus, FiTrash2 } from "react-icons/fi";

const RegisterMultiple = () => {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("pendingStudents");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentRegistrationId, setCurrentRegistrationId] = useState("");
  const [currentStudentName, setCurrentStudentName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Get branches based on selected semester
  const branches = semester
    ? subjectsData
        .find((sem) => sem.semester === semester)
        ?.branches?.map((b) => b.branch) || []
    : [];

  // Styling classes
  const inputClass = `w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    darkMode
      ? "bg-gray-800 text-white border-gray-700"
      : "bg-white text-gray-900 border-gray-300"
  }`;

  const selectClass = `w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    darkMode
      ? "bg-gray-800 text-white border-gray-700"
      : "bg-white text-gray-900 border-gray-300"
  }`;

  const buttonClass = `cursor-pointer px-5 py-2 rounded-lg font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    darkMode
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-blue-500 hover:bg-blue-600 text-white"
  }`;

  const addButtonClass = `cursor-pointer px-4 py-2 rounded-lg font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 ${
    darkMode
      ? "bg-green-600 hover:bg-green-700 text-white"
      : "bg-green-500 hover:bg-green-600 text-white"
  }`;

  const deleteButtonClass = `cursor-pointer px-3 py-1 rounded-md font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 ${
    darkMode
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-red-500 hover:bg-red-600 text-white"
  }`;

  // Validate input fields
  const validateField = (name, value) => {
    let error = "";
    if (name === "semester" || name === "branch") {
      if (!value) error = `Please select ${name}.`;
    } else if (name === "registration_no") {
      const trimmedValue = value.trim();
      if (!trimmedValue) {
        error = "Registration ID cannot be empty.";
      } else if (
        students.some(
          (student) =>
            student.registration_no.trim().toLowerCase() ===
            trimmedValue.toLowerCase()
        )
      ) {
        error = "Registration ID already exists in the list.";
      }
    } else if (name === "name") {
      if (!value.trim()) error = "Student name cannot be empty.";
    }
    return error;
  };

  // Save students to localStorage
  useEffect(() => {
    localStorage.setItem("pendingStudents", JSON.stringify(students));
  }, [students]);

  // Add new student
  const handleAddStudent = () => {
    const semesterError = validateField("semester", semester);
    const branchError = validateField("branch", branch);
    const regIdError = validateField("registration_no", currentRegistrationId);
    const nameError = validateField("name", currentStudentName);

    setValidationErrors({ semesterError, branchError, regIdError, nameError });

    if (semesterError || branchError || regIdError || nameError) return;

    setStudents((prev) => [
      ...prev,
      {
        registration_no: currentRegistrationId.trim(),
        name: currentStudentName.trim(),
      },
    ]);
    setCurrentRegistrationId("");
    setCurrentStudentName("");
    setValidationErrors({});
    toast.success("Student added successfully!");
  };

  // Delete student
  const handleDeleteStudent = (index) => {
    if (index < 0 || index >= students.length) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (!confirmDelete) return;

    setStudents((prev) => prev.filter((_, i) => i !== index));
  };

  // Clear all students
  const handleClearAll = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear all students?"
    );
    if (!confirmClear) return;

    setStudents([]);
    localStorage.removeItem("pendingStudents");
  };

  // Submit all students
  const handleRegisterAll = async () => {
    if (!semester || !branch) {
      toast.error("Please select both semester and branch.");
      return;
    }
    if (students.length === 0) {
      toast.error("Please add at least one student to the list.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = students.map((student) => ({
        registration_no: student.registration_no,
        name: student.name,
        branch,
        semester,
      }));

      await axios.post(
        "https://dce-attendance.onrender.com/api/admin/register-multiple-students",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      toast.success("Students registered successfully!");
      setSemester("");
      setBranch("");
      setStudents([]);
      localStorage.removeItem("pendingStudents");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      toast.error(
        err.response?.data?.error ||
          "Failed to register students. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } pt-24 p-4`}
    >
      <div
        className={`w-full max-w-6xl p-6 md:p-8 rounded-xl shadow-2xl border ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <button
          onClick={() => navigate(-1)}
          className={`${buttonClass} flex items-center mb-6`}
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>

        <h2 className="text-3xl font-bold mb-8">Register Multiple Students</h2>

        {/* Semester and Branch Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className={selectClass}
            >
              <option value="">Select Semester</option>
              {subjectsData.map((sem) => (
                <option key={sem.semester} value={sem.semester}>
                  {sem.semester} Semester
                </option>
              ))}
            </select>
            {validationErrors.semesterError && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.semesterError}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Branch</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className={selectClass}
              disabled={!semester}
            >
              <option value="">Select Branch</option>
              {branches.map((br) => (
                <option key={br} value={br}>
                  {br}
                </option>
              ))}
            </select>
            {validationErrors.branchError && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.branchError}
              </p>
            )}
          </div>
        </div>

        {/* Add Student Form */}
        <div className="mb-8 border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">Add New Student</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Registration ID
              </label>
              <input
                type="text"
                value={currentRegistrationId}
                onChange={(e) => {
                  setCurrentRegistrationId(e.target.value);
                  setValidationErrors((prev) => ({ ...prev, regIdError: "" }));
                }}
                className={inputClass}
                maxLength={20}
              />
              {validationErrors.regIdError && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.regIdError}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Student Name
              </label>
              <input
                type="text"
                value={currentStudentName}
                onChange={(e) => {
                  setCurrentStudentName(e.target.value);
                  setValidationErrors((prev) => ({ ...prev, nameError: "" }));
                }}
                className={inputClass}
                maxLength={50}
              />
              {validationErrors.nameError && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.nameError}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={handleAddStudent} className={addButtonClass}>
              <FiPlus className="mr-2" /> Add Student
            </button>
          </div>
        </div>

        {/* Students List */}
        {students.length > 0 && (
          <div className="mb-8 border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Pending Students</h3>
            <div className="overflow-x-auto">
              <table
                className={`w-full ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <thead className={darkMode ? "bg-gray-700" : "bg-gray-200"}>
                  <tr>
                    <th className="border px-4 py-2 text-left">
                      Registration ID
                    </th>
                    <th className="border px-4 py-2 text-left">Name</th>
                    <th className="border px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr
                      key={index}
                      className={darkMode ? "bg-gray-800" : "bg-white"}
                    >
                      <td className="border px-4 py-2">
                        {student.registration_no}
                      </td>
                      <td className="border px-4 py-2">{student.name}</td>
                      <td className="border px-4 py-2 text-center">
                        <button
                          onClick={() => handleDeleteStudent(index)}
                          className={deleteButtonClass}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {students.length > 0 && (
          <div className="flex justify-end space-x-4">
            <button onClick={handleClearAll} className={deleteButtonClass}>
              <FiTrash2 className="mr-2" /> Clear All
            </button>
            <button
              onClick={handleRegisterAll}
              className={buttonClass}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                "Register All Students"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterMultiple;
