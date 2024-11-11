import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const session = await prisma.session.findFirst({
      where: {
        token,
        isRevoked: false,
        user: {
          id: decoded.userId
        }
      },
      include: {
        user: true
      }
    });

    if (!session) {
      throw new Error();
    }

    // Update last active timestamp
    await prisma.session.update({
      where: { id: session.id },
      data: { lastActive: new Date() }
    });

    req.token = token;
    req.user = session.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};