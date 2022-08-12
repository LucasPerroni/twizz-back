import { Request, Response } from "express"
import { DeckSchema } from "../schemas/deckSchema.js"

import deckService from "../services/deckService.js"

export async function createDeck(req: Request, res: Response) {
  const { userId } = res.locals
  const body: DeckSchema = req.body

  await deckService.blockCreation(body.name, userId)
  const deck = await deckService.createDeck({ name: body.name, description: body.description, userId })
  await deckService.createQuestions(body.questions, deck.id)

  res.sendStatus(201)
}

export async function getAllUserDecks(req: Request, res: Response) {
  const { userId, offset } = req.params
  const decks = await deckService.getAllUserDecks(userId, offset)
  res.status(200).send(decks)
}

export async function getOneDeck(req: Request, res: Response) {
  const { deckId } = req.params
  const deck = await deckService.getOneDeck(deckId)
  res.status(200).send(deck)
}

export async function getAllDecks(req: Request, res: Response) {
  const { offset } = req.params
  const decks = await deckService.getAllDecks(offset)
  res.status(200).send(decks)
}

export async function getDeckNumber(req: Request, res: Response) {
  const number = await deckService.getDeckNumber()
  res.status(200).send({ totalDecks: number })
}

export async function getUserDeckNumber(req: Request, res: Response) {
  const { userId } = req.params
  const number = await deckService.getUserDeckNumber(userId)
  res.status(200).send({ totalDecks: number })
}
