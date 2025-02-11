import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import apiRoutes from "./routes/api.js";

const app = express();

app.use(cors());

app.use(cors({ 
    origin: "http://localhost:3000", // Allow requests from frontend
    credentials: true, // Allow cookies/auth headers
}));

app.use(express.json());

app.use("/api", apiRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
