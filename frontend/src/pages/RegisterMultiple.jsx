import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import subjectsData from "../assets/subjectData";
import toast from "react-hot-toast";
import { 
  FaArrowLeft, 
  FaUserPlus, 
  FaTrash, 
  FaIdCard, 
  FaUserGraduate, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaUniversity
} from "react-icons/fa";

const Loader = ({ size = "h-4 w-4" }) => (
  <div className={`animate-spin rounded-full border-2 border-white/20 border-t-white ${size}`} />
);

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

  const branches = semester
    ? subjectsData.find((sem) => sem.semester === semester)?.branches?.map((b) => b.branch) || []
    : [];

  const inputClass = `input-institutional h-12 text-sm`;
  const selectClass = `input-institutional h-12 text-sm cursor-pointer`;
  const buttonClass = `btn-institutional px-8 h-12 text-[10px] tracking-[0.2em]`;
  const addButtonClass = `btn-institutional bg-green-600/20 text-green-400 border-green-500/30 hover:bg-green-600 hover:text-white px-8 h-12 text-[10px] tracking-[0.2em]`;
  const deleteButtonClass = `btn-institutional bg-red-600/20 text-red-400 border-red-500/30 hover:bg-red-600 hover:text-white h-10 w-10 p-0 flex items-center justify-center`;
  const secondaryButtonClass = `btn-institutional bg-white text-[#133b5c] px-8 h-12 text-[10px] tracking-[0.2em]`;

  // Validate input fields
  const validateField = (name, value) => {
    let error = "";
    if (name === "semester" || name === "branch") {
      if (!value) error = `Please select ${name}.`;
    } else if (name === "registration_no") {
      const trimmedValue = value.trim();
      if (!trimmedValue) {
        error = "Institutional ID required.";
      } else if (
        students.some(
          (student) =>
            student.registration_no.trim().toLowerCase() ===
            trimmedValue.toLowerCase()
        )
      ) {
        error = "ID already exists in transmission queue.";
      }
    } else if (name === "name") {
      if (!value.trim()) error = "Legal name required.";
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
    toast.success("Identity sequenced for induction.");
  };

  // Delete student
  const handleDeleteStudent = (index) => {
    if (index < 0 || index >= students.length) return;
    const confirmDelete = window.confirm(
      "Expunge this identity from the current induction queue?"
    );
    if (!confirmDelete) return;
    setStudents((prev) => prev.filter((_, i) => i !== index));
  };

  // Clear all students
  const handleClearAll = () => {
    const confirmClear = window.confirm(
      "Purge entire induction queue? This operation cannot be reversed."
    );
    if (!confirmClear) return;
    setStudents([]);
    localStorage.removeItem("pendingStudents");
  };

  // Submit all students
  const handleRegisterAll = async () => {
    if (students.length === 0) {
      toast.error("Transmission queue is empty.");
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

      toast.success("Collective induction sequence successful.");
      setSemester("");
      setBranch("");
      setStudents([]);
      localStorage.removeItem("pendingStudents");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      toast.error(
        err.response?.data?.error ||
          "Transmission failure. Verify system uplink."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b2438] pt-28 px-6 pb-20 overflow-hidden relative font-inter">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#133b5c]/30 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#c6b677]/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto z-10 relative animate-fade-in">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 border-b border-white/5 pb-10">
          <div>
            <button 
              onClick={() => navigate(-1)} 
              className="group flex items-center gap-3 text-white/40 hover:text-[#c6b677] transition-all duration-500 mb-6 font-mono text-[10px] uppercase tracking-[0.3em]"
            >
              <FaArrowLeft className="group-hover:-translate-x-2 transition-transform" /> 
              Return to Command
            </button>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 font-serif">
              Batch <span className="text-[#c6b677]">Induction</span>
            </h1>
            <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.5em] flex items-center gap-3">
              <span className="w-8 h-px bg-[#c6b677]/30" /> Sequential Student Enrollment
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-[10px] font-bold text-[#c6b677] uppercase tracking-widest block mb-1">Queue Status</span>
              <span className="text-white/60 font-mono text-xs">{students.length} Identities Buffered</span>
            </div>
            {students.length > 0 && (
              <button onClick={handleClearAll} className="btn-institutional bg-red-600/10 text-red-500 border-red-500/20 hover:bg-red-600 hover:text-white h-10 px-4">
                <FaTrash size={12} />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Configuration Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="card-institutional p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <FaUniversity className="text-[#c6b677]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Academic Parameters</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Semester Cycle</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className={selectClass}
                    disabled={students.length > 0}
                  >
                    <option value="">Select Semester</option>
                    {subjectsData.map((sem) => (
                      <option key={sem.semester} value={sem.semester}>{sem.semester} Semester</option>
                    ))}
                  </select>
                  {validationErrors.semesterError && (
                    <p className="flex items-center gap-2 text-red-400 text-[10px] font-mono mt-1 ml-1 animate-pulse">
                      <FaExclamationTriangle /> {validationErrors.semesterError}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Departmental Branch</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className={selectClass}
                    disabled={!semester || students.length > 0}
                  >
                    <option value="">Select Branch</option>
                    {branches.map((br) => (
                      <option key={br} value={br}>{br}</option>
                    ))}
                  </select>
                  {validationErrors.branchError && (
                    <p className="flex items-center gap-2 text-red-400 text-[10px] font-mono mt-1 ml-1 animate-pulse">
                      <FaExclamationTriangle /> {validationErrors.branchError}
                    </p>
                  )}
                </div>
              </div>
              
              {students.length > 0 && (
                <div className="bg-[#133b5c]/20 border border-white/5 p-4 rounded-xl">
                  <p className="text-[10px] text-white/40 font-mono leading-relaxed italic">
                    <span className="text-[#c6b677]">Note:</span> Parameters are locked while identities are buffered in the queue to maintain data integrity.
                  </p>
                </div>
              )}
            </div>

            <div className="card-institutional p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <FaUserPlus className="text-[#c6b677]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Identify Sequencing</h3>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Institutional ID</label>
                  <input
                    type="text"
                    value={currentRegistrationId}
                    onChange={(e) => {
                      setCurrentRegistrationId(e.target.value);
                      setValidationErrors((prev) => ({ ...prev, regIdError: "" }));
                    }}
                    placeholder="e.g. 2101XXYY"
                    className={inputClass}
                    maxLength={20}
                  />
                  {validationErrors.regIdError && (
                    <p className="flex items-center gap-2 text-red-400 text-[10px] font-mono mt-1 ml-1">
                      <FaExclamationTriangle /> {validationErrors.regIdError}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Legal Full Name</label>
                  <input
                    type="text"
                    value={currentStudentName}
                    onChange={(e) => {
                      setCurrentStudentName(e.target.value);
                      setValidationErrors((prev) => ({ ...prev, nameError: "" }));
                    }}
                    placeholder="Institutional record name"
                    className={inputClass}
                    maxLength={50}
                  />
                  {validationErrors.nameError && (
                    <p className="flex items-center gap-2 text-red-400 text-[10px] font-mono mt-1 ml-1">
                      <FaExclamationTriangle /> {validationErrors.nameError}
                    </p>
                  )}
                </div>

                <button onClick={handleAddStudent} className={addButtonClass + " w-full font-bold uppercase tracking-[0.3em]"}>
                  <FaCheckCircle className="mr-2" /> Buffer Identity
                </button>
              </div>
            </div>
          </div>

          {/* Queue Column */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="card-institutional flex-1 flex flex-col overflow-hidden min-h-[400px]">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/2">
                <div className="flex items-center gap-3">
                  <FaIdCard className="text-[#c6b677]" size={18} />
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest font-serif">Transmission Buffer</h3>
                </div>
                {students.length > 0 && (
                  <button 
                    onClick={handleRegisterAll} 
                    className={buttonClass + " px-6"}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader /> : <><FaUserGraduate className="mr-2" /> Finalize Transmission</>}
                  </button>
                )}
              </div>

              <div className="flex-grow overflow-auto">
                {students.length > 0 ? (
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead className="bg-[#133b5c]/50 text-[#c6b677]">
                      <tr>
                        <th className="px-8 py-5 font-bold uppercase tracking-widest">Identity ID</th>
                        <th className="px-8 py-5 font-bold uppercase tracking-widest">Enrolled Name</th>
                        <th className="px-8 py-5 font-bold uppercase tracking-widest text-center w-24">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {students.map((student, index) => (
                        <tr key={index} className="hover:bg-white/5 transition-colors group">
                          <td className="px-8 py-4 text-white font-bold">{student.registration_no}</td>
                          <td className="px-8 py-4 text-white/70">{student.name}</td>
                          <td className="px-8 py-4 text-center">
                            <button
                              onClick={() => handleDeleteStudent(index)}
                              className="text-white/20 hover:text-red-500 transition-colors p-2"
                            >
                              <FaTrash size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-20 text-center opacity-20">
                    <FaUserGraduate size={60} className="mb-6" />
                    <p className="font-serif text-xl italic">No identities sequenced for induction</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest mt-2">Awaiting transmission buffer input...</p>
                  </div>
                )}
              </div>
            </div>
            
            {students.length > 0 && (
              <div className="card-institutional p-8 bg-green-500/5 border-green-500/10 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                    <FaCheckCircle size={24} />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold uppercase tracking-widest">Sequence Ready</h4>
                    <p className="text-white/40 text-[10px] font-mono mt-1">Status: OK - Uplink Synchronized</p>
                  </div>
                </div>
                <button 
                  onClick={handleRegisterAll} 
                  className="btn-institutional bg-white text-[#133b5c] px-10 h-14"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader /> : "Authorize Global Induction"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterMultiple;
