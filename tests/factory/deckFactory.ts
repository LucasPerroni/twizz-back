import { faker } from "@faker-js/faker"

import { application } from "../integration/app.test.js"
import { prisma } from "../../src/config/database.js"
import { Decks } from "@prisma/client"

async function createDeck(token: string) {
  const data = {
    name: faker.random.word(),
    description: faker.lorem.words(10),
    questions: [
      {
        question: faker.random.words(),
        answer: faker.random.words(),
      },
      {
        question: faker.random.words(),
        answer: faker.random.words(),
        image: faker.image.animals(),
      },
    ],
  }
  await application.post("/deck").send(data).set("Authorization", `Bearer ${token}`)
  return data
}

async function getDeckId(data: Partial<Decks>, userId: number) {
  const deck = await prisma.decks.findUnique({ where: { name_userId: { name: data.name, userId } } })
  return deck
}

const deckFactory = {
  createDeck,
  getDeckId,
}

export default deckFactory
