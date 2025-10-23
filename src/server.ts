import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();

interface User {
  id: number;
  name: string;
  email: string;
}

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js Study API',
      version: '1.0.0',
      description: 'A simple Express API for learning Node.js with TypeScript',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/server.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation route
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Sample data for learning
let users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

/**
 * @swagger
 * /:
 *   get:
 *     summary: Server health check
 *     description: Returns a message to confirm the server is running
 *     responses:
 *       200:
 *         description: Server is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Node.js Study Server is running!"
 */
// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Node.js Study Server is running!' });
});

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

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
// GET all users
app.get('/users', (req: Request, res: Response) => {
  res.json(users);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Returns a single user by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: A single user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
// GET user by ID
app.get('/users/:id', (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user with the provided name and email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New User"
 *               email:
 *                 type: string
 *                 example: "newuser@example.com"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Name and email are required
 */
// POST create new user
app.post('/users', (req: Request, res: Response) => {
  const { name, email }: Partial<User> = req.body;
  
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
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Updates an existing user's information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Name"
 *               email:
 *                 type: string
 *                 example: "updated@example.com"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
// PUT update user
app.put('/users/:id', (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const { name, email }: Partial<User> = req.body;
  
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;
  
  res.json(users[userIndex]);
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
// DELETE user
app.delete('/users/:id', (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const deletedUser = users.splice(userIndex, 1);
  res.json({ message: 'User deleted successfully', user: deletedUser[0] });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});