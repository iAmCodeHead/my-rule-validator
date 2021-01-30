import { NextFunction, Request, Response } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {

  res.status(err.status).json({ 
      message: err.message, 
      status: "error", 
      data: null
 });
}