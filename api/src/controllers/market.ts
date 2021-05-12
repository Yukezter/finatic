import { Request, Response, NextFunction } from 'express'

import * as iex from '../iex'
// import sleep from '../utils/sleep'

export const getList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const list = await iex.list(req.params.type)

  res.locals.data = list.map((stock: any) => ({
    ...stock,
    companyName: stock.companyName.replace(/ - Class [A-Z]$/, '')
  }))
  next()
}
