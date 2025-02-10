import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db/database.js"; 
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
import { authenticateToken } from "../middleware/authMiddleware.js";

// User registration
router.post("/register", (req, res) => {
    const { username, password, confirmPassword } = req.body;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Heslá sa nezhodujú" });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert user into the database
    db.run(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hashedPassword],
        function (err) {
            if (err) {
                return res.status(400).json({ error: "Používateľ už existuje" });
            }

            res.json({ message: "Používateľ úspešne zaregistrovaný" });
        }
    );
});

// User login
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: "Nesprávne meno alebo heslo" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ token });
    });
});

router.get("/opponentSelect", authenticateToken, (req, res) => {
    const userId = req.user.userId;

    db.get("SELECT id, username FROM users WHERE id = ?", [userId], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ user }); // Return user data
    });
});

router.get("/user", authenticateToken, (req, res) => {
    const userId = req.user.userId;

    db.get("SELECT id, username FROM users WHERE id = ?", [userId], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ user }); // Return user data
    });
});

export default router;
