import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import imageRoutes from "./routes/imageRoutes.js";
import connectDB from "./connection/db.js";
dotenv.config();
const server = express();
server.use(cors());
server.use(express.json());
const dirname = path.dirname(fileURLToPath(import.meta.url));
server.use("/uploads", express.static(path.join(dirname, "uploads")));
server.use("/api/images", imageRoutes);
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } 
});
