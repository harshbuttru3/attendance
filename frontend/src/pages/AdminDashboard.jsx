import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai"; // Import delete icon
import { FiLogOut } from "react-icons/fi"; // Import logout icon
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Import eye icons
import subjectData from "../assets/subjectData"; // Import subject data

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);

  // ✅ State to store teacher data
  const [teacherData, setTeacherData] = useState({
    employee_id: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [teacherList, setTeacherList] = useState([]);
  const [teacherListUpdated, setTeacherListUpdated] = useState(false); // ✅ For triggering re-fetch
  const [IsResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({
    employee_id: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // ✅ Handle teacher form changes
  const handleTeacherChange = (e) => {
    const { name, value } = e.target;
    setTeacherData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Fetch teachers list
  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("https://dce-attendance.onrender.com/api/admin/teachers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched Teachers:", res.data);
      setTeacherList(
        res.data.map(({ id, name, employee_id }) => ({
          id,
          name,
          employee_id,
        }))
      );
    } catch (err) {
      console.log(err || "Something went wrong");
      setTeacherList([]); // ✅ Clear list on error
    }
  };

  // ✅ Handle adding teacher
  const handleAddTeacher = async () => {
    if (
      !teacherData.name ||
      !teacherData.employee_id ||
      !teacherData.password ||
      !teacherData.confirmPassword
    ) {
      toast.error("Please fill all fields to add a teacher.");
      return;
    }

    if (teacherData.password !== teacherData.confirmPassword) {
      toast.error("Password and Confirm Password do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.post(
        "https://dce-attendance.onrender.com/api/admin/add-teacher",
        teacherData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      setTeacherData({
        name: "",
        employee_id: "",
        password: "",
        confirmPassword: "",
      });

      // ✅ Trigger re-fetch after adding teacher
      setTeacherListUpdated((prev) => !prev);
    } catch (err) {
      console.log(err || "Something went wrong");
      toast.error("Failed to add teacher.");
    }
  };

  // ✅ Handle deleting teacher
  const handleDeleteTeacher = async (employeeId, teacherName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete teacher: ${teacherName} with Employee ID: ${employeeId}?`
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.delete(
        `https://dce-attendance.onrender.com/api/admin/delete-teacher/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);

      // ✅ Trigger re-fetch after deleting teacher
      setTeacherListUpdated((prev) => !prev);
    } catch (err) {
      console.log(err || "Something went wrong");
      toast.error("Failed to delete teacher.");
    }
  };

  // ✅ Fetch teachers on component mount or after adding/deleting
  useEffect(() => {
    fetchTeachers(); // ✅ Runs on mount and when teacherListUpdated changes
  }, [teacherListUpdated]);

  // Reset teacher's password using employee_id.
  const handleResetPassword = async () => {
    if (
      !resetPasswordData.employee_id ||
      !resetPasswordData.newPassword ||
      !resetPasswordData.confirmNewPassword
    ) {
      toast.error("Please fill all fields to reset password.");
      return;
    }

    if (
      resetPasswordData.newPassword !== resetPasswordData.confirmNewPassword
    ) {
      toast.error("New Password and Confirm New Password do not match.");
      return;
    }

    const confirmReset = window.confirm(
      `Are you sure you want to reset password for teacher with Employee ID: ${resetPasswordData.employee_id}?`
    );

    if (!confirmReset) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.put(
        `https://dce-attendance.onrender.com/api/admin/reset-password/${resetPasswordData.employee_id}`,
        { password: resetPasswordData.newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data.message);
      setResetPasswordData({
        employee_id: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      console.log(err || "Something went wrong");
      toast.error("Failed to reset password.");
    }
  };

  // For Students
  const [formData, setFormData] = useState({
    registration_no: "",
    name: "",
    branch: "",
    semester: "",
  });

  const [promotionSemester, setPromotionSemester] = useState("");
  const [updateData, setUpdateData] = useState({
    registration_no: "",
    newSemester: "",
  });

  // State for collapsible sections
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isPromoteOpen, setIsPromoteOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [isTeacherListOpen, setIsTeacherListOpen] = useState(false);

  // Convert semester number to ordinal (1st, 2nd, 3rd, etc.)
  const toOrdinalSemester = (semester) => {
    const ordinalMap = {
      1: "1st",
      2: "2nd",
      3: "3rd",
      4: "4th",
      5: "5th",
      6: "6th",
      7: "7th",
      8: "8th",
    };
    return ordinalMap[semester] || semester;
  };

  // Handle input changes and convert semester to ordinal format
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "semester") {
      value = toOrdinalSemester(value);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle student registration
  const handleRegister = async () => {
    if (
      !formData.registration_no ||
      !formData.name ||
      !formData.branch ||
      !formData.semester
    ) {
      toast.error("Please fill all fields to register a student.");
      return;
    }

    try {
      const res = await axios.post(
        "https://dce-attendance.onrender.com/api/admin/register-student",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success(res.data.message);
      setFormData({ registration_no: "", name: "", branch: "", semester: "" });
    } catch (err) {
      toast.error(
        "Error: " + (err.response?.data?.error || "Something went wrong")
      );
    }
  };

  // Handle student promotion
  const handlePromote = async () => {
    if (!promotionSemester) {
      toast.error("Please select a semester to promote students.");
      return;
    }

    const confirmPromotion = window.confirm(
      `Are you sure you want to promote all students from ${promotionSemester} semester to the next semester? All attendance data for the current semester will be deleted!`
    );

    if (!confirmPromotion) return;

    try {
      const res = await axios.put(
        "https://dce-attendance.onrender.com/api/admin/promote-semester",
        { currentSemester: promotionSemester },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success(res.data.message);
      setPromotionSemester("");
    } catch (err) {
      toast.error(
        "Error: " + (err.response?.data?.error || "Something went wrong")
      );
    }
  };

  // Handle updating a single student's semester
  const handleUpdateSemester = async () => {
    if (!updateData.registration_no || !updateData.newSemester) {
      toast.error("Please fill all fields to update a student's semester.");
      return;
    }

    try {
      const res = await axios.put(
        "https://dce-attendance.onrender.com/api/admin/update-student-semester",
        updateData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success(res.data.message);
      setUpdateData({ registration_no: "", newSemester: "" });
    } catch (err) {
      toast.error(
        "Error: " + (err.response?.data?.error || "Something went wrong")
      );
    }
  };

  //function to delete student using registration number in the URL
  const handleDeleteStudent = async (registrationNo) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete student with Registration No: ${registrationNo}?`
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.delete(
        `https://dce-attendance.onrender.com/api/admin/delete-student/${registrationNo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      // Optionally, you can trigger a re-fetch or update the student list state here
    } catch (err) {
      console.log(err || "Something went wrong");
      toast.error("Failed to delete student.");
    }
  };

  // function to delete student's attendance data using semester while promoting
  const deleteStudentAttendanceWhilePromoting = async (semester) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.delete(
        `https://dce-attendance.onrender.com/api/admin/delete-student-attendance/${semester}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
    } catch (err) {
      console.log(err || "Something went wrong");
      toast.error("Failed to delete student attendance.");
    }
  };


  // function to delete students of last ie 8th semester
  const deleteStudentsOfLastSemester = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete students of 8th semester?`
    ); //confirmation message
    if (!confirmDelete) return; //if user cancels the confirmation message
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.delete(
        `https://dce-attendance.onrender.com/api/admin/delete-students-of-last-semester`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      // Optionally, you can trigger a re-fetch or update the student list state here   
    } catch (err) {
      console.log(err || "Something went wrong");
      toast.error("Failed to delete students of last semester.");
    }
  };


  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const sectionTitleClass = `text-xl font-semibold mb-3 ${
    darkMode ? "text-gray-300" : "text-gray-700"
  }`;
  const collapsibleTitleClass = `flex justify-between items-center cursor-pointer mb-2 ${
    darkMode ? "text-white" : "text-gray-900"
  }`;
  const collapsibleContentClass = `mt-2 p-4 rounded-md ${
    darkMode
      ? "bg-gray-700 border border-gray-600"
      : "bg-gray-100 border border-gray-200"
  }`;
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
  const buttonClass = `cursor-pointer px-5 py-2 rounded-lg font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500`;
  const primaryButtonClass = `${buttonClass} ${
    darkMode
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-blue-500 hover:bg-blue-600 text-white"
  }`;
  const successButtonClass = `${buttonClass} ${
    darkMode
      ? "bg-green-600 hover:bg-green-700 text-white"
      : "bg-green-500 hover:bg-green-600 text-white"
  }`;
  const warningButtonClass = `${buttonClass} ${
    darkMode
      ? "bg-yellow-600 hover:bg-yellow-700 text-white"
      : "bg-yellow-500 hover:bg-yellow-600 text-white"
  }`;
  const deleteButtonClass = `${buttonClass} ${
    darkMode
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-red-500 hover:bg-red-600 text-white"
  }`;
  const tableClass = `w-full border-collapse rounded-lg overflow-hidden shadow-md ${
    darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
  }`;
  const tableHeaderClass = `bg-gray-100 font-semibold text-left ${
    darkMode ? "bg-gray-700 text-gray-300" : "text-gray-600"
  }`;
  const tableRowClass = `hover:bg-gray-200 ${
    darkMode
      ? "hover:bg-gray-700 border-b border-gray-700"
      : "border-b border-gray-200"
  }`;
  const tableCellClass = `px-4 py-3`;
  const deleteIconClass = `cursor-pointer text-red-500 hover:text-red-700 focus:outline-none`;
  const logoutButtonClass = `${buttonClass} ${
    darkMode
      ? "bg-red-700 hover:bg-red-800 text-white"
      : "bg-red-600 hover:bg-red-700 text-white"
  } flex items-center`;

  return (
    <div
      className={`min-h-screen p-8 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-5xl mx-auto">
        {/* Logout Button at the Top */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              navigate("/");
            }}
            className={logoutButtonClass}
          >
            <FiLogOut className="mr-2 h-5 w-5" /> Logout
          </button>
        </div>

        <h2 className="text-4xl font-bold text-center mb-8">Admin Dashboard</h2>

        {/* Student Management Section */}
        <div className="mb-10 p-6 rounded-lg shadow-xl">
          <h3 className="text-2xl font-semibold mb-5 text-blue-500">
            Student Management
          </h3>

          {/* Register Student Section */}
          <div className="mb-6">
            <div
              className={collapsibleTitleClass}
              onClick={() => setIsRegisterOpen(!isRegisterOpen)}
            >
              <h4 className={sectionTitleClass}>Register New Student</h4>
              <span>{isRegisterOpen ? "▲" : "▼"}</span>
            </div>
            {isRegisterOpen && (
              <div className={collapsibleContentClass}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    name="registration_no"
                    placeholder="Registration No"
                    value={formData.registration_no}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className={selectClass}
                  >
                    <option value="">Select Branch</option>
                    {subjectData[0].branches.map((b) => (
                      <option key={b.branch} value={b.branch}>
                        {b.branch}
                      </option>
                    ))}
                  </select>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className={selectClass}
                  >
                    <option value="">Select Semester</option>
                    {[
                      "1st",
                      "2nd",
                      "3rd",
                      "4th",
                      "5th",
                      "6th",
                      "7th",
                      "8th",
                    ].map((sem) => (
                      <option key={sem} value={sem}>
                        {sem} Semester
                      </option>
                    ))}
                  </select>
                </div>
                <button onClick={handleRegister} className={primaryButtonClass}>
                  Register Student
                </button>
              </div>
            )}
          </div>

          {/* Promote Students Section */}
          <div className="mb-6">
            <div
              className={collapsibleTitleClass}
              onClick={() => setIsPromoteOpen(!isPromoteOpen)}
            >
              <h4 className={sectionTitleClass}>Promote Students</h4>
              <span>{isPromoteOpen ? "▲" : "▼"}</span>
            </div>
            {isPromoteOpen && (
              <div className={collapsibleContentClass}>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <select
                    value={promotionSemester}
                    onChange={(e) => setPromotionSemester(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select Semester to Promote</option>
                    {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th"].map(
                      (sem) => (
                        <option key={sem} value={sem}>
                          {sem} Semester
                        </option>
                      )
                    )}
                  </select>
                  <button
                    onClick={async () => {
                      await handlePromote();
                      await deleteStudentAttendanceWhilePromoting(promotionSemester);
                    }}
                    className={successButtonClass}
                  >
                    Promote Students
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Update Student Semester Section */}
          <div>
            <div
              className={collapsibleTitleClass}
              onClick={() => setIsUpdateOpen(!isUpdateOpen)}
            >
              <h4 className={sectionTitleClass}>Update Student Semester</h4>
              <span>{isUpdateOpen ? "▲" : "▼"}</span>
            </div>
            {isUpdateOpen && (
              <div className={collapsibleContentClass}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    name="registration_no"
                    placeholder="Registration No"
                    value={updateData.registration_no}
                    onChange={(e) =>
                      setUpdateData({
                        ...updateData,
                        registration_no: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                  <select
                    name="newSemester"
                    value={updateData.newSemester}
                    onChange={(e) =>
                      setUpdateData({
                        ...updateData,
                        newSemester: e.target.value,
                      })
                    }
                    className={selectClass}
                  >
                    <option value="">Select New Semester</option>
                    {[
                      "1st",
                      "2nd",
                      "3rd",
                      "4th",
                      "5th",
                      "6th",
                      "7th",
                      "8th",
                    ].map((sem) => (
                      <option key={sem} value={sem}>
                        {sem} Semester
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleUpdateSemester}
                  className={warningButtonClass}
                >
                  Update Semester
                </button>
              </div>
            )}
          </div>

          {/* delete studnets based on registration number  */}
          {/* Delete Student Section */}
          <div className="mb-6">
            <div
              className={collapsibleTitleClass}
              onClick={() => setIsDeleteOpen(!isDeleteOpen)}
            >
              <h4 className={sectionTitleClass}>Delete Student</h4>
              <span>{isDeleteOpen ? "▲" : "▼"}</span>
            </div>
            {isDeleteOpen && (
              <div className={collapsibleContentClass}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    name="delete_registration_no"
                    placeholder="Registration No"
                    value={formData.registration_no}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        registration_no: e.target.value,
                      })
                    }
                    className={inputClass}
                    required
                  />
                </div>
                <button
                  onClick={() => handleDeleteStudent(formData.registration_no)}
                  className={deleteButtonClass}
                >
                  Delete Student
                </button>
                <button
                  onClick={deleteStudentsOfLastSemester}
                  className={deleteButtonClass}
                  >
                  Delete Students of Last Semester
                  </button>
              </div>
            )}
          </div>
        </div>

        {/* Teacher Management Section */}
        <div className="mb-10 p-6 rounded-lg shadow-xl">
          <h3 className="text-2xl font-semibold mb-5 text-indigo-500">
            Teacher Management
          </h3>

          {/* Add Teacher Section */}
          <div className="mb-6">
            <div
              className={collapsibleTitleClass}
              onClick={() => setIsAddTeacherOpen(!isAddTeacherOpen)}
            >
              <h4 className={sectionTitleClass}>Add New Teacher</h4>
              <span>{isAddTeacherOpen ? "▲" : "▼"}</span>
            </div>
            {isAddTeacherOpen && (
              <div className={collapsibleContentClass}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    name="employee_id"
                    placeholder="Employee ID"
                    value={teacherData.employee_id}
                    onChange={handleTeacherChange}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={teacherData.name}
                    onChange={handleTeacherChange}
                    className={inputClass}
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={teacherData.password}
                      onChange={handleTeacherChange}
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className={`absolute right-3 top-2 flex items-center text-gray-500 cursor-pointer`}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={teacherData.confirmPassword}
                      onChange={handleTeacherChange}
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className={`absolute right-3 top-2 flex items-center text-gray-500 cursor-pointer`}
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleAddTeacher}
                  className={primaryButtonClass}
                >
                  Add Teacher
                </button>
              </div>
            )}
          </div>

          {/* component for reseting password of teacher */}
          {/* Reset Teacher Password Section */}
          <div className="mb-6">
            <div
              className={collapsibleTitleClass}
              onClick={() => setIsResetPasswordOpen(!IsResetPasswordOpen)}
            >
              <h4 className={sectionTitleClass}>Reset Teacher Password</h4>
              <span>{IsResetPasswordOpen ? "▲" : "▼"}</span>
            </div>
            {IsResetPasswordOpen && (
              <div className={collapsibleContentClass}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    name="reset_employee_id"
                    placeholder="Employee ID"
                    value={resetPasswordData.employee_id}
                    onChange={(e) =>
                      setResetPasswordData({
                        ...resetPasswordData,
                        employee_id: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      placeholder="New Password"
                      value={resetPasswordData.newPassword}
                      onChange={(e) =>
                        setResetPasswordData({
                          ...resetPasswordData,
                          newPassword: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className={`absolute right-3 top-2 flex items-center text-gray-500 cursor-pointer`}
                    >
                      {showNewPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showConfirmNewPassword ? "text" : "password"}
                      name="confirmNewPassword"
                      placeholder="Confirm New Password"
                      value={resetPasswordData.confirmNewPassword}
                      onChange={(e) =>
                        setResetPasswordData({
                          ...resetPasswordData,
                          confirmNewPassword: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmNewPassword(!showConfirmNewPassword)
                      }
                      className={`absolute right-3 top-2 flex items-center text-gray-500 cursor-pointer`}
                    >
                      {showConfirmNewPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleResetPassword}
                  className={primaryButtonClass}
                >
                  Reset Password
                </button>
              </div>
            )}
          </div>

          {/* List of Teachers Section */}
          <div>
            <div
              className={collapsibleTitleClass}
              onClick={() => setIsTeacherListOpen(!isTeacherListOpen)}
            >
              <h4 className={sectionTitleClass}>Current Teachers</h4>
              <span>{isTeacherListOpen ? "▲" : "▼"}</span>
            </div>
            {isTeacherListOpen && (
              <div className={collapsibleContentClass}>
                <div className="overflow-x-auto">
                  <table className={tableClass}>
                    <thead className={tableHeaderClass}>
                      <tr>
                        <th className={tableCellClass}>Name</th>
                        <th className={tableCellClass}>Employee ID</th>
                        <th className={`${tableCellClass} text-center`}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {teacherList.length > 0 ? (
                        teacherList.map((teacher) => (
                          <tr key={teacher.id} className={tableRowClass}>
                            <td className={tableCellClass}>{teacher.name}</td>
                            <td className={tableCellClass}>
                              {teacher.employee_id}
                            </td>
                            <td className={`${tableCellClass} text-center`}>
                              <button
                                onClick={() =>
                                  handleDeleteTeacher(
                                    teacher.employee_id,
                                    teacher.name
                                  )
                                }
                                className={deleteIconClass}
                              >
                                <AiOutlineDelete className="h-5 w-5 inline-block" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className={`${tableCellClass} text-center`}
                          >
                            No teachers found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
