import express from "express";
import db from "../db/database.js"; 
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = express.Router();

// Get user statistics
router.get("/", authenticateToken, (req, res) => {
    const userId = req.user.userId;

    db.all("SELECT bot_id, result, COUNT(*) as count FROM stats WHERE user_id = ? GROUP BY bot_id, result", [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error" });

        res.json(rows);
    });
});

export default router;
