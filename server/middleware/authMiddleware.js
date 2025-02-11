// authMiddleware.js
import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    console.log("Auth Header:", authHeader); // Log incoming header

    if (!authHeader) {
        console.error("No Authorization header found");
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token after 'Bearer '
    console.log("Extracted Token:", token);

    if (!token) {
        console.error("No token found in Authorization header");
        return res.status(401).json({ error: "Unauthorized: Invalid token format" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("JWT Verification Error:", err.message);
            return res.status(403).json({ error: "Forbidden: Invalid token" });
        }

        console.log("Authenticated user:", user);
        req.user = user; // Attach user payload
        next();
    });
};
