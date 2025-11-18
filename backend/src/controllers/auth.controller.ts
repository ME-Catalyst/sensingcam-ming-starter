import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { User, JWTPayload, AuthResponse } from '../types';

// In-memory user store (replace with database in production)
const users: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@sensingcam.local',
    password: '$2b$10$YourHashedPasswordHere', // Will be set on first run
    role: 'admin',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

// Helper to generate tokens
const generateTokens = (user: User) => {
  const payload: JWTPayload = {
    userId: user.id,
    username: user.username,
    role: user.role,
  };

  const token = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as string,
  });

  const refreshToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiresIn as string,
  });

  return { token, refreshToken };
};

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw ApiError.badRequest('Username and password are required');
  }

  // Find user
  const user = users.find(u => u.username === username);
  if (!user) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  // Generate tokens
  const { token, refreshToken } = generateTokens(user);

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  const response: AuthResponse = {
    user: userWithoutPassword,
    token,
    refreshToken,
  };

  res.json({
    success: true,
    data: response,
    message: 'Login successful',
  });
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password, role = 'viewer' } = req.body;

  if (!username || !email || !password) {
    throw ApiError.badRequest('Username, email, and password are required');
  }

  // Check if user exists
  const existingUser = users.find(u => u.username === username || u.email === email);
  if (existingUser) {
    throw ApiError.badRequest('Username or email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser: User = {
    id: (users.length + 1).toString(),
    username,
    email,
    password: hashedPassword,
    role: role as 'admin' | 'operator' | 'viewer',
    created_at: new Date(),
    updated_at: new Date(),
  };

  users.push(newUser);

  // Generate tokens
  const { token, refreshToken } = generateTokens(newUser);

  // Remove password from response
  const { password: _, ...userWithoutPassword } = newUser;

  const response: AuthResponse = {
    user: userWithoutPassword,
    token,
    refreshToken,
  };

  res.status(201).json({
    success: true,
    data: response,
    message: 'User registered successfully',
  });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    throw ApiError.badRequest('Refresh token is required');
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;

    // Find user
    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      throw ApiError.unauthorized('Invalid token');
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    res.json({
      success: true,
      data: tokens,
      message: 'Token refreshed successfully',
    });
  } catch (error) {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized('Not authenticated');
  }

  const user = users.find(u => u.id === req.user!.userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const { password: _, ...userWithoutPassword } = user;

  res.json({
    success: true,
    data: userWithoutPassword,
  });
});

// Initialize default admin user
export const initializeDefaultUser = async () => {
  const defaultPassword = 'admin123'; // Change this!
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);
  users[0].password = hashedPassword;
  console.log('Default admin user initialized with password: admin123');
  console.log('Please change this password after first login!');
};
