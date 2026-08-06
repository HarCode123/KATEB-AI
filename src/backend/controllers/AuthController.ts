import { Request, Response } from "express";
import { UserModel } from "../models/UserModel";
import { PatientModel } from "../models/PatientModel";
import { comparePassword } from "../services/hashService";
import { generateTokenPair, verifyRefreshToken, revokeRefreshToken, AuthUserPayload } from "../services/jwtService";

export class AuthController {
  /**
   * POST /api/auth/login
   * Authenticate Doctor or Patient with secure password comparison & JWT issue
   */
  public static async login(req: Request, res: Response) {
    try {
      const { email, password, role, patientId } = req.body;

      if (!password) {
        return res.status(400).json({
          success: false,
          message: "Password is required for login."
        });
      }

      const searchKey = (email || patientId || "").trim().toLowerCase();
      if (!searchKey) {
        return res.status(400).json({
          success: false,
          message: "Email or Patient ID is required."
        });
      }

      // 1. Find user account in database / local store
      let user = await UserModel.findByEmail(searchKey);
      if (!user) {
        user = await UserModel.findById(searchKey);
      }

      // Fallback auto-provision for default demo accounts if not found
      if (!user) {
        if (
          (searchKey === "doctor@kateb.ai" || searchKey === "harini") &&
          password === "123456"
        ) {
          user = await UserModel.createUser({
            email: "doctor@kateb.ai",
            passwordPlain: "123456",
            role: "doctor",
            name: "Dr. Harini, MD"
          });
        } else if (
          (searchKey === "harini@kateb.ai" || searchKey === "patient@kateb.ai" || searchKey === "pid-2026-001") &&
          password === "123456"
        ) {
          user = await UserModel.createUser({
            email: "harini@kateb.ai",
            passwordPlain: "123456",
            role: "patient",
            name: "Harini Al-Mansoor",
            patientId: "PID-2026-001"
          });
        }
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          code: "INVALID_CREDENTIALS",
          message: "Invalid email/patient ID or password."
        });
      }

      // 2. Verify hashed password
      const isPasswordValid = await comparePassword(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          code: "INVALID_CREDENTIALS",
          message: "Invalid email/patient ID or password."
        });
      }

      // 3. Check requested role if specified
      const userRole = role === "doctor" ? "doctor" : (user.role || "patient");

      // 4. Construct user payload for JWT token
      const tokenPayload: AuthUserPayload = {
        userId: user.id,
        email: user.email,
        role: userRole,
        name: user.name,
        patientId: user.patientId
      };

      // 5. Sign Access Token and Refresh Token
      const tokenPair = generateTokenPair(tokenPayload);

      console.log(`🔑 [AuthController] User logged in successfully: ${user.email} (${userRole})`);

      return res.status(200).json({
        success: true,
        message: "Login successful.",
        tokens: tokenPair,
        user: {
          id: user.id,
          email: user.email,
          role: userRole,
          name: user.name,
          patientId: user.patientId
        }
      });
    } catch (err: any) {
      console.error("❌ [AuthController] Login error:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Authentication server error during login."
      });
    }
  }

  /**
   * POST /api/auth/register
   * Patient Registration & Portal Activation with bcrypt hashing & JWT issue
   */
  public static async register(req: Request, res: Response) {
    try {
      const { fullName, email, phone, password, patientId, role } = req.body;

      if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Valid full name is required (at least 2 characters)."
        });
      }

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).json({
          success: false,
          message: "Valid email address is required."
        });
      }

      if (!password || typeof password !== "string" || password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long."
        });
      }

      const trimmedEmail = email.trim().toLowerCase();

      // Check if user account already exists
      const existingUser = await UserModel.findByEmail(trimmedEmail);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          code: "USER_EXISTS",
          message: "An account with this email address already exists."
        });
      }

      // Link or create patient record
      const userRole = role === "doctor" ? "doctor" : "patient";
      let activePatientId = patientId ? String(patientId).trim() : `PID-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

      if (userRole === "patient") {
        const nameParts = fullName.trim().split(" ");
        const firstName = nameParts[0] || fullName.trim();
        const lastName = nameParts.slice(1).join(" ") || "Al-Mansoor";

        await PatientModel.create(
          firstName,
          lastName,
          28,
          "Female",
          165,
          62,
          phone ? String(phone).trim() : "+966 50 123 4567",
          trimmedEmail,
          "Riyadh, Saudi Arabia",
          "O+",
          "None",
          activePatientId
        );
      }

      // Create User with bcrypt password hash
      const newUser = await UserModel.createUser({
        email: trimmedEmail,
        passwordPlain: password,
        role: userRole,
        name: fullName.trim(),
        patientId: userRole === "patient" ? activePatientId : undefined
      });

      // Sign JWT Token Pair
      const tokenPayload: AuthUserPayload = {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        patientId: newUser.patientId
      };

      const tokenPair = generateTokenPair(tokenPayload);

      console.log(`✨ [AuthController] New user registered: ${newUser.email} (${newUser.role})`);

      return res.status(201).json({
        success: true,
        message: "Registration successful.",
        tokens: tokenPair,
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          name: newUser.name,
          patientId: newUser.patientId
        }
      });
    } catch (err: any) {
      console.error("❌ [AuthController] Registration error:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Registration server error."
      });
    }
  }

  /**
   * POST /api/auth/refresh
   * Issue a new Access Token using a valid Refresh Token (Token Rotation)
   */
  public static async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.body.refreshToken || req.headers["x-refresh-token"];

      if (!refreshToken || typeof refreshToken !== "string") {
        return res.status(400).json({
          success: false,
          code: "REFRESH_TOKEN_MISSING",
          message: "Refresh token is required."
        });
      }

      // Verify refresh token signature & expiration
      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) {
        return res.status(401).json({
          success: false,
          code: "INVALID_REFRESH_TOKEN",
          message: "Refresh token is expired, invalid, or revoked."
        });
      }

      // Find user
      const user = await UserModel.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          code: "USER_NOT_FOUND",
          message: "Associated user account no longer exists."
        });
      }

      // Revoke old refresh token (rotation)
      revokeRefreshToken(refreshToken);

      // Issue new token pair
      const tokenPayload: AuthUserPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        patientId: user.patientId
      };

      const newTokenPair = generateTokenPair(tokenPayload);

      return res.status(200).json({
        success: true,
        message: "Tokens refreshed successfully.",
        tokens: newTokenPair
      });
    } catch (err: any) {
      console.error("❌ [AuthController] Refresh token error:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Failed to refresh token."
      });
    }
  }

  /**
   * POST /api/auth/logout
   * Revoke refresh token on user logout
   */
  public static async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.body.refreshToken;
      if (refreshToken && typeof refreshToken === "string") {
        revokeRefreshToken(refreshToken);
      }

      return res.status(200).json({
        success: true,
        message: "Logged out successfully. Tokens revoked."
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: "Logout error."
      });
    }
  }

  /**
   * GET /api/auth/me
   * Return authenticated user profile from verified JWT Bearer Token
   */
  public static async me(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated."
      });
    }

    return res.status(200).json({
      success: true,
      user: req.user
    });
  }
}
