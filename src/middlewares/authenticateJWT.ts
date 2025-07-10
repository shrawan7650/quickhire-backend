// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
  email: string;
  profileCompleted: boolean;
  iat: number;
  exp: number;
  role?: string;
}

// Extend the Request interface
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    profileCompleted: boolean;
  };
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
 console.log("authHeader",authHeader)
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized. Token missing." });
  }

  const token = authHeader.split(" ")[1];
  console.log("token",token)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    // ✅ decoded info ko req.user me attach kar do
    req.user = {
      id: decoded.id,
      email: decoded.email,
      profileCompleted: decoded.profileCompleted,
    };

    // ✅ role check agar required
    if (decoded.role && decoded.role !== "admin") {
      return res.status(403).json({ message: "Access Denied" });
    }

    next();
  } catch (error) {
    console.error("JWT Auth Error:", error);
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
};

// Export the interface so other files can use it
export { AuthenticatedRequest };