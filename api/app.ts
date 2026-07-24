import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user";
import { divisionRouter } from "./routes/division";
import { jobPositionRouter } from "./routes/jobPosition";
import { employeeRouter } from "./routes/employee";
import { reimbursementRouter } from "./routes/reimbursement";
import { overtimeRouter } from "./routes/overtime";
import { payrollRouter } from "./routes/payroll";
import { payslipRouter } from "./routes/payslip";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// ---------------------------------------------------------------------------
// Security middleware
// ---------------------------------------------------------------------------

/**
 * CORS — locked to the explicit frontend origin.
 * `credentials: true` is required for the browser to send/receive HttpOnly cookies.
 * A wildcard origin ("*") would silently prevent cookies from working.
 */
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  }),
);

/** Parse JSON bodies. */
app.use(express.json());

/** Parse cookies so `req.cookies` is populated for auth middleware. */
app.use(cookieParser());

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.use("/api/users", userRouter);
app.use("/api/divisions", divisionRouter);
app.use("/api/jobPosition", jobPositionRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/reimbursements", reimbursementRouter);
app.use("/api/overtimes", overtimeRouter);
app.use("/api/payrolls", payrollRouter);
app.use("/api/payslips", payslipRouter);

// ---------------------------------------------------------------------------
// Error handling (must be registered after routes)
// ---------------------------------------------------------------------------

app.use(errorHandler);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------

const PORT = process.env.APP_PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
