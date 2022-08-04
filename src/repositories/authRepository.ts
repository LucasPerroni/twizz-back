import { Users } from "@prisma/client"

import { prisma } from "../config/database.js"

async function findUserByEmail(email: string) {
  const user = await prisma.users.findUnique({ where: { email } })
  return user
}

async function createUser(data: Omit<Users, "id" | "createdAt">) {
  await prisma.users.create({ data })
}

const authRepository = {
  findUserByEmail,
  createUser,
}

export default authRepository
