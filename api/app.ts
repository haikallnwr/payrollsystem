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
import { dashboardRouter } from "./routes/dashboard";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  }),
);


app.use(express.json());


app.use(cookieParser());



app.use("/api/users", userRouter);
app.use("/api/divisions", divisionRouter);
app.use("/api/jobPosition", jobPositionRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/reimbursements", reimbursementRouter);
app.use("/api/overtimes", overtimeRouter);
app.use("/api/payrolls", payrollRouter);
app.use("/api/payslips", payslipRouter);
app.use("/api/dashboard", dashboardRouter);



app.use(errorHandler);



export { app };
export default app;
