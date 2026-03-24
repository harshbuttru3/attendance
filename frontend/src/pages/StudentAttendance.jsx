import React, { useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import toast from "react-hot-toast";
import { FaClipboardList, FaDownload, FaChevronDown, FaChevronUp, FaUniversity, FaFilter } from "react-icons/fa";
import Loader from "../components/Loader";

const StudentAttendance = () => {
  const { darkMode } = useContext(ThemeContext);
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [attendanceData, setAttendanceData] = useState({});
  const [summaryData, setSummaryData] = useState({});
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatSemester = (sem) => {
    const suffixes = { "1": "1st", "2": "2nd", "3": "3rd", "4": "4th", "5": "5th", "6": "6th", "7": "7th", "8": "8th" };
    return suffixes[sem] || sem;
  };

  const fetchAttendance = () => {
    if (semester && branch) {
      setIsLoading(true);
      setAttendanceData({});
      setSummaryData({});
      const formattedSemester = formatSemester(semester);

      axios
        .get(`https://dce-attendance.onrender.com/api/student-attendance/${formattedSemester}/${branch}`)
        .then((res) => {
          setIsLoading(false);
          const filteredData = Object.keys(res.data || {}).reduce((acc, subject) => {
            if (subject && subject !== "null" && Array.isArray(res.data[subject])) {
              acc[subject] = res.data[subject];
            }
            return acc;
          }, {});

          if (Object.keys(filteredData).length > 0) {
            setAttendanceData(filteredData);
            setSummaryData(calculateSummary(filteredData));
          } else {
            toast.error("No valid records found.");
          }
        })
        .catch((err) => {
          setIsLoading(false);
          toast.error("Attendance records not found.");
        });
    } else {
      toast.error("Select both semester and branch.");
    }
  };

  const calculateSummary = (data) => {
    let summary = {};
    Object.keys(data).forEach((subject) => {
      data[subject].forEach((student) => {
        if (!summary[student.registration_no]) {
          summary[student.registration_no] = {
            name: student.name,
            total_classes: 0,
            attended_classes: 0,
            subjects: {},
          };
        }
        summary[student.registration_no].total_classes += student.total_classes;
        summary[student.registration_no].attended_classes += student.attended_classes;
        summary[student.registration_no].subjects[subject] = {
          total_classes: student.total_classes,
          attended_classes: student.attended_classes,
        };
      });
    });
    return summary;
  };

  const exportToCSV = (dataType, subject = null) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (dataType === "subject" && subject) {
      const subjectData = attendanceData[subject];
      csvContent += "Subject,Reg No,Name,Total,Attended,%,Low Attendance\n";
      subjectData.forEach((s) => {
        const pct = s.total_classes > 0 ? (s.attended_classes / s.total_classes) * 100 : 0;
        csvContent += `${subject},${s.registration_no},${s.name},${s.total_classes},${s.attended_classes},${pct.toFixed(2)}%,${pct < 75 ? "Yes" : "No"}\n`;
      });
    } else if (dataType === "summary") {
      csvContent += "Reg No,Name,";
      Object.keys(attendanceData).forEach(sub => csvContent += `${sub} Total,${sub} Attended,`);
      csvContent += "Total,Attended,%,Low Attendance\n";
      Object.keys(summaryData).forEach((regId) => {
        const s = summaryData[regId];
        csvContent += `${regId},${s.name},`;
        Object.keys(attendanceData).forEach((sub) => {
          const sd = s.subjects[sub] || { total_classes: 0, attended_classes: 0 };
          csvContent += `${sd.total_classes},${sd.attended_classes},`;
        });
        const pct = s.total_classes > 0 ? (s.attended_classes / s.total_classes) * 100 : 0;
        csvContent += `${s.total_classes},${s.attended_classes},${pct.toFixed(2)}%,${pct < 75 ? "Yes" : "No"}\n`;
      });
    }
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Attendance_${dataType === "subject" ? subject : "Summary"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0b2438] pt-28 px-6 pb-20 overflow-hidden relative">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#133b5c]/30 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#c6b677]/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto z-10 relative animate-fade-in">
        {/* Header Section */}
        <header className="mb-16 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 font-serif">
              Attendance <span className="text-[#c6b677]">Archives</span>
            </h1>
            <p className="text-white/50 font-mono text-sm uppercase tracking-widest flex items-center gap-3">
              <FaUniversity className="text-[#c6b677]" /> Institutional Reporting Portal
            </p>
          </div>
          <div className="flex items-center gap-4 bg-[#133b5c]/40 border border-[#c6b677]/20 px-8 py-4 rounded-full shadow-2xl backdrop-blur-md">
            <FaFilter className="text-[#c6b677] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#c6b677]">Public Records Access</span>
          </div>
        </header>

        {/* Filter Selection */}
        <div className="card-institutional p-10 mb-16 border-white/5 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#c6b677] ml-2">Academic Semester</label>
              <select
                onChange={(e) => setSemester(e.target.value)}
                className="input-institutional cursor-pointer font-bold text-sm h-14"
              >
                <option value="">Select Semester</option>
                {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map(sem => (
                  <option key={sem} value={sem}>{sem} Semester</option>
                ))}
              </select>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#c6b677] ml-2">Departmental Branch</label>
              <select
                onChange={(e) => setBranch(e.target.value)}
                className="input-institutional cursor-pointer font-bold text-sm h-14"
              >
                <option value="">Select Department</option>
                {["CSE", "FTS", "EEE", "Cybersecurity", "Civil", "Mechanical"].map(br => (
                  <option key={br} value={br}>{br}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchAttendance}
                disabled={!semester || !branch || isLoading}
                className="btn-institutional w-full h-14 shadow-xl hover:shadow-[#c6b677]/20"
              >
                {isLoading ? <Loader /> : "Initialize Query"}
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Content */}
        <div className="space-y-8">
          {Object.keys(attendanceData).length > 0 && (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-4 mb-10 px-4">
                <div className="w-12 h-px bg-white/10" />
                <h2 className="text-xl font-bold text-white uppercase tracking-[0.3em] font-serif">Academic Subject Records</h2>
                <div className="flex-grow h-px bg-white/10" />
              </div>

              <div className="grid grid-cols-1 gap-6">
                {Object.keys(attendanceData).map((subject, index) => (
                  <div key={index} className="card-institutional border-white/5 overflow-hidden group">
                    <button
                      className={`w-full p-8 flex justify-between items-center cursor-pointer transition-all duration-300 ${
                        expandedSubject === subject ? "bg-[#133b5c]/50" : "hover:bg-white/5"
                      }`}
                      onClick={() => setExpandedSubject(expandedSubject === subject ? null : subject)}
                    >
                      <div className="flex items-center gap-8">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                          expandedSubject === subject ? "bg-[#c6b677] text-[#133b5c] rotate-12" : "bg-[#133b5c] text-white/50"
                        }`}>
                          <FaClipboardList size={24} />
                        </div>
                        <div className="text-left">
                          <h3 className="text-xl font-bold text-white font-serif mb-1 group-hover:text-[#c6b677] transition-colors">{subject}</h3>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Detailed Participation Log</p>
                        </div>
                      </div>
                      <div className={`transition-transform duration-500 ${expandedSubject === subject ? "rotate-180 text-[#c6b677]" : "text-white/20"}`}>
                        <FaChevronDown size={20} />
                      </div>
                    </button>

                    {expandedSubject === subject && (
                      <div className="p-8 border-t border-white/5 bg-[#0b2438]/50 animate-fade-in">
                        <div className="mb-10 flex justify-end">
                          <button
                            onClick={() => exportToCSV("subject", subject)}
                            className="flex items-center gap-3 px-6 py-2.5 rounded-full border border-[#c6b677]/20 text-[#c6b677] text-[10px] font-bold uppercase tracking-widest hover:bg-[#c6b677] hover:text-white transition-all duration-500"
                          >
                            <FaDownload size={12} /> Archival Export (.CSV)
                          </button>
                        </div>

                        <div className="overflow-x-auto rounded-[1.5rem] border border-white/5 shadow-2xl">
                          <table className="w-full text-left border-collapse font-mono text-sm">
                            <thead>
                              <tr className="bg-[#133b5c]/80 text-[#c6b677] border-b border-white/10">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">Student Index</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">Full Name</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-center">Total Sessions</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-center">Attended</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-center">Calculated %</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {attendanceData[subject].map((s, idx) => {
                                const pct = s.total_classes > 0 ? (s.attended_classes / s.total_classes) * 100 : 0;
                                return (
                                  <tr key={idx} className={`${pct < 75 ? "bg-red-500/5" : ""} hover:bg-white/5 transition-colors`}>
                                    <td className="px-8 py-5 text-white/50">{s.registration_no}</td>
                                    <td className="px-8 py-5 text-white font-bold">{s.name}</td>
                                    <td className="px-8 py-5 text-center text-white/50">{s.total_classes}</td>
                                    <td className="px-8 py-5 text-center text-[#c6b677] font-bold">{s.attended_classes}</td>
                                    <td className={`px-8 py-5 text-center font-bold font-mono text-base ${pct < 75 ? "text-red-400" : "text-green-400"}`}>
                                      {pct.toFixed(1)}%
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Consolidated Section */}
              <div className="mt-20 card-institutional border-[#c6b677]/20 bg-[#c6b677]/5 overflow-hidden shadow-3xl">
                <button
                  className="w-full p-10 flex justify-between items-center cursor-pointer group"
                  onClick={() => setShowSummary(!showSummary)}
                >
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 rounded-full bg-[#c6b677] text-[#133b5c] flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform duration-500">
                      <FaClipboardList size={28} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-2xl font-extrabold text-[#c6b677] font-serif uppercase tracking-widest">Consolidated Performance Analytics</h3>
                      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">Across All Enrolled Modules</p>
                    </div>
                  </div>
                  <div className={`transition-transform duration-700 ${showSummary ? "rotate-180" : ""} text-[#c6b677]`}>
                    <FaChevronDown size={28} />
                  </div>
                </button>

                {showSummary && (
                  <div className="p-10 border-t border-[#c6b677]/20 animate-fade-in-up">
                    <div className="flex justify-between items-center mb-10">
                      <div className="bg-[#c6b677]/10 px-6 py-2 rounded-full border border-[#c6b677]/20">
                        <span className="text-[10px] font-bold text-[#c6b677] uppercase tracking-widest">Aggregated Records</span>
                      </div>
                      <button
                        onClick={() => exportToCSV("summary")}
                        className="btn-institutional h-12 bg-white text-[#133b5c] px-8 text-[10px]"
                      >
                        <FaDownload size={14} /> Full Institutional Report (.CSV)
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-[2rem] border border-white/5 bg-[#0b2438]/40 shadow-inner">
                      <table className="w-full text-left border-collapse font-mono">
                        <thead>
                          <tr className="bg-[#133b5c]/90 text-[#c6b677]">
                            <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em]">Institutional ID</th>
                            <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em]">Full Legal Name</th>
                            <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.2em] text-center">Aggregate Result</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {Object.keys(summaryData).sort().map(regId => {
                            const s = summaryData[regId];
                            const pct = s.total_classes > 0 ? (s.attended_classes / s.total_classes) * 100 : 0;
                            return (
                              <tr key={regId} className={`hover:bg-white/5 transition-all duration-300 ${pct < 75 ? "bg-red-500/5" : ""}`}>
                                <td className="px-8 py-6 text-white/50">{regId}</td>
                                <td className="px-8 py-6 text-white font-bold text-lg">{s.name}</td>
                                <td className={`px-8 py-6 text-center`}>
                                  <div className={`inline-block px-8 py-2 rounded-full font-extrabold text-xl shadow-lg ${
                                    pct < 75 ? "bg-red-500/10 text-red-400 shadow-red-500/10" : "bg-green-500/10 text-green-400 shadow-green-500/10"
                                  }`}>
                                    {pct.toFixed(2)}%
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!isLoading && Object.keys(attendanceData).length === 0 && (
            <div className="text-center py-32 rounded-[3.5rem] border-2 border-dashed border-white/10 bg-white/5 group animate-pulse">
              <FaClipboardList className="mx-auto text-white/10 mb-8 transition-transform group-hover:scale-125 duration-700" size={80} />
              <h3 className="text-2xl font-serif text-white/30 italic mb-2">No Records Queried</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/10">Please define academic criteria to proceed with retrieval</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
