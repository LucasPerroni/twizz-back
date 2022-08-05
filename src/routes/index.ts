import { Router } from "express"

import authRouter from "./authRouter.js"
import deckRouter from "./deckRouter.js"

const routes = Router()

routes.use(authRouter)
routes.use(deckRouter)

export default routes
