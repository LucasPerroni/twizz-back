import { Request, Response, NextFunction } from "express"

const errors = {
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  conflict: 409,
  unprocessable: 422,
}

function errorUnauthorized(message: string = null) {
  throw { type: "unauthorized", message }
}

function errorForbidden(message: string = null) {
  throw { type: "forbidden", message }
}

function errorNotFound(message: string = null) {
  throw { type: "not_found", message }
}

function errorConflict(message: string = null) {
  throw { type: "conflict", message }
}

function errorUnprocessable(message: string = null) {
  throw { type: "unprocessable", message }
}

export const Error = {
  errorUnauthorized,
  errorForbidden,
  errorNotFound,
  errorConflict,
  errorUnprocessable,
}

export default function errorHandler(error, req: Request, res: Response, next: NextFunction) {
  if (error.type) {
    return error.message
      ? res.status(errors[error.type]).send(error.message)
      : res.sendStatus(errors[error.type])
  }

  res.sendStatus(500)
}
