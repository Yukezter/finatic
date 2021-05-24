import { Request, Response } from 'express'
import NodeCache from 'node-cache'

import * as iex from '../iex'

const marketCache = new NodeCache({ checkperiod: 60 * 5 })

export const getFxRate = async (req: Request, res: Response): Promise<void> => {
  const { symbol } = req.params
  let exchangeRate = marketCache.get(symbol)

  if (exchangeRate === undefined) {
    const response = await iex.fxRate({
      symbols: symbol
    })

    marketCache.set(symbol, response.data, 15 * 60)
    exchangeRate = response.data
  }

  res.json(exchangeRate)
}

export const getCryptoQuote = async (req: Request, res: Response): Promise<void> => {
  const { symbol } = req.params
  let cryptoQuote = marketCache.get(symbol)

  if (cryptoQuote === undefined) {
    const response = await iex.stockQuote(symbol)
    marketCache.set(symbol, response.data, 30)
    cryptoQuote = response.data
  }

  res.json(cryptoQuote)
}

export const getMarketDatapoint = async (req: Request, res: Response): Promise<void> => {
  const { symbol } = req.params
  let dataPoint = marketCache.get(symbol)

  if (dataPoint === undefined) {
    const response = await iex.marketDataPoint(symbol)
    marketCache.set(symbol, response.data, 24 * 60 * 60)
    dataPoint = response.data
  }

  res.json(dataPoint)
}

export const getMarketList = async (req: Request, res: Response): Promise<void> => {
  let list = marketCache.get(req.params.type)

  if (list === undefined) {
    const response = await iex.marketList(req.params.type)
    marketCache.set(req.params.type, response.data, 15 * 60)
    list = response.data
  }

  res.json(list)
}

export const getMarketData = async (_req: Request, res: Response): Promise<void> => {
  let cryptocurrencies = marketCache.get('cryptocurrencies')

  if (cryptocurrencies === undefined) {
    const responses = await Promise.all([
      iex.cryptoQuote('BTCUSD'),
      iex.cryptoQuote('ETHUSD'),
      iex.cryptoQuote('LTCUSD')
    ])

    cryptocurrencies = {
      BTC: responses[0],
      ETH: responses[1],
      LTC: responses[2]
    }

    // update at 6AM UTC Daily
    marketCache.set('cryptocurrencies', cryptocurrencies)
  }

  let commodities = marketCache.get('commodities')

  if (commodities === undefined) {
    const responses = await Promise.all([
      iex.marketDataPoint('DCOILWTICO'),
      iex.marketDataPoint('GASREGCOVW'),
      iex.marketDataPoint('DJFUELUSGULF')
    ])

    commodities = {
      oil: responses[0],
      gasloline: responses[1],
      jetFuel: responses[2]
    }

    // update at 6AM UTC Daily
    marketCache.set('commodities', commodities)
  }

  let treasuryRates = marketCache.get('treasuryRates')

  if (treasuryRates === undefined) {
    const responses = await Promise.all([
      iex.marketDataPoint('DGS1'),
      iex.marketDataPoint('DGS5'),
      iex.marketDataPoint('DGS10')
    ])

    treasuryRates = {
      oneYear: responses[0],
      fiveYear: responses[1],
      tenYear: responses[2]
    }

    // update at 6AM, 11PM UTC Daily
    marketCache.set('treasuryRates', treasuryRates)
  }

  let exchangeRates = marketCache.get('exchangeRates')

  if (exchangeRates === undefined) {
    const response = await iex.fxRate({
      symbols: 'EURUSD,GBPUSD,USDJPY'
    })

    exchangeRates = {
      EURUSD: response[0].rate,
      GBPUSD: response[1].rate,
      USDJPY: response[2].rate
    }

    // updates every hour
    marketCache.set('exchangeRates', exchangeRates, 60 * 60)
  }

  let economicData = marketCache.get('economicData')

  if (economicData === undefined) {
    const responses = await Promise.all([
      iex.marketDataPoint('CPIAUCSL'),
      iex.marketDataPoint('TERMCBCCALLNS'),
      iex.marketDataPoint('A191RL1Q225SBEA')
    ])

    economicData = {
      CPI: responses[0],
      CCInterestRate: responses[1],
      GDP: responses[2]
    }

    marketCache.set('economicData', economicData)
  }

  // updates 6AM UTC monthly
  let recessionProbabilities = marketCache.get('recessionProbabilities')

  if (recessionProbabilities === undefined) {
    const response = await iex.marketDataPoint('RECPROUSM156N')

    recessionProbabilities = response * 100
    marketCache.set('recessionProbabilities', recessionProbabilities)
  }

  res.json({
    treasuryRates,
    exchangeRates,
    economicData,
    recessionProbabilities,
    cryptocurrencies,
    commodities
  })
}
