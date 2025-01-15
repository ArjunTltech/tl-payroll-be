import { getUserById } from "../models/user.model.js";
import { generateAccessToken } from "../utils/generateAccessToken.js";
import jwt from "jsonwebtoken";

export const verifyAndRefreshToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const accessToken = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        // If the access token is expired, attempt to refresh it
        let user;
        try {
          const decoded = jwt.decode(accessToken); // Decode the access token to get user ID
          user = await getUserById(decoded.id);

          if (!user) {
            return res.status(401).json({
              success: false,
              message: "User not found",
            });
          }
        } catch (err) {
          console.error("Error fetching user:", err);
          return res.status(500).json({
            success: false,
            message: "Error retrieving user information",
          });
        }

        // Check if the refresh token exists in the database
        console.log("Refreshing token");
        const refreshToken = user.refreshToken;

        if (!refreshToken) {
          return res.status(401).json({
            success: false,
            message: "No refresh token found for the user",
          });
        }

        // Verify the refresh token
        try {
          jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
          console.error("Invalid refresh token:", err);
          return res.status(401).json({
            success: false,
            message: "Invalid refresh token",
          });
        }

        // If refresh token is valid, generate a new access token
        try {
          const newAccessToken = generateAccessToken(user);
          res.set("New-Access-Token", newAccessToken);
          req.user = jwt.decode(newAccessToken);
          return next();
        } catch (err) {
          console.error("Error generating new access token:", err);
          return res.status(500).json({
            success: false,
            message: "Error generating new access token",
          });
        }
      }

      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
