import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Home.css";

const Home = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div className="container">
            <h1>Welcome to Centralized Attendance System</h1>
            <p>Manage student attendance efficiently with our system.</p>

            {user ? (
                <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
            ) : (
                <>
                    <button onClick={() => navigate("/login")}>Login</button>
                    <button onClick={() => navigate("/signup")}>Signup</button>
                </>
            )}
        </div>
    );
};

export default Home;
