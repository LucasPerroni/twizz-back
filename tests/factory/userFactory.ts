import { faker } from "@faker-js/faker"

import { application } from "../integration/app.test.js"
import { prisma } from "../../src/config/database.js"
import { Users } from "@prisma/client"

async function createUser() {
  const data = {
    name: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    image: faker.image.avatar(),
  }
  await application.post("/sign-up").send(data)
  return data
}

async function getUserInfo(data: Partial<Users>) {
  const response = await application.post("/sign-in").send(data)
  return response.body
}

const userFactory = {
  createUser,
  getUserInfo,
}

export default userFactory
