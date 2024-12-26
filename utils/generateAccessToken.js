import jwt from 'jsonwebtoken';

// Function to generate access token (short-lived)
export const generateAccessToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const options = {
    expiresIn: '10m',
  };

  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, options);
};


export const generateRefreshToken = (user) => {
    return jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
  };
