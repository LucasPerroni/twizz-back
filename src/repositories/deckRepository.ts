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
      description: true,
      createdAt: true,
      _count: { select: { Favorites: true } },
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
    orderBy: { createdAt: "desc" },
    where: { userId },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      _count: { select: { Favorites: true } },
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
    orderBy: [{ Favorites: { _count: "desc" } }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      _count: { select: { Favorites: true } },
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

async function getDeckNumber() {
  const number = await prisma.decks.count()
  return number
}

async function getUserDeckNumber(id: number) {
  const number = await prisma.decks.count({ where: { userId: id } })
  return number
}

async function createDeck(data: Omit<Decks, "id" | "createdAt">) {
  const deck = await prisma.decks.create({ data })
  return deck
}

async function createQuestions(data: Omit<Questions, "id" | "createdAt" | "image">[]) {
  await prisma.questions.createMany({ data })
}

async function favoriteDeck(userId: number, deckId: number) {
  await prisma.favorites.create({ data: { userId, deckId } })
}

async function unfavoriteDeck(userId: number, deckId: number) {
  await prisma.favorites.delete({ where: { userId_deckId: { userId, deckId } } })
}

async function getFavorites(userId: number) {
  const decks = await prisma.favorites.findMany({
    where: {
      userId,
    },
    select: {
      deck: {
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          _count: { select: { Favorites: true } },
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
      },
    },
  })

  return decks
}

const deckRepository = {
  findDeckByData,
  findDeckById,
  createDeck,
  createQuestions,
  findDeckByUserId,
  findAllDecks,
  getDeckNumber,
  getUserDeckNumber,
  favoriteDeck,
  unfavoriteDeck,
  getFavorites,
}

export default deckRepository
