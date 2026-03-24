import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import subjectsData from "../assets/subjectData";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { TrashIcon } from "@heroicons/react/24/outline";
import { FaGraduationCap, FaClipboardList, FaUsers, FaBook, FaPlus, FaCheck } from "react-icons/fa";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [subject, setSubject] = useState("");

  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [userSubjects, setUserSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [addSubjectLoading, setAddSubjectLoading] = useState(false);
  const [fetchSubjectsLoading, setFetchSubjectsLoading] = useState(true);
  const [fetchStudentsLoading, setFetchStudentsLoading] = useState(false);
  const [removeSubjectLoading, setRemoveSubjectLoading] = useState(null);
  const [submitAttendanceLoading, setSubmitAttendanceLoading] = useState(false);
  const [selectedSubjectForAttendance, setSelectedSubjectForAttendance] = useState(null);
  const [previousTotalClasses, setPreviousTotalClasses] = useState("");

  const getOrdinalSuffix = (value) => {
    if (typeof value === "string" && /^\d+(st|nd|rd|th)$/.test(value)) return value;
    const number = parseInt(value);
    const suffixes = ["th", "st", "nd", "rd"];
    const remainder = number % 100;
    return `${number}${suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]}`;
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchUserSubjects();
    }
  }, [user, navigate]);

  const fetchUserSubjects = () => {
    if (!user?.id) {
      setFetchSubjectsLoading(false);
      return;
    }
    setFetchSubjectsLoading(true);
    axios
      .get(`https://dce-attendance.onrender.com/api/dashboard/subjects/${user.id}`)
      .then((res) => {
        setUserSubjects(res.data);
      })
      .catch((err) => {
        console.error("Error fetching subjects:", err);
        toast.error("No Subject Found");
      })
      .finally(() => setFetchSubjectsLoading(false));
  };

  useEffect(() => {
    if (semester) {
      const selectedSemester = subjectsData.find((sem) => sem.semester === semester);
      setBranches(selectedSemester ? selectedSemester.branches.map((b) => b.branch) : []);
      setBranch("");
      setSubjects([]);
    } else {
      setBranches([]);
    }
  }, [semester]);

  useEffect(() => {
    if (semester && branch) {
      const selectedSemester = subjectsData.find((sem) => sem.semester === semester);
      const selectedBranch = selectedSemester?.branches.find((b) => b.branch === branch);
      setSubjects(selectedBranch ? selectedBranch.subjects.map((sub) => sub.name) : []);
      setSubject("");
    } else {
      setSubjects([]);
    }
  }, [branch, semester]);

  const handleAddSubject = async () => {
    if (!user?.id) {
      navigate("/login");
      return;
    }
    if (!semester || !branch || !subject) {
      toast.error("Please select all fields.");
      return;
    }

    setAddSubjectLoading(true);
    const ordinalSemester = getOrdinalSuffix(semester);
    const payload = {
      teacher_id: user.id,
      subject,
      semester: ordinalSemester,
      branch,
    };

    try {
      await axios.post("https://dce-attendance.onrender.com/api/dashboard/add-subjects", payload);
      fetchUserSubjects();
      toast.success("Subject added!");
      setSemester("");
      setBranch("");
      setSubject("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add subject");
    } finally {
      setAddSubjectLoading(false);
    }
  };

  const fetchStudents = async (selectedSubject, selectedSemester, selectedBranch) => {
    const ordinalSemester = getOrdinalSuffix(selectedSemester);
    setFetchStudentsLoading(true);
    setStudents([]);
    setAttendance([]);
    setSelectedSubjectForAttendance(selectedSubject);

    try {
      const studentsRes = await axios.get(`https://dce-attendance.onrender.com/api/dashboard/students/${ordinalSemester}/${selectedBranch}`);
      const studentList = studentsRes.data;
      setStudents(studentList);

      try {
        const attendanceRes = await axios.get(`https://dce-attendance.onrender.com/api/dashboard/attendance/${ordinalSemester}/${selectedBranch}/${selectedSubject}`);
        const pastAttendance = attendanceRes.data;

        if (!pastAttendance || pastAttendance.length === 0) {
          setPreviousTotalClasses("");
          setAttendance(studentList.map((s) => ({
            student_id: s.id,
            subject: selectedSubject,
            semester: ordinalSemester,
            branch: selectedBranch,
            total_classes: 0,
            attended_classes: 0,
          })));
          return;
        }

        setPreviousTotalClasses(pastAttendance[0].total_classes);
        setAttendance(studentList.map((s) => {
          const record = pastAttendance.find((r) => r.student_id === s.id);
          return {
            student_id: s.id,
            subject: selectedSubject,
            semester: ordinalSemester,
            branch: selectedBranch,
            total_classes: record ? record.total_classes : 0,
            attended_classes: record ? record.attended_classes : 0,
          };
        }));
      } catch (err) {
        setAttendance(studentList.map((s) => ({
          student_id: s.id,
          subject: selectedSubject,
          semester: ordinalSemester,
          branch: selectedBranch,
          total_classes: 0,
          attended_classes: 0,
        })));
      }
    } catch (err) {
      toast.error("No students found.");
    } finally {
      setFetchStudentsLoading(false);
    }
  };

  const handleTotalClassesChange = (value) => {
    const numericValue = value === "" ? 0 : Math.max(0, Number(value));
    setPreviousTotalClasses(numericValue);
    setAttendance(prev => prev.map(e => ({ ...e, total_classes: numericValue })));
  };

  const handleInputChange = (index, field, value) => {
    setAttendance(prev => {
      const updated = [...prev];
      updated[index][field] = value === "" ? 0 : Math.max(0, Number(value));
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!attendance.length) return;
    setSubmitAttendanceLoading(true);
    try {
      await axios.post("https://dce-attendance.onrender.com/api/dashboard/attendance/update", attendance);
      toast.success("Records updated!");
    } catch (err) {
      toast.error("Update failed.");
    } finally {
      setSubmitAttendanceLoading(false);
    }
  };

  const handleRemoveSubject = async (sub, sem, br) => {
    if (!window.confirm(`Remove ${sub}?`)) return;
    const ordinalSem = getOrdinalSuffix(sem);
    setRemoveSubjectLoading(sub);
    try {
      await axios.delete("https://dce-attendance.onrender.com/api/dashboard/remove-subject", {
        data: { teacher_id: user.id, subject: sub, semester: ordinalSem, branch: br }
      });
      toast.success("Removed.");
      fetchUserSubjects();
      if (selectedSubjectForAttendance === sub) setStudents([]);
    } catch (err) {
      toast.error("Removal failed.");
    } finally {
      setRemoveSubjectLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b2438] pt-28 px-6 pb-20 overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#133b5c]/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#c6b677]/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto z-10 relative animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 font-serif">
              Welcome, <span className="text-[#c6b677]">{user?.name}</span>
            </h1>
            <p className="text-white/50 font-mono text-sm uppercase tracking-widest">Faculty Research & Attendance Console</p>
          </div>
          <div className="flex items-center gap-4 bg-[#133b5c]/40 border border-[#c6b677]/20 px-6 py-3 rounded-full shadow-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-[#c6b677] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#c6b677]">Teacher Module</span>
          </div>
        </div>

        {/* Selection Grid */}
        <div className="card-institutional p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Semester Selection</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="input-institutional cursor-pointer font-bold text-sm"
              >
                <option value="">Select Semester</option>
                {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map(sem => (
                  <option key={sem} value={sem}>{sem} Semester</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Academic Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="input-institutional cursor-pointer font-bold text-sm disabled:opacity-30"
                disabled={!semester}
              >
                <option value="">Select Branch</option>
                {branches.map(br => <option key={br} value={br}>{br}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Subject Title</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="input-institutional cursor-pointer font-bold text-sm disabled:opacity-30"
                disabled={!branch}
              >
                <option value="">Select Subject</option>
                {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleAddSubject}
                disabled={!subject || addSubjectLoading}
                className="btn-institutional w-full h-12"
              >
                {addSubjectLoading ? "Adding..." : <><FaPlus size={14} /> Assign Subject</>}
              </button>
            </div>
          </div>
        </div>

        {/* Subject Grid */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-2xl font-bold text-white font-serif flex items-center gap-4">
              <FaBook size={24} className="text-[#c6b677]" /> Active Assignments
            </h3>
            <span className="font-mono text-xs text-[#c6b677] uppercase tracking-tighter bg-[#c6b677]/10 px-4 py-1.5 rounded-full border border-[#c6b677]/20">
              {userSubjects?.length || 0} Modules Assigned
            </span>
          </div>

          {fetchSubjectsLoading ? (
            <div className="flex justify-center py-20"><Loader /></div>
          ) : userSubjects?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {userSubjects.map((sub, i) => (
                <div key={i} className="card-institutional group hover:-translate-y-2 overflow-hidden">
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-[#c6b677] flex items-center justify-center text-[#133b5c] shadow-lg group-hover:scale-110 transition-transform">
                        <FaClipboardList size={24} />
                      </div>
                      <button
                        onClick={() => handleRemoveSubject(sub.subject, sub.semester, sub.branch)}
                        className="text-white/20 hover:text-red-500 transition-colors p-2"
                      >
                        <TrashIcon className="h-6 w-6" />
                      </button>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2 font-serif group-hover:text-[#c6b677] transition-colors">{sub.subject}</h4>
                      <div className="flex flex-wrap gap-2 mb-8">
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white/50">{sub.semester}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white/50">{sub.branch}</span>
                      </div>
                      <button
                        onClick={() => fetchStudents(sub.subject, sub.semester, sub.branch)}
                        className="w-full py-3 rounded-full border border-[#c6b677]/20 text-[#c6b677] font-bold uppercase tracking-widest text-[10px] hover:bg-[#c6b677] hover:text-white transition-all duration-300"
                      >
                        Launch Attendance List
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border-2 border-dashed border-white/10 rounded-[2.5rem] bg-white/5">
              <p className="text-white/30 font-serif text-lg italic">No active assignments found.</p>
            </div>
          )}
        </div>

        {/* Students Table */}
        {students?.length > 0 && (
          <div className="animate-fade-in">
            <div className="flex flex-col lg:flex-row justify-between items-end mb-10 gap-8">
              <div>
                <h3 className="text-3xl font-extrabold text-white mb-3 font-serif">
                  Sheet: <span className="text-[#c6b677]">{selectedSubjectForAttendance}</span>
                </h3>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <FaUsers size={14} /> {students.length} Registered Students
                  </span>
                </div>
              </div>

              <div className="w-full lg:w-72 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#c6b677] ml-1">Cumulative Total Classes</label>
                <div className="relative">
                  <input
                    type="text"
                    className="input-institutional text-center font-mono text-lg font-bold !bg-[#133b5c]/80"
                    placeholder="Enter Total"
                    value={previousTotalClasses}
                    onChange={(e) => /^\d*$/.test(e.target.value) && handleTotalClassesChange(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="card-institutional overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#133b5c]/60 border-b border-white/10">
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#c6b677]">Registration #</th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#c6b677]">Student Identity</th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#c6b677] text-center">Sessions Present</th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-[#c6b677] text-center">Calculated %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-sm">
                    {students.sort((a,b) => a.registration_no.localeCompare(b.registration_no)).map((s, idx) => {
                      const present = attendance[idx]?.attended_classes || 0;
                      const total = attendance[idx]?.total_classes || 0;
                      const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : "0.0";
                      
                      return (
                        <tr key={s.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-8 py-5 text-white/70">{s.registration_no}</td>
                          <td className="px-8 py-5 text-white font-bold group-hover:text-[#c6b677] transition-colors">{s.name}</td>
                          <td className="px-8 py-5">
                            <div className="flex justify-center">
                              <input
                                type="text"
                                value={present}
                                onChange={(e) => /^\d*$/.test(e.target.value) && handleInputChange(idx, "attended_classes", e.target.value)}
                                className="w-24 text-center py-2.5 rounded-xl bg-white/5 border-2 border-white/10 text-white font-bold focus:border-[#c6b677] outline-none transition-all"
                              />
                            </div>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <span className={`px-4 py-1.5 rounded-full font-bold text-xs ${percentage < 75 ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>
                              {percentage}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-12 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={submitAttendanceLoading}
                className="btn-institutional px-12 h-14 bg-white hover:bg-[#c6b677] text-lg"
              >
                {submitAttendanceLoading ? "Syncing..." : <><FaCheck size={18} /> Finalize Records</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
