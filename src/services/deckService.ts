import { Decks, Questions } from "@prisma/client"

import deckRepository from "../repositories/deckRepository.js"
import authRepository from "../repositories/authRepository.js"
import { Error } from "../middlewares/errorHandler.js"

async function blockCreation(name: string, bodyUserId: number, tokenUserId: number) {
  if (bodyUserId !== tokenUserId) {
    Error.errorUnauthorized("Conflict between userId and token")
  }

  const user = await authRepository.findUserById(tokenUserId)
  if (!user) {
    Error.errorNotFound("Couldn't find a user with this id")
  }

  const deck = await deckRepository.findDeckByData(name, user.id)
  if (deck) {
    Error.errorConflict("This user already have a deck with this title")
  }
}

async function createDeck(data: Omit<Decks, "id" | "createdAt">) {
  const deck = await deckRepository.createDeck(data)
  return deck
}

async function createQuestions(
  data: Omit<Questions, "id" | "createdAt" | "deckId" | "image">[],
  deckId: number
) {
  const newData: Omit<Questions, "id" | "createdAt" | "image">[] = []
  data.forEach((d) => {
    newData.push({ ...d, deckId })
  })

  await deckRepository.createQuestions(newData)
}

const deckService = {
  blockCreation,
  createDeck,
  createQuestions,
}

export default deckService
