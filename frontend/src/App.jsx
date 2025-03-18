import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import StudentAttendance from "./pages/StudentAttendance";
import NotFound from "./components/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./context/ThemeContext";
import Footer from "./components/Footer";
import AdminLogin from "./pages/AdminLogin";
import RegisterMultiple from "./pages/RegisterMultiple";

// ✅ Protect Dashboard Route (For Students/Teachers)
const PrivateRoute = ({ element }) => {
  const { user } = useContext(AuthContext);
  return user ? element : <Navigate to="/login" />;
};

// ✅ Protect Admin Route
const AdminRoute = ({ element }) => {
  const isAdmin = localStorage.getItem("adminToken");
  return isAdmin ? element : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/attendance" element={<StudentAttendance />} />
                <Route
                  path="/dashboard"
                  element={<PrivateRoute element={<Dashboard />} />}
                />
                {/* ✅ Fixed Admin Route Logic */}
                <Route
                  path="/admin/dashboard"
                  element={<AdminRoute element={<AdminDashboard />} />}
                />
                <Route
                  path="/admin/dashboard/multi-register"
                  element={<AdminRoute element={<RegisterMultiple />} />}
                />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
