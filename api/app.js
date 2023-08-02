import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Routes of the app
import userRoutes from "./routes/users.js";
import commentRoutes from "./routes/comments.js";
import videoRoutes from "./routes/videos.js";
import authRoutes from "./routes/auths.js";

dotenv.config();
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB + "/videoDB")
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    throw err;
  });
const app = express();

app.listen(8800, () => {
  console.log("Started Listening on Port 8800");
});

app.use(cookieParser());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});
