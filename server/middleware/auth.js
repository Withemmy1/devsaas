import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.userId,
      'sessions.token': token,
      'sessions.isRevoked': false
    });

    if (!user) {
      throw new Error();
    }

    // Update last active timestamp
    const session = user.sessions.find(s => s.token === token);
    if (session) {
      session.lastActive = new Date();
      await user.save();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};