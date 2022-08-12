import { Router } from "express"

import {
  createDeck,
  getAllDecks,
  getAllUserDecks,
  getDeckNumber,
  getOneDeck,
  getUserDeckNumber,
} from "../controllers/deckController.js"
import validateSchema from "../middlewares/validateSchema.js"
import validateToken from "../middlewares/validateToken.js"
import { deckSchema } from "../schemas/deckSchema.js"

const deckRouter = Router()

deckRouter.post("/deck", validateToken, validateSchema(deckSchema), createDeck)
deckRouter.get("/decks/user/:userId/:offset", validateToken, getAllUserDecks)
deckRouter.get("/deck/:deckId", validateToken, getOneDeck)
deckRouter.get("/decks/all/:offset", validateToken, getAllDecks)
deckRouter.get("/decks/number", validateToken, getDeckNumber)
deckRouter.get("/decks/number/:userId", validateToken, getUserDeckNumber)

export default deckRouter
