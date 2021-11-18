import { createContext } from 'react'

export type GlobalState = {
  initialLoading: boolean
  isMarketOpen?: boolean
  refSymbolsMap: Map<string, { [key: string]: any }>
}

export const defaultGlobalState = {
  initialLoading: true,
  refSymbolsMap: new Map(),
}

export const GlobalContext = createContext<GlobalState>(defaultGlobalState)
