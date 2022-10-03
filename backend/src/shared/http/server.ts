import 'reflect-metadata';
import AppError from "@shared/errors/AppError";
import { NextFunction, Request, Response } from "express";
import 'express-async-errors';
import routes from "./routes";
import '@shared/typeorm/index';
import { errors } from 'celebrate';

const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(routes);

app.use(errors());

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  }

  return res.status(500).json({
    status: 500,
    message: "Internal server error"
  })
});

app.listen(3333, () => {
  console.log(`
  ==============================================
  🚀 API is running in http://localhost:3333 🚀
  ==============================================
  `);
});