import { ErrorRequestHandler, Request, Response, NextFunction } from 'express'

export const logErrors: ErrorRequestHandler = (
  error: any,
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  console.log(error)
  next(error)
}
