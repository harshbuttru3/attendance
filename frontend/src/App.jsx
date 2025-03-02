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
      {" "}
      {/* ✅ AuthContext is available everywhere */}
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<StudentAttendance />} />
          <Route
            path="/login"
            element={
              <>
                <ThemeProvider>
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                      <Login />
                    </main>
                    <Footer />
                  </div>
                </ThemeProvider>
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <ThemeProvider>
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                      <Signup />
                    </main>
                    <Footer />
                  </div>
                </ThemeProvider>
              </>
            }
          />
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
      </Router>
    </AuthProvider>
  );
}

export default App;
