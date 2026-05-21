const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const directoryRoutes = require("./routes/directory.routes");
const incidentRoutes = require("./routes/incident.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const emergencyRoutes = require("./routes/emergency.routes");
const errorMiddleware = require("./middleware/error.middleware");
const geocodeRoutes = require("./routes/geocode.routes");
const geoRoutes = require("./routes/geo.routes");
const assignmentRoutes = require("./routes/assignment.routes");
const verificationRoutes = require("./routes/verification.routes");

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "AlertNaija API Running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/directory", directoryRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/geocode", geocodeRoutes);
app.use("/api/geo", geoRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/emergency-contacts", emergencyRoutes);

app.use(errorMiddleware);

module.exports = app;
