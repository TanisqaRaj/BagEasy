import dotenv from "dotenv";
import express from "express";
import connectDB from "./db.js";
import cors from "cors";
import { verifyToken } from "./middleware/auth.js";
import authRoutes from "./routes/authRoute.js";
import apiRoute from "./routes/apiRoute.js";

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(cors({
  origin :"*"
}));
app.use("/", () => {
  console.log("BackendHome");
});
app.use("/api", apiRoute);
app.use("/auth", authRoutes);
// app.use(verifyToken);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
