import { Router } from "express"
import { Request, Response } from "express"

import { prisma } from "../config/database.js"

const testsRouter = Router()

testsRouter.post("/tests/clearAll", async (req: Request, res: Response) => {
  await prisma.questions.deleteMany()
  await prisma.favorites.deleteMany()
  await prisma.followers.deleteMany()
  await prisma.decks.deleteMany()
  await prisma.users.deleteMany()

  res.sendStatus(200)
})

export default testsRouter
