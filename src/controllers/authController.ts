import { Users } from "@prisma/client"
import { Request, Response } from "express"

import authService from "../services/authService.js"

export async function signUp(req: Request, res: Response) {
  const body: Users = req.body

  await authService.getUserByEmail(body.email)
  await authService.createUser(body)

  res.sendStatus(201)
}

export async function signIn(req: Request, res: Response) {
  const body: Users = req.body

  const user = await authService.getUserByEmail(body.email, false)
  await authService.checkPassword(user, body.password)
  const token = authService.createToken(user)

  delete user.password
  delete user.createdAt

  res.status(200).send({ token, user })
}
