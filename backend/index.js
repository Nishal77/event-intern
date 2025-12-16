import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/helper/dbconnections.js";
import router from "./src/routes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Use single combined routes
router(app);

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `🚀 Server running at http://localhost:${process.env.PORT || 3000}`
  );
});
