import AppError from "@shared/errors/AppError";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import authConfig from "@cofing/auth";

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function isAuthenticated(request: Request, response: Response, next: NextFunction): void {
  const hasToken = request.headers.authorization;
  if(!hasToken) {
    throw new AppError("JWT Token is missing!");
  }

  const token = hasToken.split("Bearer ")[1];
  const secretKey: any = authConfig.jwt.secretKey

  try {
    const decodeToken = verify(token, secretKey);
    const { sub } = decodeToken as ITokenPayload;

    request.user = {
      id: sub
    }

    return next();
  } catch (err) {
    throw new AppError('Invalid JWT Token');
  }
}