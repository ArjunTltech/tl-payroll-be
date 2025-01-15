import { validationResult } from "express-validator";
import * as argon2 from "argon2";
import { createUser, getUserByEmail, storeRefreshToken } from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateAccessToken.js";


export const registerUser = async (req, res) => {

   
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await argon2.hash(password);
        const role = 'HR';
    
        const result = await createUser(name, email, hashedPassword, role);

        res.status(201).json({
          success: true,
          message: 'User registered successfully',
        });
      } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };

export const loginUser = async (req, res) => {
    
    const { email, password } = req.body;
    try {
        const user = await getUserByEmail(email);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User does not exist'
          });
        }
        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
          });
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user); 
        await storeRefreshToken(user.id, refreshToken);
        res.status(200).json({
          success: true,
          message: 'User logged in successfully',
          accessToken
        });
      } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
}



export const getProfile = async (req, res) => {

    res.status(200).json({ message: 'my profile' });
    
}