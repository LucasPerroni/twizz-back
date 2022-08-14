import { Router } from "express"

import authRouter from "./authRouter.js"
import deckRouter from "./deckRouter.js"
import testsRouter from "./testsRouter.js"

const routes = Router()

routes.use(authRouter)
routes.use(deckRouter)

if (process.env.NODE_ENV === "tests") {
  routes.use(testsRouter)
}

export default routes
