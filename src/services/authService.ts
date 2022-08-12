import { Users } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import authRepository from "../repositories/authRepository.js"
import { Error } from "../middlewares/errorHandler.js"

async function getUserByEmail(email: string, blockExistentUser: boolean = true) {
  const user = await authRepository.findUserByEmail(email)

  if (user && blockExistentUser) {
    Error.errorConflict("This email is already in use")
  } else if (!user && !blockExistentUser) {
    Error.errorNotFound("Couldn't find a user with this email")
  }

  return user
}

async function createUser(data: Users) {
  data.password = bcrypt.hashSync(data.password, Number(process.env.BCRYPT_SALT))
  await authRepository.createUser(data)
}

async function checkPassword(user: Users, password: string) {
  if (!bcrypt.compareSync(password, user.password)) {
    Error.errorUnauthorized("Wrong password")
  }
}

export function createToken(user: Users) {
  const data = { userId: user.id }
  const key = process.env.JWT_KEY
  const config = { expiresIn: 60 * 60 * 2 } // 2 hours

  const token = jwt.sign(data, key, config)
  return token
}

const authService = {
  getUserByEmail,
  createUser,
  checkPassword,
  createToken,
}

export default authService
