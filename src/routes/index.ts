import { Router } from "express"

import authRouter from "./authRouter.js"

const routes = Router()

routes.use(authRouter)

export default routes
