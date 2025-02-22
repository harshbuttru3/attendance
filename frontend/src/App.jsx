import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import StudentAttendance from "./components/StudentAttendance";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./components/AdminDashboard";

// ✅ Protect Dashboard Route
const PrivateRoute = ({ element }) => {
  const { user } = useContext(AuthContext);
  return user ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider> {/* ✅ Moved AuthProvider inside Router */}
        <Routes>
          <Route path="/" element={<StudentAttendance/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* ✅ Only allow logged-in users to access Dashboard */}
          <Route path="/attendance" element={<StudentAttendance />} /> 
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/admin" element={<PrivateRoute element={<AdminDashboard />} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
