import { Decks, Questions } from "@prisma/client"

import { prisma } from "../config/database.js"

async function findDeckByData(name: string, userId: number) {
  const deck = await prisma.decks.findUnique({ where: { name_userId: { name, userId } } })
  return deck
}

async function findDeckById(id: number) {
  const deck = await prisma.decks.findUnique({ where: { id } })
  return deck
}

async function createDeck(data: Omit<Decks, "id" | "createdAt">) {
  const deck = await prisma.decks.create({ data })
  return deck
}

async function createQuestions(data: Omit<Questions, "id" | "createdAt" | "image">[]) {
  await prisma.questions.createMany({ data })
}

const deckRepository = {
  findDeckByData,
  findDeckById,
  createDeck,
  createQuestions,
}

export default deckRepository
