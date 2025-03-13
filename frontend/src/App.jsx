import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import StudentAttendance from "./components/StudentAttendance";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./components/AdminDashboard";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./context/ThemeContext";
import Footer from "./components/Footer";
import AdminLogin from "./components/AdminLogin";

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
