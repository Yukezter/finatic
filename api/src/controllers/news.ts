import { Request, Response } from 'express'

// import { CustomError } from '../errors'
import * as iex from '../iex'

export const getSearchResults = async (req: Request, res: Response): Promise<void> => {
  const { fragment } = req.params

  const response = await iex.search(fragment)

  res.send(response.data)
}

export const getNewsData = (_req: Request, res: Response): void => {
  res.send('News data!')
}

export const getCompanyData = (_req: Request, res: Response): void => {
  res.send('Company data!')
}
