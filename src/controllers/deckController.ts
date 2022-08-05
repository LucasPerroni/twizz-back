import { Request, Response } from "express"
import { DeckSchema } from "../schemas/deckSchema.js"

import deckService from "../services/deckService.js"

export async function createDeck(req: Request, res: Response) {
  const { userId } = res.locals
  const body: DeckSchema = req.body

  await deckService.blockCreation(body.name, body.userId, userId)
  const deck = await deckService.createDeck({ name: body.name, userId: body.userId })
  await deckService.createQuestions(body.questions, deck.id)

  res.sendStatus(201)
}
