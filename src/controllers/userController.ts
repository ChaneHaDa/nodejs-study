import { Request, Response } from 'express';
import { CreateUserRequest, UpdateUserRequest } from '../models/User';
import { prisma } from '../lib/prisma';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of user
 *           example: 1
 *         name:
 *           type: string
 *           description: The name of user
 *           example: "John Doe"
 *         email:
 *           type: string
 *           description: The email of user
 *           example: "john@example.com"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the user was last updated
 */

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email }: CreateUserRequest = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    
    const newUser = await prisma.user.create({
      data: { name, email }
    });
    
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email }: UpdateUserRequest = req.body;
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email }
    });
    
    res.json(updatedUser);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(500).json({ message: 'Error updating user', error });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    
    const deletedUser = await prisma.user.delete({
      where: { id: userId }
    });
    
    res.json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(500).json({ message: 'Error deleting user', error });
    }
  }
};