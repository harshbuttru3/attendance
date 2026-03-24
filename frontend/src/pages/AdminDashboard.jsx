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

  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingLastSemester, setIsDeletingLastSemester] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // ✅ Handle teacher form changes
  const handleTeacherChange = (e) => {
    const { name, value } = e.target;
    setTeacherData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Fetch teachers list
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
      `Are you sure you want to reset the password for teacher with Employee ID: ${resetPasswordData.employee_id}?`
    );

    if (!confirmReset) return;

    setIsResettingPassword(true); // Start loading state

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
    } finally {
      setIsResettingPassword(false); // End loading state
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
    // Validation
    if (
      !formData.registration_no ||
      !formData.name ||
      !formData.branch ||
      !formData.semester
    ) {
      toast.error("Please fill all fields to register a student.");
      return;
    }

    setIsRegistering(true); // Start loading state

    try {
      const res = await axios.post(
        "https://dce-attendance.onrender.com/api/admin/register-student",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      toast.success(res.data.message);
      setFormData({
        registration_no: "",
        name: "",
        branch: "",
        semester: "",
      }); // Clear form after successful registration
    } catch (err) {
      console.log(err || "Something went wrong");
      toast.error(
        "Error: " + (err.response?.data?.error || "Failed to register student.")
      );
    } finally {
      setIsRegistering(false); // End loading state
    }
  };

  // Handle student promotion
  const handlePromote = async () => {
    if (!promotionSemester) {
      toast.error("Please select a semester to promote.");
      return;
    }

    setIsPromoting(true); // Start loading state

    try {
      const res = await axios.put(
        "https://dce-attendance.onrender.com/api/admin/promote-semester",
        { currentSemester: promotionSemester },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success(res.data.message);
      setPromotionSemester(""); // Clear selection after promotion
    } catch (err) {
      toast.error(
        "Error: " + (err.response?.data?.error || "Something went wrong")
      );
    } finally {
      setIsPromoting(false); // End loading state
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
    setIsDeleting(true); // Start loading state

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
    } finally {
      setIsDeleting(false); // End loading state
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
      "Are you sure you want to delete all students of the last semester?"
    );

    if (!confirmDelete) return;

    setIsDeletingLastSemester(true); // Start loading state

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
    } catch (err) {
      console.log(err || "Something went wrong");
      toast.error("Failed to delete students of last semester.");
    } finally {
      setIsDeletingLastSemester(false); // End loading state
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
  const sectionTitleClass = `text-xl font-bold mb-4 font-serif text-white tracking-tight`;
  const collapsibleTitleClass = `flex justify-between items-center cursor-pointer mb-2 transition-all duration-300`;
  const collapsibleContentClass = `mt-4 p-8 rounded-[1.5rem] border border-white/5 bg-[#133b5c]/20 backdrop-blur-md shadow-inner`;
  const inputClass = `input-institutional h-12 text-sm`;
  const selectClass = `input-institutional h-12 text-sm cursor-pointer`;
  const buttonClass = `btn-institutional h-12 text-xs shadow-lg active:scale-95`;
  const primaryButtonClass = `${buttonClass}`;
  const successButtonClass = `${buttonClass} bg-green-600/20 text-green-400 border-green-500/30 hover:bg-green-600 hover:text-white`;
  const warningButtonClass = `${buttonClass} bg-[#c6b677]/20 text-[#c6b677] border-[#c6b677]/30 hover:bg-[#c6b677] hover:text-[#133b5c]`;
  const deleteButtonClass = `${buttonClass} bg-red-600/20 text-red-400 border-red-500/30 hover:bg-red-600 hover:text-white`;
  const tableClass = `w-full border-collapse font-mono text-xs rounded-2xl overflow-hidden shadow-2xl`;
  const tableHeaderClass = `bg-[#133b5c]/80 text-[#c6b677] border-b border-white/10 text-left`;
  const tableRowClass = `border-b border-white/5 hover:bg-white/5 transition-colors`;
  const tableCellClass = `px-6 py-4`;
  const deleteIconClass = `cursor-pointer text-red-400 hover:text-red-600 transition-colors focus:outline-none`;
  const logoutButtonClass = `btn-institutional h-10 px-6 bg-red-600/20 text-red-400 border-red-500/30 hover:bg-red-600 hover:text-white text-[10px]`;

  return (
    <div className="min-h-screen bg-[#0b2438] pt-28 px-6 pb-20 overflow-hidden relative">
      {/* Institutional Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#133b5c]/30 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#c6b677]/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto z-10 relative animate-fade-in">
        {/* Header Section */}
        <header className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-12">
          <div className="text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 font-serif">
              Admin <span className="text-[#c6b677]">Command</span>
            </h1>
            <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.5em] flex items-center gap-3">
              <span className="w-8 h-px bg-[#c6b677]/30" /> System Control Interface
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-bold text-[#c6b677] uppercase tracking-widest mb-1">Session Identity</span>
              <span className="text-white/40 font-mono text-xs">ROOT_ADMIN_SECURE_01</span>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("adminToken");
                navigate("/");
              }}
              className={logoutButtonClass}
            >
              <FiLogOut className="mr-3" /> Terminate Session
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-12">
        {/* Student Management Section */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 px-4">
            <div className="w-12 h-px bg-[#c6b677]/20" />
            <h2 className="text-xl font-bold text-white uppercase tracking-[0.3em] font-serif">Student Registry</h2>
            <div className="flex-grow h-px bg-[#c6b677]/20" />
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Register Student Section */}
            <div className="card-institutional border-white/5 overflow-hidden group">
              <button
                className={`w-full p-8 flex justify-between items-center cursor-pointer transition-all duration-300 ${isRegisterOpen ? "bg-[#133b5c]/50" : "hover:bg-white/5"}`}
                onClick={() => setIsRegisterOpen(!isRegisterOpen)}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${isRegisterOpen ? "bg-[#c6b677] text-[#133b5c]" : "bg-[#133b5c] text-white/50"}`}>
                    <FaUniversity size={20} />
                  </div>
                  <h4 className={sectionTitleClass}>Enrollment Protocol</h4>
                </div>
                <div className={`transition-transform duration-500 ${isRegisterOpen ? "rotate-180 text-[#c6b677]" : "text-white/20"}`}>
                  <FaChevronDown size={20} />
                </div>
              </button>
              
              {isRegisterOpen && (
                <div className={collapsibleContentClass}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <input
                      type="text"
                      name="registration_no"
                      placeholder="Institutional ID (Registration)"
                      value={formData.registration_no}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                    <input
                      type="text"
                      name="name"
                      placeholder="Legal Full Name"
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
                      <option value="">Select Academic Branch</option>
                      {subjectData[0].branches.map((b) => (
                        <option key={b.branch} value={b.branch}>{b.branch}</option>
                      ))}
                    </select>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      className={selectClass}
                    >
                      <option value="">Select Enrollment Stage</option>
                      {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map((sem) => (
                        <option key={sem} value={sem}>{sem} Semester</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    <button
                      onClick={handleRegister}
                      className="btn-institutional flex-1 h-14"
                      disabled={isRegistering}
                    >
                      {isRegistering ? <Loader size="h-5 w-5" /> : "Authorize Individual Registration"}
                    </button>
                    
                    <div className="flex items-center">
                      <div className="h-px w-8 bg-white/10" />
                      <span className="px-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">or</span>
                      <div className="h-px w-8 bg-white/10" />
                    </div>

                    <button
                      onClick={() => navigate("/admin/dashboard/multi-register")}
                      className="btn-institutional bg-white text-[#133b5c] flex-1 h-14"
                    >
                      Batch Registration Interface
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Promote Students Section */}
            <div className="card-institutional border-white/5 overflow-hidden group">
              <button
                className={`w-full p-8 flex justify-between items-center cursor-pointer transition-all duration-300 ${isPromoteOpen ? "bg-[#133b5c]/50" : "hover:bg-white/5"}`}
                onClick={() => setIsPromoteOpen(!isPromoteOpen)}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${isPromoteOpen ? "bg-green-500/20 text-green-400" : "bg-[#133b5c] text-white/50"}`}>
                    <FaUniversity size={20} />
                  </div>
                  <h4 className={sectionTitleClass}>Academic Promotion Cycle</h4>
                </div>
                <div className={`transition-transform duration-500 ${isPromoteOpen ? "rotate-180 text-[#c6b677]" : "text-white/20"}`}>
                  <FaChevronDown size={20} />
                </div>
              </button>
              
              {isPromoteOpen && (
                <div className={collapsibleContentClass}>
                  <div className="flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] font-bold text-[#c6b677] uppercase tracking-widest ml-1">Universal Promotion Stage</label>
                      <select
                        value={promotionSemester}
                        onChange={(e) => setPromotionSemester(e.target.value)}
                        className={selectClass}
                      >
                        <option value="">Select Origin Semester</option>
                        {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th"].map((sem) => (
                          <option key={sem} value={sem}>{sem} Semester</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={async () => {
                        if (!promotionSemester) {
                          toast.error("Please select a semester to promote.");
                          return;
                        }
                        const confirmed = window.confirm(`Initiate universal promotion cycle from ${promotionSemester}? This operation is permanent.`);
                        if (confirmed) {
                          setIsPromoting(true);
                          await handlePromote();
                          await deleteStudentAttendanceWhilePromoting(promotionSemester);
                          setIsPromoting(false);
                          setPromotionSemester("");
                        }
                      }}
                      className="btn-institutional bg-green-600/20 text-green-400 border-green-500/30 hover:bg-green-600 hover:text-white h-12 px-10"
                      disabled={isPromoting}
                    >
                      {isPromoting ? <Loader /> : "Authorize Global Promotion"}
                    </button>
                  </div>
                  <p className="mt-6 text-[10px] text-white/30 font-mono tracking-tighter bg-black/20 p-4 rounded-xl border border-white/5">
                    <span className="text-[#c6b677] font-bold uppercase">Note:</span> Executing promotion shifts all student indices to subsequent stages and clears legacy attendance logs for the origin semester.
                  </p>
                </div>
              )}
            </div>

            {/* Update Student Semester Section */}
            <div className="card-institutional border-white/5 overflow-hidden group">
              <button
                className={`w-full p-8 flex justify-between items-center cursor-pointer transition-all duration-300 ${isUpdateOpen ? "bg-[#133b5c]/50" : "hover:bg-white/5"}`}
                onClick={() => setIsUpdateOpen(!isUpdateOpen)}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${isUpdateOpen ? "bg-[#c6b677]/20 text-[#c6b677]" : "bg-[#133b5c] text-white/50"}`}>
                    <FaUniversity size={20} />
                  </div>
                  <h4 className={sectionTitleClass}>Registry Correction (Individual)</h4>
                </div>
                <div className={`transition-transform duration-500 ${isUpdateOpen ? "rotate-180 text-[#c6b677]" : "text-white/20"}`}>
                  <FaChevronDown size={20} />
                </div>
              </button>
              
              {isUpdateOpen && (
                <div className={collapsibleContentClass}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <input
                      type="text"
                      placeholder="Target Student ID"
                      value={updateData.registration_no}
                      onChange={(e) => setUpdateData({ ...updateData, registration_no: e.target.value })}
                      className={inputClass}
                    />
                    <select
                      value={updateData.newSemester}
                      onChange={(e) => setUpdateData({ ...updateData, newSemester: e.target.value })}
                      className={selectClass}
                    >
                      <option value="">Select Adjusted Stage</option>
                      {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map((sem) => (
                        <option key={sem} value={sem}>{sem} Semester</option>
                      ))}
                    </select>
                  </div>
                  <button onClick={handleUpdateSemester} className="btn-institutional h-12 px-10">Authorize Registry Correction</button>
                </div>
              )}
            </div>

            {/* Delete Student Section */}
            <div className="card-institutional border-white/5 overflow-hidden group">
              <button
                className={`w-full p-8 flex justify-between items-center cursor-pointer transition-all duration-300 ${isDeleteOpen ? "bg-[#133b5c]/50" : "hover:bg-white/5"}`}
                onClick={() => setIsDeleteOpen(!isDeleteOpen)}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${isDeleteOpen ? "bg-red-600/20 text-red-400" : "bg-[#133b5c] text-white/50"}`}>
                    <FaUniversity size={20} />
                  </div>
                  <h4 className={sectionTitleClass}>De-enrollment & Archive Disposal</h4>
                </div>
                <div className={`transition-transform duration-500 ${isDeleteOpen ? "rotate-180 text-[#c6b677]" : "text-white/20"}`}>
                  <FaChevronDown size={20} />
                </div>
              </button>
              
              {isDeleteOpen && (
                <div className={collapsibleContentClass}>
                  <div className="space-y-10">
                    <div>
                      <h5 className="text-[10px] font-bold text-[#c6b677] uppercase tracking-widest mb-4 ml-1">Individual De-enrollment</h5>
                      <div className="flex flex-col md:flex-row gap-6">
                        <input
                          type="text"
                          placeholder="Target Institutional ID"
                          value={formData.registration_no}
                          onChange={(e) => setFormData({ ...formData, registration_no: e.target.value })}
                          className="input-institutional flex-1 h-12"
                        />
                        <button
                          onClick={async () => {
                            if (!formData.registration_no) {
                              toast.error("Please enter a registration number.");
                              return;
                            }
                            const confirmed = window.confirm(`Expunge student ${formData.registration_no} from institutional records?`);
                            if (confirmed) {
                              await handleDeleteStudent(formData.registration_no);
                              setFormData({ ...formData, registration_no: "" });
                            }
                          }}
                          className="btn-institutional bg-red-600/20 text-red-400 border-red-500/30 hover:bg-red-600 hover:text-white h-12 px-10"
                          disabled={isDeleting}
                        >
                          {isDeleting ? <Loader /> : "Authorize Expulsion"}
                        </button>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                      <h5 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-4 ml-1">Final Cycle Disposal (8th Semester)</h5>
                      <button
                        onClick={deleteStudentsOfLastSemester}
                        className="btn-institutional w-full h-14 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border-red-500/20"
                        disabled={isDeletingLastSemester}
                      >
                        {isDeletingLastSemester ? <Loader /> : "Expunge All Graduating Cohort Records (8th Semester)"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Teacher Management Section */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 px-4">
            <div className="w-12 h-px bg-[#c6b677]/20" />
            <h2 className="text-xl font-bold text-white uppercase tracking-[0.3em] font-serif">Faculty Governance</h2>
            <div className="flex-grow h-px bg-[#c6b677]/20" />
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Add Teacher Section */}
            <div className="card-institutional border-white/5 overflow-hidden group">
              <button
                className={`w-full p-8 flex justify-between items-center cursor-pointer transition-all duration-300 ${isAddTeacherOpen ? "bg-[#133b5c]/50" : "hover:bg-white/5"}`}
                onClick={() => setIsAddTeacherOpen(!isAddTeacherOpen)}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${isAddTeacherOpen ? "bg-[#c6b677] text-[#133b5c]" : "bg-[#133b5c] text-white/50"}`}>
                    <FaUserShield size={20} />
                  </div>
                  <h4 className={sectionTitleClass}>Faculty Induction</h4>
                </div>
                <div className={`transition-transform duration-500 ${isAddTeacherOpen ? "rotate-180 text-[#c6b677]" : "text-white/20"}`}>
                  <FaChevronDown size={20} />
                </div>
              </button>
              
              {isAddTeacherOpen && (
                <div className={collapsibleContentClass}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <input
                      type="text"
                      name="employee_id"
                      placeholder="Employee Reference ID"
                      value={teacherData.employee_id}
                      onChange={handleTeacherChange}
                      className={inputClass}
                    />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Legal Name"
                      value={teacherData.name}
                      onChange={handleTeacherChange}
                      className={inputClass}
                    />
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Security Password"
                        value={teacherData.password}
                        onChange={handleTeacherChange}
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#c6b677] transition-colors cursor-pointer"
                      >
                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Verify Password"
                        value={teacherData.confirmPassword}
                        onChange={handleTeacherChange}
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#c6b677] transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>
                  </div>
                  <button onClick={handleAddTeacher} className="btn-institutional h-12 px-10">Authorize Faculty Induction</button>
                </div>
              )}
            </div>

            {/* Reset Teacher Password Section */}
            <div className="card-institutional border-white/5 overflow-hidden group">
              <button
                className={`w-full p-8 flex justify-between items-center cursor-pointer transition-all duration-300 ${IsResetPasswordOpen ? "bg-[#133b5c]/50" : "hover:bg-white/5"}`}
                onClick={() => setIsResetPasswordOpen(!IsResetPasswordOpen)}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${IsResetPasswordOpen ? "bg-[#c6b677]/20 text-[#c6b677]" : "bg-[#133b5c] text-white/50"}`}>
                    <FaUserShield size={20} />
                  </div>
                  <h4 className={sectionTitleClass}>Credential Restoration</h4>
                </div>
                <div className={`transition-transform duration-500 ${IsResetPasswordOpen ? "rotate-180 text-[#c6b677]" : "text-white/20"}`}>
                  <FaChevronDown size={20} />
                </div>
              </button>
              
              {IsResetPasswordOpen && (
                <div className={collapsibleContentClass}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <input
                      type="text"
                      placeholder="Faculty ID"
                      value={resetPasswordData.employee_id}
                      onChange={(e) => setResetPasswordData({ ...resetPasswordData, employee_id: e.target.value })}
                      className={inputClass}
                    />
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="New Password"
                        value={resetPasswordData.newPassword}
                        onChange={(e) => setResetPasswordData({ ...resetPasswordData, newPassword: e.target.value })}
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#c6b677] transition-colors cursor-pointer"
                      >
                        {showNewPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showConfirmNewPassword ? "text" : "password"}
                        placeholder="Confirm New"
                        value={resetPasswordData.confirmNewPassword}
                        onChange={(e) => setResetPasswordData({ ...resetPasswordData, confirmNewPassword: e.target.value })}
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#c6b677] transition-colors cursor-pointer"
                      >
                        {showConfirmNewPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleResetPassword}
                    className="btn-institutional h-12 px-10"
                    disabled={isResettingPassword}
                  >
                    {isResettingPassword ? <Loader /> : "Restore Credentials"}
                  </button>
                </div>
              )}
            </div>

            {/* List of Teachers Section */}
            <div className="card-institutional border-white/5 overflow-hidden group">
              <button
                className={`w-full p-8 flex justify-between items-center cursor-pointer transition-all duration-300 ${isTeacherListOpen ? "bg-[#133b5c]/50" : "hover:bg-white/5"}`}
                onClick={() => setIsTeacherListOpen(!isTeacherListOpen)}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${isTeacherListOpen ? "bg-[#133b5c] text-white/50" : "bg-[#133b5c] text-white/50"}`}>
                    <FaUserShield size={20} />
                  </div>
                  <h4 className={sectionTitleClass}>Institutional Faculty Directory</h4>
                </div>
                <div className={`transition-transform duration-500 ${isTeacherListOpen ? "rotate-180 text-[#c6b677]" : "text-white/20"}`}>
                  <FaChevronDown size={20} />
                </div>
              </button>
              
              {isTeacherListOpen && (
                <div className={collapsibleContentClass}>
                  <div className="overflow-x-auto rounded-[1.5rem] border border-white/5 shadow-2xl">
                    <table className={tableClass}>
                      <thead>
                        <tr className={tableHeaderClass}>
                          <th className={tableCellClass}>Full Name</th>
                          <th className={tableCellClass}>Institutional ID</th>
                          <th className={`${tableCellClass} text-center`}>Administrative Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {teacherList.length > 0 ? (
                          teacherList.map((teacher) => (
                            <tr key={teacher.id} className={tableRowClass}>
                              <td className={`${tableCellClass} text-white font-bold`}>{teacher.name}</td>
                              <td className={`${tableCellClass} text-white/50 font-mono`}>{teacher.employee_id}</td>
                              <td className={`${tableCellClass} text-center`}>
                                <button
                                  onClick={() => handleDeleteTeacher(teacher.employee_id, teacher.name)}
                                  className={deleteIconClass}
                                  title="Revoke Access"
                                >
                                  <AiOutlineDelete size={22} />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className={`${tableCellClass} text-center text-white/30 italic py-10`}>
                              No faculty records identified in the secure database.
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
        </section>
      </div>
    </div>
  </div>
);
};

export default AdminDashboard;
