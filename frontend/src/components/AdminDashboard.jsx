import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import subjectData from "../assets/subjectData"; // Importing subject data

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);

  //for teachers

  const [teacherData, setTeacherData] = useState({
    employee_id: "",
    name: "",
    password: "",
  });

  const handleTeacherChange = (e) => {
    const { name, value } = e.target;
    setTeacherData((prev) => ({ ...prev, [name]: value }));
  };
  const [teacherList, setTeacherList] = useState([]); // ✅ State to store teachers list

  // ✅ Fetch teachers list
  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("http://localhost:5000/api/admin/teachers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log("Fetched Teachers:", res.data);
      
      // ✅ Set teacher list directly from the response
      setTeacherList(res.data.map(({ id, name, employee_id }) => ({
        id,
        name,
        employee_id
      })));
    } catch (err) {
      console.log(err || "Something went wrong");
      setTeacherList([]); // ✅ Clear teacher list on error
    }
  };
  

  // ✅ Handle adding teacher
  const handleAddTeacher = async () => {
    if (
      !teacherData.name ||
      !teacherData.employee_id ||
      !teacherData.password
    ) {
      alert("Please fill all fields to add a teacher.");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.post(
        "http://localhost:5000/api/admin/add-teacher",
        teacherData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 Send token in Authorization header
          },
        }
      );

      alert(res.data.message);
      setTeacherData({ name: "", employee_id: "", password: "" });
      fetchTeachers(); // ✅ Refresh teacher list after adding
    } catch (err) {
      // alert("Error: " + (err.response?.data?.error || "Something went wrong"));
      console.log(err || "Something went wrong");
    }
  };

  // ✅ Handle deleting teacher
  const handleDelteTeacher = async () => {
    if (!teacherData.employee_id) {
      alert("Please enter the Employee ID to delete a teacher.");
      return;
    }
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.delete(
        `http://localhost:5000/api/admin/delete-teacher/${teacherData.employee_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(res.data.message);
      setTeacherData({ employee_id: "", name: "", password: "" });
      fetchTeachers(); // ✅ Refresh teacher list after deleting
    } catch (err) {
      // alert("Error: " + (err.response?.data?.error || "Something went wrong"));
      console.log(err || "Something went wrong");
    }
  };

  //for studdents
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

  /**
   * 🔹 Convert semester number (1, 2, 3) to ordinal ("1st", "2nd", "3rd")
   */
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

  /**
   * 🔹 Handle input changes and convert semester to ordinal format
   */
  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "semester") {
      value = toOrdinalSemester(value); // Convert semester to ordinal
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * 🔹 Handle student registration with ordinal semester
   */
  const handleRegister = async () => {
    if (
      !formData.registration_no ||
      !formData.name ||
      !formData.branch ||
      !formData.semester
    ) {
      alert("Please fill all fields to register a student.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/register-student",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(res.data.message);
      setFormData({ registration_no: "", name: "", branch: "", semester: "" }); // Clear form
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Something went wrong"));
    }
  };

  /**
   * 🔹 Handle student promotion to next semester (with confirmation)
   */
  const handlePromote = async () => {
    if (!promotionSemester) {
      alert("Please select a semester to promote students.");
      return;
    }

    const confirmPromotion = window.confirm(
      `Are you sure you want to promote all students from ${promotionSemester} semester to the next semester?`
    );

    if (!confirmPromotion) return;

    try {
      const res = await axios.put(
        "http://localhost:5000/api/admin/promote-semester",
        { currentSemester: promotionSemester },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(res.data.message);
      setPromotionSemester("");
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Something went wrong"));
    }
  };

  /**
   * 🔹 Handle updating a single student's semester
   */
  const handleUpdateSemester = async () => {
    if (!updateData.registration_no || !updateData.newSemester) {
      alert("Please fill all fields to update a student's semester.");
      return;
    }

    try {
      const res = await axios.put(
        "http://localhost:5000/api/admin/update-student-semester",
        updateData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(res.data.message);
      setUpdateData({ registration_no: "", newSemester: "" });
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Something went wrong"));
    }
  };

    useEffect(() => {
      fetchTeachers(); // ✅ Fetch teachers list on component mount
    }, []);

  return (
    <div
      className={`min-h-screen p-8 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h2>

        {/* Register Student Section */}
        <div
          className={`mb-8 p-6 rounded-lg shadow-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setIsRegisterOpen(!isRegisterOpen)}
          >
            <h3 className="text-xl font-bold">Register New Student</h3>
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

                {/* 🔹 Dropdown now uses ordinal format in state */}
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
                  {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map(
                    (sem) => (
                      <option key={sem} value={sem}>
                        {sem} Semester
                      </option>
                    )
                  )}
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
        <div
          className={`mb-8 p-6 rounded-lg shadow-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setIsPromoteOpen(!isPromoteOpen)}
          >
            <h3 className="text-xl font-bold">Promote Students</h3>
            <span>{isPromoteOpen ? "▲" : "▼"}</span>
          </div>

          {isPromoteOpen && (
            <div className="mt-4">
              <div className="flex flex-col md:flex-row gap-4">
                <select
                  value={promotionSemester}
                  onChange={(e) => setPromotionSemester(e.target.value)}
                  className="p-2 rounded-lg border"
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
                  className="px-4 py-2 rounded-lg bg-green-500 text-white"
                >
                  Promote Students
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Update Student Semester */}
        <div
          className={`mb-8 p-6 rounded-lg shadow-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3 className="text-xl font-bold">Update Student Semester</h3>
          <input
            type="text"
            name="registration_no"
            placeholder="Registration No"
            value={updateData.registration_no}
            onChange={(e) =>
              setUpdateData({ ...updateData, registration_no: e.target.value })
            }
            className="p-2 rounded-lg border"
          />
          <select
            name="newSemester"
            value={updateData.newSemester}
            onChange={(e) =>
              setUpdateData({ ...updateData, newSemester: e.target.value })
            }
            className="p-2 rounded-lg border"
          >
            <option value="">Select New Semester</option>
            {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map(
              (sem) => (
                <option key={sem} value={sem}>
                  {sem} Semester
                </option>
              )
            )}
          </select>
          <button
            onClick={handleUpdateSemester}
            className="mt-4 px-4 py-2 rounded-lg bg-yellow-500 text-white"
          >
            Update Semester
          </button>
        </div>
        {/* 🔹 Add Teacher Section */}
        <div className="mb-8 p-6 rounded-lg shadow-lg bg-white">
          <h3 className="text-xl font-bold mb-4">Add New Teacher</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="employee_id"
              placeholder="Employee ID"
              value={teacherData.employee_id}
              onChange={handleTeacherChange}
              className="p-2 rounded-lg border"
            />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={teacherData.name}
              onChange={handleTeacherChange}
              className="p-2 rounded-lg border"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={teacherData.password}
              onChange={handleTeacherChange}
              className="p-2 rounded-lg border"
            />
          </div>
          <button
            onClick={handleAddTeacher}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            Add Teacher
          </button>
        </div>

        {/* Delete teachers */}
        <div className="mb-8 p-6 rounded-lg shadow-lg bg-white">
          <h3 className="text-xl font-bold mb-4">Delete Teacher</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="employee_id"
              placeholder="Employee ID"
              value={teacherData.employee_id}
              onChange={handleTeacherChange}
              className="p-2 rounded-lg border"
            />
          </div>
          <button
            onClick={handleDelteTeacher}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            Delete Teacher
          </button>
        </div>

    {/* list of teachers */}
<div className="mb-8 p-6 rounded-lg shadow-lg bg-white">
  <h3 className="text-xl font-bold mb-4">List of Teachers</h3>
  
  <table className="w-full mt-4">
    <thead>
      <tr>
        <th className="py-2">Name</th>
        <th className="py-2">Employee ID</th>
      </tr>
    </thead>
    <tbody>
      {teacherList.length > 0 ? (
        teacherList.map((teacher) => (
          <tr key={teacher.id}>
            <td className="py-2">{teacher.name}</td>
            <td className="py-2">{teacher.employee_id}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="2" className="py-2 text-center">
            No teachers found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            navigate("/");
          }}
          className="px-4 py-2 rounded-lg bg-red-500 text-white" // 🔴 Changed color to red
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
