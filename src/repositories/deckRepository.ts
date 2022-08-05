import { Decks, Questions } from "@prisma/client"

import { prisma } from "../config/database.js"

async function findDeckByData(name: string, userId: number) {
  const deck = await prisma.decks.findUnique({ where: { name_userId: { name, userId } } })
  return deck
}

async function findDeckById(id: number) {
  const deck = await prisma.decks.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      Questions: {
        select: {
          id: true,
          question: true,
          answer: true,
          image: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  })
  return deck
}

async function findDeckByUserId(userId: number, offset: number) {
  const decks = await prisma.decks.findMany({
    skip: offset,
    take: 10,
    where: { userId },
    select: {
      id: true,
      name: true,
      Questions: {
        select: {
          id: true,
          question: true,
          answer: true,
          image: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  })
  return decks
}

async function findAllDecks(offset: number) {
  const decks = await prisma.decks.findMany({
    skip: offset,
    take: 10,
    orderBy: { Favorites: { _count: "desc" } },
    select: {
      id: true,
      name: true,
      Questions: {
        select: {
          id: true,
          question: true,
          answer: true,
          image: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  })
  return decks
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
  findDeckByUserId,
  findAllDecks,
}

export default deckRepository
