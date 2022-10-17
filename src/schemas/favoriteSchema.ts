import joi from "joi"

export const favoriteSchema = joi.object({
  deckId: joi.number().positive().required(),
})
