import "dotenv/config";
import express from "express";
import cors from "cors";
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

app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/divisions", divisionRouter);
app.use("/api/jobPosition", jobPositionRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/reimbursements", reimbursementRouter);
app.use("/api/overtimes", overtimeRouter);
app.use("/api/payrolls", payrollRouter);
app.use("/api/payslips", payslipRouter);

app.use(errorHandler);

const PORT = process.env.APP_PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
