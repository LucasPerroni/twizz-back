import supertest from "supertest"
import { faker } from "@faker-js/faker"

import app from "../../src/app.js"
import { prisma } from "../../src/config/database.js"
import userFactory from "../factory/userFactory.js"
import deckFactory from "../factory/deckFactory.js"

export const application = supertest(app)

beforeEach(async () => {
  await application.post("/tests/clearAll")
})

afterAll(async () => {
  await application.post("/tests/clearAll")
})

describe("POST /sign-up", () => {
  it("create a new user and return 201", async () => {
    const data = {
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.avatar(),
    }
    const response = await application.post("/sign-up").send(data)
    expect(response.status).toStrictEqual(201)

    const user = await prisma.users.findUnique({ where: { email: data.email } })
    expect(user).not.toBeNull()
    expect(user.password).not.toStrictEqual(data.password)
  })

  it("fail to create two users with the same email", async () => {
    const data = await userFactory.createUser()
    const response = await application.post("/sign-up").send(data)
    expect(response.status).toStrictEqual(409)

    const user = await prisma.users.findMany({ where: { email: data.email } })
    expect(user.length).toStrictEqual(1)
  })
})

describe("POST /sign-in", () => {
  it("return a token and the user info", async () => {
    const data = await userFactory.createUser()
    const response = await application.post("/sign-in").send({ email: data.email, password: data.password })
    expect(response.status).toStrictEqual(200)
    expect(response.body.token).not.toBeUndefined()
    expect(response.body.user).not.toBeUndefined()
    expect(response.body.user.name).toStrictEqual(data.name)
  })

  it("return error with wrong password", async () => {
    const data = await userFactory.createUser()
    const response = await application
      .post("/sign-in")
      .send({ email: data.email, password: "thisisthewrongpassword" })
    expect(response.status).toStrictEqual(401)
    expect(response.text).toStrictEqual("Wrong password")
    expect(response.body.token).toBeUndefined()
  })

  it("return 'not_found' with wrong email", async () => {
    const data = await userFactory.createUser()
    const response = await application
      .post("/sign-in")
      .send({ email: "wrong@email.com", password: data.password })
    expect(response.status).toStrictEqual(404)
    expect(response.text).toStrictEqual("Couldn't find a user with this email")
    expect(response.body.token).toBeUndefined()
  })
})

describe("POST /deck", () => {
  it("create a new deck with status 201", async () => {
    const { email, password } = await userFactory.createUser()
    const user = await userFactory.getUserInfo({ email, password })

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
    const response = await application.post("/deck").send(data).set("Authorization", `Bearer ${user.token}`)
    expect(response.status).toStrictEqual(201)

    const deck = await prisma.decks.findFirst({ where: { name: data.name } })
    const questions = await prisma.questions.findMany({ where: { deckId: deck.id } })
    expect(deck).not.toBeNull()
    expect(questions.length).toStrictEqual(2)
  })

  it("block deck without questions", async () => {
    const { email, password } = await userFactory.createUser()
    const user = await userFactory.getUserInfo({ email, password })

    const data = {
      name: faker.random.word(),
      description: faker.lorem.words(10),
      questions: [{}],
    }
    const response = await application.post("/deck").send(data).set("Authorization", `Bearer ${user.token}`)
    expect(response.status).toStrictEqual(422)
  })

  it("block deck with same name for the same user", async () => {
    const { email, password } = await userFactory.createUser()
    const user = await userFactory.getUserInfo({ email, password })
    const deck = await deckFactory.createDeck(user.token)

    const response = await application.post("/deck").send(deck).set("Authorization", `Bearer ${user.token}`)
    expect(response.status).toStrictEqual(409)
    expect(response.text).toStrictEqual("This user already have a deck with this title")
  })
})

describe("GET /decks/user/:userId/:offset", () => {
  it("return 5 decks of the same user", async () => {
    const { email, password } = await userFactory.createUser()
    const { email: email2, password: password2 } = await userFactory.createUser()
    const user = await userFactory.getUserInfo({ email, password })
    const user2 = await userFactory.getUserInfo({ email: email2, password: password2 })
    for (let i = 0; i < 5; i++) {
      await deckFactory.createDeck(user.token)
      await deckFactory.createDeck(user2.token)
    }

    const response = await application
      .get(`/decks/user/${user.user.id}/0`)
      .set("Authorization", `Bearer ${user.token}`)
    expect(response.status).toStrictEqual(200)
    expect(response.body.length).toStrictEqual(5)
    expect(response.body[0].user.id).toStrictEqual(user.user.id)
  })

  it("return 10 decks", async () => {
    const { email, password } = await userFactory.createUser()
    const user = await userFactory.getUserInfo({ email, password })
    for (let i = 0; i < 15; i++) {
      await deckFactory.createDeck(user.token)
    }

    const response = await application
      .get(`/decks/user/${user.user.id}/0`)
      .set("Authorization", `Bearer ${user.token}`)
    expect(response.status).toStrictEqual(200)
    expect(response.body.length).toStrictEqual(10)
  })

  it("return 5 decks with offset", async () => {
    const { email, password } = await userFactory.createUser()
    const user = await userFactory.getUserInfo({ email, password })
    for (let i = 0; i < 15; i++) {
      await deckFactory.createDeck(user.token)
    }

    const response = await application
      .get(`/decks/user/${user.user.id}/10`)
      .set("Authorization", `Bearer ${user.token}`)
    expect(response.status).toStrictEqual(200)
    expect(response.body.length).toStrictEqual(5)
  })

  it("fail request without token", async () => {
    const { email, password } = await userFactory.createUser()
    const user = await userFactory.getUserInfo({ email, password })

    const response = await application.get(`/decks/user/${user.user.id}/0`)
    expect(response.status).toStrictEqual(401)
    expect(response.text).toStrictEqual("Token not found")
  })
})

