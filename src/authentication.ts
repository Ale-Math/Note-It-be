import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import 'dotenv/config';

export function middleware(req:Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"]!;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (decoded) {
        req.email = decoded;
        next();
    } else {
        res.status(403).json({
            message: "User not authorised!"
        })
    }
}