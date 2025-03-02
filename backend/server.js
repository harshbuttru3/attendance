const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Configure CORS properly
const allowedOrigins = [
    "https://attendance-pi-woad.vercel.app", // Frontend on Vercel
    "http://localhost:5173" // Local development
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // Allow cookies/auth headers
    allowedHeaders: "Content-Type,Authorization"
}));

app.use(express.json());

// 🔹 Import routes
const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const adminRoutes = require("./routes/adminRoutes");

// 🔹 Define routes
app.use("/api/auth", authRoutes);
app.use("/api", attendanceRoutes);
app.use("/api", subjectRoutes);
app.use("/api/admin", adminRoutes);

// const PORT = process.env.PORT || 5000;
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// ✅ Debugging: List all available routes
console.log("Available routes:");
app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(r.route.path);
    }
});
