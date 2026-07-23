import "dotenv/config";
import express from "express";
import cors from "cors";
import { userRouter } from "./routes/user";
import { divisionRouter } from "./routes/division";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRouter);
app.use("/api/divisions", divisionRouter);

app.use(errorHandler);

const PORT = process.env.APP_PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
