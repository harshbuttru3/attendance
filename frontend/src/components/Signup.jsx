// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import styles from "../css/Signup.module.css";

// const subjectsList = ["Mathematics", "Physics", "Physics-L", "Chemistry", "Chemistry-L", 
//                       "Biology", "PPS", "PPS-L", "English", "DSA", "DSA-L", 
//                       "OOPS", "OOPS-L", "AE", "AE-L", "DBMS", "DBMS-L",
//                       "OS", "OS-L", "CN", "CN-L", "SE", "SE-L", "TOC", "TOC-L","Extras-Classes", "Extras-Acitivities"];

// const branchesList = ["CSE", "EEE", "Mechanical", "Civil", "Cybersecurity", "FTS"];

// const semestersList = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     subjects: [],  // ✅ Store multiple selected subjects
//     semesters: [], // ✅ Store multiple selected semesters
//     branches: [],  // ✅ Store multiple selected branches
//   });
//   const navigate = useNavigate();
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === "checkbox") {
//       setFormData((prevData) => ({
//         ...prevData,
//         [name]: checked
//           ? [...prevData[name], value]  // Add value if checked
//           : prevData[name].filter((item) => item !== value), // Remove if unchecked
//       }));
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("https://dce-attendance.onrender.com/api/auth/signup", formData);
//       alert(res.data.message);
//       navigate("/dashboard");
//     } catch (err) {
//       alert("Error: " + err.response.data.error);
//     }
//   };

//   const [passwordMatch, setPasswordMatch] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     if (name === "confirmPassword") {
//       setPasswordMatch(value === formData.password);
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Signup</h2>
//       <div id={styles.signupForm}>
//         <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
//         <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
//         <div className={styles.passwordInput}>
//           <input
//             type={showPassword ? "text" : "password"}
//             name="password"
//             placeholder="Password"
//             onChange={handleChange}
//             required
//           />
//           <button type="button" onClick={togglePasswordVisibility}>
//             {showPassword ? "Hide" : "Show"}
//           </button>
//         </div>
//         <div className={styles.passwordInput}>
//           <input
//             type={showConfirmPassword ? "text" : "password"}
//             name="confirmPassword"
//             placeholder="Confirm Password"
//             onChange={handlePasswordChange}
//             required
//           />
//           <button type="button" onClick={toggleConfirmPasswordVisibility}>
//             {showConfirmPassword ? "Hide" : "Show"}
//           </button>
//         </div>
//         {passwordMatch === false && <p style={{ color: "red" }}>Passwords do not match</p>}
//         {passwordMatch === true && <p style={{ color: "green" }}>Passwords match</p>}
//       </div>
//       {/* Subject Selection */}
//       <label className={styles.label}>Select Subjects:</label>
//       <div id={styles.subjects}>
//         {subjectsList.map((subject, index) => (
//           <div key={index}>
//             <input
//               type="checkbox"
//               name="subjects"
//               value={subject}
//               onChange={handleChange}
//             />
//             <label>{subject}</label>
//           </div>
//         ))}
//       </div>
//       {/* Semester Selection */}
//       <label className={styles.label2}>Select Semester: </label>
//       {semestersList.map((semester, index) => (
//         <div key={index}>
//           <input
//             type="checkbox"
//             name="semesters"
//             value={semester}
//             onChange={handleChange}
//           />
//           <label>{semester} Semester</label>
//         </div>
//       ))}

//       {/* Branch Selection */}
//       <label className={styles.label2}>Select Branch:</label>
//       {branchesList.map((branch, index) => (
//         <div key={index} >
//           <input
//             type="checkbox"
//             name="branches"
//             value={branch}
//             onChange={handleChange}
//           />
//           <label>{branch}</label>
//         </div>
//       ))}

//       <button type="submit" id={styles.singupButton}>Signup</button>
//       <br />
//       <p>Already have an account?</p>
//       <button type="button" onClick={() => navigate("/login")}>
//         Login
//       </button>
//     </form>
//   );
// };

// export default Signup;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../css/Signup.module.css";

// Define subjects for each semester and branch
const subjectsList = {
  "1st": {
    CSE: ["Physics","Mathematics","PPS","IT-Workshop","BEE"],
    EEE: ["Mathematics", "Physics", "Chemistry", "English", "Basic Electrical Engineering"],
    Mechanical: ["Mathematics", "Physics", "Chemistry", "English", "Mechanical Basics"],
    Civil: ["Mathematics", "Physics", "Chemistry", "English", "Civil Basics"],
    Cybersecurity: ["Mathematics", "Physics", "Chemistry", "English", "Cybersecurity Basics"],
    FTS: ["Mathematics", "Physics", "Chemistry", "English", "FTS Basics"],
  },
  "2nd": {
    CSE: ["Chemistry", "Mathematics", "English","Python","Web-Design"],
    EEE: ["Mathematics", "Physics-L", "Chemistry-L", "English", "Basic Electrical Engineering-L"],
    Mechanical: ["Mathematics", "Physics-L", "Chemistry-L", "English", "Mechanical Basics-L"],
    Civil: ["Mathematics", "Physics-L", "Chemistry-L", "English", "Civil Basics-L"],
    Cybersecurity: ["Mathematics", "Physics-L", "Chemistry-L", "English", "Cybersecurity Basics-L"],
    FTS: ["Mathematics", "Physics-L", "Chemistry-L", "English", "FTS Basics-L"],
  },
  "3rd":{
    CSE: ["AE","DSA","OOPS","Technical-Writing","Mathematics"],
    Cybersecurity: ["AE","DSA","OOPS","Technical-Writing","Mathematics"]
  },
  "4th":{
    CSE:["Discrete-Mathematics","Computer-Organisation-And-Structure","Operating-System","Design-And-Analysis-Of-Algorithm","Digital-Electronics","Human-Resources-Development-And-Orgainisational-Behavior","Environmental-Science"]
  },
  "5th":{
    CSE:[ ]
  }
 
};

const branchesList = ["CSE", "EEE", "Mechanical", "Civil", "Cybersecurity", "FTS"];
const semestersList = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    subjects: [], // Array of objects: { subject, semester, branch }
    semesters: [], // Array of selected semesters
    branches: [], // Array of selected branches
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [tempSelectedSubjects, setTempSelectedSubjects] = useState([]);
  const [passwordMatch, setPasswordMatch] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "confirmPassword") {
      setPasswordMatch(value === formData.password);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || formData.subjects.length === 0) {
        alert("Please fill all required fields.");
        return;
    }

    // ✅ Convert subjects, semesters, and branches to JSON strings
    const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        subjects: JSON.stringify(formData.subjects),
        semesters: JSON.stringify(formData.semesters),
        branches: JSON.stringify(formData.branches),
    };

    try {
        const res = await axios.post("https://dce-attendance.onrender.com/api/auth/signup", payload, {
            headers: { "Content-Type": "application/json" },
        });
        alert(res.data.message);
        navigate("/dashboard");
    } catch (err) {
        alert("Error: " + (err.response?.data?.error || "Something went wrong"));
    }
};


  const handleAddSubjectClick = () => {
    setShowModal(true);
  };

  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
    setSelectedBranch("");
    setAvailableSubjects([]);
  };

  const handleBranchChange = (e) => {
    const branch = e.target.value;
    setSelectedBranch(branch);
    if (selectedSemester && branch) {
      setAvailableSubjects(subjectsList[selectedSemester][branch] || []);
    }
  };

  const handleSubjectSelection = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTempSelectedSubjects([...tempSelectedSubjects, value]);
    } else {
      setTempSelectedSubjects(tempSelectedSubjects.filter((subject) => subject !== value));
    }
  };

  const handleAddSubjects = () => {
    const newSubjects = tempSelectedSubjects.map((subject) => ({
      subject,
      semester: selectedSemester,
      branch: selectedBranch,
    }));

    setFormData((prevData) => ({
      ...prevData,
      subjects: [...prevData.subjects, ...newSubjects],
      semesters: [...new Set([...prevData.semesters, selectedSemester])], // Add unique semesters
      branches: [...new Set([...prevData.branches, selectedBranch])], // Add unique branches
    }));

    setShowModal(false);
    setTempSelectedSubjects([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <div id={styles.signupForm}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <div className={styles.passwordInput}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handlePasswordChange}
            required
          />
          <button type="button" onClick={togglePasswordVisibility}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div className={styles.passwordInput}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handlePasswordChange}
            required
          />
          <button type="button" onClick={toggleConfirmPasswordVisibility}>
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
        {passwordMatch === false && <p style={{ color: "red" }}>Passwords do not match</p>}
        {passwordMatch === true && <p style={{ color: "green" }}>Passwords match</p>}
      </div>

      <button type="button" onClick={handleAddSubjectClick}>
        Add Subject
      </button>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Select Semester, Branch, and Subjects</h3>
            <select onChange={handleSemesterChange} value={selectedSemester}>
              <option value="">Select Semester</option>
              {semestersList.map((semester, index) => (
                <option key={index} value={semester}>
                  {semester}
                </option>
              ))}
            </select>

            {selectedSemester && (
              <select onChange={handleBranchChange} value={selectedBranch}>
                <option value="">Select Branch</option>
                {branchesList.map((branch, index) => (
                  <option key={index} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            )}

            {selectedBranch && (
              <div>
                <h4>Select Subjects:</h4>
                {availableSubjects.map((subject, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      value={subject}
                      onChange={handleSubjectSelection}
                    />
                    <label>{subject}</label>
                  </div>
                ))}
              </div>
            )}

            <button type="button" onClick={handleAddSubjects}>
              Add Subjects
            </button>
            <button type="button" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div>
        <h3>Selected Subjects:</h3>
        {formData.subjects.map((subjectData, index) => (
          <div key={index}>
            {subjectData.subject} (Semester: {subjectData.semester}, Branch: {subjectData.branch})
          </div>
        ))}
      </div>

      <button type="submit" id={styles.singupButton}>
        Signup
      </button>
      <br />
      <p>Already have an account?</p>
      <button type="button" onClick={() => navigate("/login")}>
        Login
      </button>
    </form>
  );
};

export default Signup;