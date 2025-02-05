import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db/database.js"; 
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

// User registration
router.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], function (err) {
        if (err) return res.status(400).json({ error: "User already exists" });

        res.json({ message: "User registered successfully" });
    });
});

// User login
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ token });
    });
});

export default router;
