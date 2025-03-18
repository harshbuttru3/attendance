import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import subjectsData from "../assets/subjectData";
import toast from "react-hot-toast";
import {
  ArrowLeftIcon,
  PlusCircleIcon,
  TrashIcon,
  UserCircleIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import { PlusCircleIcon as PlusCircleSolid } from "@heroicons/react/24/solid";

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
  const inputClass = `w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
    darkMode
      ? "bg-gray-800 text-white border-gray-600 focus:border-blue-500"
      : "bg-white text-gray-900 border-gray-200 focus:border-blue-500"
  }`;

  const selectClass = `w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
    darkMode
      ? "bg-gray-800 text-white border-gray-600 focus:border-blue-500"
      : "bg-white text-gray-900 border-gray-200 focus:border-blue-500"
  }`;

  const buttonClass = `cursor-pointer px-6 py-3 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 flex items-center gap-2 ${
    darkMode
      ? "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300"
      : "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-200"
  }`;

  const addButtonClass = `cursor-pointer px-6 py-3 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 flex items-center gap-2 ${
    darkMode
      ? "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-300"
      : "bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-200"
  }`;

  const deleteButtonClass = `cursor-pointer px-4 py-2 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 flex items-center gap-1 ${
    darkMode
      ? "bg-red-600 hover:bg-red-700 text-white focus:ring-red-300"
      : "bg-red-500 hover:bg-red-600 text-white focus:ring-red-200"
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

  // Load initial state from localStorage
  useEffect(() => {
    const savedStudents = localStorage.getItem("pendingStudents");
    if (savedStudents) {
      const parsedStudents = JSON.parse(savedStudents);
      if (parsedStudents.length > 0) {
        setSemester(parsedStudents[0].semester);
        setBranch(parsedStudents[0].branch);
      }
    }
  }, []);

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
        semester,
        branch,
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
    if (students.length === 0) {
      toast.error("Please add at least one student to the list.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = students.map((student) => ({
        registration_no: student.registration_no,
        name: student.name,
        branch: student.branch,
        semester: student.semester,
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
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      } pt-24 p-4`}
    >
      <div
        className={`w-full max-w-6xl p-6 md:p-8 rounded-2xl shadow-xl ${
          darkMode
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
      >
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className={`${buttonClass} mb-8`}>
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </button>

        <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
          <UserCircleIcon className="w-8 h-8" />
          Register Multiple Students
        </h2>

        {/* Semester and Branch Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2 ml-1">
              Semester
            </label>
            <div className="relative">
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className={selectClass}
                disabled={students.length > 0}
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
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 ml-1">
              Branch
            </label>
            <div className="relative">
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className={selectClass}
                disabled={!semester || students.length > 0}
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
        </div>

        {/* Add Student Form */}
        <div className="mb-8 border-t pt-8">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <PlusCircleSolid className="w-6 h-6 text-emerald-500" />
            Add New Student
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2 ml-1 flex items-center gap-1">
                <IdentificationIcon className="w-4 h-4" />
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
              <label className="block text-sm font-medium mb-2 ml-1 flex items-center gap-1">
                <UserCircleIcon className="w-4 h-4" />
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
              <PlusCircleIcon className="w-5 h-5" />
              Add Student
            </button>
          </div>
        </div>

        {/* Students List */}
        {students.length > 0 && (
          <div className="mb-8 border-t pt-8">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <IdentificationIcon className="w-6 h-6 text-blue-500" />
              Pending Registrations
            </h3>
            <div className="overflow-x-auto rounded-xl shadow-sm">
              <table
                className={`w-full border-collapse ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
                  <tr>
                    <th className="p-4 text-left font-semibold">
                      Registration ID
                    </th>
                    <th className="p-4 text-left font-semibold">
                      Student Name
                    </th>
                    <th className="p-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr
                      key={index}
                      className={`${
                        darkMode
                          ? "hover:bg-gray-700/50 border-b border-gray-700"
                          : "hover:bg-gray-50 border-b border-gray-200"
                      } transition-colors`}
                    >
                      <td className="p-4">{student.registration_no}</td>
                      <td className="p-4">{student.name}</td>
                      <td className="p-4 text-center flex justify-center items-center">
                        <button
                          onClick={() => handleDeleteStudent(index)}
                          className={deleteButtonClass}
                        >
                          <TrashIcon className="w-4 h-4" />
                          <span className="sr-only">Delete</span>
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
          <div className="flex flex-col md:flex-row justify-end gap-4 mt-8">
            <button
              onClick={handleRegisterAll}
              className={`${buttonClass} justify-center`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Registering...
                </>
              ) : (
                <>
                  <PlusCircleIcon className="w-5 h-5" />
                  Register All Students
                </>
              )}
            </button>
            <button
              onClick={handleClearAll}
              className={`${deleteButtonClass} justify-center`}
            >
              <TrashIcon className="w-5 h-5" />
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterMultiple;
