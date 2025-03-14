import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import subjectData from "../assets/subjectData"; // Importing subject data
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);

  // For Teachers
  const [teacherData, setTeacherData] = useState({
    employee_id: "",
    name: "",
    password: "",
    confirmPassword: "", // New field for confirm password
  });

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTeacherChange = (e) => {
    const { name, value } = e.target;
    setTeacherData((prev) => ({ ...prev, [name]: value }));
  };

  const [teacherList, setTeacherList] = useState([]); // State to store teachers list
  const [deleteTeacherData, setDeleteTeacherData] = useState({
    employee_id: "", // Only need employee_id for deletion
  });

  // Fetch teachers list
  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(
        "https://dce-attendance.onrender.com/api/admin/teachers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      setTeacherList([]); // Clear teacher list on error
    }
  };

  // Handle adding teacher
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
      fetchTeachers(); // Refresh teacher list after adding
    } catch (err) {
      console.log(err || "Something went wrong");
    }
  };

  // Handle deleting teacher
  const handleDeleteTeacher = async () => {
    if (!deleteTeacherData.employee_id) {
      alert("Please enter the Employee ID to delete a teacher.");
      return;
    }
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.delete(
        `https://dce-attendance.onrender.com/api/admin/delete-teacher/${deleteTeacherData.employee_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(res.data.message);
      setDeleteTeacherData({ employee_id: "" }); // Reset deleteTeacherData
      fetchTeachers(); // Refresh teacher list after deleting
    } catch (err) {
      console.log(err || "Something went wrong");
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
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [isDeleteTeacherOpen, setIsDeleteTeacherOpen] = useState(false);
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
      `Are you sure you want to promote all students from ${promotionSemester} semester to the next semester?`
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

  // Fetch teachers list on component mount
  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div
      className={`min-h-screen p-8 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h2>

        {/* Student Management Section */}
        <div
          className={`mb-8 p-6 rounded-lg shadow-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3 className="text-2xl font-bold mb-4">Student Management</h3>

          {/* Register Student Section */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setIsRegisterOpen(!isRegisterOpen)}
            >
              <h4 className="text-xl font-bold">Register New Student</h4>
              <span>{isRegisterOpen ? "▲" : "▼"}</span>
            </div>
            {isRegisterOpen && (
              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="registration_no"
                    placeholder="Registration No"
                    value={formData.registration_no}
                    onChange={handleChange}
                    className={`p-2 rounded-lg border focus:outline-none ${
                      darkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-900 border-gray-300"
                    }`}
                    required
                  />
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`p-2 rounded-lg border focus:outline-none ${
                      darkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-900 border-gray-300"
                    }`}
                    required
                  />
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className={`p-2 rounded-lg border focus:outline-none ${
                      darkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-900 border-gray-300"
                    }`}
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
                    className={`p-2 rounded-lg border focus:outline-none ${
                      darkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-900 border-gray-300"
                    }`}
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
                <button
                  onClick={handleRegister}
                  className={`mt-4 px-4 py-2 rounded-lg ${
                    darkMode
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white w-full md:w-auto`}
                >
                  Register Student
                </button>
              </div>
            )}
          </div>

          {/* Promote Students Section */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setIsPromoteOpen(!isPromoteOpen)}
            >
              <h4 className="text-xl font-bold">Promote Students</h4>
              <span>{isPromoteOpen ? "▲" : "▼"}</span>
            </div>
            {isPromoteOpen && (
              <div className="mt-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <select
                    value={promotionSemester}
                    onChange={(e) => setPromotionSemester(e.target.value)}
                    className={`p-2 rounded-lg border focus:outline-none ${
                      darkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-900 border-gray-300"
                    }`}
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
                    onClick={handlePromote}
                    className={`px-4 py-2 rounded-lg ${
                      darkMode
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white`}
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
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setIsUpdateOpen(!isUpdateOpen)}
            >
              <h4 className="text-xl font-bold">Update Student Semester</h4>
              <span>{isUpdateOpen ? "▲" : "▼"}</span>
            </div>
            {isUpdateOpen && (
              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className={`p-2 rounded-lg border focus:outline-none ${
                      darkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-900 border-gray-300"
                    }`}
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
                    className={`p-2 rounded-lg border focus:outline-none ${
                      darkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-900 border-gray-300"
                    }`}
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
                  className={`mt-4 px-4 py-2 rounded-lg ${
                    darkMode
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  } text-white w-full md:w-auto`}
                >
                  Update Semester
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Teacher Management Section */}
        <div
          className={`mb-8 p-6 rounded-lg shadow-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3 className="text-2xl font-bold mb-4">Teacher Management</h3>

          {/* Add Teacher Section */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setIsAddTeacherOpen(!isAddTeacherOpen)}
            >
              <h4 className="text-xl font-bold">Add New Teacher</h4>
              <span>{isAddTeacherOpen ? "▲" : "▼"}</span>
            </div>
            {isAddTeacherOpen && (
              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="employee_id"
                    placeholder="Employee ID"
                    value={teacherData.employee_id}
                    onChange={handleTeacherChange}
                    className={`p-2 rounded-lg border focus:outline-none ${
                      darkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-900 border-gray-300"
                    }`}
                  />
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={teacherData.name}
                    onChange={handleTeacherChange}
                    className={`p-2 rounded-lg border focus:outline-none ${
                      darkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-900 border-gray-300"
                    }`}
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={teacherData.password}
                      onChange={handleTeacherChange}
                      className={`p-2 rounded-lg border focus:outline-none w-full ${
                        darkMode
                          ? "bg-gray-700 text-white border-gray-600"
                          : "bg-white text-gray-900 border-gray-300"
                      }`}
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-2 top-2 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={teacherData.confirmPassword}
                      onChange={handleTeacherChange}
                      className={`p-2 rounded-lg border focus:outline-none w-full ${
                        darkMode
                          ? "bg-gray-700 text-white border-gray-600"
                          : "bg-white text-gray-900 border-gray-300"
                      }`}
                    />
                    <button
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className={`absolute right-2 top-2 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleAddTeacher}
                  className={`mt-4 px-4 py-2 rounded-lg ${
                    darkMode
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white w-full md:w-auto`}
                >
                  Add Teacher
                </button>
              </div>
            )}
          </div>

          {/* Delete Teacher Section */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setIsDeleteTeacherOpen(!isDeleteTeacherOpen)}
            >
              <h4 className="text-xl font-bold">Delete Teacher</h4>
              <span>{isDeleteTeacherOpen ? "▲" : "▼"}</span>
            </div>
            {isDeleteTeacherOpen && (
              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="employee_id"
                    placeholder="Employee ID"
                    value={deleteTeacherData.employee_id}
                    onChange={(e) =>
                      setDeleteTeacherData({
                        ...deleteTeacherData,
                        employee_id: e.target.value,
                      })
                    }
                    className={`p-2 rounded-lg border focus:outline-none ${
                      darkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-900 border-gray-300"
                    }`}
                  />
                </div>
                <button
                  onClick={handleDeleteTeacher}
                  className={`mt-4 px-4 py-2 rounded-lg ${
                    darkMode
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white w-full md:w-auto`}
                >
                  Delete Teacher
                </button>
              </div>
            )}
          </div>

          {/* List of Teachers Section */}
          <div>
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setIsTeacherListOpen(!isTeacherListOpen)}
            >
              <h4 className="text-xl font-bold">Current Teachers</h4>
              <span>{isTeacherListOpen ? "▲" : "▼"}</span>
            </div>
            {isTeacherListOpen && (
              <div className="mt-4 overflow-x-auto">
                <table
                  className={`w-full border-collapse rounded-lg overflow-hidden ${
                    darkMode ? "bg-gray-700" : "bg-white"
                  }`}
                >
                  <thead>
                    <tr
                      className={`${
                        darkMode
                          ? "bg-gray-800 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Employee ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherList.length > 0 ? (
                      teacherList.map((teacher) => (
                        <tr
                          key={teacher.id}
                          className={`${
                            darkMode
                              ? "hover:bg-gray-600 border-b border-gray-600"
                              : "hover:bg-gray-100 border-b border-gray-200"
                          } transition duration-200`}
                        >
                          <td
                            className={`px-4 py-3 ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {teacher.name}
                          </td>
                          <td
                            className={`px-4 py-3 ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {teacher.employee_id}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          className={`px-4 py-3 text-center ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          No teachers found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              navigate("/");
            }}
            className={`px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-red-600 hover:bg-red-700"
                : "bg-red-500 hover:bg-red-600"
            } text-white`}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
