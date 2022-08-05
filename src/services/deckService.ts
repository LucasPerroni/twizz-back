import { Decks, Questions } from "@prisma/client"

import deckRepository from "../repositories/deckRepository.js"
import authRepository from "../repositories/authRepository.js"
import { Error } from "../middlewares/errorHandler.js"

async function blockCreation(name: string, userId: number) {
  const user = await authRepository.findUserById(userId)
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

async function getAllUserDecks(id: string, offset: string) {
  if (!Number(id) || (!Number(offset) && offset !== "0")) {
    Error.errorUnprocessable("UserId and Offset must be numbers")
  }

  const decks = await deckRepository.findDeckByUserId(Number(id), Number(offset))
  return decks
}

async function getOneDeck(id: string) {
  if (!Number(id)) {
    Error.errorUnprocessable("DeckId must be a number")
  }

  const deck = await deckRepository.findDeckById(Number(id))
  if (!deck) {
    Error.errorNotFound("Couldn't find a deck with that id")
  }

  return deck
}

async function getAllDecks(offset: string) {
  if (!Number(offset) && offset !== "0") {
    Error.errorUnprocessable("Offset must be a number")
  }

  const decks = await deckRepository.findAllDecks(Number(offset))
  return decks
}

const deckService = {
  blockCreation,
  createDeck,
  createQuestions,
  getAllUserDecks,
  getOneDeck,
  getAllDecks,
}

export default deckService
