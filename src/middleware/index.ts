import express from 'express';
import cors from 'cors';

export const setupMiddleware = (app: express.Application): void => {
  // CORS middleware
  app.use(cors());
  
  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Request logging middleware
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
};