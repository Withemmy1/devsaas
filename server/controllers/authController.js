import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import speakeasy from 'speakeasy';
import crypto from 'crypto';
import UAParser from 'ua-parser-js';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { validatePassword } from '../utils/passwordValidator.js';

const transporter = nodemailer.createTransport({
  // Configure your email service
});

export const register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Check for disposable email
    if (await isDisposableEmail(email)) {
      return res.status(400).json({ message: 'Please use a valid email address' });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ message: passwordValidation.message });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        verificationToken,
        verificationTokenExpiry
      }
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, mfaToken } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email first' });
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      return res.status(423).json({ 
        message: 'Account is temporarily locked. Please try again later.' 
      });
    }

    // Check MFA if enabled
    if (user.mfaEnabled) {
      if (!mfaToken) {
        return res.status(403).json({ message: 'MFA token required' });
      }

      const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: mfaToken
      });

      if (!verified) {
        return res.status(401).json({ message: 'Invalid MFA token' });
      }
    }

    // Create session
    const ua = new UAParser(req.headers['user-agent']);
    const device = `${ua.getBrowser().name} on ${ua.getOS().name}`;
    
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    await prisma.session.create({
      data: {
        token,
        device,
        userId: user.id
      }
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        mfaEnabled: user.mfaEnabled
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

export const setupMFA = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    
    const secret = speakeasy.generateSecret({
      name: `DevFlow:${user.email}`
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { mfaSecret: secret.base32, mfaEnabled: true }
    });

    res.json({
      otpAuthUrl: secret.otpauth_url,
      secret: secret.base32
    });
  } catch (error) {
    res.status(500).json({ message: 'MFA setup failed', error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiry: { gt: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null
      }
    });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Email verification failed', error: error.message });
  }
};