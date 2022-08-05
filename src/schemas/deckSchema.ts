import joi from "joi"

export interface DeckSchema {
  name: string
  userId: number
  questions: [
    {
      question: string
      answer: string
      image?: string
    }
  ]
}

export const deckSchema = joi.object<DeckSchema>({
  name: joi.string().required(),
  userId: joi.number().required(),
  questions: joi
    .array()
    .items(
      joi
        .object({
          question: joi.string().required(),
          answer: joi.string().required(),
          image: joi.string().uri(),
        })
        .required()
    )
    .required(),
})
