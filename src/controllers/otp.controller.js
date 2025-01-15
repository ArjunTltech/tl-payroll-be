import crypto from 'crypto';
import redisClient from '../config/redis.js'; // Import the Redis client

// Generate OTP
export const generateOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const attempts = await redisClient.get(`otp:attempts:${email}`);
    if (attempts && attempts >= 3) {
      return res.status(429).json({ success: false, message: 'Too many OTP requests. Try again later.' });
    }

    const otp = crypto.randomInt(100000, 999999);
    await redisClient.setex(`otp:${email}`, 60, otp);

    // Track OTP attempts
    await redisClient.multi()
      .incr(`otp:attempts:${email}`)
      .expire(`otp:attempts:${email}`, 10) 
      .exec();

    console.log(`Generated OTP for ${email}: ${otp}`);

    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to generate OTP' });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const storedOtp = await redisClient.get(`otp:${email}`);

    if (storedOtp === otp) {
      await redisClient.del(`otp:${email}`);
      res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP' });
  }
};
