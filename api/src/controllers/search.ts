import { Request, Response } from 'express'

import * as iex from '../iex'

const securityTypes = 'ad,cs,etf,cef,oef,wt'

export const getSearchResults = async (req: Request, res: Response): Promise<void> => {
  const { fragment } = req.params

  const data: any[] = await iex.search(fragment)

  const filteredData: any[] = []
  let index = 0

  while (index < data.length - 1 && filteredData.length < 6) {
    const result = data[index]
    if (securityTypes.indexOf(result.securityType) !== -1) {
      filteredData.push(result)
    }
    ++index
  }

  res.json(filteredData)
}
