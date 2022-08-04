import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

import { Error } from "./errorHandler.js"

export default function validateToken(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers

  const token = authorization?.replace("Bearer", "").trim()
  if (!token) {
    Error.errorUnauthorized("Token not found")
  }

  try {
    const user: any = jwt.verify(token, process.env.JWT_KEY)

    res.locals.userId = user.userId
    next()
  } catch (e) {
    Error.errorUnauthorized("Token has expired")
  }
}
