import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db/database.js";
import dotenv from "dotenv";
import { authenticateToken } from "../middleware/authMiddleware.js";

dotenv.config();
const router = express.Router();

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
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  });
});

router.get("/user", authenticateToken, (req, res) => {
  const userId = req.user.userId;

  db.get(
    "SELECT id, username FROM users WHERE id = ?",
    [userId],
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user }); // Return user data
    }
  );
});

router.post("/game-result", authenticateToken, async (req, res) => {
  const { level, win, lose } = req.body;
  const userId = req.user.userId; // Extract userId from the token

  console.log("Received payload:", { userId, level, win, lose }); // Log the payload

  try {
    // Check if stats exist for this user and level
    db.get(
      "SELECT * FROM game_stats WHERE user_id = ? AND level = ?",
      [userId, level],
      (err, data) => {
        if (data) {
          console.log("Updating existing stats:", data); // Log existing stats
          db.run(
            "UPDATE game_stats SET wins = wins + ?, losses = losses + ? WHERE user_id = ? AND level = ?",
            [win, lose, userId, level]
          );
        } else {
          console.log("Inserting new stats"); // Log new stats insertion
          db.run(
            "INSERT INTO game_stats (user_id, level, wins, losses) VALUES (?, ?, ?, ?)",
            [userId, level, win, lose]
          );
        }
      }
    );

    res.json({ message: "Game result updated" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/statistics", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  console.log(userId);

  try {
    // Fetch stats for all levels (1, 10, 20)
    db.all(
      "SELECT level, SUM(wins) AS total_wins, SUM(losses) AS total_losses FROM game_stats WHERE user_id = ? AND level IN (1, 10, 20) GROUP BY level",
      [userId],
      (err, data) => {
        // If no stats exist, return default values
        if (err) console.log(err)
        if (!data.length) {
          return res.json([
            { level: 1, total_wins: 0, total_losses: 0 },
            { level: 10, total_wins: 0, total_losses: 0 },
            { level: 20, total_wins: 0, total_losses: 0 },
          ]);
        }

        // Return the fetched stats
        res.json(data);
      }
    );
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
export default router;
