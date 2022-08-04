import joi from "joi"

export const signUpSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  image: joi.string().uri().required(),
  password: joi.string().min(10).required(),
})
