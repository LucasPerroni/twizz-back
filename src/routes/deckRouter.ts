import { Router } from "express"

import { createDeck } from "../controllers/deckController.js"
import validateSchema from "../middlewares/validateSchema.js"
import validateToken from "../middlewares/validateToken.js"
import { deckSchema } from "../schemas/deckSchema.js"

const deckRouter = Router()

deckRouter.post("/deck", validateToken, validateSchema(deckSchema), createDeck)

export default deckRouter