describe("GET /deck/:deckId", () => {
  it("return deck with specified id", async () => {
    const { email, password } = await userFactory.createUser()
    const user = await userFactory.getUserInfo({ email, password })
    const deckData = await deckFactory.createDeck(user.token)

    const deck = await deckFactory.getDeckId(deckData, user.user.id)
    const response = await application.get(`/deck/${deck.id}`).set("Authorization", `Bearer ${user.token}`)
    expect(response.status).toStrictEqual(200)
    expect(response.body.id).toStrictEqual(deck.id)
    expect(response.body.name).toStrictEqual(deckData.name)
  })

  it("fail request without token", async () => {
    const { email, password } = await userFactory.createUser()
    const user = await userFactory.getUserInfo({ email, password })
    const deckData = await deckFactory.createDeck(user.token)

    const deck = await deckFactory.getDeckId(deckData, user.user.id)
    const response = await application.get(`/deck/${deck.id}`)
    expect(response.status).toStrictEqual(401)
    expect(response.text).toStrictEqual("Token not found")
  })
})

describe("GET /decks/all/:offset", () => {
  it("return 10 decks of two different users", async () => {
    const { email, password } = await userFactory.createUser()
    const { email: email2, password: password2 } = await userFactory.createUser()
    const user = await userFactory.getUserInfo({ email, password })
    const user2 = await userFactory.getUserInfo({ email: email2, password: password2 })
    for (let i = 0; i < 6; i++) {
      await deckFactory.createDeck(user.token)
      await deckFactory.createDeck(user2.token)
    }

    const response = await application.get(`/decks/all/0`).set("Authorization", `Bearer ${user.token}`)
    expect(response.status).toStrictEqual(200)
    expect(response.body.length).toStrictEqual(10)

    const ids = [response.body[0].user.id, response.body[1].user.id].sort((a, b) => {
      return a - b
    })
    expect(ids[0]).toStrictEqual(user.user.id)
    expect(ids[1]).toStrictEqual(user2.user.id)
  })

  it("return 4 decks of two different users with offset", async () => {
    const { email, password } = await userFactory.createUser()
    const { email: email2, password: password2 } = await userFactory.createUser()
    const user = await userFactory.getUserInfo({ email, password })
    const user2 = await userFactory.getUserInfo({ email: email2, password: password2 })
    for (let i = 0; i < 7; i++) {
      await deckFactory.createDeck(user.token)
      await deckFactory.createDeck(user2.token)
    }

    const response = await application.get(`/decks/all/10`).set("Authorization", `Bearer ${user.token}`)
    expect(response.status).toStrictEqual(200)
    expect(response.body.length).toStrictEqual(4)

    const ids = [response.body[0].user.id, response.body[1].user.id].sort((a, b) => {
      return a - b
    })
    expect(ids[0]).toStrictEqual(user.user.id)
    expect(ids[1]).toStrictEqual(user2.user.id)
  })

  it("fail request without token", async () => {
    const response = await application.get(`/decks/all/0`)
    expect(response.status).toStrictEqual(401)
    expect(response.text).toStrictEqual("Token not found")
  })
})

describe("GET /decks/number", () => {
  it("return 12 total decks", async () => {
    const { email, password } = await userFactory.createUser()
    const { email: email2, password: password2 } = await userFactory.createUser()
    const user = await userFactory.getUserInfo({ email, password })
    const user2 = await userFactory.getUserInfo({ email: email2, password: password2 })
    for (let i = 0; i < 6; i++) {
      await deckFactory.createDeck(user.token)
      await deckFactory.createDeck(user2.token)
    }

    const response = await application.get("/decks/number").set("Authorization", `Bearer ${user.token}`)
    expect(response.status).toStrictEqual(200)
    expect(response.body.totalDecks).toStrictEqual(12)
  })

  it("fail request without token", async () => {
    const response = await application.get(`/decks/number`)
    expect(response.status).toStrictEqual(401)
    expect(response.text).toStrictEqual("Token not found")
  })
})

describe("GET /decks/number/:userId", () => {
  it("return 6 total decks", async () => {
    const { email, password } = await userFactory.createUser()
    const { email: email2, password: password2 } = await userFactory.createUser()
    const user = await userFactory.getUserInfo({ email, password })
    const user2 = await userFactory.getUserInfo({ email: email2, password: password2 })
    for (let i = 0; i < 6; i++) {
      await deckFactory.createDeck(user.token)
      await deckFactory.createDeck(user2.token)
    }

    const response = await application
      .get(`/decks/number/${user.user.id}`)
      .set("Authorization", `Bearer ${user.token}`)
    expect(response.status).toStrictEqual(200)
    expect(response.body.totalDecks).toStrictEqual(6)
  })

  it("fail request without token", async () => {
    const { email, password } = await userFactory.createUser()
    const user = await userFactory.getUserInfo({ email, password })

    const response = await application.get(`/decks/number/${user.user.id}`)
    expect(response.status).toStrictEqual(401)
    expect(response.text).toStrictEqual("Token not found")
  })
})
