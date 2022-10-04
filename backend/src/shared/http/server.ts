import 'reflect-metadata';
import 'express-async-errors';
import '@shared/typeorm/index';

import routes from "./routes";
import uploadConfig from '@cofing/upload';
import AppError from "@shared/errors/AppError";

import { errors } from 'celebrate';
import { NextFunction, Request, Response } from "express";

import cors from 'cors';
// const cors = require('cors');

import express from 'express';
// const express = require('express');


const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
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