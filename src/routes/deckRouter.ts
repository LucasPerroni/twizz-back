import { Router } from "express"

import * as deckController from "../controllers/deckController.js"
import validateSchema from "../middlewares/validateSchema.js"
import validateToken from "../middlewares/validateToken.js"
import { deckSchema } from "../schemas/deckSchema.js"
import { favoriteSchema } from "../schemas/favoriteSchema.js"

const deckRouter = Router()

deckRouter.post("/deck", validateToken, validateSchema(deckSchema), deckController.createDeck)
deckRouter.get("/decks/user/:userId/:offset", validateToken, deckController.getAllUserDecks)
deckRouter.get("/deck/:deckId", validateToken, deckController.getOneDeck)
deckRouter.get("/decks/all/:offset", validateToken, deckController.getAllDecks)
deckRouter.get("/decks/number", validateToken, deckController.getDeckNumber)
deckRouter.get("/decks/number/:userId", validateToken, deckController.getUserDeckNumber)
deckRouter.post("/decks/favorite", validateToken, validateSchema(favoriteSchema), deckController.favoriteDeck)

export default deckRouter
