import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import '../types/database.types';

// Middleware to verify JWT token and protect private routes
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // 1. Check if Authorization header exists and has 'Bearer' prefix
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 2. Return error if no token was found
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
      return;
    }

    // 3. Check if JWT_SECRET is configured
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500).json({
        success: false,
        message: 'Server configuration error: JWT_SECRET is not set.',
      });
      return;
    }

    // 4. Verify token using jsonwebtoken
    const decoded = jwt.verify(token, jwtSecret) as { id: string; role: string };

    // 5. Attach decoded user info to the request object
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    // 6. Call next middleware or controller
    next();
  } catch (error) {
    // Return 401 if token verification fails
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

// Middleware to allow only admin users
export const adminOnly = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.',
    });
    return;
  }

  next();
};

// Middleware to allow Organizers or Admins
export const organizerOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || (req.user.role !== 'organizer' && req.user.role !== 'admin')) {
    res.status(403).json({
      success: false,
      message: 'Access denied. Organizer or Admin role required.',
    });
    return;
  }

  next();
};

// Optional authentication middleware: attaches user if token exists, but doesn't block if absent
export const optionalProtect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const jwtSecret = process.env.JWT_SECRET;
      if (jwtSecret) {
        const decoded = jwt.verify(token, jwtSecret) as { id: string; role: string };
        req.user = {
          id: decoded.id,
          role: decoded.role,
        };
      }
    }
  } catch (error) {
    // If token is invalid or expired, continue as guest/unauthenticated
  }

  next();
};
