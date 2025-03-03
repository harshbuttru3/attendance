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

// ✅ Protect Dashboard Route
const PrivateRoute = ({ element }) => {
  const { user } = useContext(AuthContext);
  return user ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        {" "}
        {/* Wrap the entire app with ThemeProvider */}
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar /> {/* Navbar is outside Routes to appear on all pages */}
            <main className="flex-grow">
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/" element={<StudentAttendance />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/attendance" element={<StudentAttendance />} />
                <Route
                  path="/dashboard"
                  element={<PrivateRoute element={<Dashboard />} />}
                />
                <Route
                  path="/admin"
                  element={<PrivateRoute element={<AdminDashboard />} />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer /> {/* Footer is outside Routes to appear on all pages */}
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
