import { Request, Response } from 'express';
import { User, CreateUserRequest, UpdateUserRequest } from '../models/User';

// In-memory storage for demo purposes
let users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

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
 *           description: The auto-generated id of the user
 *           example: 1
 *         name:
 *           type: string
 *           description: The name of the user
 *           example: "John Doe"
 *         email:
 *           type: string
 *           description: The email of the user
 *           example: "john@example.com"
 */

export const getAllUsers = (_req: Request, res: Response) => {
  res.json(users);
};

export const getUserById = (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const createUser = (req: Request, res: Response) => {
  const { name, email }: CreateUserRequest = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }
  
  const newUser: User = {
    id: users.length + 1,
    name,
    email
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
};

export const updateUser = (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const { name, email }: UpdateUserRequest = req.body;
  
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;
  
  res.json(users[userIndex]);
};

export const deleteUser = (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const deletedUser = users.splice(userIndex, 1);
  res.json({ message: 'User deleted successfully', user: deletedUser[0] });
};