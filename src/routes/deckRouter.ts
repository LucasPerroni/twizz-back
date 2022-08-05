import { Router } from "express"

import { createDeck, getAllDecks, getAllUserDecks, getOneDeck } from "../controllers/deckController.js"
import validateSchema from "../middlewares/validateSchema.js"
import validateToken from "../middlewares/validateToken.js"
import { deckSchema } from "../schemas/deckSchema.js"

const deckRouter = Router()

deckRouter.post("/deck", validateToken, validateSchema(deckSchema), createDeck)
deckRouter.get("/decks/user/:userId/:offset", validateToken, getAllUserDecks)
deckRouter.get("/deck/:deckId", validateToken, getOneDeck)
deckRouter.get("/decks/all/:offset", validateToken, getAllDecks)

export default deckRouter
